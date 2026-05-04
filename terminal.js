const input = document.getElementById("cmd-input");
const output = document.getElementById("output");
const terminalBody = document.getElementById("terminal-body");
const terminalWindow = document.querySelector(".terminal-window");
const promptEl = document.getElementById("prompt");
const screenPath = document.getElementById("screen-path");
const terminalShell = terminalWindow ? terminalWindow.closest(".terminal-preview-shell") : null;

const home = "/home/visitor";
let cwd = home;
let history = [];
let historyIndex = 0;
let activeRunId = 0;
let isRunning = false;
const bootTime = Date.now();

const env = {
  HOME: home,
  USER: "visitor",
  HOSTNAME: "nameserver",
  SHELL: "/bin/nameserver-sh",
  TERM: "xterm-256color",
  PATH: "/bin:/usr/bin:/usr/local/bin"
};

const recordTypes = ["A", "AAAA", "CNAME", "MX", "NS", "SOA", "TXT", "CAA", "SRV", "HTTPS"];
const typeNames = { 1: "A", 2: "NS", 5: "CNAME", 6: "SOA", 15: "MX", 16: "TXT", 28: "AAAA", 33: "SRV", 65: "HTTPS", 257: "CAA" };
const statusNames = { 0: "NOERROR", 2: "SERVFAIL", 3: "NXDOMAIN", 5: "REFUSED" };

const zones = {
  "nameserver.ing": {
    ttl: 300,
    records: {
      SOA: ["ns1.nameserver.ing. hostmaster.nameserver.ing. 2026042401 3600 600 1209600 300"],
      NS: ["ns1.nameserver.ing.", "ns2.nameserver.ing."],
      A: ["203.0.113.42"],
      AAAA: ["2001:db8:53::42"],
      MX: ["10 mail.nameserver.ing."],
      TXT: ['"v=spf1 -all"', '"dns notes live here"'],
      CAA: ['0 issue "letsencrypt.org"']
    }
  },
  "www.nameserver.ing": { ttl: 300, records: { CNAME: ["nameserver.ing."] } },
  "mail.nameserver.ing": { ttl: 300, records: { A: ["203.0.113.25"], AAAA: ["2001:db8:53::25"] } },
  "ns1.nameserver.ing": { ttl: 300, records: { A: ["203.0.113.53"], AAAA: ["2001:db8:53::53"] } },
  "ns2.nameserver.ing": { ttl: 300, records: { A: ["203.0.113.54"], AAAA: ["2001:db8:53::54"] } },
  "example.com": { ttl: 3600, records: { A: ["93.184.216.34"], TXT: ['"example domain"'] } }
};

const files = {
  "/": { type: "dir", mode: "drwxr-xr-x", children: ["home", "etc", "var"] },
  "/home": { type: "dir", mode: "drwxr-xr-x", children: ["visitor"] },
  "/home/visitor": { type: "dir", mode: "drwxr-xr-x", children: ["README.md", "records.txt", "zones", "notes"] },
  "/home/visitor/README.md": { type: "file", mode: "-rw-r--r--", content: ["# nameserver.ing", "", "Try: ls -la, dig nameserver.ing ANY, ping nameserver.ing"] },
  "/home/visitor/records.txt": { type: "file", mode: "-rw-r--r--", content: recordTypes.map((x) => x) },
  "/home/visitor/zones": { type: "dir", mode: "drwxr-xr-x", children: ["nameserver.ing.zone"] },
  "/home/visitor/zones/nameserver.ing.zone": {
    type: "file",
    mode: "-rw-r--r--",
    content: Object.entries(zones["nameserver.ing"].records).flatMap(([type, values]) =>
      values.map((value) => `@ 300 IN ${type} ${value}`)
    )
  },
  "/home/visitor/notes": { type: "dir", mode: "drwxr-xr-x", children: ["ttl.txt"] },
  "/home/visitor/notes/ttl.txt": { type: "file", mode: "-rw-r--r--", content: ["TTL controls how long resolvers cache answers."] },
  "/etc": { type: "dir", mode: "drwxr-xr-x", children: ["hosts"] },
  "/etc/hosts": { type: "file", mode: "-rw-r--r--", content: ["127.0.0.1 localhost", "203.0.113.42 nameserver.ing"] },
  "/var": { type: "dir", mode: "drwxr-xr-x", children: ["log"] },
  "/var/log": { type: "dir", mode: "drwxr-xr-x", children: ["resolver.log"] },
  "/var/log/resolver.log": { type: "file", mode: "-rw-r--r--", content: ["query nameserver.ing A NOERROR 3ms"] }
};

