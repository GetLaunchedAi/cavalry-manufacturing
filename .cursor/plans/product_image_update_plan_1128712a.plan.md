---
name: Product Image Update Plan
overview: Audit 131+ product images as source of truth, map to existing products or identify gaps, then standardize all images to consistent 4:3 aspect ratio at 1000x750px dimensions.
todos:
  - id: audit-images
    content: Catalog all 131+ images and identify products/variants they represent
    status: pending
  - id: map-to-products
    content: Match images to existing products and identify missing products
    status: pending
    dependencies:
      - audit-images
  - id: generate-mapping-doc
    content: Create detailed mapping document showing image→product relationships
    status: pending
    dependencies:
      - map-to-products
  - id: await-approval
    content: Present mapping for manual review and approval
    status: pending
    dependencies:
      - generate-mapping-doc
  - id: standardize-images
    content: Process all images to 1000x750px with 4:3 aspect ratio
    status: pending
    dependencies:
      - await-approval
  - id: update-products-json
    content: Update products.json with corrected image paths and variants
    status: pending
    dependencies:
      - standardize-images
  - id: test-validation
    content: Build site and validate all images display correctly
    status: pending
    dependencies:
      - update-products-json
---

# Product Image Consistency & Matching Plan

## Overview

Use the 131+ images in [`src/assets/img/products`](src/assets/img/products) as the **source of truth**. Each image represents a product or variant that should exist on the site. Audit all images, map them to products, identify gaps, and standardize dimensions to 1000x750px (4:3 ratio).

## Phase 1: Image-First Audit & Mapping

### 1.1 Catalog All Product Images (Source of Truth)

- Inventory all 131+ images in [`src/assets/img/products`](src/assets/img/products)
- Parse filenames to identify product types and variants:
- **AR15 Stocks** (fixed, adjustable) - various colors (black, tan, orange, blue, pink)
- **Pistol Grips** (standard, ergo) - various colors (black, tan, orange, purple, white)
- **Handguards** (full, slim, short, vented) - various colors and lengths
- **Grip Covers** - various color combinations
- **Medical Kits** (trauma kits, IFAK) - various shots and layouts
- **Medical Supplies** (tourniquets, bandages, chest seals, gauze, gloves, etc.)
- **Medical Equipment** (shears, airways, PPE, tape, etc.)
- **AR15 Hardware** (receivers, buffer tubes, endplates, pins, mounts, rail covers)
- **Logos** (Cavalry Manufacturing, Cavalry Medical)
- Group images by product/variant families
- Note multiple angles and variations for same products

### 1.2 Map Images to Current Products

- Cross-reference image catalog with 28 existing products in [`src/_data/products.json`](src/_data/products.json)
- Identify:
- **Correctly matched**: Products using appropriate images
- **Incorrectly matched**: Products using wrong images (e.g., charging handle using receiver image)
- **Missing images**: Products that should have better/more images available
- **Missing products**: Images that suggest products/variants not yet in products.json
- **Variant opportunities**: Images showing color/size variants that could be added to existing products

### 1.3 Generate Comprehensive Mapping Document

Create detailed markdown/CSV file with:**Per Image Entry:**

- Image filename
- Identified product type and variant (from filename analysis)
- Current usage (Product ID/Title if mapped, or "UNUSED")
- Recommended action (Keep/Replace/Add as variant/Create new product)
- Notes

**Summary Sections:**

- Products needing image updates
- Suggested new products based on images
- Variant expansion opportunities
- Images that may be logos/duplicates/test files

### 1.4 Review & Approval

Present mapping document for manual review and approval before implementing changes.---

## Phase 2: Image Processing & Implementation

### 2.1 Image Standardization

Based on approved mapping, standardize all product images:

- Process each image to 1000x750px (4:3 ratio)
- Maintain aspect ratio using:
- Smart cropping for images close to 4:3
- Padding (dark background to match site theme) for images with very different ratios
- Center product in frame for consistency
- Optimize file sizes for web performance (target <150KB per image)
- Preserve image quality and clarity
- Keep original images as backup before processing
- Use image processing tools (sharp package or similar)

**Processing Strategy by Image Type:**

- Product photos on white/plain backgrounds: crop to product, pad if needed
- Product photos in use/context: smart crop to maintain context
- Multiple angle photos: ensure consistent framing across set
- Variant photos (colors): match framing exactly for consistency

### 2.2 Update Product Data

Based on the approved image mapping:

- Update [`src/_data/products.json`](src/_data/products.json) with corrected image paths
- Add multiple images to products where available:
- Different angles (front, side, detail shots)
- In-use/lifestyle photos
- Packaging/contents layouts for kits
- Update variant information where color/size variants are shown in images
- Add new product entries for products identified in image audit (if approved)
- Ensure all image paths use correct format: `/assets/img/products/filename.jpg`
- Remove references to placeholder images where real images exist

### 2.3 CSS Verification

Verify existing CSS in [`src/assets/css/styles.css`](src/assets/css/styles.css) properly handles standardized images:

- **Product cards**: `.product-card .img` (aspect-ratio: 4/3, object-fit: cover) ✓
- **Product page gallery**: `.gallery img` (width: 100%, height: auto) ✓
- Hero images and other image contexts
- Ensure responsive behavior maintained across breakpoints
- Verify object-fit: cover works well with standardized 4:3 images

### 2.4 Testing & Validation

Comprehensive testing after implementation:

- Build site (`npm run build`) and verify all images render correctly
- Test image display across all page types:
- **Homepage**: Featured product grid
- **Collection pages**: Product grids with filters/sorting
- **Individual product pages**: Gallery view with full-size images
- **Search results**: Product cards in search interface
- **Cart page**: Product thumbnails
- **Admin panel**: Product management interface
- Verify no broken image links (404s)
- Check loading performance and lazy-loading behavior
- Validate aspect ratio consistency across all viewports (mobile, tablet, desktop)
- Confirm image quality is acceptable at displayed sizes
- Test with slow network to ensure progressive loading works well

### 2.5 Documentation & Cleanup

- Document final image specifications (1000x750px, 4:3, <150KB)
- Create style guide for adding new product images:
- Required dimensions and aspect ratio
- Background recommendations
- Framing and composition guidelines
- Naming conventions for variants
- List any products that still need better images or additional angles
- Note any unused images that could be archived/removed
- Clean up any temporary processing files

---

## Deliverables

1. **Phase 1**: Comprehensive image-to-product mapping document for review (with recommendations)
2. **Phase 2**: 

- Standardized image assets (1000x750px, 4:3 ratio, optimized)
- Updated `products.json` with correct image mappings
- Validation report confirming all images work correctly
- Documentation for future image additions

---

## Key Files Modified

- [`src/_data/products.json`](src/_data/products.json) - Product data with corrected image paths
- [`src/assets/img/products/`](src/assets/img/products/) - Standardized product images
- Image mapping document (new) - Audit results and recommendations

## Notes

- Images are the **source of truth** - they dictate what products/variants should exist
- Manual review/approval required before Phase 2 implementation