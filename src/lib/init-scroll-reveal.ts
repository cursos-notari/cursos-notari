'use client'

export async function initScrollReveal() {
  if (typeof window === "undefined") return; // garante client-side

  const ScrollReveal = (await import("scrollreveal")).default;

  const sr = ScrollReveal({
    origin: "top",
    distance: "50px",
    duration: 1800,
  });

  sr.reveal(".delaySmallReveal", { delay: 200 });
  sr.reveal(".delayMediumReveal", { delay: 300 });
  sr.reveal(".delayLargeReveal", { delay: 400 });
  sr.reveal(".delayExtraBigReveal", { delay: 600 });
  sr.reveal(".intervalCardReveal", { interval: 300 });
}