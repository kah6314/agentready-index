# AgentReady Index (site)

Static site ranking how agent-friendly 21 commerce platforms are. Plain HTML/CSS/JS; `index.html` and `changes.html` fetch `data/*.json`, so serve over HTTP:

    cd site && python3 -m http.server 8000

Status: **preliminary**. Footer date is hard-coded in each page; update it on each release.

## Layout
- `data/sites.json` - one record per platform: subscores (bot_access, agent_checkout, structured_paths, email, sms, live_chat, book_online), total, evidence links, notes
- `data/changelog.json` - newest-first release notes (shown on `changes.html`)
- `data/evidence.csv`, `data/raw/robots_*.txt` - crawl evidence. Some platforms have no raw robots file on purpose (united, hyatt, resy: timeout/HTML/duplicate)
- `../tools/build_data.py` - regenerates the JSON from `../evidence.csv` (scores are hand-entered in that script)

## Weekly update routine
1. **Re-crawl** (same day each week): curl each URL in `targets.txt` with the same bot UA; record home status/bytes, robots status, GPTBot/ClaudeBot full-disallow count, AI-agent mentions into a new `evidence.csv`; save `robots_<id>.txt`.
2. **Validate raw files**: robots must be plain text (not HTML), must not duplicate another site's file, and timeouts (status 000) get no robots evidence. Retry timeouts/429/403 once from a different network before scoring them low.
3. **Re-score**: update the score table in `tools/build_data.py`. Bot access follows the new crawl; the other six dimensions change only when a public source (docs, announcement, help page) supports it. Stay conservative when unsure and re-check each cited doc URL still resolves.
4. **Rebuild**: copy the new `evidence.csv` and valid robots files into `site/data/` (`raw/`), run `python3 -I tools/build_data.py <repo-root>`, bump the `date` fields.
5. **Changelog**: prepend an entry to `data/changelog.json` (score moves, new evidence, data issues).
6. **Footer + status**: update "last updated" in all pages; keep status `preliminary` until the rubric is reviewed.
7. **Smoke test**: serve locally, check sort, filter, expand rows, mobile width, and that evidence links open.

## Notes
- The email signup on the home page is a disabled placeholder (no backend).
- `build_data.py` regenerates `changelog.json` with the initial entry only; after the first release, edit the changelog by hand or change the script to append.
