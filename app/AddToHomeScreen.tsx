"use client";

import { useState, useEffect } from "react";

export const AddToHomeScreen = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isChrome, setIsChrome] = useState(false);

  useEffect(() => {
    const ios = /iphone|ipad|ipod/.test(
      window.navigator.userAgent.toLowerCase()
    );
    const chrome = /chrome/.test(window.navigator.userAgent.toLowerCase());
    setIsIOS(ios);
    setIsChrome(chrome);
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

    const handler = (e: Event) => {
      e.preventDefault();
      console.log("beforeinstallprompt event fired");
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    console.log("AddToHomeScreen component mounted");
    console.log("User Agent:", window.navigator.userAgent);
    console.log("Platform:", window.navigator.platform);
    console.log("Is Chrome:", chrome);
    console.log(
      "Is Standalone:",
      window.matchMedia("(display-mode: standalone)").matches
    );

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User ${outcome} the install prompt`);
      setDeferredPrompt(null);
    } else {
      console.log("Install prompt not available");
    }
  };

  if (isStandalone) {
    return null; // App is already installed
  }

  if (isIOS) {
    return (
      <div className="fixed bottom-4 right-4 bg-white text-violet-900 px-4 py-2 rounded-full shadow-lg z-50">
        Install this app: tap <span className="text-blue-500">Share</span> then
        &quot;Add to Home Screen&quot;
      </div>
    );
  }

  if (isChrome) {
    return (
      <button
        onClick={handleClick}
        className="fixed bottom-4 right-4 bg-white text-violet-900 px-4 py-2 rounded-full shadow-lg z-50"
      >
        {deferredPrompt ? "Add to Homescreen" : "Install App"}
      </button>
    );
  }

  // For other browsers
  return (
    <div className="fixed bottom-4 right-4 bg-white text-violet-900 px-4 py-2 rounded-full shadow-lg z-50">
      Install this app: Use browser menu to &quot;Add to Home Screen&quot;
    </div>
  );
};
