'use client'

export async function initScrollReveal() {
  const ScrollReveal = (await import("scrollreveal")).default;

  const sr = ScrollReveal({
    origin: "top",
    distance: "50px",
    duration: 1800,
  });

  sr.reveal(".delay-small-reveal", { delay: 200 });
  sr.reveal(".delay-medium-reveal", { delay: 300 });
  sr.reveal(".delay-large-reveal", { delay: 400 });
  sr.reveal(".delay-extra-large-reveal", { delay: 600 });
  sr.reveal(".interval-card-reveal", { interval: 300 });
}