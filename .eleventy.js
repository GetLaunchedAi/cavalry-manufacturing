const fs = require("fs");
const path = require("path");

module.exports = function(eleventyConfig) {
  // Passthrough static assets
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  // ---- Filters ----
  eleventyConfig.addFilter("money", (value) => {
    const num = Number(value);
    if (!Number.isFinite(num)) return value;
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(num);
  });

  eleventyConfig.addFilter("excerpt", (text, max = 140) => {
    const s = String(text || "").replace(/\s+/g, " ").trim();
    if (s.length <= max) return s;
    return s.slice(0, max - 1) + "…";
  });

  eleventyConfig.addFilter("json", (value, spaces = 0) => JSON.stringify(value, null, spaces));

  eleventyConfig.addFilter("concat", (a, b) => {
    const aa = Array.isArray(a) ? a : [];
    const bb = Array.isArray(b) ? b : [];
    return aa.concat(bb);
  });

  eleventyConfig.addFilter("whereTrue", (arr, key) => Array.isArray(arr) ? arr.filter(x => !!(x && x[key])) : []);

  eleventyConfig.addFilter("byCollections", (products, slugs) => {
    if (!Array.isArray(products)) return [];
    const set = new Set(Array.isArray(slugs) ? slugs : []);
    return products.filter(p => {
      const arr = Array.isArray(p?.collectionSlugs) ? p.collectionSlugs : [];
      return arr.some(s => set.has(s));
    });
  });

  eleventyConfig.addFilter("byCollection", (products, collectionSlug) => {
    if (!Array.isArray(products)) return [];
    return products.filter(p => Array.isArray(p.collectionSlugs) && p.collectionSlugs.includes(collectionSlug));
  });

  eleventyConfig.addFilter("childrenOf", (collections, parentSlug) => {
    if (!Array.isArray(collections)) return [];
    return collections.filter(c => (c && c.parent) === parentSlug);
  });

  eleventyConfig.addFilter("descendantSlugs", (collections, rootSlug) => {
    if (!Array.isArray(collections) || !rootSlug) return [];
    const byParent = new Map();
    collections.forEach(c => {
      const p = c && c.parent ? c.parent : null;
      if (!byParent.has(p)) byParent.set(p, []);
      byParent.get(p).push(c.slug);
    });
    const out = [];
    const queue = [rootSlug];
    const seen = new Set();
    while (queue.length) {
      const cur = queue.shift();
      if (!cur || seen.has(cur)) continue;
      seen.add(cur);
      out.push(cur);
      const kids = byParent.get(cur) || [];
      kids.forEach(k => queue.push(k));
    }
    return out;
  });

  eleventyConfig.addFilter("topLevel", (collections) => {
    if (!Array.isArray(collections)) return [];
    return collections.filter(c => !c.parent);
  });

  eleventyConfig.addFilter("countInCollection", (products, collectionSlug) => {
    if (!Array.isArray(products)) return 0;
    return products.filter(p => Array.isArray(p.collectionSlugs) && p.collectionSlugs.includes(collectionSlug)).length;
  });

  eleventyConfig.addFilter("uniqueTags", (products) => {
    if (!Array.isArray(products)) return [];
    const set = new Set();
    products.forEach(p => (p.tags || []).forEach(t => set.add(String(t))));
    return Array.from(set).sort((a,b) => a.localeCompare(b, "en"));
  });

  eleventyConfig.addFilter("sortByKey", (arr, key) => {
    if (!Array.isArray(arr)) return [];
    const copy = [...arr];
    copy.sort((a,b) => {
      const av = (a && a[key] != null) ? String(a[key]).toLowerCase() : "";
      const bv = (b && b[key] != null) ? String(b[key]).toLowerCase() : "";
      return av.localeCompare(bv, "en");
    });
    return copy;
  });

  eleventyConfig.addFilter("sortByNumber", (arr, key, dir = "asc") => {
    if (!Array.isArray(arr)) return [];
    const copy = [...arr];
    copy.sort((a,b) => {
      const av = Number(a?.[key]);
      const bv = Number(b?.[key]);
      const an = Number.isFinite(av) ? av : 0;
      const bn = Number.isFinite(bv) ? bv : 0;
      return dir === "desc" ? (bn - an) : (an - bn);
    });
    return copy;
  });

  eleventyConfig.addFilter("sortByDate", (arr, key, dir = "desc") => {
    if (!Array.isArray(arr)) return [];
    const copy = [...arr];
    copy.sort((a,b) => {
      const ad = Date.parse(a?.[key] || "") || 0;
      const bd = Date.parse(b?.[key] || "") || 0;
      return dir === "asc" ? (ad - bd) : (bd - ad);
    });
    return copy;
  });

  eleventyConfig.addFilter("nowYear", () => new Date().getFullYear());

  // ---- Shortcodes ----
  eleventyConfig.addShortcode("icon", (name) => {
    // Minimal inline icons (avoids dependencies)
    const icons = {
      "arrow": '<span aria-hidden="true">→</span>',
      "check": '<span aria-hidden="true">✓</span>',
      "shield": '<span aria-hidden="true">🛡️</span>',
      "truck": '<span aria-hidden="true">🚚</span>',
      "bolt": '<span aria-hidden="true">⚡</span>',
    };
    return icons[name] || "";
  });

  // ---- Collections ----
  // Provide an Eleventy collection of products by reading global data directly.
  eleventyConfig.addCollection("allProducts", () => {
    try {
      const p = path.join(process.cwd(), "src", "_data", "products.json");
      const raw = fs.readFileSync(p, "utf-8");
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch(e) {
      return [];
    }
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"]
  };
};
