"use client";
import { useState, useEffect } from "react";
import type { Locale } from "@/locales/it";

export default function CookieBanner({ t }: { t: Locale }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  const accept = (type: "all" | "technical") => {
    localStorage.setItem("cookie-consent", type);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--fg)] text-[var(--bg)] px-5 py-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <p className="font-sans text-sm leading-relaxed opacity-90 flex-1">
          {t.cookie.message}
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => accept("technical")}
            className="font-mono text-xs tracking-widest uppercase border border-current px-3 py-2 opacity-70 hover:opacity-100 transition-opacity"
          >
            {t.cookie.decline}
          </button>
          <button
            onClick={() => accept("all")}
            className="font-mono text-xs tracking-widest uppercase bg-[var(--accent)] text-white px-3 py-2 hover:bg-[var(--accent-dark)] transition-colors"
            style={{ color: "#fff" }}
          >
            {t.cookie.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
