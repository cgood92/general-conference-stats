# Growth and Conference Insights Implementation Plan

**Goal:** Build the approved exploratory features and run a preview.
**Architecture:** Static React with a reproducible offline analysis index. Normalize language by text length and show talk spread. Label inferred semantic and relationship results and link to source evidence.

## Approved scope
Growth totals, annual net additions, percentage growth, percentage-point change; optional trailing three-year smoothing. Insights includes distinctive language, rare appearances, returning language, trend shifts, shared emphasis, passage themes, scripture/person references, related conferences, familiar ideas in new wording, invitations/blessings and an evidence-backed relationship explorer. Comparison choices: all other conferences, past conferences, same session type, previous conference. Session selection is supported independently.

## Work
- [x] Test/implement growth transformations including gaps and zero denominators.
- [x] Test/implement comparison selection, normalized scores, rare terms and semantic evidence.
- [x] Generate a reproducible analysis index; enrich source references and document coverage.
- [x] Build all panels, selectors, evidence links and navigation.
- [x] Run tests and production build; inspect a running browser preview.
- [x] Leave the preview running for user review.

## Final scope after page review (October 6, 2026)

Retained distinctive language, trend shifts, shared emphasis, scripture/person references, and invitations/blessings. Removed rare appearances, returning language, related conferences, themes, semantic similarities, the relationship explorer, and the word/phrase search. Removed their supporting code and model dependencies. Added section methodology disclosures and the requested unverified-analysis disclaimer.

Growth explanations and summary help use plain language. Updated statistical reports through 2025. Reference extraction now preserves source evidence separately from cleaned word-count text; refreshed all 3,963 archived talks, rebuilt the fingerprint, and verified historical inline-link and modern footnote formats. See `analysis/README.md` for the current pipeline and limitations.
