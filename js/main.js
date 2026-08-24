const FACEBOOK_URL = "https://www.facebook.com/share/1FAkHTirVK/";

const loader = document.getElementById("loader");
window.addEventListener("load", () => {
  window.setTimeout(() => loader?.classList.add("loaded"), 450);
});

const navbar = document.getElementById("navbar");
const setNavbarState = () => {
  navbar?.classList.toggle("scrolled", window.scrollY > 24);
};
setNavbarState();
window.addEventListener("scroll", setNavbarState, { passive: true });

const hamburger = document.getElementById("hamburger");
const mobMenu = document.getElementById("mob-menu");
hamburger?.addEventListener("click", () => {
  const isOpen = mobMenu?.classList.toggle("open");
  hamburger.setAttribute("aria-expanded", String(Boolean(isOpen)));
});
mobMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobMenu.classList.remove("open");
    hamburger?.setAttribute("aria-expanded", "false");
  });
});

const marquee = document.getElementById("marquee");
if (marquee) {
  const items = [
    "FIBERNET",
    "La velocidad en tus manos",
    "100% fibra optica",
    "Instalacion inmediata",
    "Planes desde 100 Mb",
    "Hasta 300 Mb"
  ];
  const content = Array.from({ length: 2 }, () =>
    items.map((item) => `<span>${item}<i class="fa-solid fa-circle"></i></span>`).join("")
  ).join("");
  marquee.innerHTML = content;
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

const countNumber = (el) => {
  const target = Number(el.dataset.count || 0);
  const prefix = el.dataset.prefix || "";
  const suffix = el.dataset.suffix || "";
  const duration = 1300;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * eased);
    el.textContent = `${prefix}${value}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll(".stat-num").forEach(countNumber);
    statObserver.unobserve(entry.target);
  });
}, { threshold: 0.3 });
document.querySelectorAll(".stats-grid").forEach((el) => statObserver.observe(el));

document.getElementById("year").textContent = new Date().getFullYear();

document.getElementById("wa-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("f-name")?.value.trim();
  const interest = document.getElementById("f-interest")?.value;
  const message = document.getElementById("f-msg")?.value.trim();

  if (!name || !message) {
    event.currentTarget.reportValidity();
    return;
  }

  const summary = `Hola FIBERNET. Soy ${name}. Me interesa: ${interest}. Detalles: ${message}`;
  navigator.clipboard?.writeText(summary).catch(() => {});
  window.open(FACEBOOK_URL, "_blank", "noopener,noreferrer");
});

const canvas = document.getElementById("hero-canvas");
const ctx = canvas?.getContext("2d");
let particles = [];

const resizeCanvas = () => {
  if (!canvas) return;
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx?.setTransform(ratio, 0, 0, ratio, 0, 0);
  particles = Array.from({ length: Math.min(70, Math.floor(window.innerWidth / 18)) }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 2.2 + .7,
    vx: (Math.random() - .5) * .25,
    vy: (Math.random() - .5) * .25,
    hue: Math.random() > .55 ? "36,198,184" : "243,107,11"
  }));
};

const drawParticles = () => {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  particles.forEach((p, index) => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < -10) p.x = window.innerWidth + 10;
    if (p.x > window.innerWidth + 10) p.x = -10;
    if (p.y < -10) p.y = window.innerHeight + 10;
    if (p.y > window.innerHeight + 10) p.y = -10;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.hue}, .72)`;
    ctx.fill();

    for (let i = index + 1; i < particles.length; i += 1) {
      const next = particles[i];
      const dx = p.x - next.x;
      const dy = p.y - next.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 115) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(next.x, next.y);
        ctx.strokeStyle = `rgba(214,222,232, ${0.14 * (1 - dist / 115)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  });
  requestAnimationFrame(drawParticles);
};

if (canvas && ctx) {
  resizeCanvas();
  drawParticles();
  window.addEventListener("resize", resizeCanvas);
}
