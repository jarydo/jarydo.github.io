import { useState, useEffect } from "react";

const StartupScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentImage, setCurrentImage] = useState<"first" | "second">("first");

  useEffect(() => {
    const imageTimeout = setTimeout(() => {
      setCurrentImage("second");
    }, 1000);

    const messageTimeout = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 2000);

    return () => {
      clearTimeout(imageTimeout);
      clearTimeout(messageTimeout);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-neutral-900 flex items-center justify-center"
      style={{
        backgroundImage: "url(/macos_assets/startup_bg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex items-center justify-center">
        {currentImage === "first" && (
          <img
            src="/macos_assets/startup_image.png"
            alt="Cool Mac"
            className="w-20"
          />
        )}
        {currentImage === "second" && (
          <img
            src="/macos_assets/startup_message.png"
            alt="Welcome to Jaryd's Site"
            className="p-28 max-w-[1000px]"
          />
        )}
      </div>
    </div>
  );
};

export default StartupScreen;
