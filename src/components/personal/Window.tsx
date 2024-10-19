import React, { useState } from "react";
import { Rnd } from "react-rnd";
import ClassicScrollbar from "./Scrollbar";

interface WindowProps {
  title: string;
  initialPosition: { x: number; y: number };
  zIndex: number;
  onFocus: () => void;
  onClose: () => void;
  children: React.ReactNode;
}

export const Window: React.FC<WindowProps> = ({
  title,
  initialPosition,
  zIndex,
  onFocus,
  onClose,
  children,
}) => {
  const [size, setSize] = useState({ width: 600, height: 450 });
  const [isCloseButtonPressed, setIsCloseButtonPressed] = useState(false);

  return (
    <Rnd
      default={{
        x: initialPosition.x,
        y: initialPosition.y,
        width: size.width,
        height: size.height,
      }}
      minWidth={400}
      minHeight={300}
      maxWidth={800}
      maxHeight={600}
      style={{ zIndex }}
      onMouseDown={onFocus}
      onResize={(_, __, ref) => {
        setSize({ width: ref.offsetWidth, height: ref.offsetHeight });
      }}
      dragHandleClassName="window-header"
      cancel=".window-button"
    >
      <div className="bg-white border-black border-2 flex flex-col h-full">
        <div className="window-header flex border-black border-b-2 items-center cursor-move">
          <img
            src="/macos_assets/window_header.png"
            width="12px"
            className="mx-2"
            draggable="false"
          />
          <button
            onClick={onClose}
            onMouseDown={() => setIsCloseButtonPressed(true)}
            onMouseUp={() => setIsCloseButtonPressed(false)}
            onMouseLeave={() => setIsCloseButtonPressed(false)}
            className="window-button cursor-pointer"
          >
            <img
              src={
                isCloseButtonPressed
                  ? "/macos_assets/window_clicked.png"
                  : "/macos_assets/window_unclicked.png"
              }
              width="22px"
              draggable="false"
            />
          </button>
          <img
            className="grow mx-2 h-[38px]"
            src="/macos_assets/window_header.png"
            draggable="false"
          />
          <div className="text-xl select-none">{title}</div>
          <img
            className="grow ml-2 h-[38px]"
            src="/macos_assets/window_header.png"
            draggable="false"
          />
          <img
            className="h-[38px] w-[50px] mr-2"
            src="/macos_assets/window_header.png"
            draggable="false"
          />
        </div>

        <div className="flex-grow overflow-hidden cursor-default">
          <ClassicScrollbar>{children}</ClassicScrollbar>
        </div>
      </div>
    </Rnd>
  );
};
