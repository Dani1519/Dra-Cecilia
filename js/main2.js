// Número de WhatsApp que recibirá las solicitudes de cita (52 = México)
const WHATSAPP_NUMBER = "524621250307";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Menú móvil
const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");

navToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", open);
});

nav.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  })
);

// Encabezado y barra de progreso al hacer scroll
const header = document.getElementById("header");
const progress = document.getElementById("progress");

function onScroll() {
  header.classList.toggle("is-scrolled", window.scrollY > 10);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Aparición suave de elementos
const revealItems = document.querySelectorAll(".card, .bento__item, .step, .contact-card, .form, .portrait, .split__text, .section__header, .map");
revealItems.forEach((el) => el.classList.add("reveal"));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
revealItems.forEach((el) => observer.observe(el));

// Brillo que sigue al cursor en tarjetas
document.querySelectorAll(".glow").forEach((el) => {
  el.addEventListener("pointermove", (e) => {
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
});

// Inclinación 3D del panel de escaneo
const scanner = document.getElementById("scanner");
if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
  scanner.addEventListener("pointermove", (e) => {
    const r = scanner.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    scanner.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
  });
  scanner.addEventListener("pointerleave", () => {
    scanner.style.transform = "";
  });
}

// Red de partículas en el fondo del hero
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let points = [];
let rafId;

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = canvas.offsetWidth * dpr;
  canvas.height = canvas.offsetHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const count = Math.min(70, Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 16000));
  points = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.offsetWidth,
    y: Math.random() * canvas.offsetHeight,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
  }));
}

function drawParticles() {
  const w = canvas.offsetWidth;
  const h = canvas.offsetHeight;
  ctx.clearRect(0, 0, w, h);

  for (const p of points) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > w) p.vx *= -1;
    if (p.y < 0 || p.y > h) p.vy *= -1;
  }

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const a = points[i];
      const b = points[j];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < 130) {
        ctx.strokeStyle = `rgba(45, 226, 208, ${0.18 * (1 - d / 130)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  ctx.fillStyle = "rgba(45, 226, 208, .7)";
  for (const p of points) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }

  rafId = requestAnimationFrame(drawParticles);
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);
if (reduceMotion) {
  drawParticles();
  cancelAnimationFrame(rafId);
} else {
  // Pausa la animación cuando el hero no está visible
  new IntersectionObserver(([entry]) => {
    cancelAnimationFrame(rafId);
    if (entry.isIntersecting) drawParticles();
  }).observe(canvas);
}

// Formulario de contacto: abre WhatsApp con el mensaje ya redactado (sin servidor)
const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const { nombre, mensaje } = form.elements;

  if (!nombre.value.trim() || !mensaje.value.trim()) {
    status.textContent = "Por favor completa todos los campos.";
    status.className = "form__status is-error";
    return;
  }

  const text = encodeURIComponent(
    `Hola, Dra. Cecilia. Me gustaría agendar una cita.\n\nNombre: ${nombre.value.trim()}\nMotivo: ${mensaje.value.trim()}`
  );
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank", "noopener");

  status.textContent = "Abriendo WhatsApp…";
  status.className = "form__status is-ok";
  form.reset();
});

// Año actual en el pie de página
document.getElementById("year").textContent = new Date().getFullYear();
