import { useEffect, useRef } from "react";
import {
  AnimatePresence,
  motion,
  useAnimate,
  useReducedMotion,
  type TargetAndTransition,
  type Transition,
} from "motion/react";
import chatIcon from "./assets/chat-3-fill.svg";

export type BadgeVariant = "pop" | "pulse" | "grow" | "roll";

type Props = {
  count: number;
  variant: BadgeVariant;
  /** 1 = normal, 0.25 = slow motion 4x */
  speed?: number;
  onClick?: () => void;
};

const EASE_OUT = [0.32, 0.72, 0, 1] as const;
const MORPH_FROM = 0.95;

export function ChatFab({ count, variant, speed = 1, onClick }: Props) {
  const reduce = useReducedMotion() ?? false;
  const [fabScope, animateFab] = useAnimate<HTMLButtonElement>();
  const [badgeScope, animateBadge] = useAnimate<HTMLSpanElement>();
  const prevCount = useRef(count);

  const s = (seconds: number) => seconds / speed;
  const spring = (duration: number, delay = 0): Transition => ({
    type: "spring",
    duration: s(duration),
    bounce: 0,
    delay: s(delay),
  });

  // Re-morph on every new chat while the badge is already visible (1 → 2 → 3 ...).
  useEffect(() => {
    const prev = prevCount.current;
    prevCount.current = count;
    if (reduce || count <= prev) return;

    if (prev > 0 && badgeScope.current) {
      animateBadge(badgeScope.current, { scale: [MORPH_FROM, 1] }, spring(0.35));
    }
    if (variant === "pulse") {
      animateFab(fabScope.current, { scale: [MORPH_FROM, 1] }, spring(0.45));
    }
    if (variant === "grow") {
      animateFab(fabScope.current, { scale: [MORPH_FROM, 1] }, spring(0.45, 0.06));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  const rest: TargetAndTransition = { scale: 1, opacity: 1, x: 0, y: 0, filter: "blur(0px)" };
  const enter: TargetAndTransition =
    variant === "grow"
      ? { scale: MORPH_FROM, opacity: 0, x: -6, y: 6, filter: "blur(2px)" }
      : { scale: MORPH_FROM, opacity: 0 };
  const enterTransition: Transition =
    variant === "pop" || variant === "roll"
      ? { duration: s(0.2), ease: EASE_OUT }
      : spring(variant === "grow" ? 0.45 : 0.4);
  const exit: TargetAndTransition = {
    scale: MORPH_FROM,
    opacity: 0,
    transition: { duration: s(0.15), ease: "easeIn" },
  };

  const label = count > 9 ? "9+" : String(count);

  return (
    <button
      ref={fabScope}
      type="button"
      onClick={onClick}
      aria-label={count > 0 ? `Chat, ${count} pesan baru` : "Chat"}
      className="relative size-12 rounded-full transition-[scale] duration-150 ease-out will-change-transform active:scale-96 motion-reduce:transition-none"
    >
      <span
        aria-hidden
        className="absolute inset-0 flex items-center justify-center overflow-clip rounded-full border-2 border-white/10 shadow-[0px_23.143px_33.429px_0px_rgba(254,94,13,0.11),0px_2.571px_6.857px_0px_rgba(254,94,13,0.24),0px_1.714px_10.286px_-3.429px_rgba(0,0,0,0.1),0px_0px_0px_2px_#0c0c0c]"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,0.1) 9.09%, rgba(255,255,255,0) 107.95%), linear-gradient(169deg, #f54900 12.93%, #f3a755 114.35%)",
        }}
      >
        <img src={chatIcon} width={20} height={20} alt="" className="relative" />
        <span className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_-3.429px_3.429px_0px_rgba(255,255,255,0.15),inset_0px_-2.571px_2.571px_0px_rgba(0,0,0,0.25),inset_0px_2.571px_12.429px_0px_rgba(255,198,174,0.8),inset_0px_-1.714px_1.714px_0px_rgba(255,255,255,0.15),inset_0px_1.714px_1.714px_0px_rgba(255,255,255,0.15),inset_0px_0px_10.286px_0px_rgba(255,255,255,0.16)]" />
      </span>

      <AnimatePresence initial={false}>
        {count > 0 && (
          <motion.span
            key="badge"
            ref={badgeScope}
            aria-hidden
            initial={reduce ? false : enter}
            animate={rest}
            exit={reduce ? { opacity: 0, transition: { duration: 0 } } : exit}
            transition={enterTransition}
            style={{ transformOrigin: variant === "grow" ? "bottom left" : "center" }}
            className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center overflow-hidden rounded-full bg-white px-[5px] text-xs leading-none font-medium text-brand tabular-nums will-change-transform"
          >
            {variant === "roll" && !reduce ? (
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={label}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: s(0.22), ease: EASE_OUT }}
                  className="block"
                >
                  {label}
                </motion.span>
              </AnimatePresence>
            ) : (
              label
            )}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
