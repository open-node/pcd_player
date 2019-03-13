#! /usr/bin/env node

const fs = require("fs");

const arr = fs
  .readFileSync(process.argv[2])
  .toString()
  .trim()
  .split("\n");
const header = arr
  .slice(0, 11)
  .map(x => x.trim())
  .join("\n");
const data = arr.slice(11);
data.forEach(
  (x, i) =>
    (data[i] = x
      .trim()
      .split(" ")
      .map(x => +x))
);

// const range = [1200, 1200, 110];
const limit = [[0, 0], [0, 0], [0, 0]];
for (const x of data) {
  for (let i = 0; i < 3; i += 1) {
    limit[i][0] = Math.min(limit[i][0], x[i]);
    limit[i][1] = Math.max(limit[i][1], x[i]);
  }
}

const range = limit.map(x => Math.floor(x[1] - x[0] + 10));
// console.log(limit);

data.forEach((x, i) => {
  data[i] = [
    Math.round((data[i][0] * 10000000) / range[0]) / 10000000,
    Math.round((data[i][1] * 10000000) / range[1]) / 10000000,
    Math.round((data[i][2] * 10000000) / range[2]) / 10000000,
    0x0f0f0f + Math.round((0xf0f0f0 * data[i][2]) / range[2])
  ].join(" ");
});

console.log(header);
console.log(data.join("\n"));