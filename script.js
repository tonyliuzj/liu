const profile = {
  name: "Liu",
  email: "hello@example.com",
  intro: "Product-minded frontend work with clean systems, sharp interactions, and interfaces that feel ready for real people.",
  about:
    "Liu is a compact portfolio for digital product work: clear visual systems, responsive frontend builds, and practical product thinking shaped around the details users notice.",
  stats: [
    ["08", "Selected product and web concepts"],
    ["04", "Core disciplines across UI, frontend, motion, and systems"],
    ["01", "Simple static site ready for GitHub Pages"]
  ],
  nav: [
    ["Work", "#work"],
    ["Capabilities", "#capabilities"],
    ["About", "#about"],
    ["Contact", "#contact"]
  ]
};

const projects = [
  {
    title: "Signal Desk",
    description: "A compact analytics surface for teams that need status, decisions, and next moves in one scan.",
    tags: ["Dashboard", "Design System", "Frontend"],
    bg: "#e8efed",
    accent: "#126b64"
  },
  {
    title: "Atlas Notes",
    description: "A personal knowledge workspace with organized reading queues, project notes, and focused search.",
    tags: ["Workspace", "Interaction", "Prototype"],
    bg: "#f1ece6",
    accent: "#c54e3f"
  },
  {
    title: "Studio Index",
    description: "A polished portfolio archive that gives case studies, experiments, and contact paths equal clarity.",
    tags: ["Portfolio", "Content", "Responsive"],
    bg: "#e7eaf1",
    accent: "#314f83"
  }
];

const capabilities = [
  {
    title: "Interface Design",
    description: "Structure, visual hierarchy, interaction states, and layout systems for product-facing screens."
  },
  {
    title: "Frontend Build",
    description: "Accessible static pages and lightweight JavaScript that deploy cleanly without complex tooling."
  },
  {
    title: "Product Polish",
    description: "Microcopy, responsive behavior, and motion details that make a first visit feel considered."
  }
];

const contactLinks = [
  ["Email", `mailto:${profile.email}`],
  ["GitHub", "https://github.com/"],
  ["LinkedIn", "https://www.linkedin.com/"]
];

