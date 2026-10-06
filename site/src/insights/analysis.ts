export type Reference = {
  label: string;
  kind: "scripture" | "person";
  relation: string;
  excerpt: string;
  source?: string;
};
export type Invitation = { excerpt: string; blessing: string };
export type Talk = {
  id: number;
  session: string;
  words: number;
  terms: Record<string, number>;
  references: Reference[];
  invitations: Invitation[];
  title?: string;
  speaker?: string;
  url?: string;
  referenceCoverage?: string;
  referenceDiagnostics?: {
    noteCount?: number;
    noteAnchorCount?: number;
    unresolvedNoteIds?: string[];
    unmatchedNoteCount?: number;
  };
};
export type Conference = { key: number; talks: Talk[] };
export type Comparison = "all" | "past" | "session" | "previous";
export function selectBaseline(
  conferences: Conference[],
  key: number,
  mode: Comparison,
  session: string
): Talk[] {
  const prior = conferences
    .filter((c) => c.key < key)
    .sort((a, b) => b.key - a.key)[0]?.key;
  const selectedSessions = new Set(
    conferences.find((c) => c.key === key)?.talks.map((t) => t.session)
  );
  return conferences
    .filter(
      (c) =>
        c.key !== key &&
        (mode !== "past" || c.key < key) &&
        (mode !== "previous" || c.key === prior)
    )
    .flatMap((c) => c.talks)
    .filter((t) =>
      session
        ? t.session === session
        : mode !== "session" || selectedSessions.has(t.session)
    );
}
export function aggregate(talks: Talk[]) {
  const counts: Record<string, number> = {},
    spread: Record<string, number> = {};
  talks.forEach((t) =>
    Object.entries(t.terms).forEach(([term, count]) => {
      counts[term] = (counts[term] || 0) + count;
      if (count) spread[term] = (spread[term] || 0) + 1;
    })
  );
  return { counts, spread, words: talks.reduce((s, t) => s + t.words, 0) };
}
export function languageInsights(target: Talk[], baseline: Talk[]) {
  const a = aggregate(target),
    b = aggregate(baseline);
  if (!a.words || !b.words) return [];
  return Array.from(
    new Set([...Object.keys(a.counts), ...Object.keys(b.counts)])
  )
    .map((term) => {
      const count = a.counts[term] || 0,
        baselineCount = b.counts[term] || 0;
      const rate = (count / a.words) * 10000,
        baselineRate = (baselineCount / b.words) * 10000;
      // A half-count prior avoids infinite rankings from a single occurrence.
      const score =
        (Math.log((count + 0.5) / (a.words - count + 0.5)) -
          Math.log((baselineCount + 0.5) / (b.words - baselineCount + 0.5))) /
        Math.sqrt(1 / (count + 0.5) + 1 / (baselineCount + 0.5));
      return {
        term,
        count,
        baselineCount,
        rate,
        baselineRate,
        ratio: baselineRate ? rate / baselineRate : null,
        score,
        talks: a.spread[term] || 0,
        baselineTalks: b.spread[term] || 0,
      };
    })
    .filter(
      (x) => x.count >= 2 || (x.baselineRate >= 1 && x.baselineTalks >= 5)
    );
}
export function termHistory(
  conferences: Conference[],
  term: string,
  session: string
) {
  return conferences.map((c) => {
    const talks = c.talks.filter((t) => !session || t.session === session),
      stats = aggregateTerm(talks, term);
    return { key: c.key, ...stats };
  });
}
function aggregateTerm(talks: Talk[], term: string) {
  const count = talks.reduce((s, t) => s + (t.terms[term] || 0), 0),
    words = talks.reduce((s, t) => s + t.words, 0);
  return {
    count,
    rate: words ? (count / words) * 10000 : null,
    talks: talks.filter((t) => t.terms[term] > 0).length,
  };
}
export function trendShifts(
  conferences: Conference[],
  key: number,
  session: string,
  terms: string[]
) {
  const past = conferences
    .filter((c) => c.key <= key)
    .sort((a, b) => a.key - b.key)
    .slice(-7);
  if (past.length < 5) return [];
  return terms
    .map((term) => {
      const history = termHistory(past, term, session);
      if (history.some((h) => h.rate == null)) return null;
      const recent = history.slice(0, -1).map((h) => h.rate!),
        mean = recent.reduce((s, v) => s + v, 0) / recent.length;
      const xmean = (recent.length - 1) / 2;
      const slope =
        recent.reduce((s, v, i) => s + (i - xmean) * (v - mean), 0) /
        recent.reduce((s, _, i) => s + (i - xmean) ** 2, 0);
      const current = history[history.length - 1],
        previous = history[history.length - 2];
      const change = current.rate! - previous.rate!;
      return slope * change < 0 &&
        Math.abs(change) > Math.max(0.3, mean * 0.2) &&
        Math.abs(slope) > 0.1
        ? { term, slope, change, history }
        : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
}
export function sharedLanguage(target: Talk[], baseline: Talk[]) {
  const a = aggregate(target),
    b = aggregate(baseline);
  return Object.entries(a.counts).map(([term, count]) => ({
    term,
    count,
    talks: a.spread[term],
    baselineTalks: b.spread[term] || 0,
  }));
}
