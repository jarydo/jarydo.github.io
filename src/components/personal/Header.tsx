import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface MenuItem {
  name: string;
  onClick?: () => void;
}

export const Header: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleMenuClick = (menu: string) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const fileMenuItems: MenuItem[] = [
    {
      name: "Open",
      onClick: () => {
        console.log("open");
      },
    },
  ];

  const recruiterMenuItems: MenuItem[] = [
    {
      name: "Off",
    },
    {
      name: "On",
      onClick: () => {
        navigate("/recruiter");
      },
    },
  ];

  const MenuDropdown: React.FC<{ items: MenuItem[] }> = ({ items }) => (
    <div className="absolute top-full left-0 bg-white border-2 border-black shadow-md min-w-[160px] z-20">
      {items.map((item, index) => (
        <div
          key={index}
          className="px-4 py-1 hover:bg-black hover:text-white cursor-pointer border-b border-gray-200 last:border-b-0"
          onClick={() => {
            if (item.onClick) {
              item.onClick();
              setActiveDropdown(null);
            }
          }}
        >
          {item.name}
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Header */}
      <div className="bg-white flex text-xl border-b-4 border-black items-center">
        <img src="/macos_assets/header_left.png" />
        <div className="flex grow items-center gap-6  h-full">
          <img src="/macos_assets/pear_logo.png" width="16px" alt="Pear logo" />
          <div className="relative">
            <button
              onClick={() => handleMenuClick("file")}
              className={`px-2 ${activeDropdown === "file" ? "bg-black text-white" : ""}`}
            >
              File
            </button>
            {activeDropdown === "file" && (
              <MenuDropdown items={fileMenuItems} />
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => handleMenuClick("recruiter")}
              className={`px-2 ${activeDropdown === "recruiter" ? "bg-black text-white" : ""}`}
            >
              Recruiter Mode
            </button>
            {activeDropdown === "recruiter" && (
              <MenuDropdown items={recruiterMenuItems} />
            )}
          </div>
        </div>
        <img src="/macos_assets/header_right.png" />
      </div>

      {/* Click anywhere else to close dropdowns */}
      {activeDropdown && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </>
  );
};