const commandNames = [
  "help", "man", "status", "pwd", "ls", "cd", "cat", "head", "tail", "stat",
  "echo", "whoami", "hostname", "uname", "env", "printenv", "export", "date",
  "uptime", "history", "clear", "dig", "nslookup", "lookup", "host", "trace",
  "zone", "records", "whois", "ping", "curl", "myip", "privacy", "open"
];

const pad = (value, length) => String(value).padEnd(length, " ");
const normalizeName = (value = "nameserver.ing") => (value.trim().toLowerCase() || "nameserver.ing").replace(/\.$/, "");
const fqdn = (value) => value === "." ? "." : `${value}.`;
const compact = (path) => path === home ? "~" : path.startsWith(`${home}/`) ? `~${path.slice(home.length)}` : path;
const now = () => new Date().toLocaleString();

function prompt() {
  return `visitor@nameserver ${compact(cwd)} %`;
}

function updatePrompt() {
  promptEl.textContent = prompt();
  if (screenPath) screenPath.textContent = compact(cwd);
  env.PWD = cwd;
}

function scrollToBottom() {
  terminalBody.scrollTop = terminalBody.scrollHeight;
}

function line(text = "", className = "") {
  const div = document.createElement("div");
  div.className = className ? `terminal-line ${className}` : "terminal-line";
  div.textContent = text;
  output.appendChild(div);
  scrollToBottom();
}

function print(lines) {
  lines.forEach((item) => {
    if (typeof item === "string") {
      line(item);
    } else {
      line(item.text, item.className);
    }
  });
}

function echo(command) {
  const div = document.createElement("div");
  div.className = "terminal-line echo system";

  const promptSpan = document.createElement("span");
  promptSpan.className = "prompt";
  promptSpan.textContent = prompt();

  const commandSpan = document.createElement("span");
  commandSpan.textContent = command;

  div.append(promptSpan, commandSpan);
  output.appendChild(div);
}

function tokenize(command) {
  return [...command.matchAll(/"([^"]*)"|'([^']*)'|[^\s]+/g)].map((match) => match[1] || match[2] || match[0]);
}

function splitCommands(command) {
  const parts = [];
  let current = "";
  let quote = null;

  for (let index = 0; index < command.length; index += 1) {
    const char = command[index];
    const next = command[index + 1];

    if ((char === '"' || char === "'") && command[index - 1] !== "\\") {
      quote = quote === char ? null : quote || char;
    }

    if (!quote && (char === ";" || (char === "&" && next === "&"))) {
      if (current.trim()) parts.push(current.trim());
      current = "";
      if (char === "&") index += 1;
    } else {
      current += char;
    }
  }

  if (current.trim()) parts.push(current.trim());
  return parts;
}

function normalizePath(path) {
  const stack = [];
  path.split("/").forEach((part) => {
    if (part === "..") {
      stack.pop();
    } else if (part && part !== ".") {
      stack.push(part);
    }
  });
  return `/${stack.join("/")}`;
}

function resolve(path = ".") {
  if (!path || path === "~") return home;
  if (path.startsWith("~/")) return normalizePath(`${home}/${path.slice(2)}`);
  if (path.startsWith("/")) return normalizePath(path);
  return normalizePath(`${cwd}/${path}`);
}

function basename(path) {
  return path === "/" ? "/" : path.slice(path.lastIndexOf("/") + 1);
}

function read(path) {
  const full = resolve(path);
  const node = files[full];
  if (!node) return { error: `No such file or directory: ${path}` };
  if (node.type === "dir") return { error: `Is a directory: ${path}` };
  return node.content;
}

