import { writeFileSync } from "node:fs";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";

export default async function getStatisticalReports() {
  const allStatisticalReports = await getAllStatisticalReports();
  const collections = getCollections(allStatisticalReports);

  const rows = Object.keys(allStatisticalReports).map((year) => {
    const row = { year };

    allStatisticalReports[year].stats.forEach(({ key, value }) => {
      const collection = collections[key];
      if (collection !== "unknown") {
        row[collection] = stringToNumber(value);
      }
    });

    row.url = allStatisticalReports[year].url;

    return row;
  });

  writeFileSync("case1/output/stats.json", JSON.stringify(rows, null, 4));
}

async function getAllStatisticalReports() {
  const allStatisticalReports = {};

  await get1970to2016(allStatisticalReports);
  await get2017(allStatisticalReports);
  await get2018to2021(allStatisticalReports);

  writeFileSync(
    "case1/output/allStatisticalReports.json",
    JSON.stringify(allStatisticalReports, null, 1)
  );

  return allStatisticalReports;
}

function getCollections(allStatisticalReports) {
  const keys = [
    ...new Set(
      Object.keys(allStatisticalReports).reduce(
        (acc, key) =>
          acc.concat(allStatisticalReports[key].stats.map((row) => row.key)),
        []
      )
    ),
  ];

  const collections = groupKeysIntoCollections(keys);

  writeFileSync(
    "case1/output/keyCollections.json",
    JSON.stringify(collections, null, 2)
  );

  return collections;
}

async function get1970to2016(allStatisticalReports) {
  for (let year = 1970; year <= 2016; year++) {
    // A few one-offs that were just easier to do manually
    if (year === 1971) {
      get1971(allStatisticalReports);
      continue;
    } else if (year === 2010) {
      get2010(allStatisticalReports);
      continue;
    }

    const url = `https://www.churchofjesuschrist.org/study/general-conference/${
      year + 1
    }/04/statistical-report-${year}?lang=eng`;
    const main = (await getDomFromURL(url)).window.document.querySelector(
      ".body-block"
    );
    const stats = getKeyValuesFromTable(main);
    allStatisticalReports[year] = {
      stats,
      url,
    };

    console.info(`Done with year ${year}...`);
  }
}

function getKeyValuesFromTable(main) {
  return Array.from(main.querySelectorAll("tr"))
    .map((row) => Array.from(row.querySelectorAll("td")))
    .filter((cells) => cells.length > 1)
    .map(([key, value]) => ({
      key: key.textContent.trim(),
      value: value.textContent.trim(),
    }));
}

async function get2017(allStatisticalReports) {
  const url =
    "https://newsroom.churchofjesuschrist.org/article/2017-statistical-report-april-2018-general-conference";

  const main = (await getDomFromURL(url)).window.document.querySelector(
    "article"
  );

  const stats = Array.from(main.querySelectorAll("span"))
    .map((row) => row.textContent)
    .filter((text) => text.includes("...."))
    .map((text) => {
      const [, key, value] = text.match(/([^\.]+)\.+ (.+)/);
      return {
        key,
        value,
      };
    });

  allStatisticalReports[2017] = {
    stats,
    url,
  };

  console.info(`Done with year 2017...`);
}

function get1971(allStatisticalReports) {
  allStatisticalReports[1971] = {
    stats: toArrayOfKeyValues({
      "Total Membership": "3,090,953",
      "New Children of Record": "53,524",
      "Converts Baptized": "83,514",
      Stakes: "562",
      Wards: "4,342",
    }),
    url: "https://www.churchofjesuschrist.org/study/general-conference/1972/04/the-annual-report-of-the-church?lang=eng",
  };

  console.info(`Done with year 1971...`);
}

function get2010(allStatisticalReports) {
  allStatisticalReports[2010] = {
    stats: toArrayOfKeyValues({
      "Total Membership": "14,131,467",
      "New Children of Record": "120,528",
      "Converts Baptized": "272,814",
      Stakes: "2,896",
      Wards: "28,660",
    }),
    url: "https://www.churchofjesuschrist.org/study/general-conference/2011/04/statistical-report-2010?lang=eng",
  };

  console.info(`Done with year 2010...`);
}

function toArrayOfKeyValues(object) {
  return Object.keys(object).reduce(
    (acc, key) => (acc.push({ key, value: object[key] }), acc),
    []
  );
}

async function get2018to2021(allStatisticalReports) {
  const urls = {
    2018: "https://newsroom.churchofjesuschrist.org/article/2018-statistical-report",
    2019: "https://newsroom.churchofjesuschrist.org/article/2019-statistical-report",
    2020: "https://newsroom.churchofjesuschrist.org/article/april-2021-general-conference-statistical-report",
    2021: "https://newsroom.churchofjesuschrist.org/article/2021-statistical-report-april-2022-conference",
    2022: "https://newsroom.churchofjesuschrist.org/article/2022-statistical-report-april-2023-conference",
  };

  for (const year in urls) {
    const url = urls[year];
    const main = (await getDomFromURL(url)).window.document.querySelector(
      "article"
    );
    const stats = getKeyValuesFromTable(main);
    allStatisticalReports[year] = {
      stats,
      url,
    };

    console.info(`Done with year ${year}...`);
  }
}

async function getDomFromURL(url) {
  const report = await fetch(url).then((response) => response.text());

  return new JSDOM(report);
}

function groupKeysIntoCollections(keys) {
  return keys.reduce((acc, key) => {
    acc[key] = getCollectionFromKey(key);
    return acc;
  }, {});
}

function getCollectionFromKey(key) {
  if (key.match(/Total Membership/i) || key.match(/Total Church membership/i)) {
    return "membership";
  } else if (key.match(/Number of Stakes/i) || key === "Stakes") {
    return "stakes";
  } else if (
    key.match(/Number of Wards/i) ||
    key === "Wards" ||
    key.match(/Total Wards/i) ||
    key.match(/Wards and Branches/i)
  ) {
    return "wards";
  } else if (key.match(/convert/i)) {
    return "converts";
  } else if (
    (key.match(/children/i) &&
      (key.match(/baptize/i) || key.match(/record/i))) ||
    key.match(/Eight-year-olds/)
  ) {
    return "children_of_record";
  } else {
    return "unknown";
  }
}

function stringToNumber(string) {
  return Number(string.replaceAll(/\D/g, ""));
}

getStatisticalReports();
