# Adding works to the gallery

All works live in **`portfolioData.js`**. The gallery builds itself from that one list, so ALL WORKS and the three category filters always match it. Just copying a file into a folder does **not** register it by itself.

1. **Place the image** in the matching folder:
   `images/portfolio/clothing-designs/`, `images/portfolio/posters-and-ads/` or `images/portfolio/finished-products/`.
2. **Register it.** Easiest: run `node scan-portfolio.js` (needs Node.js). It adds an entry for every image that isn't registered yet, with the category taken from the folder. No Node? Copy one entry by hand:
   ```
   { "id": "clothing-my-hoodie", "title": "", "src": "images/portfolio/clothing-designs/my-hoodie.jpg",
     "category": "clothing", "ratio": "", "description": "", "year": "" }
   ```
   `id` must be unique. Separate entries with commas.
3. **Category:** `"clothing"`, `"posters"` or `"finished"` (the scan script sets it from the folder).
4. **Optional fields:** `title` and `description` (shown on hover and in the viewer), `year`, and `ratio` such as `"4/5"`, `"1/1"` or `"16/10"` to crop the thumbnail to a chosen frame shape (empty = the image's own shape). The full image always shows in the viewer.
5. **Refresh the page.** The work appears in ALL WORKS and in its category, and the masonry layout rebalances itself.

If a path is wrong the gallery shows "Image not found" with the path it tried.

## Imported clothing designs

The current archive includes 28 optimized images from the supplied `CLOTHING DESIGNS.zip`, stored in `images/portfolio/clothing-designs/` and registered under the Clothing designs filter. They also appear under All works. The zip contained clothing designs only; the Posters and ads and Actual finished products categories are ready for their own image imports.


## Recently imported work

The latest Actual Image archive is stored in `images/portfolio/finished-products/` and appears under Actual finished products. The Posters archive is stored in `images/portfolio/posters-and-ads/` and appears under Posters and ads. All imported entries are included in All Works automatically.
