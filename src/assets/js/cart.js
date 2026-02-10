/* cavalry cart (localStorage) */
(() => {
  const KEY = "cav-cart-v1";

  /** @typedef {{key:string, id:string, qty:number, variant?:Record<string,string>}} CartItem */
  /** @typedef {{items: CartItem[]}} Cart */

  const listeners = new Set();

  function safeParse(json) {
    try { return JSON.parse(json); } catch { return null; }
  }

  function stableVariantKey(variant) {
    if (!variant || typeof variant !== "object") return "";
    const keys = Object.keys(variant).sort((a,b)=>a.localeCompare(b,"en"));
    return keys.map(k => `${k}:${variant[k]}`).join("|");
  }

  function makeKey(id, variant) {
    const v = stableVariantKey(variant);
    return v ? `${id}__${v}` : id;
  }

  function normalize(cart) {
    const out = { items: [] };
    const items = Array.isArray(cart?.items) ? cart.items : [];
    for (const it of items) {
      if (!it || typeof it !== "object") continue;
      const id = String(it.id || "").trim();
      const qty = Math.max(1, Number(it.qty || 1));
      if (!id) continue;
      const variant = (it.variant && typeof it.variant === "object") ? it.variant : undefined;
      const key = String(it.key || makeKey(id, variant));
      out.items.push({ key, id, qty, variant });
    }
    // merge dup keys
    const byKey = new Map();
    for (const it of out.items) {
      const prev = byKey.get(it.key);
      if (prev) prev.qty += it.qty;
      else byKey.set(it.key, { ...it });
    }
    out.items = Array.from(byKey.values());
    return out;
  }

  function read() {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? safeParse(raw) : null;
    return normalize(parsed || { items: [] });
  }

  function write(cart) {
    localStorage.setItem(KEY, JSON.stringify(normalize(cart)));
  }

  function emit() {
    const cart = read();
    for (const fn of listeners) {
      try { fn(cart); } catch {}
    }
    window.dispatchEvent(new CustomEvent("cav-cart-change", { detail: cart }));
  }

  function getCount(cart = read()) {
    return cart.items.reduce((sum, it) => sum + (Number(it.qty) || 0), 0);
  }

  function updateBadges() {
    const count = getCount();
    document.querySelectorAll("[data-cart-count]").forEach(el => {
      el.textContent = String(count);
    });
  }

  function add(id, qty = 1, variant) {
    const cart = read();
    const q = Math.max(1, Number(qty || 1));
    const key = makeKey(id, variant);
    const found = cart.items.find(i => i.key === key);
    if (found) found.qty += q;
    else cart.items.push({ key, id, qty: q, variant });
    write(cart);
    emit();
  }

  function setQty(key, qty) {
    const cart = read();
    const q = Math.max(0, Number(qty || 0));
    cart.items = cart.items
      .map(i => i.key === key ? ({ ...i, qty: q }) : i)
      .filter(i => i.qty > 0);
    write(cart);
    emit();
  }

  function remove(key) {
    const cart = read();
    cart.items = cart.items.filter(i => i.key !== key);
    write(cart);
    emit();
  }

  function clear() {
    write({ items: [] });
    emit();
  }

  function subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  // Sync badges initially and on changes/storage
  document.addEventListener("DOMContentLoaded", () => {
    updateBadges();
    subscribe(updateBadges);
  });
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) {
      updateBadges();
      emit();
    }
  });

  window.CAV_CART = { read, add, setQty, remove, clear, getCount, subscribe, makeKey };
})();
