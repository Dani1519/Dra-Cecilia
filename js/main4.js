// Número de WhatsApp que recibirá las solicitudes de cita (52 = México)
const WHATSAPP_NUMBER = "524621250307";

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

// Aparición suave de elementos
const revealItems = document.querySelectorAll(
  ".hero__text, .hero__media, .section__head, .card, .perk, .doctor__media, .doctor__text, .step, .faq details, .contact__info, .form, .map"
);
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
