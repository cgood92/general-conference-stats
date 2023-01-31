import webCompressed from "@root/case2/output/web.json";

const { talks, speakers } = webCompressed as any;

type Talk = {
  speaker: string;
  title: string;
  talk: string;
  url: string;
  year: number;
  month: number;
  content: string;
};

const output: Talk[] = talks.map((talk: any) => ({
  speaker: speakers[talk.s],
  title: talk.t,
  url: `https://www.churchofjesuschrist.org/study/general-conference/${talk.y}/${talk.m}/${talk.u}`,
  month: talk.m,
  year: talk.y,
  content: talk.c,
}));

export default output;
