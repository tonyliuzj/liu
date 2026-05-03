const project = {
  name: "Liu.js",
  maintainerSite: "https://tony-liu.com",
  sourceUrl: "https://github.com/tonyliuzj/liu",
  moduleUrl: "liu.js",
  intro:
    "A browser-first JavaScript utility kit for small static sites and UI experiments. It documents focused helpers for URL state, delegated events, async flow control, and DOM rendering without a framework.",
  overview:
    "Liu.js is intentionally small: plain ESM, no build step, and no runtime dependencies. The helpers are designed for modern browser projects that need practical JavaScript glue without adopting a larger framework.",
  stats: [
    ["0", "runtime dependencies"],
    ["ESM", "native browser module format"],
    ["4", "documented utility areas"]
  ],
  nav: [
    ["Modules", "#modules"],
    ["API", "#api"],
    ["Examples", "#examples"],
    ["Backlink", "#backlink"]
  ]
};

const modules = [
  {
    title: "URL State",
    description:
      "Read and update query parameters with URLSearchParams and history.replaceState so filters can be shared without reloading the page.",
    tags: ["URLSearchParams", "History API", "State"],
    bg: "#e8efed",
    accent: "#126b64"
  },
  {
    title: "Delegated Events",
    description:
      "Attach one listener to a container and route clicks, input changes, or custom events through selectors for dynamic DOM lists.",
    tags: ["DOM", "Events", "Selectors"],
    bg: "#f1ece6",
    accent: "#c54e3f"
  },
  {
    title: "Async Tasks",
    description:
      "Keep only the newest search, preview, or validation request active with a tiny AbortController wrapper.",
    tags: ["Promise", "AbortController", "Fetch"],
    bg: "#e7eaf1",
    accent: "#314f83"
  }
];

const apiItems = [
  {
    title: "queryState(defaults)",
    description:
      "Creates a small reader and writer for query-string backed UI state. Values matching defaults are removed from the URL to keep links tidy.",
    code: `import { queryState } from "./liu.js";

const filters = queryState({ status: "open", page: "1" });
const current = filters.get();

filters.set({ status: "done", page: "1" });`
  },
  {
    title: "delegate(root, selector, type, handler)",
    description:
      "Handles events from current and future matching children through one parent listener, then returns a cleanup function.",
    code: `import { delegate } from "./liu.js";

const stop = delegate(list, "[data-action]", "click", (event, button) => {
  event.preventDefault();
  runAction(button.dataset.action);
});`
  },
  {
    title: "latestTask(worker)",
    description:
      "Wraps an async worker so each new run aborts the previous one. This is useful for search boxes, live previews, and validation.",
    code: `import { latestTask } from "./liu.js";

const search = latestTask((signal, term) => {
  return fetch("/api/search?q=" + encodeURIComponent(term), { signal });
});`
  },
  {
    title: "renderList(container, items, renderItem)",
    description:
      "Builds a DocumentFragment and replaces a list in one DOM operation, keeping rendering clear and predictable.",
    code: `import { renderList } from "./liu.js";

renderList(results, items, (item) => {
  const li = document.createElement("li");
  li.textContent = item.title;
  return li;
});`
  }
];

const examples = [
  {
    title: "Filter links that stay shareable",
    description:
      "Use queryState for status tabs, search terms, or pagination on static documentation pages where a server is not involved."
  },
  {
    title: "Dynamic controls with one listener",
    description:
      "Use delegate when a list is re-rendered often and individual addEventListener calls would be repetitive or easy to leak."
  },
  {
    title: "Live search without stale results",
    description:
      "Use latestTask to cancel older fetch calls when a user types quickly, then render only the response for the newest input."
  }
];

const relatedLinks = [
  ["Download ESM Module", project.moduleUrl],
  ["Source Repository", project.sourceUrl],
  ["Maintainer Backlink", project.maintainerSite]
];

