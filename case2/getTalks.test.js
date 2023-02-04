import fs from "node:fs";
import { extractTalkContent, extractTalkListingsFromDOM } from "./getTalks";

const kacher17 = fs.readFileSync("./case2/fixtures/17kacher.html", "utf-8");
const kacher17_out = fs.readFileSync(
  "./case2/fixtures/17kacher_out.txt",
  "utf-8"
);
const soares55 = fs.readFileSync("./case2/fixtures/55soares.html", "utf-8");
const soares55_out = fs.readFileSync(
  "./case2/fixtures/55soares_out.txt",
  "utf-8"
);

const l2002_04 = fs.readFileSync("./case2/fixtures/2002-04.html", "utf-8");

describe("extractTalkContent", () => {
  it("extracts text properly", () => {
    expect(normalizeWhitespace(extractTalkContent(kacher17))).toEqual(
      normalizeWhitespace(kacher17_out)
    );
  });

  it("extracts text properly - removes image alt but keeps link to bible verse", () => {
    expect(normalizeWhitespace(extractTalkContent(soares55))).toEqual(
      normalizeWhitespace(soares55_out)
    );
  });
});

describe("extractTalkListingsFromDOM", () => {
  it("extracts list of talks correctly", () => {
    const actual = extractTalkListingsFromDOM(l2002_04)
      .map((talk) => talk.speaker)
      .filter(Boolean)
      .map(normalizeWhitespace)
      .map((s) => s.trim());

    expect(actual).toEqual([
      "Gordon B. Hinckley",
      "Boyd K. Packer",
      "Earl C. Tingey",
      "Mary Ellen W. Smoot",
      "Joseph B. Wirthlin",
      "Thomas S. Monson",
      "Thomas S. Monson",
      "Wesley L. Jones",
      "F. Michael Watson",
      "Richard G. Scott",
      "Henry B. Eyring",
      "R. Conrad Schultz",
      "Robert R. Steuer",
      "Dallin H. Oaks",
      "Neal A. Maxwell",
      "L. Tom Perry",
      "Ben B. Banks",
      "Spencer J. Condie",
      "James E. Faust",
      "Thomas S. Monson",
      "Gordon B. Hinckley",
      "James E. Faust",
      "Jeffrey R. Holland",
      "Richard C. Edgley",
      "Gayle M. Clegg",
      "Robert D. Hales",
      "Gordon B. Hinckley",
      "Russell M. Nelson",
      "John M. Madsen",
      "Carlos H. Amado",
      "Gene R. Cook",
      "Bonnie D. Parkin",
      "Gerald N. Lund",
      "William R. Walker",
      "M. Russell Ballard",
      "Gordon B. Hinckley",
      "Sharon G. Larsen",
      "Carol B. Thomas",
      "Margaret D. Nadauld",
      "Thomas S. Monson",
    ]);
  });
});

function normalizeWhitespace(string) {
  return string
    .replaceAll(/\s+/g, " ")
    .replaceAll("\\n", " ")
    .replaceAll(/ +/g, " ")
    .trim();
}
