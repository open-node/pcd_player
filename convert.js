#! /usr/bin/env node

const fs = require("fs");
const color = require("color");

const arr = fs
  .readFileSync(process.argv[2])
  .toString()
  .trim()
  .split("\n");
const header = arr.slice(0, 11).map(x => x.trim());
header[2] += " rgb";
header[3] += " 4";
header[4] += " U";
header[5] += " 1";
const data = arr.slice(11);
data.forEach(
  (x, i) =>
    (data[i] = x
      .trim()
      .split(" ")
      .map(x => +x))
);

// const range = [1200, 1200, 110];
const limit = [
  [Infinity, -Infinity],
  [Infinity, -Infinity],
  [Infinity, -Infinity]
];
const set = new Set();
for (const x of data) {
  for (let i = 0; i < 3; i += 1) {
    limit[i][0] = Math.min(limit[i][0], x[i]);
    limit[i][1] = Math.max(limit[i][1], x[i]);
  }
  // set.add(x[2]);
}

const range = limit.map(x => Math.floor(x[1] - x[0]));
/*
console.log(limit);
console.log(range);
console.log(set);
process.exit();
*/

const max = Math.max(...range);
data.forEach((x, i) => {
  const c =
    266 -
    Math.floor((266 * 10000 * (data[i][2] - limit[2][0])) / range[2]) / 10000;
  data[i] = [
    Math.round((data[i][0] * 10000000) / max) / 10000000,
    Math.round((data[i][1] * 10000000) / max) / 10000000,
    Math.round((data[i][2] * 10000000) / max) / 10000000,
    color.hsl(c, 80, 60).rgbNumber()
  ].join(" ");
});

console.log(header.join("\n"));
console.log(data.join("\n"));
