import { File } from "@/components/personal/File";
import { Window } from "@/components/personal/Window";
import { Folder } from "@/components/personal/Folder";
import { useState, useEffect } from "react";
import { TextContent } from "@/components/personal/TextContent";
import fileSystemData from "@/content/filesystem.json";
import { Header } from "@/components/personal/Header";

type FileItem = {
  id: string;
  name: string;
  type: "file" | "folder";
  path: string;
  content?: string;
  children?: FileItem[];
};

type WindowState = {
  id: string;
  title: string;
  content: FileItem[] | string;
  zIndex: number;
  isOpen: boolean;
  windowType: "folder" | "text";
  parentId?: string;
};

// Helper function to recursively process the file system
function processFileSystem(items: FileItem[]): FileItem[] {
  return items.map((item) => {
    if (item.type === "folder" && item.children) {
      return { ...item, children: processFileSystem(item.children) };
    }
    if (item.type === "file" && item.path) {
      // For files, we'll load the content here
      return { ...item, content: "" }; // Initialize with empty content
    }
    return item;
  });
}

function PersonalPage() {
  const [fileSystem, setFileSystem] = useState<FileItem[]>([]);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [maxZIndex, setMaxZIndex] = useState(0);
  const [disabledItems, setDisabledItems] = useState<Set<string>>(new Set());
  const [clickedItem, setClickedItem] = useState<string | null>(null);

  // handle clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".file-container")) {
        setClickedItem(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const processedFileSystem = processFileSystem(fileSystemData as FileItem[]);
    setFileSystem(processedFileSystem);

    // Load all file contents
    const loadAllContents = async () => {
      const loadContent = async (items: FileItem[]): Promise<FileItem[]> => {
        const promises = items.map(async (item) => {
          if (item.type === "file" && item.path) {
            try {
              const response = await fetch(item.path);
              const content = await response.text();
              return { ...item, content };
            } catch (error) {
              console.error(`Error loading file: ${item.path}`, error);
              return { ...item, content: "Error loading content" };
            }
          }
          if (item.type === "folder" && item.children) {
            const children = await loadContent(item.children);
            return { ...item, children };
          }
          return item;
        });

        return Promise.all(promises);
      };

      const updatedFileSystem = await loadContent(processedFileSystem);
      setFileSystem(updatedFileSystem);
    };

    loadAllContents();
  }, []);

  const isDisabled = (id: string) => disabledItems.has(id);

  const openWindow = (item: FileItem, parentId?: string) => {
    // Remove click
    setClickedItem(null);

    // Check if window is already open
    const existingWindow = windows.find((w) => w.id === item.id);
    if (existingWindow) {
      bringToFront(item.id);
      return;
    }

    // Mark the item as disabled
    setDisabledItems((prev) => {
      const newSet = new Set(prev);
      newSet.add(item.id);
      return newSet;
    });

    if (item.type === "file") {
      const newWindow: WindowState = {
        id: item.id,
        title: item.name,
        content: item.content || "Error: Content not loaded",
        zIndex: maxZIndex + 1,
        isOpen: true,
        windowType: "text",
        parentId,
      };
      setWindows([...windows, newWindow]);
    } else if (item.type === "folder") {
      const newWindow: WindowState = {
        id: item.id,
        title: item.name,
        content: item.children || [],
        zIndex: maxZIndex + 1,
        isOpen: true,
        windowType: "folder",
        parentId,
      };
      setWindows([...windows, newWindow]);
    }
    setMaxZIndex(maxZIndex + 1);
  };

  const bringToFront = (id: string) => {
    setWindows(
      windows.map((win) => ({
        ...win,
        zIndex: win.id === id ? maxZIndex + 1 : win.zIndex,
      }))
    );
    setMaxZIndex(maxZIndex + 1);
  };

  const closeWindow = (id: string) => {
    // Remove the disabled state when closing the window
    setDisabledItems((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });

    // Close the window and any child windows
    setWindows((prevWindows) => {
      const windowToClose = prevWindows.find((w) => w.id === id);
      if (!windowToClose) return prevWindows;

      // Find all child windows that need to be closed
      const childWindows = prevWindows.filter((w) => w.parentId === id);

      // Remove disabled state for all child items
      setDisabledItems((prev) => {
        const newSet = new Set(prev);
        childWindows.forEach((child) => newSet.delete(child.id));
        return newSet;
      });

      // Remove the window and all its children
      return prevWindows.filter((w) => w.id !== id && w.parentId !== id);
    });
  };

  const renderFileOrFolder = (item: FileItem, parentId?: string) => {
    const isItemDisabled = isDisabled(item.id);

    if (item.type === "folder") {
      return (
        <Folder
          key={item.id}
          name={item.name}
          disabled={isItemDisabled}
          onOpen={() => !isItemDisabled && openWindow(item, parentId)}
          clicked={clickedItem === item.id}
          onClick={() => setClickedItem(item.id)}
        />
      );
    }
    return (
      <File
        key={item.id}
        name={item.name}
        disabled={isItemDisabled}
        onOpen={() => !isItemDisabled && openWindow(item, parentId)}
        clicked={clickedItem === item.id}
        onClick={() => setClickedItem(item.id)}
      />
    );
  };

  return (
    <div className="font-macos fixed top-0 left-0 w-full h-full touch-none bg-chessboard">
      <Header />

      <div className="grid grid-flow-row justify-end pr-1">
        {fileSystem.map((item) => renderFileOrFolder(item))}
      </div>

      {windows
        .filter((w) => w.isOpen)
        .map((win) => (
          <Window
            key={win.id}
            title={win.title}
            initialPosition={{
              x: 100 + windows.length * 20,
              y: 100 + windows.length * 20,
            }}
            zIndex={win.zIndex}
            onFocus={() => bringToFront(win.id)}
            onClose={() => closeWindow(win.id)}
          >
            {win.windowType === "folder" && Array.isArray(win.content) ? (
              <div className="p-2 flex flex-wrap gap-4">
                {win.content.map((item) => renderFileOrFolder(item, win.id))}
              </div>
            ) : (
              <TextContent content={win.content as string} />
            )}
          </Window>
        ))}
    </div>
  );
}

export default PersonalPage;
