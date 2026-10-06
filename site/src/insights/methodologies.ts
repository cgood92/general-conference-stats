export const methodologies: Record<string, string[]> = {
  language: [
    "These words and phrases are chosen automatically, not randomly or by hand. We compare mentions per 10,000 words in the selected talks with mentions per 10,000 words across the pooled comparison talks. This helps a long conference and a short session be compared fairly.",
    "We rank the strongest increases and decreases using smoothed log odds: the difference in relative frequency is moderated by how much evidence supports it, with a half-count added to soften tiny counts. More prominent requires at least three mentions here; Less prominent requires use in at least five comparison talks. Terms used fewer than twice here also need at least one baseline mention per 10,000 words. We show up to eight terms on each side and skip overlapping phrases to avoid repetitive results. This is a discovery ranking, not a statistical significance test.",
    "For example, ‘John’ can appear under Less prominent because its word rate is lower here than in the comparison talks and its score ranks among the strongest decreases. It counts the literal word wherever it occurs; it does not distinguish which John is meant or establish why the word was used. Supporting talks let you inspect the context. Sparklines show rates across the latest twelve conferences through the selected conference.",
  ],
  shifts: [
    "We look at the selected conference and up to six preceding conferences, using the selected session type when one is chosen. We fit a straight trend line to the earlier word rates, then find terms whose latest change goes in the opposite direction. This always looks backward, regardless of the comparison setting.",
    "At least five conferences with comparable text are needed. The earlier slope must exceed 0.1 mentions per 10,000 words per conference in either direction. The latest change must exceed both 0.3 mentions per 10,000 words and 20% of the earlier average. Results are ranked by the size of that latest change, with up to eight non-overlapping terms shown. These are observed reversals, not forecasts or confirmed turning points.",
  ],
  shared: [
    "Each talk contributes one vote for a term if it uses it at least once. Repeating a word many times in a single talk does not increase its reach. We rank terms first by the number of selected talks using them, then by total mentions, and show up to twelve without overlapping phrases.",
    "A term must appear in at least three selected talks, or every selected talk when fewer than three are available. The baseline percentage is the share of comparison talks using that term. This measures breadth of wording, not importance: common closing language can appear alongside substantive subjects.",
  ],
  references: [
    "Scriptures come from original inline scripture links, explicit chapter-and-verse references in the talk body, and source footnotes. Older talks often use abbreviated inline links; newer talks often use numbered footnotes. The scraper preserves both before cleaning the text. Reference links help normalize book names and verse ranges. A range is kept as one reference rather than divided into individual verses; different ranges can therefore appear separately. Unnamed allusions are not detected.",
    "People are recognized using the archive’s speaker names, historical Church leaders, and a small list of other quoted authors. A footnote link to another archived talk also identifies its speaker. This is a list of recognized people, not a complete catalog of every quoted author. The attributed-only option includes source footnote attributions and wording patterns that connect a name to a quotation; a footnote attribution does not always mean a verbatim quote. Ordinary name mentions, including people discussed inside quoted passages, are kept separate.",
    "We rank the top twelve references or people by the number of talks containing them, then by citation or mention count. Percentages compare the share of selected and baseline talks. Expanded entries show the source passages so you can check ambiguous names, attributions, and extraction gaps.",
  ],
  invitations: [
    "Text patterns look for explicit invitations such as ‘I invite,’ ‘we encourage,’ ‘I urge,’ or ‘please.’ We then search that sentence and the next three sentences for nearby wording about promises, blessings, peace, joy, healing, strength, or happiness.",
    "We retain up to six invitations per talk and display the first twelve in conference order, rather than ranking them by importance. The excerpt and nearby blessing language are shown together for inspection. Other ways of inviting can be missed, and nearby blessing language does not by itself establish a conditional promise.",
  ],
};
