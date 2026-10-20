# Yearwheel JS

Browser-based replacement for the supplied R/Shiny annual wheel generator. No build step, server, Python or TeX installation is needed to use the editor. Serve `dist/` as static assets.

## Features
- Desktop wheel view fits the window: compact settings at left and SVG sized to the remaining height. Additional settings scroll within their panel; the wheel stays visible. Narrow screens use a stacked layout.
- Header-mounted Wheel and Events tabs, with keyboard navigation. Event editing, search and category filters are available in the Events tab. Printing still includes both views.
- Double-click a name, category, week range, date range or existing note in the Events table to open a small anchored field popup without resizing the table. Click outside or press Escape to dismiss without saving. Enter saves, Shift+Enter adds a newline, Escape cancels; Save/Cancel controls are also available. Invalid changes stay in the editor without altering the event. The Edit button opens the full modal, and F2 starts inline editing from a focused name.
- Category settings use compact rows with an enable checkbox, editable name, and Background/Event colour circles. Click either circle to open the colour wheel picker. Categories and the event category picker read from outside to inside. Drag a category handle to reorder its ring; touch dragging and arrow-key reordering are supported. The order is retained in local saves and JSON backups, including disabled categories. Defaults match the original R source palette. Blank event colours inherit the category Event colour or the subcategory’s single Event colour. Legacy `highlight` tokens use the same event colour. Category-colour edits update all inheriting events.
- Use two or three category rings. A plan using exactly two categories omits the smallest inner ring; categories can be disabled in settings even when they contain events. Their events remain editable, marked Disabled in the list, and are excluded from the wheel. Re-enabling restores them.
- Add or remove up to eight subcategories per ring in settings. New subcategories start with the parent Event colour. Removing a subcategory retains all its events in the parent ring, preserving events and custom overrides. Names, colours, CSV/JSON and both event pickers use the updated list.
- Conferences contains editable Blue and Purple subcategories sharing one ring. Blue defaults to midblue and Purple to midpurple, each with a single Event colour and per-event custom overrides. Both use their parent ring background. Saved version-2 highlighted subcategory events keep their previous colour as explicit overrides during migration. The event editor offers a subcategory picker; JSON preserves child names/colours, and CSV carries a `subcategory` column (name or ID). Old conference CSV colours `midblue`, `darkblue`, `midpurple` and `darkpurple` map to these child palettes automatically.
- Two-ring imports visibly uncheck and mark the unused category Disabled. The two remaining checked boxes cannot be unchecked until another ring is enabled; the unused checkbox remains clickable to restore it. Explicit ring choices survive later settings changes.
- Custom colour picker with a hue/saturation wheel, brightness slider, original palette swatches and hex/name entry. Changes apply only with Apply colour; Cancel and Escape discard them. Works for categories, subcategories, highlighted weeks and custom event colours; pointer/touch and keyboard controls are supported.
- Multiple groups of coloured highlighted weeks (red by default). Later groups override earlier ones.
- Saturated month colours retain the original intensity and progress from reddish purple in September through purple and blue to bluish green in March, shared by SVG and LaTeX.
- Inclusive ISO week spans in both SVG and LaTeX; LaTeX uses the same fixed overlap lanes as SVG: full ring height for isolated events, halves for groups requiring two lanes, thirds for three, and so on.
- Correct 52/53-week ISO calendars, actual month boundaries and clipped partial-year spans.
- Overlapping SVG events keep their lane height for the full event duration; isolated events use full-width slices. Automatic labels follow the configured ring thresholds. Month and week labels also follow their ring tangent. Event names appear without automatic numbering in both the SVG and event list. Tiny slices omit text when it cannot fit; hover/click still exposes the full name. LaTeX retains the original wheelchart style while sharing the same fixed overlap lanes.
- Reset defaults beside Clear events restores default category order, names, palettes and label size while preserving events, dates, highlighted weeks and the centre label. Event rows use compact screen spacing; print spacing is retained.
- Click the unscheduled count below the wheel to open Events filtered to unscheduled items. The schedule filter offers All events, Scheduled and Unscheduled and combines with search/category filters.
- Local browser storage, complete JSON backup/restore and CSV import/export. Nothing is synced between browsers.
- Export menu begins with Download .tex and Open in Overleaf. The Overleaf action posts the current UTF-8 source to the documented https://www.overleaf.com/docs endpoint in a new tab using encoded_snip, without a public file upload. It creates a new Overleaf project; it does not update an existing project.
- Vector SVG overview export and original-style standalone `wheelchart` LaTeX export for pdfLaTeX in Overleaf. The TeX uses the supplied main.tex geometry, original named palette and the shared saturated month gradient, rotated full event labels, date/week rings and arrow-shaped months. Category settings and week highlight groups are applied to the template. Two categories omit the smallest ring. The SVG remains the simpler clickable overview.
- Download .tex generates source immediately. Open in Overleaf posts that same source directly; the app never runs a TeX compiler.
- Browser Print / Save as PDF with the wheel and unfiltered event list.

