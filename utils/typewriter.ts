export function typeWriter() {
  const elementos = document.querySelectorAll<HTMLElement>(".typewriter");

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const elemento = entry.target as HTMLElement;
          const textoArray = elemento.innerHTML.split("");
          elemento.innerHTML = " ";

          textoArray.forEach((letra, i) => {
            setTimeout(() => {
              elemento.innerHTML += letra;
            }, 50 * i);
          });

          obs.unobserve(elemento); // não precisa mais observar
        }
      });
    },
    {
      threshold: 0.5 // 50% do elemento visível
    }
  );

  elementos.forEach(el => observer.observe(el));
}