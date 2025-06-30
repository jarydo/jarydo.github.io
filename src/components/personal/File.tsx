import React from "react";
import { Rnd } from "react-rnd";
import fileIcon from "/macos_assets/file.png";
import fileClickedIcon from "/macos_assets/file_clicked.png";
import fileDisabledIcon from "/macos_assets/file_disabled.png";

interface FileProps {
  name: string;
  initialPosition?: { x: number; y: number };
  onOpen: () => void;
  disabled?: boolean;
  clicked?: boolean;
  onClick: () => void;
  id: string;
}

export const File: React.FC<FileProps> = ({
  name,
  initialPosition,
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

  // Select the appropriate icon based on state
  const getIconSrc = () => {
    if (disabled) return fileDisabledIcon;
    if (clicked) return fileClickedIcon;
    return fileIcon;
  };

  const FileContent = (
    <div
      id={id}
      className={`file-container flex flex-col items-center justify-center p-2 ${!disabled ? "cursor-pointer" : ""}`}
      onDoubleClick={!disabled ? handleDoubleClick : undefined}
      onClick={!disabled ? handleClick : undefined}
    >
      <img src={getIconSrc()} alt="File" draggable="false" />
      <p
        className={`${!clicked ? "text-black bg-white" : "text-white bg-black"} text-wrap max-w-[140px] text-center font-medium text-sm px-2 text-xl`}
      >
        {name}
      </p>
    </div>
  );

  if (initialPosition) {
    return (
      <Rnd
        default={{
          x: initialPosition.x,
          y: initialPosition.y,
          width: 80,
          height: 80,
        }}
        enableResizing={false}
      >
        {FileContent}
      </Rnd>
    );
  }

  return FileContent;
};
