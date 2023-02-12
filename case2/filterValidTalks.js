const talkTitleDenyList = [
  "General Women",
  "General Relief Society Meeting",
  "Women’s Fireside Addresses",
  "Priesthood Leadership Meeting",
  "February 1999 Conversion and Retention Broadcast",
  "Special Satellite Broadcast for Children",
  "Video: “You Are the Women He Foresaw”",
  "The Annual Report of the Church",
  "Church Audit Committee Report",
  "Sustaining of General Authorities",
  "General Priesthood",
  "General Young Women",
  "Women's Fireside Addresses",
  "Member Finances Fireside",
  "Relief Society Sesquicentennial",
  "Saturday Morning",
  "Video: The Light That Shineth",
  "Sustaining of Church Officers",
  "Statistical Report",
  "Church Auditing Department Report",
  "Audit Report",
  "Church Finance Committee Report",
  "Sustaining of Church Authorities and Officers",
  "Welfare Services Meeting",
  "Solemn Assembly",
  "Faith in Every Footstep: The Epic Pioneer Journey",
];

const sessionDenyList = [
  "Welfare Session",
  "Welfare Services Session",
  "General Welfare Session",
  "Women’s Fireside Addresses",
  "Priesthood Leadership Meeting",
  "Member Finances Fireside",
  "Relief Society Sesquicentennial Satellite Broadcast",
  "February 1999 Conversion and Retention Broadcast",
  "Special Satellite Broadcast for Children",
];

export default function filterValidTalks(talk) {
  const session = talk.title.includes("Session");
  const validTitle = !talkTitleDenyList.some((item) =>
    talk.title.includes(item)
  );
  const validSession = !sessionDenyList.includes(talk.session);

  const isValidTalk = !session && validTitle && validSession;

  if (!isValidTalk) {
    console.info(
      `Not going to fetch [${talk.session}] "${talk.title}" - ${talk.url}`
    );
  }

  return isValidTalk;
}
