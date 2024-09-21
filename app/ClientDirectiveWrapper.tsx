"use client";

import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";
export function AnalyticsWrapper() {
  return <Analytics />;
}

export function ToasterWrapper() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 6000,
        error: {
          duration: 4000,
        },
        success: {
          duration: 2000,
        },
      }}
    />
  );
}
