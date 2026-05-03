/**
 * Liu.js
 * Dependency-free browser helpers for small JavaScript projects.
 */

export function queryState(defaults = {}, options = {}) {
  const baseUrl =
    options.base || (typeof window === "undefined" ? "https://liu.js.org/" : window.location.href);
  const currentUrl = new URL(options.url || baseUrl, baseUrl);

  function get() {
    return Object.fromEntries(
      Object.entries(defaults).map(([key, fallback]) => {
        return [key, currentUrl.searchParams.get(key) ?? fallback];
      })
    );
  }

  function set(patch, config = {}) {
    Object.entries(patch).forEach(([key, value]) => {
      const shouldClear = value == null || value === "" || value === defaults[key];

      if (shouldClear) {
        currentUrl.searchParams.delete(key);
      } else {
        currentUrl.searchParams.set(key, String(value));
      }
    });

    if (config.silent !== true && typeof window !== "undefined" && window.history) {
      const method = config.push === true ? "pushState" : "replaceState";
      window.history[method]({}, "", `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`);
    }

    return get();
  }

  return { get, set, params: currentUrl.searchParams };
}

export function delegate(root, selector, type, handler, options) {
  function listener(event) {
    const target = event.target instanceof Element ? event.target.closest(selector) : null;

    if (!target || !root.contains(target)) {
      return;
    }

    handler(event, target);
  }

  root.addEventListener(type, listener, options);
  return () => root.removeEventListener(type, listener, options);
}

export function latestTask(worker) {
  let currentController = null;

  return function runLatest(...args) {
    if (currentController) {
      currentController.abort();
    }

    const controller = new AbortController();
    currentController = controller;

    return Promise.resolve(worker(controller.signal, ...args)).finally(() => {
      if (currentController === controller) {
        currentController = null;
      }
    });
  };
}

export function renderList(container, items, renderItem) {
  const fragment = document.createDocumentFragment();

  items.forEach((item, index) => {
    fragment.append(renderItem(item, index));
  });

  container.replaceChildren(fragment);
  return container;
}
