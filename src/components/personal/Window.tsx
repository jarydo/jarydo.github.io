import React, { useState, useEffect, useRef, useCallback } from "react";
import { Rnd } from "react-rnd";
import ClassicScrollbar from "./Scrollbar";
import windowHeader from "/macos_assets/window_header.png";
import windowClicked from "/macos_assets/window_clicked.png";
import windowUnclicked from "/macos_assets/window_unclicked.png";

/** Gap kept between a window and the edge of the viewport. */
const MARGIN = 8;
/** Space reserved at the top for the menu bar. */
const TOP_OFFSET = 40;
const MIN_WIDTH = 280;
const MIN_HEIGHT = 240;

type Size = { width: number; height: number };
type Position = { x: number; y: number };

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const availableWidth = () => window.innerWidth - MARGIN * 2;
const availableHeight = () => window.innerHeight - TOP_OFFSET - MARGIN;

/** Shrink a window so it always fits the current viewport. */
const fitSize = ({ width, height }: Size): Size => ({
  width: Math.min(width, availableWidth()),
  height: Math.min(height, availableHeight()),
});

/** Keep a window fully on screen. */
const fitPosition = ({ x, y }: Position, size: Size): Position => ({
  x: clamp(
    x,
    MARGIN,
    Math.max(MARGIN, window.innerWidth - size.width - MARGIN),
  ),
  y: clamp(
    y,
    TOP_OFFSET,
    Math.max(TOP_OFFSET, window.innerHeight - size.height - MARGIN),
  ),
});

interface WindowProps {
  title: string;
  initialPosition: Position;
  width?: number;
  height?: number;
  zIndex: number;
  onFocus: () => void;
  onClose: () => void;
  children: React.ReactNode;
  /** ID of the desktop icon that opened this window; the open/close animation flies to and from it. */
  sourceElementId: string;
}

