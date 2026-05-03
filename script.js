const project = {
  name: "Liu.js",
  maintainerSite: "https://tony-liu.com",
  intro:
    "Documentation for the open source design blocks used by Liu.js: a React iframe window component and plain JavaScript terminal controls.",
  nav: [
    ["React", "#react"],
    ["Usage", "#usage"],
    ["Terminal", "#terminal"],
    ["Backlink", "#backlink"]
  ]
};

const snippetGroups = [
  {
    id: "react",
    kicker: "src/pages/index.js",
    title: "React iframe window block",
    summary:
      "Add the lucide-react import and WindowIframe component to src/pages/index.js. The component wraps an iframe in a browser-window frame with reload, external-open, and click-to-interact behavior.",
    snippets: [
      ["Lucide import", "src/pages/index.js", "snippet-lucide-import"],
      ["WindowIframe component", "src/pages/index.js", "snippet-window-iframe"]
    ]
  },
  {
    id: "usage",
    kicker: "src/pages/index.js",
    title: "Status and monitor sections",
    summary:
      "Use WindowIframe for the status and monitor embeds. Each footer links to the related open source project named in the snippet.",
    snippets: [
      ["Status section", "src/pages/index.js", "snippet-status-section"],
      ["Monitor section", "src/pages/index.js", "snippet-monitor-section"]
    ]
  },
  {
    id: "terminal",
    kicker: "before </body>",
    title: "Terminal window JavaScript",
    summary:
      "Paste these script blocks before the closing body tag on the page that contains the terminal markup. They manage prompt state, window controls, commands, history, and focus.",
    snippets: [
      ["Terminal state", "before </body>", "snippet-terminal-state"],
      ["Window controls", "before </body>", "snippet-terminal-window"],
      ["Command runner", "before </body>", "snippet-terminal-commands"],
      ["Keyboard and command buttons", "before </body>", "snippet-terminal-keyboard"]
    ]
  }
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

function getSnippet(id) {
  const snippet = document.getElementById(id);
  return snippet ? snippet.value.trim() : "";
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
    createElement("p", { className: "eyebrow", text: "Open source design docs" }),
    createElement("h1", { text: project.name }),
    createElement("p", { className: "hero-text", text: project.intro })
  );

  const actions = createElement("div", { className: "hero-actions" });
  actions.append(
    createElement("a", {
      className: "button primary",
      text: "React Block",
      attributes: { href: "#react" }
    }),
    createElement("a", {
      className: "button secondary",
      text: "Terminal Scripts",
      attributes: { href: "#terminal" }
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

function buildCodeBlock(label, path, snippetId) {
  const card = createElement("article", { className: "doc-card" });
  const toolbar = createElement("div", { className: "code-toolbar" });
  const title = createElement("div", { className: "code-title" });
  const snippet = getSnippet(snippetId);
  const copyButton = createElement("button", {
    className: "copy-button",
    text: "Copy",
    attributes: { type: "button" }
  });
  const pre = createElement("pre", { className: "snippet-block" });
  const code = createElement("code", { text: snippet });

  title.append(createElement("strong", { text: label }), createElement("span", { text: path }));
  toolbar.append(title, copyButton);
  pre.append(code);
  card.append(toolbar, pre);

  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      copyButton.textContent = "Copied";
      window.setTimeout(() => {
        copyButton.textContent = "Copy";
      }, 1200);
    } catch {
      copyButton.textContent = "Select code";
    }
  });

  return card;
}

function buildSnippetSection(group, index) {
  const section = createElement("section", {
    className: index % 2 === 0 ? "section" : "section alt",
    id: group.id
  });
  const inner = createElement("div", { className: "section-inner" });
  const grid = createElement("div", { className: "doc-grid" });

  group.snippets.forEach(([label, path, snippetId]) => {
    grid.append(buildCodeBlock(label, path, snippetId));
  });

  inner.append(buildSectionHeading(group.kicker, group.title, group.summary), grid);
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
    createElement("p", { className: "section-kicker", text: "Backlink" }),
    createElement("h2", { text: "Maintainer website." }),
    createElement("p", {
      text: "This documentation page stays focused on the JavaScript and React design blocks above. The maintainer backlink is included here."
    })
  );

  actions.append(
    createElement("a", {
      className: "backlink-link",
      attributes: {
        href: project.maintainerSite,
        target: "_blank",
        rel: "noreferrer"
      }
    })
  );
  actions.lastElementChild.append(
    createElement("span", { text: "tony-liu.com" }),
    createElement("span", { text: "Open" })
  );

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
    createElement("span", { text: "Maintainer: " })
  );
  inner.lastElementChild.append(backlink);
  footer.append(inner);
  return footer;
}

function renderApp() {
  const app = document.querySelector("#app");
  const shell = createElement("div", { className: "site-shell" });
  const main = createElement("main");

  main.append(buildHero(), ...snippetGroups.map(buildSnippetSection), buildBacklinkSection());
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