async function fetchJson(url, options = {}, timeout = 4500) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { cache: "no-store", ...options, signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

function localDns(queryName, queryType, error = null) {
  const zone = zones[queryName];
  const answers = zone ? Object.entries(zone.records).flatMap(([type, values]) =>
    (queryType === "ANY" || queryType === type)
      ? values.map((value) => ({ name: queryName, ttl: zone.ttl, type, value }))
      : []
  ) : [];

  return {
    status: answers.length || zone ? 0 : 3,
    answers,
    resolver: error ? "local fallback" : "local reference",
    live: false,
    elapsed: 0,
    error
  };
}

async function queryDns(queryName, queryType) {
  const types = queryType === "ANY" ? ["A", "AAAA", "CNAME", "MX", "NS", "SOA", "TXT", "CAA", "HTTPS"] : [queryType];
  const started = performance.now();

  try {
    const results = await Promise.all(types.map(async (type) => {
      const data = await fetchJson(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(fqdn(queryName))}&type=${type}`, {
        headers: { accept: "application/dns-json" }
      });

      return (data.Answer || []).map((answer) => ({
        name: normalizeName(answer.name || queryName),
        ttl: answer.TTL || 0,
        type: typeNames[answer.type] || type,
        value: answer.data || ""
      }));
    }));

    const answers = results.flat();
    return {
      status: answers.length ? 0 : 3,
      answers,
      resolver: "Cloudflare DoH",
      live: true,
      elapsed: Math.round(performance.now() - started)
    };
  } catch (error) {
    return localDns(queryName, queryType, error.message);
  }
}

const handlers = {
  help: () => [
    { text: "Shell commands", className: "accent" },
    "ls [-la] [path], cd, pwd, cat/head/tail, stat, echo, env, export, history, clear",
    { text: "DNS commands", className: "accent" },
    "dig, nslookup, host, trace, zone, records, whois, ping, curl, myip, privacy"
  ],
  status: () => [`User: ${env.USER}`, `Directory: ${cwd}`, `Known names: ${Object.keys(zones).length}`, "Live DNS: enabled via DNS-over-HTTPS"],
  pwd: () => [cwd],
  ls: (args) => {
    const path = resolve(args.find((arg) => !arg.startsWith("-")) || ".");
    const node = files[path];
    if (!node) return [{ text: `ls: ${path}: No such file or directory`, className: "error" }];
    if (node.type === "file") return [basename(path)];

    return [
      node.children.map((child) => {
        const childPath = path === "/" ? `/${child}` : `${path}/${child}`;
        return files[childPath]?.type === "dir" ? `${child}/` : child;
      }).join("  ")
    ];
  },
  cd: (args) => {
    const path = resolve(args[0] || "~");
    if (!files[path]) return [{ text: `cd: no such file or directory: ${args[0]}`, className: "error" }];
    if (files[path].type !== "dir") return [{ text: `cd: not a directory: ${args[0]}`, className: "error" }];
    cwd = path;
    updatePrompt();
    return [];
  },
  cat: (args) => args.flatMap((path) => {
    const result = read(path);
    return result.error ? [{ text: `cat: ${result.error}`, className: "error" }] : result;
  }),
  head: (args) => {
    const result = read(args.at(-1));
    return result.error ? [{ text: `head: ${result.error}`, className: "error" }] : result.slice(0, Number(args[1]) || 10);
  },
  tail: (args) => {
    const result = read(args.at(-1));
    return result.error ? [{ text: `tail: ${result.error}`, className: "error" }] : result.slice(-(Number(args[1]) || 10));
  },
  stat: (args) => {
    const path = resolve(args[0] || ".");
    const node = files[path];
    return node ? [`File: ${compact(path)}`, `Type: ${node.type}`, `Access: ${node.mode}`] : [{ text: `stat: not found: ${args[0]}`, className: "error" }];
  },
  echo: (args) => [args.join(" ").replace(/\$([A-Z_]+)/g, (_, key) => env[key] || "")],
  env: () => Object.keys(env).sort().map((key) => `${key}=${env[key]}`),
  printenv: (args) => args[0] ? [env[args[0]] || ""] : handlers.env(),
  export: (args) => {
    args.forEach((arg) => {
      const [key, ...value] = arg.split("=");
      if (key) env[key] = value.join("=");
    });
    return [];
  },
  whoami: () => [env.USER],
  hostname: () => [env.HOSTNAME],
  uname: () => ["NameserverShell nameserver 0.4.0 local-reference x86_64"],
  date: () => [now()],
  uptime: () => [`up ${Math.floor((Date.now() - bootTime) / 1000)} sec`],
  history: () => history.map((item, index) => `${String(index + 1).padStart(3)}  ${item}`),
  clear: () => {
    output.innerHTML = "";
    return [];
  }
};

Object.assign(handlers, {
  records: () => recordTypes,
  zone: (args) => {
    const queryName = normalizeName(args[0]);
    const zone = zones[queryName];
    if (!zone) return [{ text: `zone: no local zone for ${fqdn(queryName)}`, className: "warn" }];

    return [
      `$ORIGIN ${fqdn(queryName)}`,
      `$TTL ${zone.ttl}`,
      ...Object.entries(zone.records).flatMap(([type, values]) => values.map((value) => `@ ${zone.ttl} IN ${type} ${value}`))
    ];
  },
  dig: async (args) => {
    let queryName = "nameserver.ing";
    let queryType = "A";

    args.filter((arg) => !arg.startsWith("@")).forEach((arg) => {
      if (recordTypes.includes(arg.toUpperCase()) || arg.toUpperCase() === "ANY") {
        queryType = arg.toUpperCase();
      } else {
        queryName = normalizeName(arg);
      }
    });

    const result = await queryDns(queryName, queryType);
    return [
      `; <<>> nameserver shell <<>> dig ${fqdn(queryName)} ${queryType}`,
      `;; resolver: ${result.resolver}${result.live ? "" : " (fallback)"}`,
      "",
      ";; ANSWER SECTION:",
      ...(result.answers.length
        ? result.answers.map((answer) => `${pad(fqdn(answer.name), 28)} ${pad(answer.ttl, 5)} IN ${pad(answer.type, 6)} ${answer.value}`)
        : [`;; status: ${statusNames[result.status] || result.status}, no answers`]),
      "",
      `;; Query time: ${result.elapsed} msec`
    ];
  },
  lookup: (args) => handlers.dig(args),
  nslookup: async (args) => {
    const queryName = normalizeName(args[0]);
    const result = await queryDns(queryName, "A");
    return result.answers.length
      ? [`Server: ${result.resolver}`, "", `Name: ${fqdn(queryName)}`, ...result.answers.map((answer) => `Address: ${answer.value}`)]
      : [`server can't find ${fqdn(queryName)}`];
  },
  host: async (args) => {
    const queryName = normalizeName(args[0]);
    const result = await queryDns(queryName, "ANY");
    return result.answers.map((answer) => `${fqdn(queryName)} has ${answer.type} record ${answer.value}`);
  },
  trace: async (args) => {
    const queryName = normalizeName(args[0]);
    const result = await queryDns(queryName, "NS");
    return [`trace ${fqdn(queryName)}`, ". 518400 IN NS a.root-servers.net.", ...result.answers.map((answer) => `${fqdn(queryName)} ${answer.ttl} IN NS ${answer.value}`)];
  },
  whois: async (args) => {
    const queryName = normalizeName(args[0]);
    try {
      const data = await fetchJson(`https://rdap.org/domain/${encodeURIComponent(queryName)}`, {}, 5000);
      return [`Domain Name: ${(data.ldhName || queryName).toUpperCase()}`, `Handle: ${data.handle || "unavailable"}`, `Status: ${(data.status || []).join(", ") || "unavailable"}`];
    } catch (error) {
      return [{ text: `RDAP lookup unavailable: ${error.message}`, className: "warn" }];
    }
  },
  ping: async (args) => {
    const host = normalizeName(args.find((arg) => !arg.startsWith("-")) || "nameserver.ing");
    const result = await queryDns(host, "A");
    const ip = result.answers[0]?.value;
    return ip ? [`PING ${host} (${ip}): browser HTTPS latency`, `https response from ${ip}: time=1 ms`] : [`ping: cannot resolve ${host}`];
  },
  curl: async (args) => {
    const url = /^https?:\/\//.test(args.at(-1) || "") ? args.at(-1) : `https://${args.at(-1) || "nameserver.ing"}`;
    try {
      const response = await fetch(url, { method: args.includes("-I") ? "HEAD" : "GET" });
      return [`HTTP ${response.status} ${response.statusText}`, `url: ${response.url}`];
    } catch (error) {
      return [{ text: `curl: ${error.message}`, className: "warn" }];
    }
  },
  myip: async () => {
    const data = await fetchJson("https://api.ipify.org?format=json");
    return [`Public IP: ${data.ip}`];
  },
  privacy: () => ["DNS commands use DNS-over-HTTPS.", "curl uses browser fetch.", "myip only runs when requested."],
  open: () => {
    terminalWindow.classList.remove("is-closed", "is-minimized");
    terminalWindow.classList.add("is-fullscreen");
    syncWindowShellState();
    return ["terminal entered fullscreen"];
  },
  man: (args) => [`Manual page: ${args[0] || "help"}`, "Use help for command list."]
});

async function runCommand(raw, shouldEcho = true) {
  raw = raw.trim();
  if (!raw) return;
  if (isRunning) return line("nameserver-sh: process still running; press Ctrl+C to interrupt", "warn");

  const runId = ++activeRunId;
  isRunning = true;
  input.readOnly = true;
  if (shouldEcho) echo(raw);

  if (raw === "!!" && history.length) raw = history.at(-1);
  history.push(raw);
  historyIndex = history.length;

  try {
    for (const part of splitCommands(raw)) {
      if (runId !== activeRunId) return;
      const tokens = tokenize(part);
      const command = (tokens.shift() || "").toLowerCase();
      const handler = handlers[command];

      if (!handler) {
        line(`nameserver-sh: command not found: ${command}`, "error");
        continue;
      }

      const result = await handler(tokens);
      if (result?.length) print(result);
    }
    line();
  } finally {
    if (runId === activeRunId) {
      isRunning = false;
      input.readOnly = false;
      input.focus();
    }
  }
}

function completeInput() {
  const value = input.value;
  const tokens = tokenize(value);
  const last = /\s$/.test(value) ? "" : tokens.at(-1) || "";
  const matches = commandNames.filter((command) => command.startsWith(last));

  if (matches.length === 1) {
    input.value = `${matches[0]} `;
  } else if (matches.length) {
    print([{ text: matches.join("  "), className: "dim" }, ""]);
  }
}

function syncWindowShellState() {
  if (!terminalShell) return;
  terminalShell.classList.toggle("is-minimized", terminalWindow.classList.contains("is-minimized"));
  terminalShell.classList.toggle("is-closed", terminalWindow.classList.contains("is-closed"));
  terminalShell.classList.toggle("is-fullscreen", terminalWindow.classList.contains("is-fullscreen"));
  document.body.classList.toggle("terminal-fullscreen-open", terminalWindow.classList.contains("is-fullscreen"));
}

input.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.key.toLowerCase() === "l") {
    event.preventDefault();
    output.innerHTML = "";
    return;
  }

  if (event.ctrlKey && event.key.toLowerCase() === "c") {
    event.preventDefault();
    activeRunId += 1;
    isRunning = false;
    input.readOnly = false;
    input.value = "";
    line("^C", "system");
    line();
    return;
  }

  if (event.key === "Enter") {
    const command = input.value;
    input.value = "";
    runCommand(command);
    return;
  }

  if (event.key === "ArrowUp") {
    event.preventDefault();
    if (historyIndex > 0) input.value = history[--historyIndex];
    return;
  }

  if (event.key === "ArrowDown") {
    event.preventDefault();
    input.value = historyIndex < history.length - 1 ? history[++historyIndex] : "";
    return;
  }

  if (event.key === "Tab") {
    event.preventDefault();
    completeInput();
  }
});

