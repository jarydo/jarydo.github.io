import React from "react";

interface FolderProps {
  name: string;
  icon: string;
  onOpen: () => void;
  disabled?: boolean;
}

export const Folder: React.FC<FolderProps> = ({
  name,
  icon,
  onOpen,
  disabled = false,
}) => {
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onOpen();
  };

  return (
    <div
      className={`flex flex-col items-center justify-center p-2 ${!disabled ? "cursor-pointer" : ""}`}
      onDoubleClick={!disabled ? handleDoubleClick : undefined}
    >
      <img
        src={
          disabled
            ? "/macos_assets/folder_disabled.png"
            : "/macos_assets/folder.png"
        }
        alt="Folder"
        draggable="false"
      />
      <p className="text-black bg-white font-medium text-sm px-2 text-xl">
        {name}
      </p>
    </div>
  );
};
