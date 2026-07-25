import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DesktopIcon } from "@/components/personal/DesktopIcon";
import { Window } from "@/components/personal/Window";
import { TextContent } from "@/components/personal/TextContent";
import { Header } from "@/components/personal/Header";
import StartupScreen from "@/components/personal/StartupScreen";
import fileSystemData from "@/content/filesystem.json";
import type { FileItem } from "@/types";

import meChannelIcon from "/wii_assets/channel_icon.png";

const fileSystem = fileSystemData as FileItem[];

type WindowState = {
  id: string;
  title: string;
  parentId?: string;
  position: { x: number; y: number };
} & (
  | { windowType: "folder"; items: FileItem[] }
  | { windowType: "text"; path: string }
);

const MOBILE_BREAKPOINT = 768;
/** Number of windows before the cascade offset wraps, so windows stay on screen. */
const CASCADE_LENGTH = 5;
/**
 * Phones have height to spare and no room to arrange windows side by side, so
 * windows open tall. `Window` shrinks this to fit short/landscape viewports.
 */
const MOBILE_WINDOW_HEIGHT = 520;

// The boot animation is charming on arrival and tedious on every navigation
// back, so it plays once per browser session. Private modes can refuse storage
// entirely, in which case replaying it is a fine fallback.
const BOOTED_KEY = "hasBooted";

const hasBootedThisSession = () => {
  try {
    return sessionStorage.getItem(BOOTED_KEY) === "true";
  } catch {
    return false;
  }
};

const rememberBooted = () => {
  try {
    sessionStorage.setItem(BOOTED_KEY, "true");
  } catch {
    // no-op
  }
};

function PersonalPage() {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [clickedItem, setClickedItem] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth < MOBILE_BREAKPOINT,
  );
  const [isStarting, setIsStarting] = useState(() => !hasBootedThisSession());

  const navigate = useNavigate();

  // Deselect when clicking anywhere that isn't an icon
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
    const handleResize = () =>
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const openWindow = (item: FileItem, parentId?: string) => {
    setClickedItem(null);

    setWindows((previous) => {
      // Already open — just raise it (windows are ordered back to front)
      const existing = previous.find((w) => w.id === item.id);
      if (existing) {
        return [...previous.filter((w) => w.id !== item.id), existing];
      }

      const cascade = (previous.length % CASCADE_LENGTH) * 20;
      const position = {
        x: (isMobile ? 8 : 100) + cascade,
        y: (isMobile ? 48 : 100) + cascade,
      };

      const base = { id: item.id, title: item.name, parentId, position };
      const newWindow: WindowState =
        item.type === "folder"
          ? { ...base, windowType: "folder", items: item.children ?? [] }
          : { ...base, windowType: "text", path: item.path ?? "" };

      return [...previous, newWindow];
    });
  };

  // Land first-time visitors on something readable rather than a desktop of
  // icons. Tied to the boot screen, so a reload later in the session doesn't
  // reopen a window the visitor already closed.
  const handleStartupComplete = () => {
    rememberBooted();
    setIsStarting(false);

    const readme = fileSystem.find((item) => item.id === "readme");
    if (readme) openWindow(readme);
  };

  const bringToFront = (id: string) => {
    setWindows((previous) => {
      const target = previous.find((w) => w.id === id);
      if (!target || previous[previous.length - 1]?.id === id) return previous;
      return [...previous.filter((w) => w.id !== id), target];
    });
  };

  // Close the window along with any windows it opened
  const closeWindow = (id: string) =>
    setWindows((previous) =>
      previous.filter((w) => w.id !== id && w.parentId !== id),
    );

  // An icon is greyed out exactly while its window is open
  const openIds = new Set(windows.map((w) => w.id));

  const renderIcon = (item: FileItem, parentId?: string) => {
    const disabled = openIds.has(item.id);

    return (
      <DesktopIcon
        key={item.id}
        id={item.id}
        name={item.name}
        type={item.type}
        disabled={disabled}
        clicked={clickedItem === item.id}
        onClick={() => setClickedItem(item.id)}
        onOpen={() => !disabled && openWindow(item, parentId)}
      />
    );
  };

  return (
    <>
      {isStarting && <StartupScreen onComplete={handleStartupComplete} />}
      <div className="font-macos fixed inset-0 bg-chessboard overflow-hidden flex flex-col">
        <Header />

        {/* Icons fill a column top-down and wrap into a new column to the left
            when they run out of height, so nothing is ever clipped off screen */}
        <div className="flex-1 min-h-0 flex flex-col flex-wrap-reverse content-start items-center pr-1">
          {fileSystem.map((item) => renderIcon(item))}

          <div
            className="file-container flex flex-col items-center justify-center p-2 w-[120px] sm:w-[140px] select-none cursor-pointer"
            role="button"
            tabIndex={0}
            onClick={() => navigate("/channel")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate("/channel");
              }
            }}
          >
            <img
              src={meChannelIcon}
              alt=""
              draggable="false"
              width="60"
              height="60"
            />
            <p className="text-black bg-white max-w-full text-center font-medium px-2 text-lg sm:text-xl break-words">
              Me Channel
            </p>
          </div>
        </div>

        {windows.map((win, index) => (
          <Window
            key={win.id}
            title={win.title}
            width={isMobile ? 350 : 600}
            height={isMobile ? MOBILE_WINDOW_HEIGHT : 400}
            initialPosition={win.position}
            zIndex={index + 1}
            onFocus={() => bringToFront(win.id)}
            onClose={() => closeWindow(win.id)}
            sourceElementId={win.id}
          >
            {win.windowType === "folder" ? (
              // Column count follows the same breakpoint as the window width,
              // so icons never outgrow the window they're in
              <div
                className={`p-2 pt-4 grid ${
                  isMobile ? "grid-cols-2" : "grid-cols-3"
                } justify-items-center items-start`}
              >
                {win.items.map((item) => renderIcon(item, win.id))}
              </div>
            ) : (
              <TextContent path={win.path} />
            )}
          </Window>
        ))}
      </div>
    </>
  );
}

export default PersonalPage;
