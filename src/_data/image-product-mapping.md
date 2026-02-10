# Product Image ↔ Product Mapping Audit

> **Generated:** 2026-02-10  
> **Total Images:** 135 files in `src/assets/img/products/`  
> **Total Products:** 28 in `products.json`  
> **Images Currently Used:** 33 (across 28 products)  
> **Unused Product Images:** 84  
> **Non-Product Images:** 18 (logos, placeholders, payment icons)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Product Image Status (All 28 Products)](#product-image-status)
3. [Incorrectly Matched Products](#incorrectly-matched-products)
4. [Products Using Placeholder/Generic Images](#products-using-placeholder-images)
5. [Image Inventory by Category](#image-inventory-by-category)
6. [Suggested New Products (from Unused Images)](#suggested-new-products)
7. [Variant Expansion Opportunities](#variant-expansion-opportunities)
8. [Additional Images for Existing Products](#additional-images-for-existing-products)
9. [Non-Product Images (Logos/UI)](#non-product-images)
10. [Recommendations Summary](#recommendations-summary)

---

## Executive Summary

### Critical Issues Found
- **5 products use WRONG images** (charging handles, barrels using handguard images)
- **6 products share a single generic `mounting-plate-metal.jpg`** for very different products
- **84 product images are UNUSED** — representing products/variants not in the catalog
- **Many products lack multiple images** despite multiple angles being available

### Key Opportunities
- **~15 new products** could be created from unused images
- **5+ existing products** can be expanded with color/variant images
- **8+ products** can add additional angle/detail shots from available images

---

## Product Image Status

### ✅ Correctly Matched (15 products)

| ID | Product | Images Used | Status |
|---|---|---|---|
| CM-1001 | C1 Fixed Buttstock | `ar-stock-fixed-black-01/02/03.jpg` | ✅ Good — 6 more angles available |
| CM-1002 | C2 Modular Grip | `pistol-grip-black.jpg`, `pistol-grip-tan.jpg` | ✅ Good — 4 more colors available |
| CM-1003 | Cavalry M-LOK Handguard 13.5" | `handguard-slim-dark/tan/olive.jpg` | ✅ Good — 3 more colors available |
| CM-1013 | AR Furniture Set — Special Color | `ar-stock-adjustable-orange-01.jpg`, `blue-01.jpg`, `pink.jpg` | ✅ Good |
| CM-2001 | CAT Tourniquet (Gen 7) | `tourniquet-orange.jpg` | ✅ Correct |
| CM-2003 | Compact IFAK Kit — Basic | `trauma-kit-red-bag-open.jpg`, `contents-layout.jpg`, `supplies.jpg` | ✅ Good — more images available |
| CM-2004 | IFAK Refill Pack | `trauma-kit-contents-layout.jpg` | ✅ Reasonable |
| CM-2006 | Emergency Bandage 6" | `emergency-bandage-packet.jpg` | ✅ Correct — more images available |
| CM-2007 | Emergency Bandage 4" | `emergency-bandage-packet-02.jpg` | ✅ Correct |
| CM-2008 | Occlusive Chest Seal (Twin Pack) | `chest-seal-packet.jpg` | ✅ Correct |
| CM-2009 | Hemostatic Gauze | `celox-hemostatic-gauze.jpg` | ✅ Correct |
| CM-2010 | Celox Granules 15g | `medical-foil-pack-labeled.jpg` | ✅ Reasonable |
| CM-2011 | Nitrile Gloves (Pair) | `nitrile-gloves-blue.jpg` | ✅ Correct |
| CM-2012 | Medical Pouch — Rip-Away | `utility-pouch-black-red-zips.jpg`, `-02.png` | ✅ Correct |
| CM-2013 | Chest Seal Training Pack | `chest-seal-vented-red-bg.jpg` | ✅ Correct |
| CM-2014 | Nasopharyngeal Airway Kit | `nasopharyngeal-airway-green.jpg` | ✅ Correct |
| CM-2016 | ABD Pads (5-pack) | `gauze-pads.jpg` | ✅ Correct |
| CM-3002 | Warehouse Blowout: M-LOK Rail Covers | `rail-ladder-cover-tan.jpg` | ✅ Correct |

### ⚠️ Questionable Matches (5 products)

| ID | Product | Current Image | Issue | Recommendation |
|---|---|---|---|---|
| CM-1006 | Nitride BCG — 5.56 | `receiver-endplate-hardware.jpg` | Using endplate hardware image for BCG | No BCG image exists — keep or source new image |
| CM-1007 | Spare Gas Rings (3-pack) | `takedown-pins-set.jpg` | Using takedown pins for gas rings | No gas ring image exists — keep or source new image |
| CM-2002 | SOF-T Wide Tourniquet | `tourniquet-orange.jpg` | Same image as CM-2001 (CAT Tourniquet) | No distinct SOF-T image exists — keep or source new image |
| CM-2005 | Trauma Shears 7.5" | `multi-tool-pliers.jpg` | Multi-tool pliers image for shears | Closest available — keep or source new image |
| CM-2015 | Decon Wipes (10-pack) | `medical-supplies-small-packs.jpg` | Generic supplies image | Closest available — keep or source new image |

### ❌ Incorrectly Matched (4 products)

| ID | Product | Current Image | Issue | Recommendation |
|---|---|---|---|---|
| CM-1004 | Enhanced Charging Handle (Ambi) | `handguard-slim-dark.jpg` | **Handguard image for Charging Handle** | No charging handle image exists — needs new image |
| CM-1005 | Standard Charging Handle | `handguard-slim-dark.jpg` | **Handguard image for Charging Handle** | No charging handle image exists — needs new image |
| CM-1010 | 16" Duty Barrel — 5.56 NATO | `handguard-slim-dark.jpg` | **Handguard image for Barrel** | No barrel image exists — needs new image |
| CM-1011 | 10.3" CQB Barrel — 5.56 NATO | `handguard-slim-dark.jpg` | **Handguard image for Barrel** | No barrel image exists — needs new image |

### ⚠️ Overused Generic Images (6 products sharing `mounting-plate-metal.jpg`)

| ID | Product | Notes |
|---|---|---|
| CM-1008 | A2 Flash Hider | No flash hider image exists |
| CM-1009 | Comp Muzzle Brake | No muzzle brake image exists |
| CM-1014 | Shotgun Side-Saddle 6-Round | No shotgun accessory image exists |
| CM-1015 | SCAR Muzzle Device Adapter | No SCAR adapter image exists |
| CM-1016 | CAV-15 Sling Mount | No sling mount image exists |

### ⚠️ Other Issues

| ID | Product | Current Image | Issue |
|---|---|---|---|
| CM-1012 | AR Furniture Set — Standard | `ar-stock-fixed-black-01.jpg` | Only shows stock; should show full furniture set |
| CM-3001 | Overrun Polymer Sling Keeper | `rail-ladder-cover-dark.jpg` | Rail cover image for sling keeper — no sling keeper image exists |

---

## Image Inventory by Category

### AR15 Stocks — Fixed (9 images)

| Image | Used By | Status |
|---|---|---|
| `ar-stock-fixed-black-01.jpg` | CM-1001, CM-1012 | ✅ Used |
| `ar-stock-fixed-black-02.jpg` | CM-1001 | ✅ Used |
| `ar-stock-fixed-black-03.jpg` | CM-1001 | ✅ Used |
| `ar-stock-fixed-black-04.jpg` | — | 🔵 Add to CM-1001 |
| `ar-stock-fixed-black-05.jpg` | — | 🔵 Add to CM-1001 |
| `ar-stock-fixed-black-06.jpg` | — | 🔵 Add to CM-1001 |
| `ar-stock-fixed-black-07.jpg` | — | 🔵 Add to CM-1001 |
| `ar-stock-fixed-black-08.jpg` | — | 🔵 Add to CM-1001 |
| `ar-stock-fixed-black-09.jpg` | — | 🔵 Add to CM-1001 |

### AR15 Stocks — Adjustable (19 images)

| Image | Used By | Status |
|---|---|---|
| `ar-stock-adjustable-blue-01.jpg` | CM-1013 | ✅ Used |
| `ar-stock-adjustable-blue-02.jpg` | — | 🔵 Add to CM-1013 |
| `ar-stock-adjustable-orange-01.jpg` | CM-1013 | ✅ Used |
| `ar-stock-adjustable-orange-02.jpg` | — | 🔵 Add to CM-1013 |
| `ar-stock-adjustable-pink.jpg` | CM-1013 | ✅ Used |
| `ar-stock-adjustable-tan-01.jpg` | — | 🟡 New product: "C1 Adjustable Buttstock" |
| `ar-stock-adjustable-tan-02.jpg` | — | 🟡 New product angle |
| `ar-stock-adjustable-tan-02-01.jpg` | — | 🟡 New product angle |
| `ar-stock-adjustable-tan-02-02.jpg` | — | 🟡 New product angle |
| `ar-stock-adjustable-tan-03.jpg` | — | 🟡 New product angle |
| `ar-stock-adjustable-tan-03-01.jpg` | — | 🟡 New product angle |
| `ar-stock-adjustable-tan-03-02.jpg` | — | 🟡 New product angle |
| `ar-stock-adjustable-tan-04.jpg` | — | 🟡 New product angle |
| `ar-stock-adjustable-tan-04-02.jpg` | — | 🟡 New product angle |
| `ar-stock-adjustable-tan-05.jpg` | — | 🟡 New product angle |
| `ar-stock-adjustable-tan-06.jpg` | — | 🟡 New product angle |
| `ar-stock-adjustable-tan-07.jpg` | — | 🟡 New product angle |
| `ar-stock-adjustable-tan-08.jpg` | — | 🟡 New product angle |
| `ar-stock-adjustable-tan-09.jpg` | — | 🟡 New product angle |

### Pistol Grips (6 images)

| Image | Used By | Status |
|---|---|---|
| `pistol-grip-black.jpg` | CM-1002 | ✅ Used |
| `pistol-grip-tan.jpg` | CM-1002 | ✅ Used |
| `pistol-grip-ergo-black.jpg` | — | 🟡 New product: "C2 Ergo Grip" |
| `pistol-grip-orange.jpg` | — | 🔵 Add as CM-1002 variant image |
| `pistol-grip-purple.jpg` | — | 🔵 Add as CM-1002 variant image |
| `pistol-grip-white.jpg` | — | 🔵 Add as CM-1002 variant image |

### Handguards — Full Length (9 images)

| Image | Used By | Status |
|---|---|---|
| `handguard-full-pink.jpg` | — | 🟡 New product: "Full-Length Handguard" (Pink) |
| `handguard-full-pink-02.jpg` | — | 🟡 Additional angle |
| `handguard-full-purple-01.jpg` | — | 🟡 New product variant (Purple) |
| `handguard-full-purple-02.jpg` | — | 🟡 Additional angle |
| `handguard-full-tan-01.jpg` | — | 🟡 New product variant (Tan) |
| `handguard-full-tan-02.jpg` | — | 🟡 Additional angle |
| `handguard-full-tan-03.jpg` | — | 🟡 Additional angle |
| `handguard-full-tan-04.jpg` | — | 🟡 Additional angle |
| `handguard-full-tan-05.jpg` | — | 🟡 Additional angle |

### Handguards — Short (9 images)

| Image | Used By | Status |
|---|---|---|
| `handguard-short-orange-01.jpg` | — | 🟡 New product: "Short Handguard" (Orange) |
| `handguard-short-orange-02.jpg` | — | 🟡 Additional angle |
| `handguard-short-orange-03.jpg` | — | 🟡 Additional angle |
| `handguard-short-orange-04.jpg` | — | 🟡 Additional angle |
| `handguard-short-orange-05.jpg` | — | 🟡 Additional angle |
| `handguard-short-orange-06.jpg` | — | 🟡 Additional angle |
| `handguard-short-orange-07.jpg` | — | 🟡 Additional angle |
| `handguard-short-orange-08.jpg` | — | 🟡 Additional angle |
| `handguard-short-tan.jpg` | — | 🟡 New product variant (Tan) |

### Handguards — Slim / M-LOK (7 images)

| Image | Used By | Status |
|---|---|---|
| `handguard-slim-dark.jpg` | CM-1003, CM-1004❌, CM-1005❌, CM-1010❌, CM-1011❌ | ⚠️ Overused — only correct for CM-1003 |
| `handguard-slim-tan.jpg` | CM-1003 | ✅ Used |
| `handguard-slim-olive.jpg` | CM-1003 | ✅ Used |
| `handguard-slim-gray.jpg` | — | 🔵 Add to CM-1003 |
| `handguard-slim-gray-02.jpg` | — | 🔵 Add to CM-1003 |
| `handguard-slim-pink.jpg` | — | 🔵 Add to CM-1003 |
| `handguard-slim-tan-02.jpg` | — | 🔵 Add to CM-1003 |

### Handguards — Vented (2 images)

| Image | Used By | Status |
|---|---|---|
| `handguard-vented-tan-01.jpg` | — | 🟡 New product: "Vented Handguard" |
| `handguard-vented-tan-02.jpg` | — | 🟡 Additional angle |

### Grip Covers (6 images)

| Image | Used By | Status |
|---|---|---|
| `grip-cover-black-yellow.jpg` | — | 🟡 New product: "Grip Cover" (Black/Yellow) |
| `grip-cover-blue-yellow.jpg` | — | 🟡 Variant (Blue/Yellow) |
| `grip-cover-blue-yellow-02.png` | — | 🟡 Additional angle |
| `grip-cover-blue-yellow-03.png` | — | 🟡 Additional angle |
| `grip-cover-purple-yellow.jpg` | — | 🟡 Variant (Purple/Yellow) |
| `grip-cover-red-black.png` | — | 🟡 Variant (Red/Black) |

### AR15 Hardware (7 images)

| Image | Used By | Status |
|---|---|---|
| `ar-lower-receiver-black.jpg` | — | 🟡 New product: "AR Lower Receiver" |
| `stock-buffer-tube-kit-black.jpg` | — | 🟡 New product: "Buffer Tube Kit" |
| `stock-buffer-tube-kit-black-02.jpg` | — | 🟡 Additional angle |
| `stock-buffer-tube-kit-black-03.jpg` | — | 🟡 Additional angle |
| `receiver-endplate-hardware.jpg` | CM-1006 | ⚠️ Used for BCG (questionable) |
| `takedown-pins-set.jpg` | CM-1007 | ⚠️ Used for Gas Rings (questionable) |
| `mounting-plate-metal.jpg` | CM-1008/09/14/15/16 | ⚠️ Overused generic image for 5 different products |

### Rail Covers (3 images)

| Image | Used By | Status |
|---|---|---|
| `rail-ladder-cover-dark.jpg` | CM-3001 | ⚠️ Used for Sling Keeper (questionable) |
| `rail-ladder-cover-tan.jpg` | CM-3002 | ✅ Used |
| `rail-ladder-cover-pink.jpg` | — | 🔵 Add to CM-3002 as variant |

### Tourniquets (1 image)

| Image | Used By | Status |
|---|---|---|
| `tourniquet-orange.jpg` | CM-2001, CM-2002 | ⚠️ Shared between 2 different tourniquet products |

### Trauma Kits (10 images)

| Image | Used By | Status |
|---|---|---|
| `trauma-kit-red-bag-open.jpg` | CM-2003 | ✅ Used |
| `trauma-kit-contents-layout.jpg` | CM-2003, CM-2004 | ✅ Used |
| `trauma-kit-supplies.jpg` | CM-2003 | ✅ Used |
| `trauma-kit-contents-black-bg.jpg` | — | 🔵 Add to CM-2003 |
| `trauma-kit-items-red-bg.jpg` | — | 🔵 Add to CM-2003 |
| `trauma-kit-supplies-02.jpg` | — | 🔵 Add to CM-2003 or CM-2004 |
| `trauma-kit-supplies-03.jpg` | — | 🔵 Add to CM-2003 or CM-2004 |
| `trauma-kit-supplies-04.jpg` | — | 🔵 Add to CM-2003 or CM-2004 |
| `trauma-kit-supplies-assorted.jpg` | — | 🔵 Add to CM-2003 or CM-2004 |
| `trauma-kit-yellow-case.jpg` | — | 🟡 New product: "Trauma Kit — Pro" (yellow case variant) |

### Emergency Bandages (5 images)

| Image | Used By | Status |
|---|---|---|
| `emergency-bandage-packet.jpg` | CM-2006 | ✅ Used |
| `emergency-bandage-packet-02.jpg` | CM-2007 | ✅ Used |
| `emergency-bandage-packet-03.jpg` | — | 🔵 Add to CM-2006 or CM-2007 |
| `emergency-bandage-packet-04.jpg` | — | 🔵 Add to CM-2006 or CM-2007 |
| `emergency-bandage-packet-05.jpg` | — | 🔵 Add to CM-2006 or CM-2007 |

### Bandages & Wraps (4 images)

| Image | Used By | Status |
|---|---|---|
| `bandage-dressing-kit.jpg` | — | 🟡 New product: "Bandage Dressing Kit" |
| `elastic-bandage-wrap-tan.jpg` | — | 🟡 New product: "Elastic Bandage Wrap" |
| `elastic-bandage-wrap-pink.jpg` | — | 🟡 Variant (Pink) |
| `medical-bandage-gauze-red-bg.jpg` | — | 🔵 Add to existing bandage/gauze product |

### Gauze (2 images)

| Image | Used By | Status |
|---|---|---|
| `gauze-pads.jpg` | CM-2016 | ✅ Used |
| `gauze-roll-bandage.jpg` | — | 🟡 New product: "Gauze Roll Bandage" |

### Chest Seals (2 images)

| Image | Used By | Status |
|---|---|---|
| `chest-seal-packet.jpg` | CM-2008 | ✅ Used |
| `chest-seal-vented-red-bg.jpg` | CM-2013 | ✅ Used |

### Hemostatic / Celox (1 image)

| Image | Used By | Status |
|---|---|---|
| `celox-hemostatic-gauze.jpg` | CM-2009 | ✅ Used |

### Airway / CPR (2 images)

| Image | Used By | Status |
|---|---|---|
| `nasopharyngeal-airway-green.jpg` | CM-2014 | ✅ Used |
| `cpr-mask.jpg` | — | 🟡 New product: "CPR Pocket Mask" |

### PPE / Gloves (4 images)

| Image | Used By | Status |
|---|---|---|
| `nitrile-gloves-blue.jpg` | CM-2011 | ✅ Used |
| `tactical-gloves-olive.jpg` | — | 🟡 New product: "Tactical Gloves" |
| `face-shield.jpg` | — | 🟡 New product: "Face Shield" |
| `ppe-mask-gloves-kit.jpg` | — | 🟡 New product: "PPE Kit" |

### Medical Supplies — Misc (7 images)

| Image | Used By | Status |
|---|---|---|
| `medical-foil-pack-labeled.jpg` | CM-2010 | ✅ Used |
| `medical-foil-pack.jpg` | — | 🔵 Add to CM-2010 |
| `medical-foil-pack-02.jpg` | — | 🔵 Add to CM-2010 |
| `medical-sponges-box.jpg` | — | 🟡 New product: "Medical Sponges" |
| `medical-supplies-small-packs.jpg` | CM-2015 | ✅ Used |
| `medical-supply-box-and-tube.jpg` | — | 🟡 New product or add to existing |
| `medical-tape-rolls.jpg` | — | 🟡 New product: "Medical Tape" |

### Other Medical (2 images)

| Image | Used By | Status |
|---|---|---|
| `surgical-lubricant-packet.jpg` | — | 🔵 Add to CM-2014 (NPA Kit — lubricant is used with NPA) |
| `multi-tool-pliers.jpg` | CM-2005 | ⚠️ Used for Trauma Shears (questionable) |

### Utility Pouches (2 images)

| Image | Used By | Status |
|---|---|---|
| `utility-pouch-black-red-zips.jpg` | CM-2012 | ✅ Used |
| `utility-pouch-black-red-zips-02.png` | CM-2012 | ✅ Used |

---

## Suggested New Products (from Unused Images)

Based on images that exist but have NO matching product in `products.json`:

| # | Suggested Product | Suggested ID | Images Available | Category |
|---|---|---|---|---|
| 1 | **C1 Adjustable Buttstock** | CM-10XX | 14 tan images + blue-02 + orange-02 | AR15 Furniture |
| 2 | **C2 Ergo Grip** | CM-10XX | `pistol-grip-ergo-black.jpg` | AR15 Furniture |
| 3 | **Full-Length Handguard** | CM-10XX | 9 images (pink, purple, tan) | Upper Parts |
| 4 | **Short Handguard** | CM-10XX | 9 images (orange, tan) | Upper Parts |
| 5 | **Vented Handguard** | CM-10XX | 2 images (tan) | Upper Parts |
| 6 | **Grip Cover Set** | CM-10XX | 6 images (4 color combos) | AR15 Accessories |
| 7 | **AR Lower Receiver** | CM-10XX | `ar-lower-receiver-black.jpg` | Lower Parts |
| 8 | **Buffer Tube Kit** | CM-10XX | 3 images (black) | Lower Parts |
| 9 | **Bandage Dressing Kit** | CM-20XX | `bandage-dressing-kit.jpg` | Medical Supplies |
| 10 | **Elastic Bandage Wrap** | CM-20XX | 2 images (tan, pink) | Medical Supplies |
| 11 | **Gauze Roll Bandage** | CM-20XX | `gauze-roll-bandage.jpg` | Medical Supplies |
| 12 | **CPR Pocket Mask** | CM-20XX | `cpr-mask.jpg` | Medical Equipment |
| 13 | **Tactical Gloves** | CM-20XX | `tactical-gloves-olive.jpg` | PPE |
| 14 | **Face Shield** | CM-20XX | `face-shield.jpg` | PPE |
| 15 | **PPE Kit (Mask + Gloves)** | CM-20XX | `ppe-mask-gloves-kit.jpg` | PPE |
| 16 | **Medical Sponges** | CM-20XX | `medical-sponges-box.jpg` | Medical Supplies |
| 17 | **Medical Tape** | CM-20XX | `medical-tape-rolls.jpg` | Medical Supplies |
| 18 | **Trauma Kit — Pro (Yellow Case)** | CM-20XX | `trauma-kit-yellow-case.jpg` | Medical Kits |

---

## Variant Expansion Opportunities

### CM-1002: C2 Modular Grip — Add Color Variants
Currently: Black, FDE  
**Add from images:** Orange, Purple, White  
Images: `pistol-grip-orange.jpg`, `pistol-grip-purple.jpg`, `pistol-grip-white.jpg`

### CM-1003: Cavalry M-LOK Handguard — Add Color Variants
Currently: Dark, Tan, Olive (implied from images)  
**Add from images:** Gray, Pink  
Images: `handguard-slim-gray.jpg`, `handguard-slim-gray-02.jpg`, `handguard-slim-pink.jpg`, `handguard-slim-tan-02.jpg`

### CM-3002: M-LOK Rail Covers — Add Color Variant
Currently: Tan  
**Add from images:** Pink  
Image: `rail-ladder-cover-pink.jpg`

### CM-1013: AR Furniture Set — Special Color — Add More Angles
Currently: Orange-01, Blue-01, Pink  
**Add from images:** `ar-stock-adjustable-blue-02.jpg`, `ar-stock-adjustable-orange-02.jpg`

---

## Additional Images for Existing Products

### CM-1001: C1 Fixed Buttstock — Add 6 More Angles
Add: `ar-stock-fixed-black-04.jpg` through `ar-stock-fixed-black-09.jpg`

### CM-2003: Compact IFAK Kit — Add 5 More Images
Add: `trauma-kit-contents-black-bg.jpg`, `trauma-kit-items-red-bg.jpg`, `trauma-kit-supplies-02.jpg`, `trauma-kit-supplies-03.jpg`, `trauma-kit-supplies-04.jpg`, `trauma-kit-supplies-assorted.jpg`

### CM-2006/CM-2007: Emergency Bandages — Add Extra Images
Add: `emergency-bandage-packet-03.jpg`, `emergency-bandage-packet-04.jpg`, `emergency-bandage-packet-05.jpg`

### CM-2010: Celox Granules — Add Extra Images
Add: `medical-foil-pack.jpg`, `medical-foil-pack-02.jpg`

### CM-2014: Nasopharyngeal Airway Kit — Add Lubricant Image
Add: `surgical-lubricant-packet.jpg` (NPA kits include lubricant)

---

## Non-Product Images

These images are NOT product photos and should NOT be mapped to products:

### Logos (13 images)
- `cavalry-logo-white.png`
- `cavalry-manufacturing-logo-black-01.png`
- `cavalry-manufacturing-logo-black-02.png`
- `cavalry-manufacturing-logo-yellow-01.png` through `05.png`
- `cavalry-medical-logo-01.jpg` through `05.jpg`

### UI/Placeholder (3 images)
- `store-placeholder.png`
- `payment-icons-01.png`
- `payment-icons-02.png`

**Recommendation:** Move logos to `src/assets/img/logos/` and UI images to `src/assets/img/ui/` to keep the products directory clean.

---

## Recommendations Summary

### 🔴 Priority 1: Fix Incorrect Image Mappings
1. **CM-1004** (Enhanced Charging Handle) — Remove `handguard-slim-dark.jpg`, needs product-specific image
2. **CM-1005** (Standard Charging Handle) — Remove `handguard-slim-dark.jpg`, needs product-specific image
3. **CM-1010** (16" Duty Barrel) — Remove `handguard-slim-dark.jpg`, needs product-specific image
4. **CM-1011** (10.3" CQB Barrel) — Remove `handguard-slim-dark.jpg`, needs product-specific image

### 🟡 Priority 2: Replace Overused Generic Images
5. **CM-1008, CM-1009, CM-1014, CM-1015, CM-1016** — All sharing `mounting-plate-metal.jpg`. Need product-specific images or at minimum different placeholder images.

### 🟢 Priority 3: Enhance Existing Products with Available Images
6. Add more angles to CM-1001 (Fixed Buttstock) — 6 additional images available
7. Add color variant images to CM-1002 (Grip) — 3 colors available
8. Add color variant images to CM-1003 (Handguard) — 3 more colors available
9. Add more kit images to CM-2003 (IFAK Kit) — 5+ additional images available
10. Add lubricant image to CM-2014 (NPA Kit)
11. Add extra bandage images to CM-2006/CM-2007

### 🔵 Priority 4: Create New Products from Available Images
12. Create ~15-18 new products from the 84 unused product images (see Suggested New Products table above)

### 📁 Priority 5: Directory Cleanup
13. Move 13 logo images to `src/assets/img/logos/`
14. Move 3 UI images to `src/assets/img/ui/`
15. Consider removing `store-placeholder.png` if no longer needed

---

## Products Needing New Photography (No Suitable Image Exists)

These products have NO matching image in the image library and currently use incorrect or generic images:

| ID | Product | Current (Wrong) Image |
|---|---|---|
| CM-1004 | Enhanced Charging Handle (Ambi) | `handguard-slim-dark.jpg` |
| CM-1005 | Standard Charging Handle | `handguard-slim-dark.jpg` |
| CM-1008 | A2 Flash Hider | `mounting-plate-metal.jpg` |
| CM-1009 | Comp Muzzle Brake | `mounting-plate-metal.jpg` |
| CM-1010 | 16" Duty Barrel — 5.56 NATO | `handguard-slim-dark.jpg` |
| CM-1011 | 10.3" CQB Barrel — 5.56 NATO | `handguard-slim-dark.jpg` |
| CM-1014 | Shotgun Side-Saddle 6-Round | `mounting-plate-metal.jpg` |
| CM-1015 | SCAR Muzzle Device Adapter | `mounting-plate-metal.jpg` |
| CM-1016 | CAV-15 Sling Mount | `mounting-plate-metal.jpg` |

**9 products need new product photography** — no suitable image exists in the current library.

