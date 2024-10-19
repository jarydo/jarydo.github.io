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

async function loadMarkdownContent(path: string): Promise<string> {
  try {
    // Using dynamic import to load markdown files
    const content = await import(
      /* @vite-ignore */
      path
    );
    return content.markdown;
  } catch (error) {
    console.error(`Error loading markdown file: ${path}`, error);
    return "Error loading content";
  }
}

function PersonalPage() {
  const [fileSystem, setFileSystem] = useState<FileItem[]>([]);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [maxZIndex, setMaxZIndex] = useState(0);
  const [disabledItems, setDisabledItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    setFileSystem(fileSystemData as FileItem[]);
  }, []);

  const isDisabled = (id: string) => disabledItems.has(id);

  const openWindow = async (item: FileItem, parentId?: string) => {
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

    if (item.type === "file" && item.name.endsWith(".txt")) {
      const content = await loadMarkdownContent(item.path);
      const newWindow: WindowState = {
        id: item.id,
        title: item.name,
        content: content,
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
        />
      );
    }
    return (
      <File
        key={item.id}
        name={item.name}
        disabled={isItemDisabled}
        onOpen={() => !isItemDisabled && openWindow(item, parentId)}
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
            initialPosition={{ x: 100, y: 100 }}
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
