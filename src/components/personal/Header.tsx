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

  const webRingItems: MenuItem[] = [
    {
      name: "CS Webring",
      onClick: () => {
        window.open("https://cs.uwatering.com/#jaryddiamond");
      },
    },
    {
      name: "←",
      onClick: () => {
        window.open("https://cs.uwatering.com/#jaryddiamond?nav=prev");
      },
    },
    {
      name: "→",
      onClick: () => {
        window.open("https://cs.uwatering.com/#jaryddiamond?nav=next");
      },
    },
  ];

  const contactMenuItems: MenuItem[] = [
    {
      name: "Twitter",
      onClick: () => {
        window.open("https://x.com/jaryd_diamond");
      },
    },
    {
      name: "LinkedIn",
      onClick: () => {
        window.open("https://linkedin.com/in/jaryddiamond");
      },
    },
    {
      name: "Github",
      onClick: () => {
        window.open("https://github.com/jarydo");
      },
    },
    {
      name: "Letterboxd",
      onClick: () => {
        window.open("https://letterboxd.com/jarydo");
      },
    },
    {
      name: "Email",
      onClick: () => {
        window.open("mailto:jaryd.diamond@uwaterloo.ca");
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
        <div className="flex grow items-center gap-6 h-full">
          <div className="relative">
            <button
              onClick={() => handleMenuClick("webRing")}
              className={`px-2 py-2 ${activeDropdown === "webRing" ? "bg-black text-white" : ""}`}
            >
              {!activeDropdown && (
                <img
                  src="/macos_assets/webring_black.png"
                  width="24px"
                  alt="CS Webring"
                />
              )}
              {activeDropdown && (
                <img
                  src="/macos_assets/webring_white.png"
                  width="24px"
                  alt="CS Webring"
                />
              )}
            </button>
            {activeDropdown === "webRing" && (
              <MenuDropdown items={webRingItems} />
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => handleMenuClick("contact")}
              className={`px-2 ${activeDropdown === "contact" ? "bg-black text-white" : ""}`}
            >
              Contact
            </button>
            {activeDropdown === "contact" && (
              <MenuDropdown items={contactMenuItems} />
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
