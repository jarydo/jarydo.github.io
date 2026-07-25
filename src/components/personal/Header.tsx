import React, { useState, useEffect } from "react";
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

const MENU_ITEM_CLASS =
  "block w-full text-left px-4 py-1 hover:bg-black hover:text-white cursor-pointer border-b border-gray-200 last:border-b-0";

const MenuDropdown: React.FC<{ items: MenuItem[]; onSelect: () => void }> = ({
  items,
  onSelect,
}) => (
  <div className="absolute top-full left-0 bg-white border-2 border-black shadow-md min-w-[160px]">
    {items.map((item, index) =>
      item.href ? (
        <a
          key={index}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className={MENU_ITEM_CLASS}
          onClick={onSelect}
        >
          {item.name}
        </a>
      ) : (
        <button
          key={index}
          type="button"
          className={MENU_ITEM_CLASS}
          onClick={() => {
            item.onClick?.();
            onSelect();
          }}
        >
          {item.name}
        </button>
      ),
    )}
  </div>
);

export const Header: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleMenuClick = (menu: string) =>
    setActiveDropdown(activeDropdown === menu ? null : menu);

  const closeDropdown = () => setActiveDropdown(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDropdown();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const webRingItems: MenuItem[] = [
    {
      name: "CS Webring",
      href: "https://cs.uwatering.com/#jaryddiamond",
    },
    {
      name: "←",
      href: "https://cs.uwatering.com/#jaryddiamond?nav=prev",
    },
    {
      name: "→",
      href: "https://cs.uwatering.com/#jaryddiamond?nav=next",
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
    { name: "Twitter", href: "https://x.com/jaryddiamond" },
    { name: "LinkedIn", href: "https://linkedin.com/in/jaryddiamond" },
    { name: "Github", href: "https://github.com/jarydo" },
    { name: "Letterboxd", href: "https://letterboxd.com/jarydo" },
    {
      name: "Email",
      onClick: () => {
        window.open("mailto:jarydnoahdiamond@gmail.com");
      },
    },
  ];

  const recruiterMenuItems: MenuItem[] = [
    { name: "Off" },
    {
      name: "On",
      onClick: () => navigate("/recruiter"),
    },
  ];

  const menuButtonClass = (menu: string) =>
    `px-1 sm:px-2 py-1 flex items-center shrink-0 whitespace-nowrap ${
      activeDropdown === menu ? "bg-black text-white" : ""
    }`;

  return (
    <>
      {/* Menu bar. Sits above every window, which stack from z-index 1. */}
      <div className="relative z-[100] bg-white flex text-base sm:text-xl border-b-4 border-black items-center">
        <img src={headerLeftIcon} alt="" />
        <div className="flex grow items-center gap-6 h-full min-w-0">
          <div className="relative">
            <button
              onClick={() => handleMenuClick("webRing")}
              className={menuButtonClass("webRing")}
              aria-haspopup="true"
              aria-expanded={activeDropdown === "webRing"}
              aria-label="CS Webring"
            >
              <img
                src={
                  activeDropdown === "webRing"
                    ? webringWhiteIcon
                    : webringBlackIcon
                }
                width="24"
                height="24"
                alt=""
                className="w-5 h-5"
              />
            </button>
            {activeDropdown === "webRing" && (
              <MenuDropdown items={webRingItems} onSelect={closeDropdown} />
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => handleMenuClick("socraticaWebRing")}
              className={menuButtonClass("socraticaWebRing")}
              aria-haspopup="true"
              aria-expanded={activeDropdown === "socraticaWebRing"}
              aria-label="Socratica Webring"
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
              <MenuDropdown
                items={socraticaWebRingItems}
                onSelect={closeDropdown}
              />
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => handleMenuClick("contact")}
              className={menuButtonClass("contact")}
              aria-haspopup="true"
              aria-expanded={activeDropdown === "contact"}
            >
              Contact
            </button>
            {activeDropdown === "contact" && (
              <MenuDropdown items={contactMenuItems} onSelect={closeDropdown} />
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => handleMenuClick("recruiter")}
              className={menuButtonClass("recruiter")}
              aria-haspopup="true"
              aria-expanded={activeDropdown === "recruiter"}
            >
              {/* "Mode" is dropped on narrow screens so the bar fits */}
              Recruiter<span className="hidden sm:inline">&nbsp;Mode</span>
            </button>
            {activeDropdown === "recruiter" && (
              <MenuDropdown
                items={recruiterMenuItems}
                onSelect={closeDropdown}
              />
            )}
          </div>
        </div>
        <img src={headerRightIcon} alt="" />
      </div>

      {/* Hidden Socratica webring links for crawler detection */}
      <a
        href="https://socratica.info/webring/jaryddiamond.com/prev"
        className="sr-only"
      >
        Prev
      </a>
      <a
        href="https://socratica.info/webring/jaryddiamond.com/next"
        className="sr-only"
      >
        Next
      </a>
      <a href="https://socratica.info/webring" className="sr-only"></a>

      {/* Click anywhere else to close dropdowns */}
      {activeDropdown && (
        <div className="fixed inset-0 z-[99]" onClick={closeDropdown} />
      )}
    </>
  );
};
