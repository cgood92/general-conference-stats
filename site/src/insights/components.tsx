import React from "react";
import { Talk } from "./analysis";

export function Source({
  talk,
  excerpt,
  children,
}: {
  talk: Talk;
  excerpt?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="insight-source">
      {excerpt && <blockquote>{excerpt}</blockquote>}
      <a href={talk.url} target="_blank" rel="noreferrer">
        {talk.title} ↗
      </a>
      <span>
        {talk.speaker} · {talk.session}
      </span>
      {children}
    </div>
  );
}
export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="insight-empty">{children}</p>;
}
export function Section({
  id,
  title,
  description,
  methodology,
  tag,
  children,
}: {
  id: string;
  title: string;
  description: string;
  methodology: string[];
  tag?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="insight-section" id={id}>
      <div className="insight-section-heading">
        <h2>{title}</h2>
        {tag && <span className="insight-tag">{tag}</span>}
        <details className="insight-section-methodology">
          <summary aria-label={`How this works: ${title}`}>
            How this works
          </summary>
          <div>
            {methodology.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </details>
      </div>
      <p className="insight-description">{description}</p>
      {children}
    </section>
  );
}
export function Sparkline({
  values,
  label,
}: {
  values: (number | null)[];
  label: string;
}) {
  const valid = values.filter((v): v is number => v != null);
  const max = Math.max(1, ...valid);
  const segments: string[] = [];
  let current = "";
  values.forEach((v, i) => {
    if (v == null) {
      if (current) segments.push(current);
      current = "";
    } else
      current += `${(i / Math.max(1, values.length - 1)) * 140},${
        35 - (v / max) * 30
      } `;
  });
  if (current) segments.push(current);
  const last = values[values.length - 1];
  return (
    <svg
      className="insight-sparkline"
      viewBox="0 0 145 42"
      role="img"
      aria-label={label}
    >
      <title>{label}</title>
      <line x1="0" x2="140" y1="36" y2="36" stroke="#e2e7f0" />
      {segments.map((points, i) => (
        <polyline
          key={i}
          points={points}
          fill="none"
          stroke="#5973b7"
          strokeWidth="2"
        />
      ))}
      {last != null && (
        <circle cx="140" cy={35 - (last / max) * 30} r="3" fill="#c8893a" />
      )}
    </svg>
  );
}
export function Evidence({
  talks,
  term,
  baseline = [],
}: {
  talks: Talk[];
  term: string;
  baseline?: Talk[];
}) {
  const matches = talks.filter((t) => t.terms[term] > 0);
  const examples = matches.length
    ? matches
    : baseline.filter((t) => t.terms[term] > 0);
  return (
    <details className="insight-evidence">
      <summary>See supporting talks</summary>
      {!matches.length && (
        <p className="insight-note">
          No mentions in the selected talks.
          {examples.length > 0 && " Examples from the comparison baseline:"}
        </p>
      )}
      {examples.slice(0, 8).map((t) => (
        <Source key={t.id} talk={t}>
          <small>
            {t.terms[term]} {t.terms[term] === 1 ? "mention" : "mentions"}
          </small>
        </Source>
      ))}
    </details>
  );
}
