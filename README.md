# Yearwheel JS

Browser-based replacement for the supplied R/Shiny annual wheel generator. No build step, server, Python or TeX installation is needed to use the editor. Serve `dist/` as static assets.

## Features
- Separate Wheel and Events tabs, with keyboard navigation. Event editing, search and category filters are available in the Events tab. Printing still includes both views.
- Click any event row to edit its name, dates, category, colour and notes in a modal.
- Category settings use compact rows with an enable checkbox, editable name, and Normal/Highlight colour circles. Click either circle to open its native colour picker. Categories and the event category picker read from outside to inside. Drag a category handle to reorder its ring; touch dragging and arrow-key reordering are supported. The order is retained in local saves and JSON backups, including disabled categories. Defaults match the original R source palette. Blank event colours inherit normal; `highlight` inherits highlighted. Category-colour edits update all inheriting events.
- Use two or three category rings. A plan using exactly two categories omits the smallest inner ring; categories can be disabled in settings even when they contain events. Their events remain editable, marked Disabled in the list and appendix, and are excluded from the wheel. Re-enabling restores them.
- Multiple groups of coloured highlighted weeks (red by default). Later groups override earlier ones.
- Light month colours progress from reddish purple in September through purple and blue to bluish green in March.
- Inclusive ISO week spans.
- Correct 52/53-week ISO calendars, actual month boundaries and clipped partial-year spans.
- Dynamic collision-free event lanes in each category; numbered wheel labels refer to the full event list.
- Local browser storage, complete JSON backup/restore and CSV import/export. Nothing is synced between browsers.
- Export menu begins with Download .tex and Open in Overleaf. The Overleaf action posts the current UTF-8 source to the documented https://www.overleaf.com/docs endpoint in a new tab using encoded_snip, without a public file upload. It creates a new Overleaf project; it does not update an existing project.
- Vector SVG export and self-contained TikZ/LaTeX export for pdfLaTeX in Overleaf. LaTeX includes a full event list with notes.
- Browser Print / Save as PDF with the wheel and unfiltered event list.

## CSV compatibility
Columns: `category,date,end_date,duration_weeks,name,color,notes`. `date` is the start ISO week number or a calendar date (`YYYY-MM-DD`, `DD-MM-YYYY`, `DD/MM/YYYY` or `DD.MM.YYYY`). Calendar dates are converted to their ISO week in the selected ISO year. A mismatched ISO year is reported instead of silently placing an event in another year. `end_date` takes precedence over inclusive duration. The default category IDs are `activity`, `funding`, `conference`. CSV also accepts renamed category labels and up to three custom category names. Missing category values use the first enabled category. CSV replacement imports infer names for new categories; JSON backups retain all category settings. Blank end/duration means a one-week event. Blank start/end/duration preserves an unscheduled event, editable using “Date not yet decided”. Empty CSV separator rows are ignored. Colours accept `#RRGGBB`, `#RGB`, the 148 standard CSS colour names, original non-standard palette aliases such as `midpurple`, or `highlight`. Standard CSS colour names use their standard values. A blank colour inherits the category normal colour. CSV export retains inheritance tokens and category names; JSON retains the palette itself. CSV imports replace by default and ask for confirmation before replacing existing events. Uncheck Replace to append. Semicolon-separated CSV and quoted commas/newlines are accepted. Invalid imports are rejected without applying partial changes.

## Export limitations
The PDF option opens the browser print dialog. Download LaTeX for consistent vector PDF compilation in Overleaf (pdfLaTeX). Latin text including Danish characters is supported by the pdfLaTeX export; arbitrary scripts or emoji may require another TeX engine/font setup. Dense wheels shorten or number labels; complete names and notes remain in the event list.

## Validation
Verified the supplied `yearwheeltest.csv`: all 42 events retained, 35 scheduled and 7 unscheduled, with Danish characters, both calendar date formats, named colours and overlapping spans. Checked JSON and CSV round trips, malformed dates and ISO-year mismatch handling. Compiled and inspected all three pages of the imported plan’s LaTeX PDF. Checked JavaScript syntax, ISO-year boundaries, interval clipping, overlapping lanes, CSV round trips and malformed input, event validation and TeX escaping. Compiled full-year and partial-year exported LaTeX with pdfLaTeX and visually inspected the resulting wheel. Browser interaction QA was unavailable in the managed environment.

## Regression checks
Run `node tests/regression.cjs` for calendar, colour, category, two-ring geometry, inheritance, highlight-group, modal, roundtrip and replace/append checks. Set `YEARWHEEL_QA_TEX=/absolute/path/test.tex` to generate the representative two-ring export for pdfLaTeX QA.

## GitHub Pages

The `Test and deploy GitHub Pages` workflow checks the JavaScript and runs regression tests, then publishes `dist/` after pushes to `main`. Pull requests run checks without deploying. In repository Settings → Pages, choose **GitHub Actions** as the source.

Local preview: `python3 -m http.server 8000 --directory dist`, then visit http://localhost:8000/.

Plans are saved per browser and website origin. To move a plan from the existing hosted site to GitHub Pages, export its JSON backup on the old site and import it on the new site.
