"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RefreshOrders() {
  const router = useRouter();
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    if (!autoRefresh) return;

    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        router.refresh();
      }
    }, 25_000);

    return () => window.clearInterval(timer);
  }, [autoRefresh, router]);

  return (
    <div>
      <button type="button" onClick={() => router.refresh()}>
        Actualizar
      </button>
      <label>
        <input
          type="checkbox"
          checked={autoRefresh}
          onChange={(event) => setAutoRefresh(event.target.checked)}
        />
        Actualizar automáticamente
      </label>
    </div>
  );
}
