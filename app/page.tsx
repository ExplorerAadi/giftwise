"use client";

import { useEffect } from "react";
import { Recommendations } from "./Recommendations";
import { registerServiceWorker } from "./registerSW";

export default function Home() {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return <Recommendations />;
}
