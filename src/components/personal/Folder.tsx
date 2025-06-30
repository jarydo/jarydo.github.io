import React from "react";
import folderIcon from "/macos_assets/folder.png";
import folderClickedIcon from "/macos_assets/folder_clicked.png";
import folderDisabledIcon from "/macos_assets/folder_disabled.png";

interface FolderProps {
  name: string;
  onOpen: () => void;
  disabled?: boolean;
  clicked?: boolean;
  onClick: () => void;
  id: string;
}

export const Folder: React.FC<FolderProps> = ({
  name,
  onOpen,
  disabled = false,
  clicked = false,
  onClick,
  id,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick();
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onOpen();
  };

  const getIconSrc = () => {
    if (disabled) return folderDisabledIcon;
    if (clicked) return folderClickedIcon;
    return folderIcon;
  };

  return (
    <div
      id={id}
      className={`file-container flex flex-col items-center justify-center p-2 ${!disabled ? "cursor-pointer" : ""}`}
      onDoubleClick={!disabled ? handleDoubleClick : undefined}
      onClick={!disabled ? handleClick : undefined}
    >
      <img src={getIconSrc()} alt="Folder" draggable="false" />
      <p
        className={`${!clicked ? "text-black bg-white" : "text-white bg-black"} font-medium text-sm px-2 text-xl`}
      >
        {name}
      </p>
    </div>
  );
};
