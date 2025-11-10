onst fs = require('fs');
const path = require('path');
const fse = require('fs-extra');

/**
* Writes results to disk in the requested format.
* Supported formats: "json", "csv".
*/
async function writeDataset(results, { outputPath, format = 'json', logger = console }) {
if (!outputPath) {
throw new Error('writeDataset: outputPath is required');
}

const dir = path.dirname(outputPath);
await fse.ensureDir(dir);

const fmt = String(format || 'json').toLowerCase();
if (fmt === 'json') {
await writeJson(results, outputPath);
logger.info('[Crawler] Wrote JSON dataset to', outputPath);
} else if (fmt === 'csv') {
await writeCsv(results, outputPath);
logger.info('[Crawler] Wrote CSV dataset to', outputPath);
} else {
throw new Error(
`writeDataset: Unsupported format "${format}". Supported formats: json, csv.`,
);
}
}

async function writeJson(results, outputPath) {
const data = JSON.stringify(results || [], null, 2);
await fse.writeFile(outputPath, data, 'utf8');
}

function escapeCsvValue(value) {
if (value === null || value === undefined) return '';
const str = String(value);
if (/[",\n]/.test(str)) {
return `"${str.replace(/"/g, '""')}"`;
}
return str;
}

function toFlatRecord(obj, prefix = '') {
const flat = {};
Object.keys(obj || {}).forEach((key) => {
const value = obj[key];
const fullKey = prefix ? `${prefix}.${key}` : key;
if (value && typeof value === 'object' && !Array.isArray(value)) {
Object.assign(flat, toFlatRecord(value, fullKey));
} else {
flat[fullKey] = value;
}
});
return flat;
}

async function writeCsv(results, outputPath) {
const rows = Array.isArray(results) ? results : [];
if (!rows.length) {
await fse.writeFile(outputPath, '', 'utf8');
return;
}

const flatRows = rows.map((row) => toFlatRecord(row));
const headerSet = new Set();
flatRows.forEach((row) => {
Object.keys(row).forEach((k) => headerSet.add(k));
});
const headers = Array.from(headerSet);

const lines = [];
lines.push(headers.map(escapeCsvValue).join(','));

flatRows.forEach((row) => {
const line = headers
.map((h) => {
const value = row[h];
if (Array.isArray(value) || (value && typeof value === 'object')) {
return escapeCsvValue(JSON.stringify(value));
}
return escapeCsvValue(value);
})
.join(',');
lines.push(line);
});

const csvContent = lines.join('\n');
await fse.writeFile(outputPath, csvContent, 'utf8');
}

module.exports = {
writeDataset,
};