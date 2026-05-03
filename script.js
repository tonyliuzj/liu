const project = {
  name: "Panel4Liu",
  maintainerSite: "https://tony-liu.com",
  intro:
    "Live previews and implementation notes for JavaScript window patterns: a React iframe window component and plain JavaScript terminal controls.",
  nav: [
    ["Iframe", "#iframe-window"],
    ["Terminal", "#terminal-window"],
    ["Docs", "#react"],
    ["Contact", "#contact"]
  ]
};

const iframePreviews = [
  {
    src: "https://statusno.de/",
    title: "System Status",
    footerLabel: "KumaView",
    footerHref: "https://github.com/tonyliuzj/kumaview"
  },
  {
    src: "https://monitorno.de",
    title: "Monitor",
    footerLabel: "PocketView",
    footerHref: "https://github.com/tonyliuzj/pocketview"
  }
];

const terminalLogic = [
  {
    title: "Prompt State",
    description:
      "The terminal keeps a home directory, current directory, compact path label, command history, and history cursor in JavaScript state."
  },
  {
    title: "Window State",
    description:
      "Close, minimize, restore, and fullscreen are class toggles on the terminal window plus a body class for fullscreen scroll locking."
  },
  {
    title: "Command Dispatch",
    description:
      "Commands are normalized from input, echoed into output, looked up in a command map, and rendered as terminal lines with status styling."
  },
  {
    title: "Keyboard Control",
    description:
      "Enter runs a command, arrow keys move through history, Ctrl+L clears output, and clicking command chips runs predefined commands."
  }
];