## CSV compatibility
Columns: `name,category,subcategory,start,end,color,notes`. Only `name` is required. `start` and `end` accept ISO week numbers or ISO calendar dates (`YYYY-MM-DD`); older day-first date formats remain importable. Dates are converted to their ISO week in the selected ISO year; mismatched ISO years are rejected. End weeks are inclusive: 2–4 covers all three weeks. A blank end means the start week; blank start/end keeps an unscheduled event. An end without a start is rejected. Names preserve quoted line breaks. Notes are excluded from wheel labels.

Category/subcategory values accept names or IDs; blank category uses the first enabled category and its palette. Up to three category names are inferred on import. Blank colour inherits the category/subcategory Event colour; legacy `highlight` uses the same Event colour. Colours also accept hex, standard CSS names and original wheel palette names. Original aliases retain their original values; old conference blue/purple aliases are mapped to subcategories. CSV exports preserve inheritance tokens; JSON backups preserve settings, palettes, ring order and highlighted-week groups.

Legacy `date`, `end_date`, `duration_weeks` headers remain accepted, with inclusive end semantics and explicit end taking precedence over duration. CSV imports replace by default and confirm before replacing existing events; uncheck Replace to append. Semicolons, quoted commas/newlines and empty separator rows are supported. Invalid imports are rejected atomically. Duplicate headers are rejected.

The built-in example and CSV template demonstrate all three categories, Blue/Purple subcategories, event-colour inheritance, named/hex colours, overlapping ranges, multiline labels, ISO dates, notes and unscheduled events. The built-in example also sets two highlighted-week groups; the CSV template contains events only. Example dates use the selected year. `examples/yearwheeltest.csv` is the migrated 2026 user test calendar, with the three old 2–5 ranges corrected to inclusive 2–4.


## Export limitations
The PDF option opens the browser print dialog. Download LaTeX for consistent vector PDF compilation in Overleaf (pdfLaTeX). Latin text including Danish characters is supported by the pdfLaTeX export; arbitrary scripts or emoji may require another TeX engine/font setup. The SVG overview may shorten or number dense labels. LaTeX exports full names, keeps explicit `\\` and actual newline breaks, and merges same-week labels with line breaks. TeX wraps point labels using the ring’s available width and its own font metrics, with extra break opportunities after slashes. Crowded labels reduce font size to fit the week’s available height. The event editor accepts multiline names; export wrapping never changes the saved event names. Notes remain in the editor and CSV/JSON exports. The standalone PDF contains only the wheel.

## Regression checks
Run `node tests/regression.cjs` for calendar, colour, category, two-ring geometry, inheritance, highlight-group, modal, roundtrip and replace/append checks, plus original wheelchart geometry, multiline/full event labels, fixed proportional span heights, range-local slice indices, 52/53-week dates, disabled-category exclusion, reorder behavior and identical Overleaf/download source. Set `YEARWHEEL_QA_TEX=/absolute/path/test.tex` to generate the representative two-ring export for pdfLaTeX QA.

## GitHub Pages

The `Test and deploy GitHub Pages` workflow checks the JavaScript and runs regression tests, then publishes `dist/` after pushes to `main`. Pull requests run checks without deploying. In repository Settings → Pages, choose **GitHub Actions** as the source.

Local preview: `python3 -m http.server 8000 --directory dist`, then visit http://localhost:8000/.

Plans are saved per browser and website origin. To move a plan from the existing hosted site to GitHub Pages, export its JSON backup on the old site and import it on the new site.

Settings can be resized horizontally; text and controls enlarge with the panel. Drag the divider, use arrow keys (Shift for larger steps), or double-click to reset. Width is remembered on the device.

Overlapping events keep a constant lane and proportional height throughout each overlap group in the SVG and TeX. Automatic text orientation switches full-height labels to tangential at 2 weeks in the outer ring, 4 in the middle, and 6 in the inner ring. Settings can force standard radial or tangential labels; JSON backups retain the choice.
