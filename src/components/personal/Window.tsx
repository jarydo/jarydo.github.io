import React, { useState, useEffect, useRef } from "react";
import { Rnd } from "react-rnd";
import ClassicScrollbar from "./Scrollbar";

interface WindowProps {
  title: string;
  initialPosition: { x: number; y: number };
  width?: number;
  height?: number;
  zIndex: number;
  onFocus: () => void;
  onClose: () => void;
  children: React.ReactNode;
  sourceElementId?: string; // Optional: ID of element that triggered window open
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
  const [size, setSize] = useState({ width, height });
  const [isCloseButtonPressed, setIsCloseButtonPressed] = useState(false);
  const [showOutline, setShowOutline] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [animationStyle, setAnimationStyle] = useState({});
  const windowRef = useRef<Rnd>(null);
  const animationTimersRef = useRef<number[]>([]);

  // Helper to clear all animation timers
  const clearAllTimers = () => {
    animationTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    animationTimersRef.current = [];
  };

  // Helper to add a timer to the tracking array
  const addTimer = (timer: number) => {
    animationTimersRef.current.push(timer);
    return timer;
  };

  useEffect(() => {
    // Start the open animation
    const sourceElement = sourceElementId
      ? document.getElementById(sourceElementId)
      : null;

    let startRect;

    if (sourceElement) {
      // Animation starts from source element (file or folder)
      startRect = sourceElement.getBoundingClientRect();
    } else {
      // Default animation starts from a small centered point
      startRect = {
        left: window.innerWidth / 2 - 30,
        top: window.innerHeight / 2 - 30,
        width: 60,
        height: 60,
      };
    }

    // Calculate final position
    const finalRect = {
      left: initialPosition.x,
      top: initialPosition.y,
      width: width,
      height: height,
    };

    // Calculate the center points for both
    const startCenter = {
      x: startRect.left + startRect.width / 2,
      y: startRect.top + startRect.height / 2,
    };

    const finalCenter = {
      x: finalRect.left + finalRect.width / 2,
      y: finalRect.top + finalRect.height / 2,
    };

    // Calculate translation needed
    const translateX = finalCenter.x - startCenter.x;
    const translateY = finalCenter.y - startCenter.y;

    // Clear any existing timers
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

    // Start the animation sequence
    const animationFrame = requestAnimationFrame(() => {
      // First phase: Move to center position
      setAnimationStyle({
        position: "fixed",
        left: `${startRect.left}px`,
        top: `${startRect.top}px`,
        width: `${startRect.width}px`,
        height: `${startRect.height}px`,
        transform: `translate(${translateX}px, ${translateY}px)`,
        transition: "transform 200ms cubic-bezier(0.3, 0, 0.2, 1)",
        zIndex: zIndex,
        pointerEvents: "none",
      });

      // Second phase: Expand to final size
      addTimer(
        window.setTimeout(() => {
          setAnimationStyle({
            position: "fixed",
            left: `${finalRect.left}px`,
            top: `${finalRect.top}px`,
            width: `${finalRect.width}px`,
            height: `${finalRect.height}px`,
            transform: "none",
            transition: "all 300ms cubic-bezier(0.2, 0, 0.2, 1)",
            zIndex: zIndex,
            pointerEvents: "none",
          });

          // Final phase: Show actual window content
          addTimer(
            window.setTimeout(() => {
              setShowOutline(false);
              setShowContent(true);
            }, 300)
          );
        }, 200)
      );
    });

    return () => {
      // Cleanup timers to prevent memory leaks
      cancelAnimationFrame(animationFrame);
      clearAllTimers();
    };
  }, [initialPosition, width, height, zIndex, sourceElementId]);

  // Close animation
  const handleClose = () => {
    // Get current position of window for animation
    if (!windowRef.current) {
      onClose();
      return;
    }

    const rndElement = windowRef.current.resizableElement.current;
    if (!rndElement) {
      onClose();
      return;
    }

    const currentRect = rndElement.getBoundingClientRect();

    // Find the source element if it exists
    const sourceElement = sourceElementId
      ? document.getElementById(sourceElementId)
      : null;

    if (!sourceElement) {
      // No source element, just close
      onClose();
      return;
    }

    const targetRect = sourceElement.getBoundingClientRect();

    // Hide the actual window and show the outline for animation
    setShowContent(false);
    setShowOutline(true);

    // Clear any existing timers
    clearAllTimers();

    // Start with current window position
    setAnimationStyle({
      position: "fixed",
      left: `${currentRect.left}px`,
      top: `${currentRect.top}px`,
      width: `${currentRect.width}px`,
      height: `${currentRect.height}px`,
      transform: "none",
      transition: "none",
      zIndex: zIndex,
      pointerEvents: "none",
    });

    // Calculate position to shrink while maintaining center position
    const centerOffsetX = (currentRect.width - targetRect.width) / 2;
    const centerOffsetY = (currentRect.height - targetRect.height) / 2;

    // First phase: Shrink in place - run in next frame to ensure initial position renders
    requestAnimationFrame(() => {
      addTimer(
        window.setTimeout(() => {
          setAnimationStyle({
            position: "fixed",
            left: `${currentRect.left + centerOffsetX}px`,
            top: `${currentRect.top + centerOffsetY}px`,
            width: `${targetRect.width}px`,
            height: `${targetRect.height}px`,
            transform: "none",
            transition: "all 250ms cubic-bezier(0.2, 0, 0.2, 1)",
            zIndex: zIndex,
            pointerEvents: "none",
          });

          // Second phase: Move to target position
          addTimer(
            window.setTimeout(() => {
              setAnimationStyle({
                position: "fixed",
                left: `${targetRect.left}px`,
                top: `${targetRect.top}px`,
                width: `${targetRect.width}px`,
                height: `${targetRect.height}px`,
                transform: "none",
                transition: "all 180ms cubic-bezier(0.3, 0, 0.2, 1)",
                zIndex: zIndex,
                pointerEvents: "none",
              });

              // Final phase: Close the window after animation completes
              addTimer(
                window.setTimeout(() => {
                  setShowOutline(false);
                  onClose();
                }, 200)
              );
            }, 250)
          );
        }, 10)
      );
    });
  };

  return (
    <>
      {/* Wireframe outline for animation */}
      {showOutline && (
        <div
          className="fixed border-2 border-black bg-transparent"
          style={animationStyle}
        />
      )}

      {/* Actual window content */}
      {showContent && (
        <Rnd
          default={{
            x: initialPosition.x,
            y: initialPosition.y,
            width: size.width,
            height: size.height,
          }}
          minWidth={350}
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
          ref={windowRef}
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
                onClick={handleClose}
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
      )}
    </>
  );
};
