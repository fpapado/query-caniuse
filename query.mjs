#!/usr/bin/env node
import db from "caniuse-db/fulldata-json/data-2.0.json" assert { type: "json" };
import sade from "sade";

const prog = sade("query-caniuse");

const outputFormats = ["tsv", "table"];
const outputFormatsStr = outputFormats.join(", ");

prog.version("0.0.1");

prog
  .command("query <feature-name-or-url>")
  .describe(
    "Query the minimum browser version that suppots the feature. Expects a feature id or a caniuse.com url."
  )
  .option(
    "-f, --format",
    `Change the output format. Options: ${outputFormatsStr}`,
    "tsv"
  )
  .example("query focus-visible")
  .example("query https://caniuse.com/css-focus-visible")
  .example("query focus-visible --format table")
  .example("query focus-visible --format tsv")
  .action((nameOrUrl, opts) => {
    let featureName;
    if (URL.canParse(nameOrUrl)) {
      const url = new URL(nameOrUrl);
      featureName = url.pathname.split("/").slice(-1)[0];
    } else {
      featureName = nameOrUrl;
    }
    const browsers = findFirstBrowsersForFeature(featureName);

    switch (opts.format) {
      case "tsv": {
        printTsv(browsers);
        return;
      }
      case "table": {
        printTable(browsers);
        return;
      }
      default: {
        throw new Error(
          `Unknown format ${opts.format}. Valid options are ${outputFormatsStr}`
        );
      }
    }
  });

prog.parse(process.argv);

function findFirstBrowsersForFeature(featureName) {
  const feature = db.data[featureName];
  if (!feature) {
    if (featureName.startsWith("mdn-")) {
      throw new Error(
        `Feature with id ${featureName} comes from MDN data, and is currently not available to query via caniuse-db.`
      );
    }
    throw new Error(`no feature with id ${featureName} found`);
  }

  const withFirstVersion = [];
  for (const [agentId, stats] of Object.entries(feature.stats)) {
    const firstSupported = Object.entries(stats).find(
      ([_version, supports]) => supports === "y"
    );
    if (firstSupported) {
      withFirstVersion.push([agentId, firstSupported[0]]);
    } else {
      withFirstVersion.push([agentId, "N/A"]);
    }
  }
  return withFirstVersion.map(([agentId, version]) => [
    getAgentName(agentId),
    version,
  ]);
}

function getAgentName(agentId) {
  return db.agents[agentId].browser;
}

function printTsv(table) {
  const formatted = table.map((data) => data.join("\t")).join("\n");
  console.log(formatted);
}

function printTable(table) {
  const formatted = table.map(([agent, version]) => ({ agent, version }));
  console.table(formatted, ["agent", "version"]);
}
