"use client";

import { useEffect } from "react";

export const ServiceWorkerRegister = () => {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => {
          // SW registered successfully
        })
        .catch(() => {
          // Registration ignored in dev
        });
    }
  }, []);

  return null;
};
