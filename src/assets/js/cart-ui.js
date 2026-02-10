(() => {
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  function safeParse(json){ try { return JSON.parse(json); } catch { return null; } }
  function escapeHtml(str){
    return String(str ?? "")
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;")
      .replace(/'/g,"&#039;");
  }
  function money(n){
    const num = Number(n || 0);
    return num.toLocaleString(undefined, { style: "currency", currency: "USD" });
  }

  function variantText(variant){
    if (!variant || typeof variant !== "object") return "";
    const parts = Object.keys(variant).map(k => `${k}: ${variant[k]}`);
    return parts.join(", ");
  }

  function renderRow(item, product){
    const img = (product.images && product.images.length) ? product.images[0] : "/assets/img/placeholder.svg";
    const v = variantText(item.variant);
    const line = Number(product.price) * Number(item.qty);

    return `
      <div class="cart-item" data-key="${escapeHtml(item.key)}">
        <img src="${escapeHtml(img)}" alt="${escapeHtml(product.title)}" />
        <div class="meta">
          <a href="/products/${encodeURIComponent(product.slug)}/" style="font-weight:900; color:var(--text); text-decoration:none;">
            ${escapeHtml(product.title)}
          </a>
          <div class="small" style="color:var(--muted);">SKU ${escapeHtml(product.sku || "")}</div>
          ${v ? `<div class="small" style="color:var(--muted2);">${escapeHtml(v)}</div>` : ""}
          <div class="small" style="color:var(--muted2); margin-top:6px;">
            ${money(product.price)} each
          </div>
        </div>
        <div class="qty">
          <button class="btn" type="button" data-dec aria-label="Decrease quantity">−</button>
          <input type="number" min="1" step="1" value="${escapeHtml(item.qty)}" data-qty aria-label="Quantity" />
          <button class="btn" type="button" data-inc aria-label="Increase quantity">+</button>
        </div>
        <div style="text-align:right;">
          <div style="font-weight:900;">${money(line)}</div>
          <button class="btn danger" type="button" data-remove style="margin-top:8px;">Remove</button>
        </div>
      </div>
    `;
  }

  function loadProducts(){
    const el = $("#products-data");
    const parsed = el ? safeParse(el.textContent || "") : null;
    if (Array.isArray(parsed)) return parsed;
    return [];
  }

  document.addEventListener("DOMContentLoaded", () => {
    const itemsEl = $("[data-cart-items]");
    const emptyEl = $("[data-cart-empty]");
    const subtotalEl = $("[data-cart-subtotal]");
    const clearBtn = $("[data-cart-clear]");
    if (!itemsEl || !window.CAV_CART) return;

    const products = loadProducts();
    const byId = new Map(products.map(p => [String(p.id), p]));

    function render(cart) {
      const items = cart.items || [];
      if (!items.length) {
        itemsEl.innerHTML = "";
        emptyEl && (emptyEl.style.display = "block");
        subtotalEl && (subtotalEl.textContent = money(0));
        return;
      }
      emptyEl && (emptyEl.style.display = "none");

      let subtotal = 0;
      const rows = [];
      for (const it of items) {
        const p = byId.get(String(it.id));
        if (!p) continue;
        subtotal += Number(p.price) * Number(it.qty);
        rows.push(renderRow(it, p));
      }
      itemsEl.innerHTML = rows.join("");
      subtotalEl && (subtotalEl.textContent = money(subtotal));
    }

    function sync() {
      render(window.CAV_CART.read());
    }

    itemsEl.addEventListener("click", (e) => {
      const row = e.target.closest(".cart-item");
      if (!row) return;
      const key = row.getAttribute("data-key");
      if (!key) return;

      if (e.target.closest("[data-remove]")) {
        window.CAV_CART.remove(key);
        return;
      }
      if (e.target.closest("[data-inc]")) {
        const cart = window.CAV_CART.read();
        const item = cart.items.find(i => i.key === key);
        if (item) window.CAV_CART.setQty(key, Number(item.qty) + 1);
        return;
      }
      if (e.target.closest("[data-dec]")) {
        const cart = window.CAV_CART.read();
        const item = cart.items.find(i => i.key === key);
        if (item) window.CAV_CART.setQty(key, Math.max(1, Number(item.qty) - 1));
        return;
      }
    });

    itemsEl.addEventListener("change", (e) => {
      const input = e.target.closest("[data-qty]");
      if (!input) return;
      const row = input.closest(".cart-item");
      const key = row?.getAttribute("data-key");
      const qty = Math.max(1, Number(input.value || 1));
      if (key) window.CAV_CART.setQty(key, qty);
    });

    clearBtn && clearBtn.addEventListener("click", () => {
      if (confirm("Clear all items from cart?")) window.CAV_CART.clear();
    });

    window.CAV_CART.subscribe(render);
    sync();
  });
})();
