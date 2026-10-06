# Conference analysis

The static Insights files are built from the stored English talk archive. The remaining features use word counts, source references, and invitation patterns. No semantic model, embeddings, theme categories, or model dependencies remain.

## Import and rebuild

- `yarn run case2` fetches conference listings and talk HTML, stores cleaned text **and separate structured reference evidence**, then rebuilds Insights. Python 3 is required; analysis uses only its standard library.
- `yarn run case2 --references-only` refreshes missing, outdated, or incomplete reference evidence for existing talks without changing their word-count text, then rebuilds Insights. Successfully checked evidence is reused, so this command is resumable. Six source pages are fetched concurrently; requests time out after 20 seconds and retry on fetch/HTTP failures.
- `yarn run case2:web` rebuilds Insights from the stored archive without network access.

`site/public/insights-index.json` contains comparison summaries. `site/public/insights/{conference}.json` contains selected-conference source excerpts. Each has a precompressed `.gz` copy. Raw scraper evidence is not shipped as Insights assets. The existing search bundle keeps talk text; its JSON loader omits structured reference evidence.

## Source extraction and verification

`case2/getTalkReferences.js` parses the original HTML before text cleaning. It retains:

- Canonical inline scripture links, including abbreviated labels used in older talks.
- Numbered footnotes and all their links, citation text, and linked body paragraphs. Both `sup > a` and `a.note-ref > sup` forms are supported; repeated anchors retain separate contexts.
- Body reference text with `<cite>` titles intact. Word-count text excludes note markers, images and scripts; footnotes stay separate so they do not inflate language counts.
- Coverage diagnostics: note/anchor counts, unresolved note IDs, and notes without body contexts. A missing body is unavailable; unresolved anchors mark partial coverage. A checked page with no footnotes is not described as recovered footnotes.

Live source samples fetched on October 6, 2026 from 1971, 1980, 1990, 2000, 2010, 2020 and 2026 are retained as reduced HTML fixtures in `case2/fixtures/references-{year}.html`. The early samples use inline references; later samples use numbered notes. Automated regression tests exercise each format. The current archive starts in 1971, not 1970.

Scripture labels are resolved from canonical book/chapter/verse URLs, including numbered books, nonbreaking spaces, verse ranges and lists. Text references supplement links. Equivalent link/text variants within one citation context count once; other verses from the same chapter are retained. When a link points to a scripture footnote or omits its verse anchor, explicit display verses supply the missing information. Joseph Smith Translation references stay distinct from ordinary Bible verses. Genuine chapter-only references stay chapter-only. Distinct citation contexts can count again. Source links and the quoted body paragraph (or note text when no paragraph is available) are displayed.

People extraction recognizes full names from the archive’s speaker roster, historical Church leaders, and a small additional author list. An explicit link to an archived talk identifies its speaker. Forward and backward quotation attributions are distinguished from ordinary name mentions; a quotation in a later sentence is not assigned to an earlier name. Bibliographic author names are distinguished from people mentioned inside a quoted passage. Footnote citations are **not necessarily verbatim quotations**. Unnamed attributions, unlinked abbreviations, and authors outside the roster can still be missed. This is not an exhaustive catalog of every quotation or scripture allusion.

## Interpretation

- Distinctiveness uses half-count-smoothed log odds divided by its approximate standard error: a discovery ranking, not a hypothesis test.
- Word rates are per 10,000 stored words. Breadth counts talks with at least one mention. Baselines exclude the selected conference; session comparisons match stored labels exactly.
- Unigrams require three archive-wide occurrences. Two-to-four-word phrases require six occurrences across two talks; the 6,500 most widely distributed phrases are retained. Phrases do not cross sentences or paragraphs.
- Trend reversals compare the latest change with the preceding six conference positions and are descriptive.
- Invitations match explicit wording patterns; nearby blessing language is a candidate association, not a verified promise.

## Checks

```sh
python3 -m unittest discover -s analysis
npm test -- --runInBand case2/
CI=true npm test --prefix site -- --watch=false --runInBand
npm run build --prefix site
```
