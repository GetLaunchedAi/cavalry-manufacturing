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
  function escRe(s){ return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

  function highlight(text, q){
    const t = String(text ?? "");
    const query = String(q ?? "").trim();
    if (!query) return escapeHtml(t);
    const re = new RegExp(escRe(query), "ig");
    return escapeHtml(t).replace(re, (m)=>`<mark>${escapeHtml(m)}</mark>`);
  }

  function money(n){
    const num = Number(n || 0);
    return num.toLocaleString(undefined, { style: "currency", currency: "USD" });
  }

  function renderCard(p, q){
    const img = (p.images && p.images.length) ? p.images[0] : "/assets/img/placeholder.svg";
    const title = highlight(p.title, q);
    const desc = highlight((p.shortDescription || p.description || ""), q);
    const sku = escapeHtml(p.sku || "");
    const price = money(p.price);
    const compareAt = p.compareAt ? money(p.compareAt) : "";

    const pills = [
      p.isSpecial ? `<span class="pill accent">Special</span>` : "",
      p.featured ? `<span class="pill good">Featured</span>` : "",
      p.inStock ? `<span class="pill">In stock</span>` : `<span class="pill bad">Out of stock</span>`
    ].join("");

    return `
      <article class="product-card">
        <a class="img" href="/products/${encodeURIComponent(p.slug)}/" aria-label="View ${escapeHtml(p.title)}">
          <img src="${escapeHtml(img)}" alt="${escapeHtml(p.title)}" />
        </a>
        <div class="body">
          <div class="kv">${pills}</div>
          <a class="title" href="/products/${encodeURIComponent(p.slug)}/">${title}</a>
          <div class="desc">${desc}</div>
          <div class="small" style="color:var(--muted2);">SKU ${sku}</div>
          <div class="price-row">
            <span class="price-now">${price}</span>
            ${compareAt ? `<span class="price-was">${compareAt}</span>` : ""}
          </div>
          <div class="actions">
            <a class="btn" href="/products/${encodeURIComponent(p.slug)}/">View →</a>
            <button class="btn primary" type="button" data-add-to-cart data-product-id="${escapeHtml(p.id)}" ${p.inStock ? "" : "disabled"}>Add</button>
          </div>
        </div>
      </article>
    `;
  }

  function debounce(fn, ms){
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  }

  function matches(p, q){
    if (!q) return true;
    const query = q.toLowerCase();
    const hay = [
      p.title, p.sku, p.description, p.shortDescription,
      Array.isArray(p.tags) ? p.tags.join(" ") : ""
    ].filter(Boolean).join(" ").toLowerCase();
    return hay.includes(query);
  }

  async function loadProducts(){
    const el = $("#products-data");
    const parsed = el ? safeParse(el.textContent || "") : null;
    if (Array.isArray(parsed)) return parsed;
    const res = await fetch("/assets/data/products.json", { cache: "force-cache" });
    return await res.json();
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const input = $("[data-search-input]");
    const results = $("[data-search-results]");
    const countEl = $("[data-search-count]");
    if (!input || !results) return;

    const products = await loadProducts();

    const run = () => {
      const q = String(input.value || "").trim();
      const list = products.filter(p => matches(p, q));
      countEl && (countEl.textContent = `${list.length} result(s)`);
      results.innerHTML = list.slice(0, 120).map(p => renderCard(p, q)).join("");
    };

    const runDebounced = debounce(run, 260);
    input.addEventListener("input", runDebounced);

    // initial: show all but not too many
    run();

    // allow /search/?q=
    const url = new URL(window.location.href);
    const qp = url.searchParams.get("q");
    if (qp) {
      input.value = qp;
      run();
    }
  });
})();
