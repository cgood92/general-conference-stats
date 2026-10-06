import React, { useState } from "react";
import { Talk, Reference } from "./analysis";
import { Source, Empty } from "./components";
export default function ReferencePanel({
  talks,
  baseline,
}: {
  talks: Talk[];
  baseline: Talk[];
}) {
  const [kind, setKind] = useState<"scripture" | "person">("scripture"),
    [onlyQuotes, setOnlyQuotes] = useState(true);
  const accept = (r: Reference) =>
    r.kind === kind &&
    (kind !== "person" || !onlyQuotes || r.relation !== "mentions");
  const ranked = new Map<
    string,
    {
      count: number;
      talkIds: Set<number>;
      examples: { talk: Talk; reference: Reference }[];
    }
  >();
  talks.forEach((t) =>
    t.references.filter(accept).forEach((reference) => {
      const row = ranked.get(reference.label) || {
        count: 0,
        talkIds: new Set<number>(),
        examples: [],
      };
      row.count++;
      row.talkIds.add(t.id);
      row.examples.push({ talk: t, reference });
      ranked.set(reference.label, row);
    })
  );
  const baselineCounts = new Map<string, Set<number>>();
  baseline.forEach((t) =>
    t.references.filter(accept).forEach((r) => {
      const ids = baselineCounts.get(r.label) || new Set<number>();
      ids.add(t.id);
      baselineCounts.set(r.label, ids);
    })
  );
  const rows = Array.from(ranked.entries()).sort(
    (a, b) => b[1].talkIds.size - a[1].talkIds.size || b[1].count - a[1].count
  );
  const coverage = talks.filter(
    (t) => t.referenceCoverage === "source checked"
  ).length;
  return (
    <>
      <div className="insight-inline-controls">
        <div className="insight-segmented">
          <button
            aria-pressed={kind === "scripture"}
            onClick={() => setKind("scripture")}
          >
            Scriptures
          </button>
          <button
            aria-pressed={kind === "person"}
            onClick={() => setKind("person")}
          >
            People
          </button>
        </div>
        {kind === "person" && (
          <label>
            <input
              type="checkbox"
              checked={onlyQuotes}
              onChange={(e) => setOnlyQuotes(e.target.checked)}
            />{" "}
            Only attributed quotations and footnote citations
          </label>
        )}
      </div>
      <p className="insight-note">
        Source pages checked for {coverage} of {talks.length} selected talks.
        Inline scripture links and footnotes are preserved separately from the
        cleaned talk text.{" "}
        {kind === "person"
          ? "Person attribution is automatically extracted; expand an entry to inspect its wording."
          : "Explicit chapter/verse references and linked footnote citations are counted; uncredited allusions are not."}
      </p>
      {coverage < talks.length && (
        <p className="insight-warning">
          Some source pages could not be fully checked. These results may be
          incomplete; missing references are not evidence that a talk cited
          none.
        </p>
      )}
      {rows.length ? (
        <div className="insight-reference-list">
          {rows.slice(0, 12).map(([label, row], i) => {
            const spread = (row.talkIds.size / talks.length) * 100,
              prior =
                ((baselineCounts.get(label)?.size || 0) /
                  Math.max(1, baseline.length)) *
                100;
            return (
              <details key={label}>
                <summary>
                  <span className="insight-rank">{i + 1}</span>
                  <strong>{label}</strong>
                  <span>
                    {row.count} {row.count === 1 ? "reference" : "references"} ·{" "}
                    {row.talkIds.size}{" "}
                    {row.talkIds.size === 1 ? "talk" : "talks"}
                  </span>
                  <span className="insight-muted">
                    {baseline.length
                      ? `${spread.toFixed(0)}% of talks vs ${prior.toFixed(
                          1
                        )}% baseline`
                      : "No comparison available"}
                  </span>
                </summary>
                <div className="insight-reference-evidence">
                  {row.examples.slice(0, 6).map(({ talk, reference }, j) => (
                    <Source key={j} talk={talk} excerpt={reference.excerpt}>
                      <small>
                        {reference.relation}
                        {reference.source && (
                          <>
                            {" "}
                            ·{" "}
                            <a
                              href={reference.source}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Open reference ↗
                            </a>
                          </>
                        )}
                      </small>
                    </Source>
                  ))}
                </div>
              </details>
            );
          })}
        </div>
      ) : (
        <Empty>
          No explicit{" "}
          {kind === "scripture"
            ? "scripture references"
            : "person attributions"}{" "}
          were extracted from these talks.
        </Empty>
      )}
    </>
  );
}
