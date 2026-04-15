import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import headerRightIcon from "/macos_assets/header_right.png";
import headerLeftIcon from "/macos_assets/header_left.png";
import webringBlackIcon from "/macos_assets/webring_black.png";
import webringWhiteIcon from "/macos_assets/webring_white.png";

interface MenuItem {
  name: string;
  onClick?: () => void;
  href?: string;
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

  const socraticaWebRingItems: MenuItem[] = [
    {
      name: "Socratica",
      href: "https://socratica.info/webring/",
    },
    {
      name: "←",
      href: "https://socratica.info/webring/jaryddiamond.com/prev",
    },
    {
      name: "→",
      href: "https://socratica.info/webring/jaryddiamond.com/next",
    },
  ];

  const contactMenuItems: MenuItem[] = [
    {
      name: "Twitter",
      onClick: () => {
        window.open("https://x.com/jaryddiamond");
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
      {items.map((item, index) => {
        const className =
          "block px-4 py-1 hover:bg-black hover:text-white cursor-pointer border-b border-gray-200 last:border-b-0";
        if (item.href) {
          return (
            <a
              key={index}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={className}
              onClick={() => setActiveDropdown(null)}
            >
              {item.name}
            </a>
          );
        }
        return (
          <div
            key={index}
            className={className}
            onClick={() => {
              if (item.onClick) {
                item.onClick();
                setActiveDropdown(null);
              }
            }}
          >
            {item.name}
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Header */}
      <div className="bg-white flex text-lg sm:text-xl border-b-4 border-black items-center">
        <img src={headerLeftIcon} />
        <div className="flex grow items-center gap-6 h-full">
          <div className="relative">
            <button
              onClick={() => handleMenuClick("webRing")}
              className={`px-2 py-1 flex items-center ${
                activeDropdown === "webRing" ? "bg-black text-white" : ""
              }`}
            >
              <img
                src={
                  activeDropdown === "webRing"
                    ? webringWhiteIcon
                    : webringBlackIcon
                }
                width="24"
                height="24"
                alt="CS Webring"
                className="w-5 h-5"
              />
            </button>
            {activeDropdown === "webRing" && (
              <MenuDropdown items={webRingItems} />
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => handleMenuClick("socraticaWebRing")}
              className={`px-2 py-1 flex items-center ${
                activeDropdown === "socraticaWebRing"
                  ? "bg-black text-white"
                  : ""
              }`}
            >
              <svg
                viewBox="0 0 215 212"
                width="24"
                height="24"
                fill="currentColor"
                aria-hidden="true"
                className="sm:w-5 sm:h-5 w-[18px] h-[18px]"
              >
                <path d="M107.64 105.928c-6.011 0-9.646-3.913-9.366-10l1.398-28.546-25.303 17.389c-1.537 1.16-3.495 1.739-5.731 1.739-4.474 0-8.807-3.623-8.807-9.709 0-3.767 1.677-6.23 5.312-8.405l26.7-14.635-26.7-14.636c-3.635-2.029-5.312-4.637-5.312-8.405 0-5.94 4.334-9.563 8.807-9.563 2.236 0 4.194.58 5.731 1.593l25.303 16.955-1.398-29.706C97.994 3.913 101.629 0 107.64 0c5.731 0 9.086 3.623 8.946 9.999l-1.537 29.706 25.023-16.954c1.537-1.015 3.494-1.594 5.731-1.594 4.473 0 8.807 3.622 8.807 9.563 0 3.768-1.678 6.376-5.312 8.405l-26.7 14.636 26.7 14.635c3.634 2.174 5.312 4.638 5.312 8.405 0 6.086-4.334 9.709-8.807 9.709-2.237 0-4.194-.58-5.731-1.739l-25.023-17.389 1.537 28.547c.28 6.376-3.215 9.999-8.946 9.999M47.809 212c-6.011 0-9.646-3.913-9.366-9.999l1.398-28.546-25.303 17.388c-1.537 1.16-3.494 1.739-5.731 1.739-4.473 0-8.807-3.622-8.807-9.708 0-3.768 1.678-6.231 5.312-8.405l26.7-14.636-26.7-14.635C1.678 143.169 0 140.56 0 136.793c0-5.941 4.334-9.564 8.807-9.564 2.237 0 4.194.58 5.731 1.594l25.303 16.954-1.398-29.706c-.28-6.086 3.355-9.999 9.366-9.999 5.731 0 9.086 3.623 8.947 9.999l-1.538 29.706 25.023-16.954c1.537-1.014 3.494-1.594 5.731-1.594 4.473 0 8.807 3.623 8.807 9.564 0 3.767-1.678 6.376-5.312 8.405l-26.7 14.635 26.7 14.636c3.634 2.174 5.312 4.637 5.312 8.405 0 6.086-4.334 9.708-8.807 9.708-2.237 0-4.194-.579-5.731-1.739l-25.023-17.388 1.537 28.546c.28 6.376-3.215 9.999-8.946 9.999m120.221 0c-6.011 0-9.646-3.913-9.366-9.999l1.398-28.546-25.303 17.388c-1.537 1.16-3.494 1.739-5.731 1.739-4.473 0-8.807-3.622-8.807-9.708 0-3.768 1.678-6.231 5.312-8.405l26.7-14.636-26.7-14.635c-3.634-2.029-5.312-4.638-5.312-8.405 0-5.941 4.334-9.564 8.807-9.564 2.237 0 4.194.58 5.731 1.594l25.303 16.954-1.398-29.706c-.28-6.086 3.355-9.999 9.366-9.999 5.731 0 9.086 3.623 8.947 9.999l-1.538 29.706 25.023-16.954c1.537-1.014 3.494-1.594 5.731-1.594 4.473 0 8.807 3.623 8.807 9.564 0 3.767-1.678 6.376-5.312 8.405l-26.7 14.635 26.7 14.636c3.634 2.174 5.312 4.637 5.312 8.405 0 6.086-4.334 9.708-8.807 9.708-2.237 0-4.194-.579-5.731-1.739l-25.023-17.388 1.538 28.546c.279 6.376-3.216 9.999-8.947 9.999" />
              </svg>
            </button>
            {activeDropdown === "socraticaWebRing" && (
              <MenuDropdown items={socraticaWebRingItems} />
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
        <img src={headerRightIcon} />
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
