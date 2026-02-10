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
          <div class="price-row">
            <span class="price-now">${money(p.price)}</span>
            ${p.compareAt ? `<span class="price-was">${money(p.compareAt)}</span>` : ""}
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

  function includesQ(p, q){
    if (!q) return true;
    const qq = q.toLowerCase();
    const hay = [
      p.title, p.sku, p.description, p.shortDescription,
      Array.isArray(p.tags) ? p.tags.join(" ") : ""
    ].filter(Boolean).join(" ").toLowerCase();
    return hay.includes(qq);
  }

  function filterList(list, state){
    return list.filter(p => {
      if (state.tag && !(Array.isArray(p.tags) && p.tags.includes(state.tag))) return false;
      if (state.stock === "in" && !p.inStock) return false;
      if (state.stock === "out" && p.inStock) return false;
      if (state.min != null && Number(p.price) < state.min) return false;
      if (state.max != null && Number(p.price) > state.max) return false;
      if (!includesQ(p, state.q)) return false;
      return true;
    });
  }

  function sortList(list, sort){
    const arr = [...list];
    const by = {
      "featured": (a,b) => (Number(!!b.featured) - Number(!!a.featured)) || (new Date(b.updatedAt) - new Date(a.updatedAt)),
      "newest": (a,b) => (new Date(b.updatedAt) - new Date(a.updatedAt)),
      "price-asc": (a,b) => (Number(a.price) - Number(b.price)),
      "price-desc": (a,b) => (Number(b.price) - Number(a.price)),
      "az": (a,b) => String(a.title).localeCompare(String(b.title), "en"),
    }[sort] || ((a,b)=>0);
    arr.sort(by);
    return arr;
  }

  document.addEventListener("DOMContentLoaded", () => {
    const seedEl = $("#collection-products-data");
    const list = seedEl ? safeParse(seedEl.textContent || "") : null;
    if (!Array.isArray(list)) return;

    const results = $("[data-results]");
    const qEl = $("[data-filter-q]");
    const tagEl = $("[data-filter-tag]");
    const stockEl = $("[data-filter-stock]");
    const sortEl = $("[data-sort]");
    const minEl = $("[data-filter-min]");
    const maxEl = $("[data-filter-max]");
    const resetBtn = $("[data-reset]");
    const countEl = $("[data-results-count]");
    const rangeHint = $("[data-range-hint]");

    // range hint
    const prices = list.map(p => Number(p.price)).filter(n => Number.isFinite(n));
    if (prices.length && rangeHint) {
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      rangeHint.textContent = `Range: ${money(min)} – ${money(max)}`;
    }

    const state = { q:"", tag:"", stock:"", sort:"featured", min:null, max:null };

    function readState(){
      state.q = String(qEl?.value || "").trim();
      state.tag = String(tagEl?.value || "");
      state.stock = String(stockEl?.value || "");
      state.sort = String(sortEl?.value || "featured");
      const min = String(minEl?.value || "").trim();
      const max = String(maxEl?.value || "").trim();
      state.min = min ? Number(min) : null;
      state.max = max ? Number(max) : null;
      if (!Number.isFinite(state.min)) state.min = null;
      if (!Number.isFinite(state.max)) state.max = null;
    }

    function render(){
      readState();
      const filtered = filterList(list, state);
      const sorted = sortList(filtered, state.sort);
      if (countEl) countEl.textContent = `${sorted.length} results`;
      if (results) results.innerHTML = sorted.map(p => renderCard(p, state.q)).join("");
    }

    const renderDebounced = debounce(render, 240);

    qEl && qEl.addEventListener("input", renderDebounced);
    [tagEl, stockEl, sortEl, minEl, maxEl].forEach(el => el && el.addEventListener("change", render));
    resetBtn && resetBtn.addEventListener("click", () => {
      if (qEl) qEl.value = "";
      if (tagEl) tagEl.value = "";
      if (stockEl) stockEl.value = "";
      if (sortEl) sortEl.value = "featured";
      if (minEl) minEl.value = "";
      if (maxEl) maxEl.value = "";
      render();
    });

    render();
  });
})();
