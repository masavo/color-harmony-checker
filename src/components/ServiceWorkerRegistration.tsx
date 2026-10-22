"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) {
      return;
    }

    // The generated worker claims clients when ready. Keep the current page's
    // React state intact; the next navigation loads the updated application.
    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .then((registration) => registration.update())
      .catch((error: unknown) => {
        console.error("Service worker registration failed:", error);
      });
  }, []);

  return null;
}
