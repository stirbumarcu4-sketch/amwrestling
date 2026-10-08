"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ContextToast = { arata: (mesaj: string) => void };

const Context = createContext<ContextToast | null>(null);

export function useToast() {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useToast trebuie folosit în interiorul lui ToastProvider.");
  }
  return context;
}

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [mesaj, setMesaj] = useState<string | null>(null);
  const cronometru = useRef<ReturnType<typeof setTimeout> | null>(null);

  const arata = useCallback((text: string) => {
    setMesaj(text);
    if (cronometru.current) clearTimeout(cronometru.current);
    cronometru.current = setTimeout(() => setMesaj(null), 3000);
  }, []);

  useEffect(() => {
    return () => {
      if (cronometru.current) clearTimeout(cronometru.current);
    };
  }, []);

  return (
    <Context.Provider value={{ arata }}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed bottom-5 right-5 z-50 max-w-[calc(100vw-40px)]"
      >
        {mesaj ? (
          <p className="border border-ink-800 bg-ink-900 px-4 py-3 text-sm text-chalk-50 shadow-[var(--shadow-pop)]">
            {mesaj}
          </p>
        ) : null}
      </div>
    </Context.Provider>
  );
}