terminalBody.addEventListener("click", () => input.focus());

document.querySelectorAll("[data-command]").forEach((button) => {
  button.addEventListener("click", () => runCommand(button.dataset.command));
});

document.querySelectorAll("[data-window-action]").forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.windowAction;

    if (action === "fullscreen") {
      const shouldFullscreen = !terminalWindow.classList.contains("is-fullscreen");
      terminalWindow.classList.remove("is-closed", "is-minimized");
      terminalWindow.classList.toggle("is-fullscreen", shouldFullscreen);
    }

    if (action === "minimize") {
      const shouldMinimize = !terminalWindow.classList.contains("is-minimized");
      terminalWindow.classList.remove("is-closed", "is-fullscreen");
      terminalWindow.classList.toggle("is-minimized", shouldMinimize);
    }

    if (action === "close") {
      terminalWindow.classList.remove("is-fullscreen", "is-minimized");
      terminalWindow.classList.add("is-closed");
    }

    if (action === "wake" || action === "restore") {
      terminalWindow.classList.remove("is-closed", "is-minimized", "is-fullscreen");
    }

    syncWindowShellState();
    input.focus();
  });
});

updatePrompt();
line("PanelKit terminal ready", "accent");
line("Try: help, ls -la, dig nameserver.ing ANY, zone nameserver.ing", "dim");
line();
input.focus();
