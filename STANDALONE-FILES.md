# Use datepicker without npm (standalone)

Copy **one folder** into your project so the datepicker works with no package manager.

## What to copy

Copy the **entire** folder:

```
dist/islamic-ksa-calender/
```

into your project (e.g. `js/`, `vendor/`, or `assets/datepicker/`). Keep the folder name and all files inside it.

## Files inside

| File | Purpose |
|------|---------|
| `islamic-ksa-calender.esm.js` | Main ESM entry — load this in your HTML |
| `islamic-ksa-calender.js` | ES5 / nomodule fallback |
| `*.js` (chunks & entries) | Stencil runtime, components, and Hijri logic |

**Important:** Do not rename files or change the folder structure. The scripts load each other by relative path.

## In your HTML

Point the script to your copied folder. Example if you copied to `js/islamic-ksa-calender/`:

```html
<script type="module" src="js/islamic-ksa-calender/islamic-ksa-calender.esm.js"></script>

<input type="text" id="myDate" placeholder="اختر التاريخ">
<datepicker-hijri reference="myDate" disable-future placement="bottom"></datepicker-hijri>
```

Example if you copied to `vendor/datepicker/` (and put the folder contents inside it):

```html
<script type="module" src="vendor/datepicker/islamic-ksa-calender.esm.js"></script>
```

You can rename the **folder** (e.g. `islamic-ksa-calender` → `datepicker`) as long as you keep all files inside it and update the `src` path. Do **not** rename the `.js` files.

## Summary

- **Copy:** whole folder `dist/islamic-ksa-calender/`.
- **Load in HTML:** `<script type="module" src="YOUR_PATH/islamic-ksa-calender.esm.js"></script>`.
- **No npm or build step** needed in your project.
