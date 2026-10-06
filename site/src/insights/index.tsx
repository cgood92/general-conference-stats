import React, { useEffect, useMemo, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Conference,
  Comparison,
  languageInsights,
  selectBaseline,
  termHistory,
  trendShifts,
  aggregate,
  sharedLanguage,
} from "./analysis";
import { Section, Source, Empty, Sparkline, Evidence } from "./components";
import { loadAnalysis } from "./loadIndex";
import ReferencePanel from "./ReferencePanel";
import { methodologies } from "./methodologies";
import "./index.css";

type Index = {
  conferences: Conference[];
};
const name = (key: number) =>
  `${key % 1 ? "October" : "April"} ${Math.floor(key)}`;
const comparisonLabels: Record<Comparison, string> = {
  all: "All other conferences",
  past: "Only past conferences",
  session: "Same session type",
  previous: "Previous conference",
};
const links = [
  ["language", "Distinctive language"],
  ["shifts", "Trend shifts"],
  ["shared", "Shared emphasis"],
  ["references", "Scriptures & people"],
  ["invitations", "Invitations & blessings"],
];
type Finding = ReturnType<typeof languageInsights>[number];
function diverse<T extends { term: string }>(rows: T[], limit = 8): T[] {
  const result: T[] = [];
  for (const row of rows) {
    if (
      !result.some(
        (r) => r.term.includes(row.term) || row.term.includes(r.term)
      )
    )
      result.push(row);
    if (result.length === limit) break;
  }
  return result;
}
export default function Insights() {
  const detailCache = useRef(new Map<number, Conference>());
  const [detail, setDetail] = useState<Conference | null>(null);
  const [index, setIndex] = useState<Index | null>(null),
    [error, setError] = useState("");
  const [params, setParams] = useSearchParams();
  useEffect(() => {
    const controller = new AbortController();
    loadAnalysis<Index>("insights-index.json", controller.signal)
      .then(setIndex)
      .catch((e) => {
        if (e.name !== "AbortError")
          setError(
            "The analysis index could not be loaded. Refresh to try again."
          );
      });
    return () => controller.abort();
  }, []);
  const key =
    index &&
    index.conferences.some((c) => c.key === Number(params.get("conference")))
      ? Number(params.get("conference"))
      : index?.conferences.slice(-1)[0].key || 0;
  const rawMode = params.get("compare") || "all";
  const mode: Comparison = Object.keys(comparisonLabels).includes(rawMode)
    ? (rawMode as Comparison)
    : "all";
  const rawSession = params.get("session") || "";
  const sessions = index
    ? Array.from(
        new Set(
          index.conferences
            .find((c) => c.key === key)
            ?.talks.map((t) => t.session)
        )
      )
    : [];
  const session = sessions.includes(rawSession) ? rawSession : "";
  const update = (values: Record<string, string>) => {
    const next = new URLSearchParams(params);
    Object.entries(values).forEach(([k, v]) =>
      v ? next.set(k, v) : next.delete(k)
    );
    setParams(next);
  };
  useEffect(() => {
    if (!index) return;
    const cached = detailCache.current.get(key);
    if (cached) {
      setDetail(cached);
      return;
    }
    const controller = new AbortController();
    loadAnalysis<Conference>(`insights/${key}.json`, controller.signal)
      .then((value) => {
        detailCache.current.set(key, value);
        setDetail(value);
      })
      .catch((e) => {
        if (e.name !== "AbortError")
          setError(
            "The conference evidence could not be loaded. Refresh to try again."
          );
      });
    return () => controller.abort();
  }, [index, key]);
  const target = useMemo(
    () =>
      (detail?.key === key ? detail.talks : []).filter(
        (t) => !session || t.session === session
      ),
    [detail, key, session]
  );
  const baseline = useMemo(
    () => (index ? selectBaseline(index.conferences, key, mode, session) : []),
    [index, key, mode, session]
  );
  const findings = useMemo(
    () => languageInsights(target, baseline),
    [target, baseline]
  );
  const a = useMemo(() => aggregate(target), [target]);
  const b = useMemo(() => aggregate(baseline), [baseline]);
  const shifts = useMemo(
    () =>
      index
        ? trendShifts(
            index.conferences,
            key,
            session,
            findings
              .filter((f) => f.count >= 2 || f.baselineRate > 1)
              .map((f) => f.term)
          )
        : [],
    [index, key, session, findings]
  );
  if (error)
    return (
      <main className="insights-page">
        <h1>Conference Insights</h1>
        <Empty>{error}</Empty>
      </main>
    );
  if (!index || detail?.key !== key)
    return (
      <main className="insights-page">
        <div className="insight-eyebrow">CONFERENCE INSIGHTS</div>
        <h1>Looking beneath the surface…</h1>
        <p>
          {index
            ? `Loading source passages for ${name(key)}.`
            : "Loading the archive’s precomputed language and references."}
        </p>
        <div className="insight-loading" />
      </main>
    );
  const up = diverse(
    findings
      .filter((f) => f.count >= 3 && f.score > 0)
      .sort((a, b) => b.score - a.score)
  );
  const down = diverse(
    findings
      .filter((f) => f.score < 0 && f.baselineTalks >= 5)
      .sort((a, b) => a.score - b.score)
  );
  const shared = diverse(
    sharedLanguage(target, baseline)
      .filter((f) => f.talks >= Math.min(3, target.length))
      .sort((a, b) => b.talks - a.talks || b.count - a.count),
    12
  );
  const invitations = target.flatMap((t) =>
    t.invitations.map((invitation) => ({ talk: t, invitation }))
  );
  const words = a.words.toLocaleString();
  const row = (finding: Finding) => {
    const history = termHistory(
      index.conferences.filter((c) => c.key <= key).slice(-12),
      finding.term,
      session
    );
    const delta =
      finding.ratio == null
        ? "No baseline mentions"
        : finding.ratio >= 1
        ? `${finding.ratio.toFixed(1)}× baseline`
        : `${Math.round((1 - finding.ratio) * 100)}% below baseline`;
    return (
      <div className="insight-language-row" key={finding.term}>
        <div>
          <strong>{finding.term}</strong>
          <span className={finding.score >= 0 ? "insight-up" : "insight-down"}>
            {delta}
          </span>
          <small>
            {finding.count} mentions · {finding.talks}/{target.length} talks
          </small>
        </div>
        <div className="insight-rate">
          <strong>{finding.rate.toFixed(2)}</strong>
          <span>vs {finding.baselineRate.toFixed(2)} / 10k words</span>
          <Sparkline
            values={history.map((h) => h.rate)}
            label={`${finding.term}, mentions per 10,000 words over the last ${
              history.length
            } conferences through ${name(key)}`}
          />
        </div>
        <Evidence talks={target} term={finding.term} baseline={baseline} />
      </div>
    );
  };
  return (
    <main className="insights-page">
      <header className="insights-hero">
        <div>
          <div className="insight-eyebrow">READ BETWEEN THE LINES</div>
          <h1>Conference Insights</h1>
          <p>
            What stood out, what shifted, and how this conference connects to
            the past.
          </p>
        </div>
        <span className="insight-experimental">Exploratory analysis</span>
      </header>
      <p className="insight-warning insight-disclaimer" role="note">
        Insights is new and unverified - this page is 100% vibe coded and needs
        to be double checked
      </p>
      <div className="insight-selectors">
        <label>
          Conference
          <select
            value={key}
            onChange={(e) =>
              update({ conference: e.target.value, session: "" })
            }
          >
            {index.conferences
              .slice()
              .reverse()
              .map((c) => (
                <option key={c.key} value={c.key}>
                  {name(c.key)}
                </option>
              ))}
          </select>
        </label>
        <label>
          Session
          <select
            value={session}
            onChange={(e) => update({ session: e.target.value })}
          >
            <option value="">Whole conference</option>
            {sessions.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label>
          Compare with
          <select
            value={mode}
            onChange={(e) => update({ compare: e.target.value })}
          >
            {Object.entries(comparisonLabels).map(([k, label]) => (
              <option key={k} value={k}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="insight-baseline">
        {name(key)}
        {session ? ` · ${session}` : ""} · {target.length} talks · {words} words{" "}
        <span>
          Compared with {baseline.length.toLocaleString()} talks /{" "}
          {b.words.toLocaleString()} words
          {mode === "session"
            ? session
              ? ` from ${session}`
              : " from matching session types"
            : session
            ? " from the same selected session"
            : ""}
          .
        </span>
      </p>
      {!baseline.length && (
        <div className="insight-warning">
          There are no comparable talks for this selection. Historical
          comparisons are hidden rather than treating missing data as zero
          mentions.
        </div>
      )}
      <nav className="insight-jump-links" aria-label="Insight sections">
        {links.map(([id, label]) => (
          <a
            key={id}
            href={`#${id}`}
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById(id)
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            {label}
          </a>
        ))}
      </nav>
      <Section
        id="language"
        methodology={methodologies.language}
        title="What made this conference distinctive?"
        description="Language that stood out against your selected baseline. Rates account for conference length; small-count changes are moderated before ranking."
      >
        <div className="insight-two-columns">
          <div>
            <h3>More prominent</h3>
            {up.length ? (
              up.map(row)
            ) : (
              <Empty>No increased language meets the evidence threshold.</Empty>
            )}
          </div>
          <div>
            <h3>Less prominent</h3>
            {down.length ? (
              down.map(row)
            ) : (
              <Empty>No decreased language meets the evidence threshold.</Empty>
            )}
          </div>
        </div>
      </Section>
      <Section
        id="shifts"
        methodology={methodologies.shifts}
        title="A change in direction"
        description="Language whose latest move goes against its trend across the preceding six conferences. These are descriptive reversals, not predictions or statistically confirmed turning points."
        tag="Past conferences"
      >
        {shifts.length ? (
          <div className="insight-card-grid">
            {diverse(shifts, 8).map((s) => (
              <article className="insight-card" key={s.term}>
                <span className="insight-mini-label">
                  {s.slope > 0
                    ? "RISING TREND, LATEST DIP"
                    : "FALLING TREND, LATEST REBOUND"}
                </span>
                <h3>{s.term}</h3>
                <Sparkline
                  values={s.history.map((h) => h.rate)}
                  label={`${s.term}: historical trend reversal`}
                />
                <p>
                  Latest change: {s.change > 0 ? "+" : ""}
                  {s.change.toFixed(2)} mentions / 10k words.
                </p>
                <Evidence talks={target} term={s.term} />
              </article>
            ))}
          </div>
        ) : (
          <Empty>
            No clear reversals meet the change threshold. At least five
            conferences with comparable session text are needed.
          </Empty>
        )}
      </Section>
      <Section
        id="shared"
        methodology={methodologies.shared}
        title="Shared emphasis across talks"
        description="Repetition and breadth tell different stories. These terms appeared across the most talks, rather than simply accumulating mentions in a single address."
      >
        {shared.length ? (
          <div className="insight-shared-grid">
            {shared.map((f) => (
              <article key={f.term}>
                <div>
                  <strong>{f.term}</strong>
                  <span>
                    {f.talks}/{target.length} talks
                  </span>
                </div>
                <div className="insight-progress">
                  <span
                    style={{ width: `${(f.talks / target.length) * 100}%` }}
                  />
                </div>
                <small>
                  {f.count} mentions ·{" "}
                  {baseline.length
                    ? `${((f.baselineTalks / baseline.length) * 100).toFixed(
                        0
                      )}% of baseline talks`
                    : "No comparison available"}
                </small>
                <Evidence talks={target} term={f.term} />
              </article>
            ))}
          </div>
        ) : (
          <Empty>No shared terms were found for this selection.</Empty>
        )}
      </Section>
      <Section
        id="references"
        methodology={methodologies.references}
        title="The scripture and quotation fingerprint"
        description="Discover which passages and people were referenced, how widely they appeared, and where the attribution comes from."
      >
        <ReferencePanel talks={target} baseline={baseline} />
      </Section>
      <Section
        id="invitations"
        methodology={methodologies.invitations}
        title="Invitations and promised blessings"
        description="Explicit invitations to act, paired with nearby language about blessings when present. The nearby passage is shown so you can judge the connection; proximity alone does not establish a promise."
        tag="Text extraction"
      >
        {invitations.length ? (
          <div className="insight-card-grid">
            {invitations.slice(0, 12).map(({ talk, invitation }, i) => (
              <article className="insight-card" key={`${talk.id}-${i}`}>
                <h3>{talk.speaker}</h3>
                <Source talk={talk} excerpt={invitation.excerpt} />
                {invitation.blessing ? (
                  <div className="insight-blessing">
                    <span>Nearby blessing language</span>
                    <p>{invitation.blessing}</p>
                  </div>
                ) : (
                  <small className="insight-muted">
                    No explicit blessing language found nearby.
                  </small>
                )}
              </article>
            ))}
          </div>
        ) : (
          <Empty>
            No explicit invitations matched the extraction patterns.
          </Empty>
        )}
      </Section>
      <details className="insight-methodology">
        <summary>Archive coverage and word counting</summary>
        <p>
          Language is lowercased, punctuation is normalized, and common function
          words are removed from the discovery vocabulary. Phrases span two to
          four words and never cross sentence boundaries. A vocabulary threshold
          excludes one-off spelling errors and keeps the static index
          manageable. Counts describe this stored English archive, not every
          spoken word.
        </p>
        <p>
          Conference texts with missing content are excluded. Session
          comparisons match stored session labels exactly; sessions that did not
          exist in a baseline are not treated as zero-use conferences. Nearby
          blessing language remains exploratory.
        </p>
      </details>
    </main>
  );
}