function createElement(tag, options = {}) {
  const element = document.createElement(tag);

  if (options.className) element.className = options.className;
  if (options.id) element.id = options.id;
  if (options.text) element.textContent = options.text;
  if (options.html) element.innerHTML = options.html;
  if (options.attributes) {
    Object.entries(options.attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }

  return element;
}

function buildHeader() {
  const header = createElement("header", { className: "site-header" });
  const nav = createElement("nav", {
    className: "nav",
    attributes: { "aria-label": "Primary navigation" }
  });

  const brand = createElement("a", {
    className: "brand",
    attributes: { href: "#top", "aria-label": `${profile.name} home` }
  });
  brand.append(
    createElement("span", { className: "brand-mark", text: profile.name.slice(0, 1) }),
    createElement("span", { text: profile.name })
  );

  const menuButton = createElement("button", {
    className: "menu-button",
    attributes: {
      type: "button",
      "aria-label": "Open navigation",
      "aria-expanded": "false"
    }
  });
  menuButton.append(createElement("span", { attributes: { "aria-hidden": "true" } }));

  const links = createElement("div", { className: "nav-links" });
  profile.nav.forEach(([label, href]) => {
    links.append(
      createElement("a", {
        className: "nav-link",
        text: label,
        attributes: { href }
      })
    );
  });

  menuButton.addEventListener("click", () => {
    const isOpen = links.classList.toggle("is-open");
    document.body.classList.toggle("menu-open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  links.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      links.classList.remove("is-open");
      document.body.classList.remove("menu-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
    }
  });

  nav.append(brand, links, menuButton);
  header.append(nav);
  return header;
}

function buildHero() {
  const hero = createElement("section", { className: "hero", id: "top" });
  const canvas = createElement("canvas", {
    className: "hero-canvas",
    attributes: { id: "heroCanvas", "aria-hidden": "true" }
  });
  const inner = createElement("div", { className: "hero-inner" });
  const copy = createElement("div", { className: "hero-copy" });

  copy.append(
    createElement("p", { className: "eyebrow", text: "Portfolio landing page" }),
    createElement("h1", { text: profile.name }),
    createElement("p", { className: "hero-text", text: profile.intro })
  );

  const actions = createElement("div", { className: "hero-actions" });
  actions.append(
    createElement("a", {
      className: "button primary",
      text: "View Work",
      attributes: { href: "#work" }
    }),
    createElement("a", {
      className: "button secondary",
      text: "Email Liu",
      attributes: { href: `mailto:${profile.email}` }
    })
  );
  copy.append(actions);
  inner.append(copy);
  hero.append(canvas, inner);
  return hero;
}

function buildSectionHeading(kicker, title, summary) {
  const heading = createElement("div", { className: "section-heading" });
  const titleWrap = createElement("div");
  titleWrap.append(
    createElement("p", { className: "section-kicker", text: kicker }),
    createElement("h2", { className: "section-title", text: title })
  );
  heading.append(titleWrap, createElement("p", { className: "section-summary", text: summary }));
  return heading;
}

function buildWorkSection() {
  const section = createElement("section", { className: "section", id: "work" });
  const inner = createElement("div", { className: "section-inner" });
  const grid = createElement("div", { className: "work-grid" });

  projects.forEach((project) => {
    const card = createElement("article", { className: "work-card" });
    const visual = createElement("div", { className: "work-visual" });
    visual.style.setProperty("--visual-bg", project.bg);
    visual.style.setProperty("--visual-accent", project.accent);

    const content = createElement("div", { className: "work-content" });
    const tags = createElement("div", { className: "tag-list" });
    project.tags.forEach((tag) => tags.append(createElement("span", { className: "tag", text: tag })));

    content.append(
      createElement("h3", { text: project.title }),
      createElement("p", { text: project.description }),
      tags
    );
    card.append(visual, content);
    grid.append(card);
  });

  inner.append(
    buildSectionHeading(
      "Selected work",
      "Focused pages, systems, and product surfaces.",
      "A concise set of product directions showing information design, responsive craft, and polished presentation."
    ),
    grid
  );
  section.append(inner);
  return section;
}

function buildCapabilitiesSection() {
  const section = createElement("section", { className: "section alt", id: "capabilities" });
  const inner = createElement("div", { className: "section-inner" });
  const grid = createElement("div", { className: "capability-grid" });

  capabilities.forEach((item, index) => {
    const card = createElement("article", { className: "capability" });
    card.append(
      createElement("div", { className: "capability-index", text: String(index + 1).padStart(2, "0") }),
      createElement("h3", { text: item.title }),
      createElement("p", { text: item.description })
    );
    grid.append(card);
  });

  inner.append(
    buildSectionHeading(
      "Capabilities",
      "A practical toolkit for polished web work.",
      "The page is intentionally lightweight, so it stays fast on GitHub Pages and simple to maintain."
    ),
    grid
  );
  section.append(inner);
  return section;
}

function buildAboutSection() {
  const section = createElement("section", { className: "section", id: "about" });
  const inner = createElement("div", { className: "section-inner about-layout" });
  const stats = createElement("div", { className: "stats" });

  profile.stats.forEach(([value, label]) => {
    const stat = createElement("div", { className: "stat" });
    stat.append(createElement("strong", { text: value }), createElement("span", { text: label }));
    stats.append(stat);
  });

  inner.append(createElement("p", { className: "about-copy", text: profile.about }), stats);
  section.append(inner);
  return section;
}

function buildContactSection() {
  const section = createElement("section", { className: "section", id: "contact" });
  const inner = createElement("div", { className: "section-inner" });
  const panel = createElement("div", { className: "contact-panel" });
  const copy = createElement("div");
  const actions = createElement("div", { className: "contact-actions" });

  copy.append(
    createElement("p", { className: "section-kicker", text: "Contact" }),
    createElement("h2", { text: "Ready for the next portfolio piece." }),
    createElement("p", {
      text: "Send a note for collaborations, portfolio reviews, or focused web projects."
    })
  );

  contactLinks.forEach(([label, href]) => {
    actions.append(
      createElement("a", {
        className: "contact-link",
        html: `<span>${label}</span><span aria-hidden="true">Open</span>`,
        attributes: { href, target: href.startsWith("http") ? "_blank" : "_self", rel: "noreferrer" }
      })
    );
  });

  panel.append(copy, actions);
  inner.append(panel);
  section.append(inner);
  return section;
}

function buildFooter() {
  const footer = createElement("footer", { className: "site-footer" });
  const inner = createElement("div", { className: "footer-inner" });
  inner.append(
    createElement("span", { text: `© ${new Date().getFullYear()} ${profile.name}` }),
    createElement("span", { text: "Built with HTML, CSS, and JavaScript for GitHub Pages." })
  );
  footer.append(inner);
  return footer;
}

function renderApp() {
  const app = document.querySelector("#app");
  const shell = createElement("div", { className: "site-shell" });
  const main = createElement("main");

  main.append(
    buildHero(),
    buildWorkSection(),
    buildCapabilitiesSection(),
    buildAboutSection(),
    buildContactSection()
  );
  shell.append(buildHeader(), main, buildFooter());
  app.append(shell);
}

function setupActiveNavigation() {
  const sections = [...document.querySelectorAll("main section[id]")];
  const links = [...document.querySelectorAll(".nav-link")];

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

function setupHeroCanvas() {
  const canvas = document.querySelector("#heroCanvas");
  const ctx = canvas.getContext("2d");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pointer = { x: 0, y: 0 };
  const blocks = [
    { x: 0.58, y: 0.18, w: 0.34, h: 0.23, color: "#314f83", speed: 0.2 },
    { x: 0.63, y: 0.48, w: 0.28, h: 0.31, color: "#126b64", speed: 0.16 },
    { x: 0.36, y: 0.34, w: 0.22, h: 0.2, color: "#d9a441", speed: 0.24 },
    { x: 0.18, y: 0.62, w: 0.25, h: 0.18, color: "#c54e3f", speed: 0.18 }
  ];

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(rect.width * scale);
    canvas.height = Math.floor(rect.height * scale);
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
  }

  function roundedRect(x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
  }

  function drawGrid(width, height, time) {
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1;
    const spacing = 56;
    const offset = prefersReducedMotion ? 0 : (time * 0.014) % spacing;

    for (let x = -spacing; x < width + spacing; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x + offset, 0);
      ctx.lineTo(x + offset, height);
      ctx.stroke();
    }

    for (let y = -spacing; y < height + spacing; y += spacing) {
      ctx.beginPath();
      ctx.moveTo(0, y + offset);
      ctx.lineTo(width, y + offset);
      ctx.stroke();
    }
  }

  function drawPanel(x, y, width, height, color, time, speed) {
    const lift = prefersReducedMotion ? 0 : Math.sin(time * 0.0012 + speed * 8) * 8;
    const parallaxX = pointer.x * speed * 16;
    const parallaxY = pointer.y * speed * 12;
    const px = x + parallaxX;
    const py = y + lift + parallaxY;

    ctx.shadowColor = "rgba(0,0,0,0.22)";
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 16;
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    roundedRect(px - 8, py + 8, width, height, 8);
    ctx.fill();
    ctx.shadowColor = "transparent";

    ctx.fillStyle = "rgba(255,255,255,0.82)";
    roundedRect(px, py, width, height, 8);
    ctx.fill();

    ctx.fillStyle = color;
    roundedRect(px + 18, py + 18, width - 36, Math.max(42, height * 0.28), 6);
    ctx.fill();

    ctx.fillStyle = "rgba(17,19,24,0.16)";
    for (let i = 0; i < 3; i += 1) {
      roundedRect(px + 18, py + height * 0.45 + i * 24, width * (0.72 - i * 0.1), 8, 4);
      ctx.fill();
    }
  }

  function draw(time = 0) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#111318";
    ctx.fillRect(0, 0, width, height);

    drawGrid(width, height, time);

    ctx.fillStyle = "rgba(255,255,255,0.07)";
    ctx.beginPath();
    ctx.arc(width * 0.88 + pointer.x * 28, height * 0.16 + pointer.y * 16, 110, 0, Math.PI * 2);
    ctx.fill();

    blocks.forEach((block) => {
      drawPanel(
        width * block.x,
        height * block.y,
        width * block.w,
        height * block.h,
        block.color,
        time,
        block.speed
      );
    });

    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width * 0.46, height * 0.22);
    ctx.bezierCurveTo(width * 0.62, height * 0.12, width * 0.72, height * 0.64, width * 0.92, height * 0.54);
    ctx.stroke();

    if (!prefersReducedMotion) requestAnimationFrame(draw);
  }

  window.addEventListener("resize", () => {
    resize();
    draw();
  });

  window.addEventListener("pointermove", (event) => {
    pointer.x = event.clientX / window.innerWidth - 0.5;
    pointer.y = event.clientY / window.innerHeight - 0.5;
  });

  resize();
  draw();
}

renderApp();
setupActiveNavigation();
setupHeroCanvas();