export const Window: React.FC<WindowProps> = ({
  title,
  width = 600,
  height = 450,
  initialPosition,
  zIndex,
  onFocus,
  onClose,
  children,
  sourceElementId,
}) => {
  const [size, setSize] = useState<Size>(() => fitSize({ width, height }));
  const [position, setPosition] = useState<Position>(() =>
    fitPosition(initialPosition, fitSize({ width, height })),
  );
  const [isCloseButtonPressed, setIsCloseButtonPressed] = useState(false);
  const [showOutline, setShowOutline] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [animationStyle, setAnimationStyle] = useState({});
  const windowRef = useRef<Rnd>(null);
  const animationTimersRef = useRef<number[]>([]);

  // The open animation runs once, from the values the window was opened with
  const openAnimation = useRef({ size, position, zIndex, sourceElementId });

  // The geometry the user asked for, before it was clamped to the viewport.
  // Re-clamping from these means a window restores itself when the viewport
  // grows again instead of shrinking a little more on every resize.
  const requested = useRef({
    size: { width, height },
    position: initialPosition,
  });

  const clearAllTimers = () => {
    animationTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    animationTimersRef.current = [];
  };

  const addTimer = (timer: number) => {
    animationTimersRef.current.push(timer);
    return timer;
  };

  // Keep the window inside the viewport when it is resized or rotated
  useEffect(() => {
    const handleResize = () => {
      const nextSize = fitSize(requested.current.size);
      setSize(nextSize);
      setPosition(fitPosition(requested.current.position, nextSize));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const {
      size: finalSize,
      position: finalPosition,
      zIndex: animationZIndex,
      sourceElementId: sourceId,
    } = openAnimation.current;

    const sourceElement = document.getElementById(sourceId);

    // The animation starts from the icon that opened the window, or from the
    // centre of the screen if that icon isn't on screen anymore.
    const startRect = sourceElement
      ? (() => {
          const rect = sourceElement.getBoundingClientRect();
          return {
            left: rect.left + window.scrollX,
            top: rect.top + window.scrollY,
            width: rect.width,
            height: rect.height,
          };
        })()
      : {
          left: window.innerWidth / 2 - 30,
          top: window.innerHeight / 2 - 30,
          width: 60,
          height: 60,
        };

    const translateX =
      finalPosition.x +
      finalSize.width / 2 -
      (startRect.left + startRect.width / 2);
    const translateY =
      finalPosition.y +
      finalSize.height / 2 -
      (startRect.top + startRect.height / 2);

    clearAllTimers();

    // Set initial style to match the source
    setAnimationStyle({
      position: "fixed",
      left: `${startRect.left}px`,
      top: `${startRect.top}px`,
      width: `${startRect.width}px`,
      height: `${startRect.height}px`,
      transform: "none",
      transition: "none",
      pointerEvents: "none",
    });

    const animationFrame = requestAnimationFrame(() => {
      // First phase: Move to final position
      setAnimationStyle({
        position: "fixed",
        left: `${startRect.left}px`,
        top: `${startRect.top}px`,
        width: `${startRect.width}px`,
        height: `${startRect.height}px`,
        transform: `translate(${translateX}px, ${translateY}px)`,
        transition: "transform 200ms cubic-bezier(0.3, 0, 0.2, 1)",
        zIndex: animationZIndex,
        pointerEvents: "none",
      });

      // Second phase: Expand to final size
      addTimer(
        window.setTimeout(() => {
          setAnimationStyle({
            position: "fixed",
            left: `${finalPosition.x}px`,
            top: `${finalPosition.y}px`,
            width: `${finalSize.width}px`,
            height: `${finalSize.height}px`,
            transform: "none",
            transition: "all 300ms cubic-bezier(0.2, 0, 0.2, 1)",
            zIndex: animationZIndex,
            pointerEvents: "none",
          });

          // Final phase: Show actual window content
          addTimer(
            window.setTimeout(() => {
              setShowOutline(false);
              setShowContent(true);
            }, 300),
          );
        }, 200),
      );
    });

    return () => {
      cancelAnimationFrame(animationFrame);
      clearAllTimers();
    };
  }, []);

  // Close animation: shrink the window back into the icon that opened it
  const handleClose = useCallback(() => {
    const rndElement = windowRef.current?.resizableElement.current;
    const sourceElement = document.getElementById(sourceElementId);

    if (!rndElement || !sourceElement) {
      onClose();
      return;
    }

    const currentRect = rndElement.getBoundingClientRect();
    const targetRect = sourceElement.getBoundingClientRect();

    clearAllTimers();

    // Animate a bare outline so the real window can unmount immediately
    const animationDiv = document.createElement("div");
    animationDiv.className = "fixed border-2 border-black bg-transparent";
    animationDiv.style.position = "fixed";
    animationDiv.style.left = `${currentRect.left + window.scrollX}px`;
    animationDiv.style.top = `${currentRect.top + window.scrollY}px`;
    animationDiv.style.width = `${currentRect.width}px`;
    animationDiv.style.height = `${currentRect.height}px`;
    animationDiv.style.zIndex = `${zIndex}`;
    animationDiv.style.pointerEvents = "none";
    document.body.appendChild(animationDiv);

    setShowContent(false);
    setShowOutline(false);

    // Shrink around the window's own centre before flying to the icon
    const centerOffsetX = (currentRect.width - targetRect.width) / 2;
    const centerOffsetY = (currentRect.height - targetRect.height) / 2;

    requestAnimationFrame(() => {
      void animationDiv.offsetHeight; // force reflow so the transition applies

      animationDiv.style.transition = "all 250ms cubic-bezier(0.2, 0, 0.2, 1)";
      animationDiv.style.left = `${currentRect.left + window.scrollX + centerOffsetX}px`;
      animationDiv.style.top = `${currentRect.top + window.scrollY + centerOffsetY}px`;
      animationDiv.style.width = `${targetRect.width}px`;
      animationDiv.style.height = `${targetRect.height}px`;

      setTimeout(() => {
        animationDiv.style.transition =
          "all 180ms cubic-bezier(0.3, 0, 0.2, 1)";
        animationDiv.style.left = `${targetRect.left + window.scrollX}px`;
        animationDiv.style.top = `${targetRect.top + window.scrollY}px`;

        setTimeout(() => {
          animationDiv.remove();
          onClose();
        }, 200);
      }, 250);
    });
  }, [onClose, sourceElementId, zIndex]);

  return (
    <>
      {/* Wireframe outline for the open animation */}
      {showOutline && (
        <div
          className="fixed border-2 border-black bg-transparent"
          style={animationStyle}
        />
      )}

      {showContent && (
        <Rnd
          size={size}
          position={position}
          minWidth={Math.min(MIN_WIDTH, availableWidth())}
          minHeight={Math.min(MIN_HEIGHT, availableHeight())}
          maxWidth={Math.min(800, availableWidth())}
          maxHeight={Math.min(600, availableHeight())}
          bounds="window"
          style={{ zIndex }}
          onClick={(e: { target: HTMLElement }) => {
            // Only focus if not clicking on a link or interactive element
            const target = e.target as HTMLElement;
            const isLink = target.tagName === "A" || target.closest("a");
            const isButton =
              target.tagName === "BUTTON" || target.closest("button");
            const isInput =
              target.tagName === "INPUT" || target.tagName === "TEXTAREA";

            if (!isLink && !isButton && !isInput) {
              onFocus();
            }
          }}
          onDragStop={(_, data) => {
            const next = { x: data.x, y: data.y };
            requested.current.position = next;
            setPosition(next);
          }}
          onResize={(_, __, ref, ___, newPosition) => {
            const next = { width: ref.offsetWidth, height: ref.offsetHeight };
            requested.current = { size: next, position: newPosition };
            setSize(next);
            setPosition(newPosition);
          }}
          dragHandleClassName="window-header"
          cancel=".window-button"
          ref={windowRef}
        >
          <div className="bg-white border-black border-2 flex flex-col h-full">
            <div className="window-header flex border-black border-b-2 items-center cursor-move">
              <img
                src={windowHeader}
                alt=""
                width="12px"
                className="mx-2 shrink-0"
                draggable="false"
              />
              <button
                onClick={handleClose}
                onMouseDown={() => setIsCloseButtonPressed(true)}
                onMouseUp={() => setIsCloseButtonPressed(false)}
                onMouseLeave={() => setIsCloseButtonPressed(false)}
                className="window-button cursor-pointer shrink-0"
                aria-label={`Close ${title}`}
              >
                <img
                  src={isCloseButtonPressed ? windowClicked : windowUnclicked}
                  alt=""
                  width="22px"
                  draggable="false"
                />
              </button>
              <img
                className="grow min-w-0 mx-2 h-[38px]"
                src={windowHeader}
                alt=""
                draggable="false"
              />
              <div className="text-lg sm:text-xl select-none truncate max-w-[55%]">
                {title}
              </div>
              <img
                className="grow min-w-0 ml-2 h-[38px]"
                src={windowHeader}
                alt=""
                draggable="false"
              />
              <img
                className="h-[38px] w-[50px] mr-2 shrink-0 hidden sm:block"
                src={windowHeader}
                alt=""
                draggable="false"
              />
            </div>

            <div className="flex-grow overflow-hidden">
              <ClassicScrollbar>{children}</ClassicScrollbar>
            </div>
          </div>
        </Rnd>
      )}
    </>
  );
};
