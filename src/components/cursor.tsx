"use client";

import { useEffect, useRef } from "react";

// A soft ring that trails the mouse. It grows over clickable things and shows a
// label over elements with `data-cursor="Label"`. Mouse only; skipped for touch and reduced motion.
export function CursorFollower() {
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!ring || !label) return;
    if (!matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    root.classList.add("has-cursor");
    // Follows the mouse 1:1 (no easing), drawn once per frame.
    let x = -100, y = -100, frame = 0;
    const draw = () => { frame = 0; ring.style.translate = `${x}px ${y}px`; };

    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      x = event.clientX; y = event.clientY;
      if (!frame) frame = requestAnimationFrame(draw);
      ring.classList.add("is-active");
    };
    const over = (event: PointerEvent) => {
      const target = (event.target as Element).closest<HTMLElement>("[data-cursor], a, button, input, textarea, label");
      const text = target?.dataset.cursor ?? "";
      const isField = Boolean(target?.matches("input, textarea, .search-box"));
      ring.classList.toggle("has-label", Boolean(text));
      ring.classList.toggle("is-hover", Boolean(target) && !text && !isField);
      ring.classList.toggle("is-field", isField);
      label.textContent = text;
    };
    const down = () => ring.classList.add("is-down");
    const up = () => ring.classList.remove("is-down");
    const hide = () => ring.classList.remove("is-active");

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    root.addEventListener("pointerleave", hide);
    return () => {
      cancelAnimationFrame(frame);
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      root.removeEventListener("pointerleave", hide);
    };
  }, []);

  return <div className="cursor" ref={ringRef} aria-hidden><span ref={labelRef} /></div>;
}