const snippetGroups = [
  {
    id: "react",
    kicker: "src/pages/index.js",
    title: "Implement the React iframe window block",
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
    title: "Implement the status and monitor sections",
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
    title: "Implement the terminal window JavaScript",
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
    createElement("p", { className: "eyebrow", text: "Open source JavaScript window docs" }),
    createElement("h1", { text: project.name }),
    createElement("p", { className: "hero-text", text: project.intro })
  );

  const actions = createElement("div", { className: "hero-actions" });
  actions.append(
    createElement("a", {
      className: "button primary",
      text: "Iframe Preview",
      attributes: { href: "#iframe-window" }
    }),
    createElement("a", {
      className: "button secondary",
      text: "Terminal Logic",
      attributes: { href: "#terminal-window" }
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

function buildWindowPreview({ src, title, footerLabel, footerHref }) {
  const card = createElement("article", { className: "preview-window" });
  const label = createElement("div", { className: "preview-label" });
  const toolbar = createElement("div", { className: "preview-window-toolbar" });
  const dots = createElement("div", { className: "preview-window-dots" });
  const address = createElement("div", { className: "preview-address", text: src });
  const reloadButton = createElement("button", {
    className: "preview-icon-button",
    text: "↻",
    attributes: { type: "button", "aria-label": `Reload ${title}` }
  });
  const openLink = createElement("a", {
    className: "preview-icon-button",
    text: "↗",
    attributes: { href: src, target: "_blank", rel: "noreferrer", "aria-label": `Open ${title}` }
  });
  const viewport = createElement("div", { className: "preview-iframe-viewport" });
  const overlay = createElement("button", {
    className: "preview-overlay",
    text: "Click to interact",
    attributes: { type: "button" }
  });
  const iframe = createElement("iframe", {
    attributes: {
      src,
      title,
      sandbox: "allow-forms allow-same-origin allow-scripts"
    }
  });
  const footer = createElement("div", { className: "preview-window-footer" });

  label.append(createElement("span", { text: "Iframe preview" }), createElement("strong", { text: title }));

  ["red", "yellow", "green"].forEach((color) => {
    dots.append(createElement("span", { className: `dot ${color}` }));
  });

  reloadButton.addEventListener("click", () => {
    iframe.src = "about:blank";
    window.requestAnimationFrame(() => {
      iframe.src = src;
    });
  });

  overlay.addEventListener("click", () => {
    viewport.classList.add("is-interacting");
  });

  viewport.addEventListener("mouseleave", () => {
    viewport.classList.remove("is-interacting");
  });

  const footerText = createElement("span", { text: "Powered by " });
  const footerLink = createElement("a", {
    text: footerLabel,
    attributes: { href: footerHref, target: "_blank", rel: "noreferrer" }
  });

  footerText.append(footerLink);
  footer.append(footerText);
  toolbar.append(dots, address, reloadButton, openLink);
  viewport.append(overlay, iframe);
  card.append(label, toolbar, viewport, footer);
  return card;
}

function buildTerminalPreview() {
  const shell = createElement("article", { className: "terminal-preview-shell" });
  const label = createElement("div", { className: "preview-label" });
  const terminal = createElement("div", { className: "terminal-window-preview" });
  const toolbar = createElement("div", { className: "terminal-toolbar" });
  const controls = createElement("div", { className: "terminal-controls" });
  const path = createElement("span", { className: "terminal-path", text: "~" });
  const body = createElement("div", { className: "terminal-body-preview" });
  const output = createElement("div", { className: "terminal-output" });
  const promptRow = createElement("label", { className: "terminal-prompt-row" });
  const prompt = createElement("span", { className: "prompt", text: "visitor@nameserver ~ %" });
  const input = createElement("input", {
    attributes: {
      type: "text",
      spellcheck: "false",
      autocomplete: "off",
      "aria-label": "Terminal command"
    }
  });
  const commandBar = createElement("div", { className: "terminal-command-bar" });
  const wakeButton = createElement("button", {
    className: "terminal-wake",
    text: "Restore terminal",
    attributes: { type: "button", hidden: "" }
  });

  [
    ["close", "Close terminal", "close"],
    ["minimize", "Minimize terminal", "minimize"],
    ["fullscreen", "Toggle fullscreen terminal", "fullscreen"]
  ].forEach(([className, label, action]) => {
    controls.append(
      createElement("button", {
        className: `terminal-control ${className}`,
        attributes: { type: "button", "aria-label": label, "data-preview-window-action": action }
      })
    );
  });

  ["help", "status", "records", "clear"].forEach((command) => {
    commandBar.append(
      createElement("button", {
        className: "terminal-command-button",
        text: command,
        attributes: { type: "button", "data-preview-command": command }
      })
    );
  });

  const homeDirectory = "/home/visitor";
  let currentDirectory = homeDirectory;
  let history = [];
  let historyIndex = 0;

  const commands = {
    help: [
      "Available commands:",
      "  help       Show commands",
      "  clear      Clear terminal",
      "  status     Show system status",
      "  records    List DNS record types"
    ],
    status: [
      "Shell Status",
      "Host: nameserver",
      "User: visitor",
      "Live DNS: enabled",
      "Window controls: active"
    ],
    records: [
      "A      IPv4 address",
      "AAAA   IPv6 address",
      "CNAME  Alias record",
      "MX     Mail exchanger",
      "NS     Nameserver",
      "SOA    Start of authority",
      "TXT    Text record"
    ]
  };

  function compactPath(value) {
    if (value === homeDirectory) return "~";
    if (value.startsWith(`${homeDirectory}/`)) return `~${value.slice(homeDirectory.length)}`;
    return value;
  }

  function updatePrompt() {
    const compact = compactPath(currentDirectory);
    prompt.textContent = `visitor@nameserver ${compact} %`;
    path.textContent = compact;
  }

  function scrollToBottom() {
    body.scrollTop = body.scrollHeight;
  }

  function appendLine(text = "", className = "") {
    const line = createElement("div", {
      className: className ? `terminal-line ${className}` : "terminal-line",
      text
    });
    output.append(line);
    scrollToBottom();
  }

  function echoCommand(command) {
    const line = createElement("div", { className: "terminal-line echo system" });
    line.append(createElement("span", { className: "prompt", text: prompt.textContent }), createElement("span", { text: command }));
    output.append(line);
  }

  function runCommand(rawCommand) {
    const command = rawCommand.trim();
    if (!command) return;

    echoCommand(command);
    history.push(command);
    historyIndex = history.length;

    if (command === "clear") {
      output.innerHTML = "";
      return;
    }

    const result = commands[command];

    if (!result) {
      appendLine(`nameserver-sh: command not found: ${command}`, "error");
      appendLine("Try: help", "dim");
      appendLine();
      return;
    }

    result.forEach((line, index) => appendLine(line, index === 0 ? "accent" : ""));
    appendLine();
  }

  function syncShellState() {
    shell.classList.toggle("is-minimized", terminal.classList.contains("is-minimized"));
    shell.classList.toggle("is-closed", terminal.classList.contains("is-closed"));
    shell.classList.toggle("is-fullscreen", terminal.classList.contains("is-fullscreen"));
  }

  function setTerminalFullscreen(isFullscreen) {
    terminal.classList.remove("is-closed", "is-minimized");
    terminal.classList.toggle("is-fullscreen", isFullscreen);
    document.body.classList.toggle("preview-terminal-fullscreen-open", isFullscreen);
    wakeButton.hidden = true;
    syncShellState();
    scrollToBottom();
  }

  function restoreTerminal() {
    terminal.classList.remove("is-closed", "is-minimized", "is-fullscreen");
    document.body.classList.remove("preview-terminal-fullscreen-open");
    wakeButton.hidden = true;
    syncShellState();
    input.focus();
  }

  function toggleTerminalMinimized() {
    const minimized = !terminal.classList.contains("is-minimized");
    terminal.classList.remove("is-closed", "is-fullscreen");
    terminal.classList.toggle("is-minimized", minimized);
    document.body.classList.remove("preview-terminal-fullscreen-open");
    wakeButton.hidden = true;
    syncShellState();
  }

  function closeTerminalWindow() {
    terminal.classList.remove("is-fullscreen", "is-minimized");
    terminal.classList.add("is-closed");
    document.body.classList.remove("preview-terminal-fullscreen-open");
    wakeButton.hidden = false;
    syncShellState();
  }

  controls.addEventListener("click", (event) => {
    const button = event.target.closest("[data-preview-window-action]");
    if (!button) return;

    const action = button.dataset.previewWindowAction;
    if (action === "fullscreen") setTerminalFullscreen(!terminal.classList.contains("is-fullscreen"));
    if (action === "minimize") toggleTerminalMinimized();
    if (action === "close") closeTerminalWindow();
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const command = input.value;
      input.value = "";
      runCommand(command);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (historyIndex > 0) {
        historyIndex -= 1;
        input.value = history[historyIndex];
      }
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIndex < history.length - 1) {
        historyIndex += 1;
        input.value = history[historyIndex];
      } else {
        historyIndex = history.length;
        input.value = "";
      }
    }

    if (event.ctrlKey && event.key.toLowerCase() === "l") {
      event.preventDefault();
      output.innerHTML = "";
    }
  });

  commandBar.addEventListener("click", (event) => {
    const button = event.target.closest("[data-preview-command]");
    if (!button) return;
    restoreTerminal();
    runCommand(button.dataset.previewCommand);
  });

  body.addEventListener("click", () => input.focus());
  wakeButton.addEventListener("click", restoreTerminal);

  label.append(createElement("span", { text: "Terminal preview" }), createElement("strong", { text: "Nameserver shell" }));
  toolbar.append(controls, path);
  promptRow.append(prompt, input);
  body.append(output, promptRow);
  terminal.append(toolbar, body, commandBar);
  shell.append(label, terminal, wakeButton);

  updatePrompt();
  appendLine(`${project.name} terminal preview`, "accent");
  appendLine("Try: help, status, records", "dim");
  appendLine();

  return shell;
}

function buildIframePreviewSection() {
  const section = createElement("section", { className: "section preview-section", id: "iframe-window" });
  const inner = createElement("div", { className: "section-inner" });
  const previewGrid = createElement("div", { className: "iframe-preview-grid" });
  const primaryPreview = buildWindowPreview(iframePreviews[0]);
  const secondaryPreview = buildWindowPreview(iframePreviews[1]);

  primaryPreview.classList.add("is-primary");
  previewGrid.append(primaryPreview, secondaryPreview);
  inner.append(
    buildSectionHeading(
      "Iframe window preview",
      "Browser-style embeds for live web tools.",
      "These previews show the WindowIframe pattern: framed URL bar, reload control, external-open action, click-to-interact overlay, sandboxed iframe, and project footer."
    ),
    previewGrid
  );
  section.append(inner);
  return section;
}

function buildTerminalLogicPanel() {
  const panel = createElement("div", { className: "terminal-logic-panel" });

  terminalLogic.forEach((item, index) => {
    const card = createElement("article", { className: "logic-card" });
    card.append(
      createElement("span", { className: "logic-index", text: String(index + 1).padStart(2, "0") }),
      createElement("h3", { text: item.title }),
      createElement("p", { text: item.description })
    );
    panel.append(card);
  });

  return panel;
}

function buildTerminalPreviewSection() {
  const section = createElement("section", { className: "section alt preview-section", id: "terminal-window" });
  const inner = createElement("div", { className: "section-inner" });
  const layout = createElement("div", { className: "terminal-preview-layout" });

  layout.append(buildTerminalPreview(), buildTerminalLogicPanel());
  inner.append(
    buildSectionHeading(
      "Terminal window preview",
      "Shell-style controls with plain JavaScript logic.",
      "The terminal preview separates visual window controls from command handling. The notes explain how the scripts manage prompt state, output, history, window classes, and keyboard shortcuts."
    ),
    layout
  );
  section.append(inner);
  return section;
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

function buildContactSection() {
  const section = createElement("section", { className: "section", id: "contact" });
  const inner = createElement("div", { className: "section-inner" });
  const panel = createElement("div", { className: "contact-panel" });
  const copy = createElement("div");
  const actions = createElement("div", { className: "contact-actions" });

  copy.append(
    createElement("p", { className: "section-kicker", text: "Contact" }),
    createElement("h2", { text: "Maintainer contact." }),
    createElement("p", {
      text: "This documentation page stays focused on JavaScript and React window design blocks. For related work and contact details, use the maintainer site."
    })
  );

  actions.append(
    createElement("a", {
      className: "contact-link",
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
  const domainLink = createElement("a", {
    text: "liu.js.org",
    attributes: { href: "https://liu.js.org", target: "_blank", rel: "noreferrer" }
  });

  inner.append(
    createElement("span", { text: `© ${new Date().getFullYear()} ${project.name}` }),
    createElement("span", { text: "Site: " })
  );
  inner.lastElementChild.append(domainLink);
  footer.append(inner);
  return footer;
}

function renderApp() {
  const app = document.querySelector("#app");
  const shell = createElement("div", { className: "site-shell" });
  const main = createElement("main");

  main.append(
    buildHero(),
    buildIframePreviewSection(),
    buildTerminalPreviewSection(),
    ...snippetGroups.map(buildSnippetSection),
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
