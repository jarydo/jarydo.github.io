import React, { useState } from "react";
import { Rnd } from "react-rnd";

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
  const [size, setSize] = useState({ width: 400, height: 300 });

  return (
    <Rnd
      default={{
        x: initialPosition.x,
        y: initialPosition.y,
        width: size.width,
        height: size.height,
      }}
      minWidth={300}
      minHeight={200}
      style={{ zIndex }}
      onMouseDown={onFocus}
      onResize={(e, direction, ref) => {
        setSize({ width: ref.offsetWidth, height: ref.offsetHeight });
      }}
    >
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col h-full">
        <div className="bg-gray-100 p-2 flex justify-between items-center border-b border-gray-300 rounded-t-lg">
          <h2 className="text-sm font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            ×
          </button>
        </div>
        <div className="p-4 flex-grow overflow-auto">{children}</div>
      </div>
    </Rnd>
  );
};
