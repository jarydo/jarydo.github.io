import React from "react";
import { Rnd } from "react-rnd";

interface FileProps {
  name: string;
  icon: string;
  initialPosition?: { x: number; y: number };
  onOpen: () => void;
  disabled?: boolean;
}

export const File: React.FC<FileProps> = ({
  name,
  icon,
  initialPosition,
  onOpen,
  disabled = false,
}) => {
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onOpen();
  };

  const FileContent = (
    <div
      className={`flex flex-col items-center justify-center p-2 ${!disabled ? "cursor-pointer" : ""}`}
      onDoubleClick={!disabled ? handleDoubleClick : undefined}
    >
      <img
        src={
          disabled
            ? "/macos_assets/file_disabled.png"
            : "/macos_assets/file.png"
        }
        alt="File"
        draggable="false"
      />
      <p className="text-black bg-white font-medium text-sm px-2 text-xl">
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
