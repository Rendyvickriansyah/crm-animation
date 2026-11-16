import { useEffect, useRef, useState } from "react";
import { ChatFab, type BadgeVariant } from "./ChatFab";

const VARIANTS: { id: BadgeVariant; name: string }[] = [
  { id: "pop", name: "A · Pop" },
  { id: "pulse", name: "B · Pulse" },
  { id: "grow", name: "C · Tumbuh" },
  { id: "roll", name: "D · Bergulir" },
];

export default function App() {
  const [variant, setVariant] = useState<BadgeVariant>("pop");
  const [count, setCount] = useState(0);
  const [slow, setSlow] = useState(false);
  const [zoom, setZoom] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  // Simulate a new chat arriving shortly after the page opens or an option is picked.
  const replay = () => {
    setCount(0);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCount(1), 700);
  };

  useEffect(() => {
    timer.current = window.setTimeout(() => setCount(1), 700);
    return () => window.clearTimeout(timer.current);
  }, []);

  return (
    <main className="flex min-h-dvh flex-col">
      <div className="flex flex-1 items-center justify-center">
        <div className={zoom ? "scale-200" : undefined}>
          <ChatFab
            count={count}
            variant={variant}
            speed={slow ? 0.25 : 1}
            onClick={() => setCount(0)}
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 px-4 pb-8 text-sm">
        <div role="radiogroup" aria-label="Opsi animasi" className="flex flex-wrap justify-center gap-1">
          {VARIANTS.map((v) => (
            <button
              key={v.id}
              type="button"
              role="radio"
              aria-checked={variant === v.id}
              onClick={() => {
                setVariant(v.id);
                replay();
              }}
              className="rounded-full px-3 py-1.5 font-medium text-neutral-400 transition-colors duration-150 hover:text-white aria-checked:bg-white/10 aria-checked:text-white"
            >
              {v.name}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-neutral-400">
          <button type="button" onClick={() => setCount((c) => c + 1)} className="font-medium text-brand">
            + Chat baru
          </button>
          <button type="button" onClick={replay} className="hover:text-white">
            Ulangi
          </button>
          <label className="flex items-center gap-1.5">
            <input type="checkbox" checked={slow} onChange={(e) => setSlow(e.target.checked)} className="accent-brand" />
            Slow 4×
          </label>
          <label className="flex items-center gap-1.5">
            <input type="checkbox" checked={zoom} onChange={(e) => setZoom(e.target.checked)} className="accent-brand" />
            Zoom 2×
          </label>
        </div>
      </div>
    </main>
  );
}
