import React from "react";
import { useIsTouchDevice } from "@/hooks/useIsTouchDevice";
import fileIcon from "/macos_assets/file.png";
import fileClickedIcon from "/macos_assets/file_clicked.png";
import fileDisabledIcon from "/macos_assets/file_disabled.png";
import folderIcon from "/macos_assets/folder.png";
import folderClickedIcon from "/macos_assets/folder_clicked.png";
import folderDisabledIcon from "/macos_assets/folder_disabled.png";

const ICONS = {
  file: {
    default: fileIcon,
    clicked: fileClickedIcon,
    disabled: fileDisabledIcon,
  },
  folder: {
    default: folderIcon,
    clicked: folderClickedIcon,
    disabled: folderDisabledIcon,
  },
};

interface DesktopIconProps {
  id: string;
  name: string;
  type: "file" | "folder";
  onOpen: () => void;
  onClick: () => void;
  disabled?: boolean;
  clicked?: boolean;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({
  id,
  name,
  type,
  onOpen,
  onClick,
  disabled = false,
  clicked = false,
}) => {
  // Double-tap is unreliable on touch devices, so open on the first tap there
  const isTouchDevice = useIsTouchDevice();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick();
    if (isTouchDevice) onOpen();
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isTouchDevice) onOpen();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen();
    }
  };

  const state = disabled ? "disabled" : clicked ? "clicked" : "default";

  return (
    <div
      id={id}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      className={`file-container flex flex-col items-center justify-center p-2 w-[140px] select-none ${
        !disabled ? "cursor-pointer" : ""
      }`}
      onDoubleClick={!disabled ? handleDoubleClick : undefined}
      onClick={!disabled ? handleClick : undefined}
      onKeyDown={!disabled ? handleKeyDown : undefined}
    >
      <img
        src={ICONS[type][state]}
        alt=""
        draggable="false"
        className="max-w-full"
      />
      <p
        className={`${
          clicked ? "text-white bg-black" : "text-black bg-white"
        } max-w-full text-center font-medium px-2 text-lg sm:text-xl break-words`}
      >
        {name}
      </p>
    </div>
  );
};
