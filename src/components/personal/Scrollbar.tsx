import React, { useState, useEffect, useRef, MouseEvent } from "react";

interface ClassicScrollbarProps {
  children: React.ReactNode;
}

interface ScrollState {
  isOverflowing: boolean;
  scrollPosition: number;
  isDragging: boolean;
  startY: number;
  startScrollTop: number;
}

export default function ClassicScrollbar({ children }: ClassicScrollbarProps) {
  const [scrollState, setScrollState] = useState<ScrollState>({
    isOverflowing: false,
    scrollPosition: 0,
    isDragging: false,
    startY: 0,
    startScrollTop: 0,
  });

  const contentRef = useRef<HTMLDivElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const scrollThumbRef = useRef<HTMLDivElement>(null);

  // Check for overflow on mount and when content changes
  useEffect(() => {
    const checkOverflow = (): void => {
      const content = contentRef.current;
      if (!content) return;

      const hasOverflow = content.scrollHeight > content.clientHeight;
      setScrollState((prev) => ({
        ...prev,
        isOverflowing: hasOverflow,
      }));
    };

    checkOverflow();

    // Create a ResizeObserver to watch for content size changes
    const resizeObserver = new ResizeObserver(checkOverflow);
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [children]);

  const handleScroll = (): void => {
    const content = contentRef.current;
    if (!content) return;

    const scrollPercentage =
      (content.scrollTop / (content.scrollHeight - content.clientHeight)) * 100;
    setScrollState((prev) => ({
      ...prev,
      scrollPosition: scrollPercentage,
    }));
  };

  const handleThumbMouseDown = (e: MouseEvent<HTMLDivElement>): void => {
    e.preventDefault(); // Prevent text selection while dragging
    setScrollState((prev) => ({
      ...prev,
      isDragging: true,
      startY: e.clientY,
      startScrollTop: contentRef.current?.scrollTop || 0,
    }));
  };

  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent): void => {
      if (!scrollState.isDragging) return;

      const content = contentRef.current;
      const track = scrollTrackRef.current;
      const thumb = scrollThumbRef.current;
      if (!content || !track || !thumb) return;

      const deltaY = e.clientY - scrollState.startY;
      const trackHeight = track.clientHeight - thumb.offsetHeight;
      const scrollRange = content.scrollHeight - content.clientHeight;

      const scrollDelta = (deltaY / trackHeight) * scrollRange;
      content.scrollTop = scrollState.startScrollTop + scrollDelta;
    };

    const handleMouseUp = (): void => {
      setScrollState((prev) => ({
        ...prev,
        isDragging: false,
      }));
    };

    if (scrollState.isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "none"; // Prevent text selection while dragging
    } else {
      document.body.style.userSelect = ""; // Restore text selection
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
    };
  }, [scrollState.isDragging, scrollState.startY, scrollState.startScrollTop]);

  const handleArrowClick = (direction: "up" | "down"): void => {
    const content = contentRef.current;
    if (!content) return;

    const scrollAmount = direction === "up" ? -20 : 20;
    content.scrollBy({ top: scrollAmount, behavior: "smooth" });
  };

  // Calculate thumb size based on content
  const getThumbHeight = (): string => {
    const content = contentRef.current;
    if (!content) return "20%";

    const viewportToContentRatio = content.clientHeight / content.scrollHeight;
    const thumbHeight = Math.max(viewportToContentRatio * 100, 10); // Minimum 10% height
    return `${thumbHeight}%`;
  };

  return (
    <div className="relative flex h-full">
      <div
        ref={contentRef}
        onScroll={handleScroll}
        className="flex-grow overflow-hidden pr-4"
      >
        {children}
      </div>

      {scrollState.isOverflowing && (
        <div className="w-8 flex flex-col border-l-2 border-black">
          <button
            onClick={() => handleArrowClick("up")}
            className="border-b-2 border-black"
          >
            <img src="/macos_assets/arrow_up.png" />
          </button>

          <div
            ref={scrollTrackRef}
            className="flex-grow bg-gray-100 border-x border-gray-400 relative"
          >
            <div
              ref={scrollThumbRef}
              onMouseDown={handleThumbMouseDown}
              style={{
                top: `${scrollState.scrollPosition}%`,
                height: getThumbHeight(),
              }}
              className="absolute w-full bg-gray-300 border border-gray-400 hover:bg-gray-400 cursor-pointer transform -translate-y-1/2"
            />
          </div>

          <button
            onClick={() => handleArrowClick("down")}
            className="w-8 border-t-2 border-black"
          >
            <img src="/macos_assets/arrow_down.png" />
          </button>
        </div>
      )}
    </div>
  );
}
