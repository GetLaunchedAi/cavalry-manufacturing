(() => {
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  const KEY_PRODUCTS = "cav-admin-products-v1";
  const KEY_DRAFT = "cav-admin-draft-v1";

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
  function nowIsoDate(){
    // Date only is easier for diffs
    const d = new Date();
    const pad = (x) => String(x).padStart(2,"0");
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  }
  function slugify(s){
    const fn = window.CAV_SLUGIFY;
    return fn ? fn(s) : String(s||"").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
  }
  function uniqId(){
    return "p_" + Math.random().toString(16).slice(2,10) + Math.random().toString(16).slice(2,6);
  }

  function loadSeedProducts(){
    const seedEl = $("#admin-products-seed");
    const parsed = seedEl ? safeParse(seedEl.textContent || "") : null;
    return Array.isArray(parsed) ? parsed : [];
  }
  function loadCollections(){
    const seedEl = $("#admin-collections-seed");
    const parsed = seedEl ? safeParse(seedEl.textContent || "") : null;
    return Array.isArray(parsed) ? parsed : [];
  }

  function loadProducts(){
    const raw = localStorage.getItem(KEY_PRODUCTS);
    const parsed = raw ? safeParse(raw) : null;
    if (Array.isArray(parsed)) return parsed;
    return loadSeedProducts();
  }
  function saveProducts(arr){
    localStorage.setItem(KEY_PRODUCTS, JSON.stringify(arr));
  }

  function loadDraft(){
    const raw = localStorage.getItem(KEY_DRAFT);
    const parsed = raw ? safeParse(raw) : null;
    return parsed && typeof parsed === "object" ? parsed : null;
  }
  function saveDraft(draft){
    localStorage.setItem(KEY_DRAFT, JSON.stringify(draft));
  }
  function clearDraft(){
    localStorage.removeItem(KEY_DRAFT);
  }

  function normalizeProduct(p){
    const toBool = (v) => v === true || v === "true";
    const toNum = (v) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : 0;
    };
    return {
      id: String(p.id || "").trim(),
      title: String(p.title || "").trim(),
      slug: String(p.slug || "").trim(),
      sku: String(p.sku || "").trim(),
      price: toNum(p.price),
      compareAt: p.compareAt === "" || p.compareAt == null ? null : toNum(p.compareAt),
      shortDescription: String(p.shortDescription || "").trim(),
      description: String(p.description || "").trim(),
      tags: Array.isArray(p.tags) ? p.tags.filter(Boolean).map(String) : [],
      collectionSlugs: Array.isArray(p.collectionSlugs) ? p.collectionSlugs.filter(Boolean).map(String) : [],
      images: Array.isArray(p.images) ? p.images.filter(Boolean).map(String) : ["/assets/img/placeholder.svg"],
      inStock: toBool(p.inStock),
      featured: toBool(p.featured),
      isSpecial: toBool(p.isSpecial),
      variants: Array.isArray(p.variants) ? p.variants : [],
      updatedAt: String(p.updatedAt || nowIsoDate())
    };
  }

  function productMatches(p, state){
    const q = state.q.toLowerCase().trim();
    if (q) {
      const hay = [
        p.title, p.sku, p.slug,
        Array.isArray(p.tags) ? p.tags.join(" ") : "",
        p.description, p.shortDescription
      ].filter(Boolean).join(" ").toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (state.collection) {
      if (!Array.isArray(p.collectionSlugs) || !p.collectionSlugs.includes(state.collection)) return false;
    }
    if (state.stock === "in" && !p.inStock) return false;
    if (state.stock === "out" && p.inStock) return false;
    if (state.featured === "yes" && !p.featured) return false;
    if (state.featured === "no" && p.featured) return false;
    return true;
  }

  function sortProducts(arr, sort){
    const list = [...arr];
    const by = {
      "updated-desc": (a,b) => (new Date(b.updatedAt) - new Date(a.updatedAt)),
      "az": (a,b) => String(a.title).localeCompare(String(b.title), "en"),
      "price-asc": (a,b) => Number(a.price) - Number(b.price),
      "price-desc": (a,b) => Number(b.price) - Number(a.price),
    }[sort] || ((a,b)=>0);
    list.sort(by);
    return list;
  }

  function download(filename, text){
    const blob = new Blob([text], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 0);
  }

  function setErr(field, msg){
    const el = $(`[data-err="${field}"]`);
    if (!el) return;
    el.textContent = msg || "";
    el.style.color = msg ? "var(--danger)" : "var(--muted2)";
  }

  function clearErrors(){
    ["title","slug","id","price","collectionSlugs","variants"].forEach(f => setErr(f, ""));
  }

  function validateProduct(p, products, currentId){
    clearErrors();
    let ok = true;
    if (!p.title) { setErr("title","Title is required."); ok = false; }
    if (!p.slug) { setErr("slug","Slug is required."); ok = false; }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug)) { setErr("slug","Slug should be lowercase with dashes."); ok = false; }
    if (!p.id) { setErr("id","ID is required."); ok = false; }

    const idDup = products.find(x => x.id === p.id && x.id !== currentId);
    if (idDup) { setErr("id","ID must be unique."); ok = false; }

    const slugDup = products.find(x => x.slug === p.slug && x.id !== currentId);
    if (slugDup) { setErr("slug","Slug must be unique."); ok = false; }

    if (!Number.isFinite(Number(p.price)) || Number(p.price) < 0) { setErr("price","Price must be a valid number."); ok = false; }

    // variants JSON validation already parsed; nothing else needed
    return ok;
  }

  document.addEventListener("DOMContentLoaded", () => {
    const listEl = $("[data-admin-list]");
    const countEl = $("[data-admin-count]");
    const searchEl = $("[data-admin-search]");
    const filterCollectionEl = $("[data-admin-filter-collection]");
    const filterStockEl = $("[data-admin-filter-stock]");
    const filterFeaturedEl = $("[data-admin-filter-featured]");
    const sortEl = $("[data-admin-sort]");

    const btnNew = $("[data-admin-new]");
    const btnDup = $("[data-admin-duplicate]");
    const btnBulkFeatured = $("[data-admin-bulk-featured]");
    const btnBulkStock = $("[data-admin-bulk-stock]");

    const form = $("[data-admin-form]");
    const formTitle = $("[data-admin-form-title]");
    const formSubtitle = $("[data-admin-form-subtitle]");
    const btnSave = $("[data-admin-save]");
    const btnExport = $("[data-admin-export]");
    const fileImport = $("[data-admin-import]");
    const btnReset = $("[data-admin-reset]");
    const btnDelete = $("[data-admin-delete]");

    if (!listEl || !form) return;

    const collections = loadCollections();
    const productsSeed = loadProducts().map(normalizeProduct);

    // Populate collection filter
    if (filterCollectionEl) {
      const opts = collections.map(c => `<option value="${escapeHtml(c.slug)}">${escapeHtml(c.title)}</option>`).join("");
      filterCollectionEl.insertAdjacentHTML("beforeend", opts);
    }

    let products = productsSeed;
    let selectedId = null;
    let hasManualSlug = false;

    // Draft restore
    const draft = loadDraft();
    if (draft?.selectedId) selectedId = draft.selectedId;

    function stateFromControls(){
      return {
        q: String(searchEl?.value || ""),
        collection: String(filterCollectionEl?.value || ""),
        stock: String(filterStockEl?.value || ""),
        featured: String(filterFeaturedEl?.value || ""),
        sort: String(sortEl?.value || "updated-desc")
      };
    }

    function filteredProducts(){
      const st = stateFromControls();
      return sortProducts(products.filter(p => productMatches(p, st)), st.sort);
    }

    function renderList(){
      const list = filteredProducts();
      countEl && (countEl.textContent = String(list.length));

      if (!list.length) {
        listEl.innerHTML = `<div class="small" style="color:var(--muted);">No products match your filters.</div>`;
        return;
      }

      listEl.innerHTML = list.map(p => `
        <button type="button" class="btn" data-select-id="${escapeHtml(p.id)}" style="text-align:left; justify-content:space-between; gap:10px;">
          <span style="display:flex; flex-direction:column; gap:2px;">
            <span style="font-weight:900;">${escapeHtml(p.title)}</span>
            <span class="small" style="color:var(--muted2);">SKU ${escapeHtml(p.sku || "")} · ${escapeHtml(p.slug)}</span>
          </span>
          <span style="display:flex; align-items:center; gap:8px;">
            ${p.isSpecial ? `<span class="pill accent">Special</span>` : ""}
            ${p.featured ? `<span class="pill good">Featured</span>` : ""}
            ${p.inStock ? `<span class="pill">In</span>` : `<span class="pill bad">Out</span>`}
            <span style="font-weight:900;">${money(p.price)}</span>
          </span>
        </button>
      `).join("");
    }

    function setForm(p, mode){
      clearErrors();
      const setVal = (name, value) => {
        const el = $(`[data-f="${name}"]`);
        if (!el) return;
        if (el.tagName === "SELECT") el.value = String(value);
        else el.value = String(value ?? "");
      };

      formTitle && (formTitle.textContent = mode === "edit" ? "Edit product" : "New product");
      formSubtitle && (formSubtitle.textContent = "Draft auto-saves to your browser.");

      setVal("title", p.title);
      setVal("slug", p.slug);
      setVal("id", p.id);
      setVal("sku", p.sku);
      setVal("updatedAt", p.updatedAt || nowIsoDate());
      setVal("price", p.price);
      setVal("compareAt", p.compareAt ?? "");
      setVal("inStock", String(!!p.inStock));
      setVal("featured", String(!!p.featured));
      setVal("isSpecial", String(!!p.isSpecial));
      setVal("images", Array.isArray(p.images) ? p.images.join(", ") : "/assets/img/placeholder.svg");
      setVal("collectionSlugs", Array.isArray(p.collectionSlugs) ? p.collectionSlugs.join(", ") : "");
      setVal("tags", Array.isArray(p.tags) ? p.tags.join(", ") : "");
      setVal("shortDescription", p.shortDescription || "");
      setVal("description", p.description || "");
      setVal("variants", (p.variants && p.variants.length) ? JSON.stringify(p.variants, null, 2) : "");

      // Delete enabled only for edit
      if (btnDelete) btnDelete.disabled = (mode !== "edit");
      hasManualSlug = false;

      saveDraft({
        selectedId,
        form: getFormRaw()
      });
    }

    function getFormRaw(){
      const get = (name) => {
        const el = $(`[data-f="${name}"]`);
        return el ? el.value : "";
      };
      return {
        title: get("title"),
        slug: get("slug"),
        id: get("id"),
        sku: get("sku"),
        updatedAt: get("updatedAt"),
        price: get("price"),
        compareAt: get("compareAt"),
        inStock: get("inStock"),
        featured: get("featured"),
        isSpecial: get("isSpecial"),
        images: get("images"),
        collectionSlugs: get("collectionSlugs"),
        tags: get("tags"),
        shortDescription: get("shortDescription"),
        description: get("description"),
        variants: get("variants")
      };
    }

    function formToProduct(){
      const raw = getFormRaw();
      const toArr = (s) => String(s || "").split(",").map(x => x.trim()).filter(Boolean);
      let variants = [];
      const vraw = String(raw.variants || "").trim();
      if (vraw) {
        const parsed = safeParse(vraw);
        if (!Array.isArray(parsed)) {
          setErr("variants","Variants must be a JSON array.");
        } else {
          variants = parsed;
        }
      }

      const p = normalizeProduct({
        id: raw.id,
        title: raw.title,
        slug: raw.slug,
        sku: raw.sku,
        price: raw.price,
        compareAt: raw.compareAt,
        shortDescription: raw.shortDescription,
        description: raw.description,
        tags: toArr(raw.tags),
        collectionSlugs: toArr(raw.collectionSlugs),
        images: toArr(raw.images),
        inStock: raw.inStock,
        featured: raw.featured,
        isSpecial: raw.isSpecial,
        variants,
        updatedAt: raw.updatedAt || nowIsoDate(),
      });

      return p;
    }

    function selectProduct(id){
      const p = products.find(x => x.id === id);
      if (!p) return;
      selectedId = id;
      setForm(p, "edit");
      renderList();
    }

    function newProduct(prefill){
      selectedId = null;
      const p = normalizeProduct({
        id: uniqId(),
        title: "",
        slug: "",
        sku: "",
        price: 0,
        compareAt: null,
        shortDescription: "",
        description: "",
        tags: [],
        collectionSlugs: [],
        images: ["/assets/img/placeholder.svg"],
        inStock: true,
        featured: false,
        isSpecial: false,
        variants: [],
        updatedAt: nowIsoDate()
      });
      setForm({ ...p, ...(prefill || {}) }, "new");
      renderList();
    }

    function saveCurrent(){
      const currentId = selectedId;
      const p = formToProduct();

      // If variants parse error exists, stop
      const variantErr = $(`[data-err="variants"]`)?.textContent?.trim();
      if (variantErr) return;

      // auto updatedAt
      p.updatedAt = nowIsoDate();
      const ok = validateProduct(p, products, currentId || "");
      if (!ok) return;

      if (currentId) {
        products = products.map(x => x.id === currentId ? p : x);
        selectedId = p.id;
      } else {
        products = [p, ...products];
        selectedId = p.id;
      }

      products = products.map(normalizeProduct);
      saveProducts(products);
      clearDraft();
      saveDraft({ selectedId, form: getFormRaw() });
      renderList();
      alert("Saved locally. Remember to Export JSON and commit it to the repo.");
    }

    function deleteCurrent(){
      if (!selectedId) return;
      const p = products.find(x => x.id === selectedId);
      if (!p) return;
      if (!confirm(`Delete "${p.title}"? This cannot be undone (locally).`)) return;
      products = products.filter(x => x.id !== selectedId);
      saveProducts(products);
      selectedId = null;
      clearDraft();
      newProduct();
      renderList();
    }

    function exportJson(){
      const clean = products.map(normalizeProduct);
      download("products.json", JSON.stringify(clean, null, 2));
    }

    async function importJson(file){
      const text = await file.text();
      const parsed = safeParse(text);
      if (!Array.isArray(parsed)) {
        alert("Import failed: JSON must be an array of products.");
        return;
      }

      const normalized = parsed.map(normalizeProduct);
      const replace = confirm("Replace the entire dataset?\n\nOK = replace all\nCancel = merge by id");
      if (replace) {
        products = normalized;
      } else {
        const byId = new Map(products.map(p => [p.id, p]));
        for (const p of normalized) {
          byId.set(p.id, p);
        }
        products = Array.from(byId.values());
      }

      products = products.map(normalizeProduct);
      saveProducts(products);
      renderList();
      alert("Import complete (saved locally).");
    }

    function duplicateCurrent(){
      const src = selectedId ? products.find(p => p.id === selectedId) : null;
      if (!src) { alert("Select a product to duplicate."); return; }
      const copy = normalizeProduct({
        ...src,
        id: uniqId(),
        slug: src.slug + "-copy",
        title: src.title + " (Copy)",
        updatedAt: nowIsoDate()
      });
      // Ensure unique slug
      let base = copy.slug;
      let i = 2;
      while (products.some(p => p.slug === copy.slug)) {
        copy.slug = `${base}-${i++}`;
      }
      products = [copy, ...products];
      saveProducts(products);
      selectedId = copy.id;
      setForm(copy, "edit");
      renderList();
      alert("Duplicated locally.");
    }

    function bulkToggle(field){
      const list = filteredProducts();
      if (!list.length) { alert("No filtered products."); return; }
      const doIt = confirm(`Apply bulk toggle to ${list.length} filtered products?`);
      if (!doIt) return;

      const ids = new Set(list.map(p => p.id));
      products = products.map(p => {
        if (!ids.has(p.id)) return p;
        const next = { ...p };
        next[field] = !Boolean(p[field]);
        next.updatedAt = nowIsoDate();
        return normalizeProduct(next);
      });
      saveProducts(products);
      renderList();
      alert("Bulk update saved locally.");
    }

    // Wire events
    listEl.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-select-id]");
      if (!btn) return;
      const id = btn.getAttribute("data-select-id");
      selectProduct(id);
    });

    [searchEl, filterCollectionEl, filterStockEl, filterFeaturedEl, sortEl].forEach(el => {
      el && el.addEventListener("input", renderList);
      el && el.addEventListener("change", renderList);
    });

    btnNew && btnNew.addEventListener("click", () => newProduct());
    btnSave && btnSave.addEventListener("click", saveCurrent);
    btnDelete && btnDelete.addEventListener("click", deleteCurrent);
    btnExport && btnExport.addEventListener("click", exportJson);
    btnDup && btnDup.addEventListener("click", duplicateCurrent);
    btnBulkFeatured && btnBulkFeatured.addEventListener("click", () => bulkToggle("featured"));
    btnBulkStock && btnBulkStock.addEventListener("click", () => bulkToggle("inStock"));

    fileImport && fileImport.addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) importJson(file);
      e.target.value = "";
    });

    btnReset && btnReset.addEventListener("click", () => {
      if (!confirm("Reset editor to last saved data?")) return;
      if (selectedId) {
        const p = products.find(x => x.id === selectedId);
        if (p) setForm(p, "edit");
      } else {
        newProduct();
      }
    });

    // Title -> slug generation
    const titleEl = $(`[data-f="title"]`);
    const slugEl = $(`[data-f="slug"]`);
    titleEl && titleEl.addEventListener("input", () => {
      if (!slugEl) return;
      if (!hasManualSlug) slugEl.value = slugify(titleEl.value);
      saveDraft({ selectedId, form: getFormRaw() });
    });
    slugEl && slugEl.addEventListener("input", () => {
      hasManualSlug = true;
      saveDraft({ selectedId, form: getFormRaw() });
    });

    // Draft autosave on input
    form.addEventListener("input", () => {
      saveDraft({ selectedId, form: getFormRaw() });
    });

        // Initial selection / restore draft
    renderList();
    if (draft?.form) {
      const raw = draft.form || {};
      const toArr = (s) => String(s || "").split(",").map(x => x.trim()).filter(Boolean);
      let variants = [];
      const vraw = String(raw.variants || "").trim();
      if (vraw) {
        const parsed = safeParse(vraw);
        variants = Array.isArray(parsed) ? parsed : [];
      }

      const restored = normalizeProduct({
        id: raw.id || uniqId(),
        title: raw.title || "",
        slug: raw.slug || "",
        sku: raw.sku || "",
        price: raw.price || 0,
        compareAt: raw.compareAt || null,
        shortDescription: raw.shortDescription || "",
        description: raw.description || "",
        tags: toArr(raw.tags),
        collectionSlugs: toArr(raw.collectionSlugs),
        images: toArr(raw.images),
        inStock: raw.inStock,
        featured: raw.featured,
        isSpecial: raw.isSpecial,
        variants,
        updatedAt: raw.updatedAt || nowIsoDate(),
      });

      selectedId = draft.selectedId || null;
      setForm(restored, selectedId ? "edit" : "new");
    } else if (selectedId) {
      selectProduct(selectedId);
    } else {
      newProduct();
    }
  });
})();