function createElement(tag, options = {}) {
  const element = document.createElement(tag);

  if (options.className) element.className = options.className;
  if (options.id) element.id = options.id;
  if (options.text) element.textContent = options.text;
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
    attributes: { href: "#top", "aria-label": `${project.name} home` }
  });
  brand.append(
    createElement("span", { className: "brand-mark", text: "JS" }),
    createElement("span", { text: project.name })
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
  project.nav.forEach(([label, href]) => {
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
    createElement("p", { className: "eyebrow", text: "JavaScript utility module" }),
    createElement("h1", { text: project.name }),
    createElement("p", { className: "hero-text", text: project.intro })
  );

  const actions = createElement("div", { className: "hero-actions" });
  actions.append(
    createElement("a", {
      className: "button primary",
      text: "Read the API",
      attributes: { href: "#api" }
    }),
    createElement("a", {
      className: "button secondary",
      text: "View Module",
      attributes: { href: project.moduleUrl }
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

function buildModulesSection() {
  const section = createElement("section", { className: "section", id: "modules" });
  const inner = createElement("div", { className: "section-inner" });
  const grid = createElement("div", { className: "module-grid" });

  modules.forEach((item) => {
    const card = createElement("article", { className: "module-card" });
    const visual = createElement("div", { className: "module-visual" });
    visual.style.setProperty("--visual-bg", item.bg);
    visual.style.setProperty("--visual-accent", item.accent);

    const content = createElement("div", { className: "module-content" });
    const tags = createElement("div", { className: "tag-list" });
    item.tags.forEach((tag) => tags.append(createElement("span", { className: "tag", text: tag })));

    content.append(
      createElement("h3", { text: item.title }),
      createElement("p", { text: item.description }),
      tags
    );
    card.append(visual, content);
    grid.append(card);
  });

  inner.append(
    buildSectionHeading(
      "Modules",
      "Small helpers for browser JavaScript.",
      "Each module maps to browser platform APIs that are already available in modern JavaScript runtimes."
    ),
    grid
  );
  section.append(inner);
  return section;
}

function buildApiSection() {
  const section = createElement("section", { className: "section alt", id: "api" });
  const inner = createElement("div", { className: "section-inner" });
  const grid = createElement("div", { className: "api-grid" });

  apiItems.forEach((item, index) => {
    const card = createElement("article", { className: "api-card" });
    const code = createElement("code", { text: item.code });
    const pre = createElement("pre", { className: "code-block" });
    pre.append(code);

    card.append(
      createElement("div", { className: "capability-index", text: String(index + 1).padStart(2, "0") }),
      createElement("h3", { text: item.title }),
      createElement("p", { text: item.description }),
      pre
    );
    grid.append(card);
  });

  inner.append(
    buildSectionHeading(
      "API",
      "Documented functions with copyable usage patterns.",
      "The exported helpers are intentionally explicit so they can be read, copied, tested, and adapted in plain JavaScript projects."
    ),
    grid
  );
  section.append(inner);
  return section;
}

function buildExamplesSection() {
  const section = createElement("section", { className: "section", id: "examples" });
  const inner = createElement("div", { className: "section-inner examples-layout" });
  const stats = createElement("div", { className: "stats" });
  const list = createElement("div", { className: "example-list" });

  project.stats.forEach(([value, label]) => {
    const stat = createElement("div", { className: "stat" });
    stat.append(createElement("strong", { text: value }), createElement("span", { text: label }));
    stats.append(stat);
  });

  examples.forEach((item) => {
    const example = createElement("article", { className: "example-item" });
    example.append(createElement("h3", { text: item.title }), createElement("p", { text: item.description }));
    list.append(example);
  });

  const copy = createElement("div");
  copy.append(
    createElement("p", { className: "about-copy", text: project.overview }),
    list
  );

  inner.append(copy, stats);
  section.append(inner);
  return section;
}

function buildBacklinkSection() {
  const section = createElement("section", { className: "section", id: "backlink" });
  const inner = createElement("div", { className: "section-inner" });
  const panel = createElement("div", { className: "backlink-panel" });
  const copy = createElement("div");
  const actions = createElement("div", { className: "backlink-actions" });

  copy.append(
    createElement("p", { className: "section-kicker", text: "Project links" }),
    createElement("h2", { text: "JavaScript resources and maintainer backlink." }),
    createElement("p", {
      text: "The primary purpose of this site is the Liu.js utility module. The maintainer backlink is included here as a related project attribution."
    })
  );

  relatedLinks.forEach(([label, href]) => {
    const isExternal = href.startsWith("http");
    const attributes = { href, target: isExternal ? "_blank" : "_self" };

    if (isExternal) {
      attributes.rel = "noreferrer";
    }

    actions.append(
      createElement("a", {
        className: "backlink-link",
        attributes
      })
    );
    const link = actions.lastElementChild;
    link.append(createElement("span", { text: label }), createElement("span", { text: isExternal ? "Open" : "View" }));
  });

  panel.append(copy, actions);
  inner.append(panel);
  section.append(inner);
  return section;
}

function buildFooter() {
  const footer = createElement("footer", { className: "site-footer" });
  const inner = createElement("div", { className: "footer-inner" });
  const backlink = createElement("a", {
    text: "tony-liu.com",
    attributes: { href: project.maintainerSite, target: "_blank", rel: "noreferrer" }
  });

  inner.append(
    createElement("span", { text: `© ${new Date().getFullYear()} ${project.name}` }),
    createElement("span", { text: "Maintained by " })
  );
  inner.lastElementChild.append(backlink);
  footer.append(inner);
  return footer;
}

function renderApp() {
  const app = document.querySelector("#app");
  const shell = createElement("div", { className: "site-shell" });
  const main = createElement("main");

  main.append(buildHero(), buildModulesSection(), buildApiSection(), buildExamplesSection(), buildBacklinkSection());
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
