# Yearwheel JS

Browser-based replacement for the supplied R/Shiny annual wheel generator. No build step, server, Python or TeX installation is needed to use the editor. Serve `dist/` as static assets.

## Features
- Separate Wheel and Events tabs, with keyboard navigation. Event editing, search and category filters are available in the Events tab. Printing still includes both views.
- Double-click a name, category, week range, date range or existing note in the Events table to edit it inline. Enter saves, Shift+Enter adds a newline, Escape cancels; Save/Cancel controls are also available. Invalid changes stay in the editor without altering the event. The Edit button opens the full modal, and F2 starts inline editing from a focused name.
- Category settings use compact rows with an enable checkbox, editable name, and Normal/Highlight colour circles. Click either circle to open its native colour picker. Categories and the event category picker read from outside to inside. Drag a category handle to reorder its ring; touch dragging and arrow-key reordering are supported. The order is retained in local saves and JSON backups, including disabled categories. Defaults match the original R source palette. Blank event colours inherit normal; `highlight` inherits highlighted. Category-colour edits update all inheriting events.
- Use two or three category rings. A plan using exactly two categories omits the smallest inner ring; categories can be disabled in settings even when they contain events. Their events remain editable, marked Disabled in the list, and are excluded from the wheel. Re-enabling restores them.
- Conferences contains editable Blue and Purple subcategories sharing one ring. Blue defaults to midblue/darkblue and Purple to midpurple/darkpurple, with normal/highlight inheritance and per-event custom colour overrides. The event editor offers a subcategory picker; JSON preserves child names/colours, and CSV carries a `subcategory` column (name or ID). Old conference CSV colours `midblue`, `darkblue`, `midpurple` and `darkpurple` map to these child palettes automatically.
- Two-ring imports visibly uncheck and mark the unused category Disabled. The two remaining checked boxes cannot be unchecked until another ring is enabled; the unused checkbox remains clickable to restore it. Explicit ring choices survive later settings changes.
- Custom colour picker with a hue/saturation wheel, brightness slider, original palette swatches and hex/name entry. Changes apply only with Apply colour; Cancel and Escape discard them. Works for categories, subcategories, highlighted weeks and custom event colours; pointer/touch and keyboard controls are supported.
- Multiple groups of coloured highlighted weeks (red by default). Later groups override earlier ones.
- Saturated month colours retain the original intensity and progress from reddish purple in September through purple and blue to bluish green in March, shared by SVG and LaTeX.
- Inclusive ISO week spans in both SVG and LaTeX; LaTeX retains the original template’s three radial sub-bands.
- Correct 52/53-week ISO calendars, actual month boundaries and clipped partial-year spans.
- SVG event lanes share ring width only where events overlap; isolated events and non-overlapping portions of spans use full-width slices. Span labels follow the tangent; single-week labels remain radial. Month and week labels also follow their ring tangent. Numbered wheel labels refer to the event list. These layout changes do not alter the LaTeX generator.
- Reset defaults beside Clear events restores default category order, names, palettes and label size while preserving events, dates, highlighted weeks and the centre label. Event rows use compact screen spacing; print spacing is retained.
- Local browser storage, complete JSON backup/restore and CSV import/export. Nothing is synced between browsers.
- Export menu begins with Download .tex and Open in Overleaf. The Overleaf action posts the current UTF-8 source to the documented https://www.overleaf.com/docs endpoint in a new tab using encoded_snip, without a public file upload. It creates a new Overleaf project; it does not update an existing project.
- Vector SVG overview export and original-style standalone `wheelchart` LaTeX export for pdfLaTeX in Overleaf. The TeX uses the supplied main.tex geometry, original named palette and the shared saturated month gradient, rotated full event labels, date/week rings and arrow-shaped months. Category settings and week highlight groups are applied to the template. Two categories omit the smallest ring. The SVG remains the simpler clickable overview.
- Download .tex generates source immediately. Open in Overleaf posts that same source directly; the app never runs a TeX compiler.
- Browser Print / Save as PDF with the wheel and unfiltered event list.

## CSV compatibility
Columns: `name,category,subcategory,start,end,color,notes`. Only `name` is required. `start` and `end` accept ISO week numbers or ISO calendar dates (`YYYY-MM-DD`); older day-first date formats remain importable. Dates are converted to their ISO week in the selected ISO year; mismatched ISO years are rejected. End weeks are inclusive: 2–4 covers all three weeks. A blank end means the start week; blank start/end keeps an unscheduled event. An end without a start is rejected. Names preserve quoted line breaks. Notes are excluded from wheel labels.

Category/subcategory values accept names or IDs; blank category uses the first enabled category and its palette. Up to three category names are inferred on import. Blank colour inherits the category/subcategory normal colour; `highlight` uses its highlight. Colours also accept hex, standard CSS names and original wheel palette names. Original aliases retain their original values; old conference blue/purple aliases are mapped to subcategories. CSV exports preserve inheritance tokens; JSON backups preserve settings, palettes, ring order and highlighted-week groups.

Legacy `date`, `end_date`, `duration_weeks` headers remain accepted, with inclusive end semantics and explicit end taking precedence over duration. CSV imports replace by default and confirm before replacing existing events; uncheck Replace to append. Semicolons, quoted commas/newlines and empty separator rows are supported. Invalid imports are rejected atomically. Duplicate headers are rejected.

The built-in example and CSV template demonstrate all three categories, Blue/Purple subcategories, normal/highlight inheritance, named/hex colours, overlapping ranges, multiline labels, ISO dates, notes and unscheduled events. The built-in example also sets two highlighted-week groups; the CSV template contains events only. Example dates use the selected year. `examples/yearwheeltest.csv` is the migrated 2026 user test calendar, with the three old 2–5 ranges corrected to inclusive 2–4.


## Export limitations
The PDF option opens the browser print dialog. Download LaTeX for consistent vector PDF compilation in Overleaf (pdfLaTeX). Latin text including Danish characters is supported by the pdfLaTeX export; arbitrary scripts or emoji may require another TeX engine/font setup. The SVG overview may shorten or number dense labels. LaTeX exports full names, keeps explicit `\\` and actual newline breaks, and merges same-week labels with line breaks. TeX wraps point labels using the ring’s available width and its own font metrics, with extra break opportunities after slashes. Crowded labels reduce font size to fit the week’s available height. The event editor accepts multiline names; export wrapping never changes the saved event names. Notes remain in the editor and CSV/JSON exports. The standalone PDF contains only the wheel.

## Regression checks
Run `node tests/regression.cjs` for calendar, colour, category, two-ring geometry, inheritance, highlight-group, modal, roundtrip and replace/append checks, plus original wheelchart geometry, multiline/full event labels, three-band spans, range-local slice indices, 52/53-week dates, disabled-category exclusion, reorder behavior and identical Overleaf/download source. Set `YEARWHEEL_QA_TEX=/absolute/path/test.tex` to generate the representative two-ring export for pdfLaTeX QA.

## GitHub Pages

The `Test and deploy GitHub Pages` workflow checks the JavaScript and runs regression tests, then publishes `dist/` after pushes to `main`. Pull requests run checks without deploying. In repository Settings → Pages, choose **GitHub Actions** as the source.

Local preview: `python3 -m http.server 8000 --directory dist`, then visit http://localhost:8000/.

Plans are saved per browser and website origin. To move a plan from the existing hosted site to GitHub Pages, export its JSON backup on the old site and import it on the new site.
