(() => {
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  function safeParse(json) {
    try { return JSON.parse(json); } catch { return null; }
  }

  // ---- Toast ----
  function toast(msg) {
    let el = $("#cav-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "cav-toast";
      el.style.position = "fixed";
      el.style.left = "50%";
      el.style.bottom = "24px";
      el.style.transform = "translateX(-50%)";
      el.style.padding = "10px 14px";
      el.style.borderRadius = "999px";
      el.style.border = "1px solid rgba(255,255,255,.12)";
      el.style.background = "rgba(15,23,32,.92)";
      el.style.color = "rgba(232,238,245,.95)";
      el.style.boxShadow = "0 18px 60px rgba(0,0,0,.55)";
      el.style.zIndex = "1000";
      el.style.fontWeight = "800";
      el.style.fontSize = "13px";
      el.style.opacity = "0";
      el.style.transition = "opacity .15s ease, transform .15s ease";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.opacity = "1";
    el.style.transform = "translateX(-50%) translateY(0)";
    clearTimeout(toast._t);
    toast._t = setTimeout(() => {
      el.style.opacity = "0";
      el.style.transform = "translateX(-50%) translateY(6px)";
    }, 1400);
  }

  // ---- Mobile drawer ----
  function setupDrawer() {
    const drawer = $("[data-drawer]");
    const backdrop = $("[data-drawer-backdrop]");
    const toggles = $$("[data-nav-toggle]");
    if (!drawer || !backdrop || !toggles.length) return;

    const open = () => {
      drawer.classList.add("open");
      backdrop.classList.add("open");
      toggles.forEach(t => t.setAttribute("aria-expanded", "true"));
      document.body.style.overflow = "hidden";
    };
    const close = () => {
      drawer.classList.remove("open");
      backdrop.classList.remove("open");
      toggles.forEach(t => t.setAttribute("aria-expanded", "false"));
      document.body.style.overflow = "";
    };

    toggles.forEach(btn => btn.addEventListener("click", () => {
      if (drawer.classList.contains("open")) close(); else open();
    }));
    backdrop.addEventListener("click", close);
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });

    // close on link click
    $$("a", drawer).forEach(a => a.addEventListener("click", close));
  }

  // Close desktop nav <details> when clicking outside
  function setupDetailsClose() {
    document.addEventListener("click", (e) => {
      const details = $$("nav.site-nav details[open]");
      details.forEach(d => {
        if (!d.contains(e.target)) d.removeAttribute("open");
      });
    });
  }

  // ---- Product cache ----
  const cache = {
    products: null,
    byId: new Map(),
    loading: null
  };

  function indexProducts(arr) {
    cache.products = Array.isArray(arr) ? arr : [];
    cache.byId.clear();
    cache.products.forEach(p => {
      if (p && p.id) cache.byId.set(String(p.id), p);
    });
  }

  function trySeedFromScriptTags() {
    const candidates = [
      $("#product-data"),
      $("#products-data"),
      $("#collection-products-data"),
      $("#admin-products-seed"),
    ].filter(Boolean);

    for (const el of candidates) {
      const parsed = safeParse(el.textContent || "");
      if (Array.isArray(parsed)) { indexProducts(parsed); return true; }
      if (parsed && typeof parsed === "object" && parsed.id) {
        indexProducts([parsed]);
        return true;
      }
    }
    return false;
  }

  async function ensureProductsLoaded() {
    if (cache.products) return cache.products;
    if (trySeedFromScriptTags()) return cache.products;

    if (cache.loading) return cache.loading;
    cache.loading = (async () => {
      try {
        const res = await fetch("/assets/data/products.json", { cache: "force-cache" });
        if (!res.ok) throw new Error("Failed to load products");
        const arr = await res.json();
        indexProducts(arr);
      } catch (e) {
        indexProducts([]);
      } finally {
        cache.loading = null;
      }
      return cache.products;
    })();

    return cache.loading;
  }

  async function getProductById(id) {
    const key = String(id);
    if (cache.byId.has(key)) return cache.byId.get(key);
    await ensureProductsLoaded();
    return cache.byId.get(key) || null;
  }

  function readVariantFromForm(form) {
    const variant = {};
    const selects = $$("select[name^='variant:']", form);
    selects.forEach(sel => {
      const name = sel.name.replace(/^variant:/, "");
      variant[name] = sel.value;
    });
    return Object.keys(variant).length ? variant : undefined;
  }

  function readQtyFromForm(form) {
    const qtyEl = $("input[name='qty']", form);
    const q = qtyEl ? Number(qtyEl.value) : 1;
    return Math.max(1, Number.isFinite(q) ? q : 1);
  }

  function slugify(s) {
    return String(s || "")
      .toLowerCase()
      .trim()
      .replace(/['"]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  // ---- Add to cart ----
  function setupAddToCart() {
    document.addEventListener("click", async (e) => {
      const btn = e.target.closest("[data-add-to-cart]");
      if (!btn) return;

      const id = btn.getAttribute("data-product-id");
      if (!id) return;

      const form = btn.closest("[data-product-form]");
      const qty = form ? readQtyFromForm(form) : 1;
      const variant = form ? readVariantFromForm(form) : undefined;

      const product = await getProductById(id);
      if (!product) {
        toast("Couldn’t load product data.");
        return;
      }

      if (!window.CAV_CART) {
        toast("Cart not available.");
        return;
      }

      window.CAV_CART.add(String(product.id), qty, variant);
      toast(`Added to cart: ${product.title}`);
    });
  }

  // ---- Product Gallery & Variant ↔ Image Matching ----
  function setupProductGallery() {
    const mainImg = $("#gallery-main-img");
    const thumbs = $$("[data-gallery-thumb]");
    if (!mainImg || !thumbs.length) return;

    // Thumbnail click → switch main image
    thumbs.forEach(btn => {
      btn.addEventListener("click", () => {
        const src = btn.getAttribute("data-img");
        if (!src) return;
        mainImg.src = src;
        thumbs.forEach(t => t.classList.remove("active"));
        btn.classList.add("active");
      });
    });

    // Variant select → find matching image by filename keyword
    const form = $("[data-product-form]");
    if (!form) return;

    const colorSelect = $("select[name='variant:Color']", form);
    if (!colorSelect) return;

    // Build a mapping from color keywords to image URLs / thumb buttons
    // Image filenames follow the pattern: something-COLOR-something.jpg
    const colorMap = buildColorMap(thumbs);

    colorSelect.addEventListener("change", () => {
      const selected = colorSelect.value.toLowerCase();
      const match = findBestMatch(selected, colorMap, thumbs);
      if (match) {
        match.click();
      }
    });
  }

  /**
   * Build a mapping of lowercase color keywords found in image filenames
   * to their corresponding thumbnail buttons.
   */
  function buildColorMap(thumbs) {
    const map = new Map(); // keyword -> [thumb, ...]
    thumbs.forEach(btn => {
      const src = (btn.getAttribute("data-img") || "").toLowerCase();
      // Extract filename from path
      const filename = src.split("/").pop().replace(/\.\w+$/, "");
      // Store the full filename for matching
      if (!map.has(filename)) map.set(filename, btn);
    });
    return map;
  }

  /**
   * Given a selected color value, find the best matching thumbnail.
   * Tries multiple matching strategies:
   * 1. Exact keyword in filename (e.g. "orange" in "pistol-grip-orange")
   * 2. Common color aliases (FDE → tan, OD Green → olive, Coyote → tan, etc.)
   */
  function findBestMatch(selected, colorMap, thumbs) {
    // Normalize the selected value
    const norm = selected.trim().toLowerCase();

    // Map of common variant names to filename keywords
    const aliases = {
      "fde": ["tan", "fde", "coyote"],
      "coyote": ["tan", "coyote", "fde"],
      "coyote brown": ["tan", "coyote", "brown"],
      "olive drab": ["olive", "od", "green"],
      "od green": ["olive", "od", "green"],
      "burnt bronze": ["bronze", "burnt"],
      "grey": ["gray", "grey"],
      "gray": ["gray", "grey"],
      "black/yellow": ["black-yellow", "black"],
      "blue/yellow": ["blue-yellow", "blue"],
      "purple/yellow": ["purple-yellow", "purple"],
      "red/black": ["red-black", "red"],
    };

    // Keywords to try: the value itself, plus any aliases
    const keywords = [norm, ...(aliases[norm] || [])];

    for (const keyword of keywords) {
      for (const btn of thumbs) {
        const src = (btn.getAttribute("data-img") || "").toLowerCase();
        const filename = src.split("/").pop().replace(/\.\w+$/, "");
        // Check if the keyword appears as a distinct segment in the filename
        // (separated by hyphens)
        const parts = filename.split("-");
        if (parts.includes(keyword) || filename.includes(keyword)) {
          return btn;
        }
      }
    }

    return null;
  }

  // ---- Init ----
  document.addEventListener("DOMContentLoaded", () => {
    setupDrawer();
    setupDetailsClose();
    setupAddToCart();
    setupScrollAnimations();
    setupProductGallery();

    // Seed cache ASAP for other scripts
    trySeedFromScriptTags();

    // slug helper for admin (if needed globally)
    window.CAV_SLUGIFY = slugify;
  });

  // ---- Scroll Animations ----
  function setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          // Once animated, we can stop observing
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const elementsToReveal = $$(".reveal, .reveal-group");
    elementsToReveal.forEach(el => observer.observe(el));
  }
})();
