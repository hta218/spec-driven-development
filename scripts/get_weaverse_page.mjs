#!/usr/bin/env node
// Fetch a specific page from Weaverse docs via the Mintlify MCP endpoint
import { parseArgs } from "util";

const { positionals } = parseArgs({ allowPositionals: true });
const page = positionals[0];

if (!page) {
  console.error(
    "Usage: node scripts/get_weaverse_page.mjs <page-path>\n" +
      'Example: node scripts/get_weaverse_page.mjs "development-guide/component-schema"'
  );
  process.exit(1);
}

const response = await fetch("https://docs.weaverse.io/mcp", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json, text/event-stream",
  },
  body: JSON.stringify({
    jsonrpc: "2.0",
    method: "tools/call",
    params: {
      name: "get_page_weaverse",
      arguments: { page },
    },
    id: 1,
  }),
});

if (!response.ok) throw new Error(`HTTP ${response.status}`);

// Parse SSE response
const text = await response.text();
const dataLine = text
  .split("\n")
  .find((line) => line.startsWith("data: "));

if (!dataLine) {
  console.error("No data in response");
  process.exit(1);
}

const data = JSON.parse(dataLine.slice(6));
const results = data.result?.content || [];

for (const item of results) {
  if (item.type === "text") {
    console.log(item.text);
  }
}
