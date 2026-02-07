#!/usr/bin/env bun
/**
 * Exa Search Agent CLI
 * Semantic search using Exa AI
 */

import { Command } from "commander";
import Exa from "exa-js";

const program = new Command();

function getClient(): Exa {
  const apiKey = process.env.EXA_API_KEY;
  if (!apiKey) {
    console.error("❌ EXA_API_KEY environment variable not set");
    process.exit(1);
  }
  return new Exa(apiKey);
}

interface SearchOptions {
  num?: string;
  type?: "neural" | "keyword" | "auto";
  contents?: boolean;
  summary?: boolean;
  days?: string;
  domain?: string;
  format?: "text" | "json";
}

function formatResults(results: any, format: string = "text"): string {
  if (format === "json") {
    return JSON.stringify(results, null, 2);
  }

  const lines: string[] = [];
  lines.push(`\n🔍 Found ${results.results?.length || 0} results\n`);
  lines.push("─".repeat(60));

  for (const result of results.results || []) {
    lines.push("");
    lines.push(`📄 ${result.title || "Untitled"}`);
    lines.push(`🔗 ${result.url}`);
    if (result.publishedDate) {
      lines.push(`📅 ${new Date(result.publishedDate).toLocaleDateString()}`);
    }
    if (result.author) {
      lines.push(`✍️  ${result.author}`);
    }
    if (result.summary) {
      lines.push("");
      lines.push(`📝 ${result.summary}`);
    }
    if (result.text) {
      lines.push("");
      const preview = result.text.slice(0, 300).replace(/\n/g, " ");
      lines.push(`${preview}${result.text.length > 300 ? "..." : ""}`);
    }
    lines.push("");
    lines.push("─".repeat(60));
  }

  return lines.join("\n");
}

program
  .name("exa-search")
  .description("Semantic search using Exa AI")
  .version("1.0.0");

// Main search command
program
  .command("search")
  .description("Search the web semantically")
  .argument("<query>", "Search query")
  .option("-n, --num <number>", "Number of results", "10")
  .option("-t, --type <type>", "Search type: neural, keyword, auto", "auto")
  .option("-c, --contents", "Include page contents")
  .option("-s, --summary", "Include AI summary")
  .option("-d, --days <days>", "Limit to last N days")
  .option("--domain <domain>", "Limit to specific domain")
  .option("-f, --format <format>", "Output format: text, json", "text")
  .action(async (query: string, options: SearchOptions) => {
    const exa = getClient();
    try {
      const searchOptions: any = {
        numResults: parseInt(options.num || "10"),
        type: options.type || "auto",
      };

      if (options.days) {
        const date = new Date();
        date.setDate(date.getDate() - parseInt(options.days));
        searchOptions.startPublishedDate = date.toISOString();
      }

      if (options.domain) {
        searchOptions.includeDomains = [options.domain];
      }

      let results;
      if (options.contents || options.summary) {
        const contentsOptions: any = {};
        if (options.contents) contentsOptions.text = true;
        if (options.summary) contentsOptions.summary = true;
        results = await exa.searchAndContents(query, {
          ...searchOptions,
          ...contentsOptions,
        });
      } else {
        results = await exa.search(query, searchOptions);
      }

      console.log(formatResults(results, options.format));
    } catch (error: any) {
      console.error("❌ Error:", error.message);
      process.exit(1);
    }
  });

// Find similar pages
program
  .command("similar")
  .description("Find pages similar to a URL")
  .argument("<url>", "URL to find similar pages to")
  .option("-n, --num <number>", "Number of results", "10")
  .option("-c, --contents", "Include page contents")
  .option("-f, --format <format>", "Output format: text, json", "text")
  .action(async (url: string, options: SearchOptions) => {
    const exa = getClient();
    try {
      let results;
      if (options.contents) {
        results = await exa.findSimilarAndContents(url, {
          numResults: parseInt(options.num || "10"),
          text: true,
        });
      } else {
        results = await exa.findSimilar(url, {
          numResults: parseInt(options.num || "10"),
        });
      }
      console.log(formatResults(results, options.format));
    } catch (error: any) {
      console.error("❌ Error:", error.message);
      process.exit(1);
    }
  });

// Get contents of URLs
program
  .command("contents")
  .description("Get contents of specific URLs")
  .argument("<urls...>", "URLs to get contents from")
  .option("-s, --summary", "Include AI summary")
  .option("-f, --format <format>", "Output format: text, json", "text")
  .action(async (urls: string[], options: SearchOptions) => {
    const exa = getClient();
    try {
      const contentsOptions: any = { text: true };
      if (options.summary) contentsOptions.summary = true;
      
      const results = await exa.getContents(urls, contentsOptions);
      console.log(formatResults(results, options.format));
    } catch (error: any) {
      console.error("❌ Error:", error.message);
      process.exit(1);
    }
  });

// Research a topic (search + contents + summary)
program
  .command("research")
  .description("Deep research a topic (search + contents + AI summary)")
  .argument("<topic>", "Topic to research")
  .option("-n, --num <number>", "Number of sources", "5")
  .option("-d, --days <days>", "Limit to last N days")
  .option("-f, --format <format>", "Output format: text, json", "text")
  .action(async (topic: string, options: SearchOptions) => {
    const exa = getClient();
    try {
      console.log(`🔬 Researching: ${topic}...\n`);
      
      const searchOptions: any = {
        numResults: parseInt(options.num || "5"),
        type: "neural",
        text: true,
        summary: true,
      };

      if (options.days) {
        const date = new Date();
        date.setDate(date.getDate() - parseInt(options.days));
        searchOptions.startPublishedDate = date.toISOString();
      }

      const results = await exa.searchAndContents(topic, searchOptions);
      console.log(formatResults(results, options.format));
    } catch (error: any) {
      console.error("❌ Error:", error.message);
      process.exit(1);
    }
  });

// News search
program
  .command("news")
  .description("Search recent news on a topic")
  .argument("<topic>", "News topic")
  .option("-n, --num <number>", "Number of results", "10")
  .option("-d, --days <days>", "Last N days", "7")
  .option("-f, --format <format>", "Output format: text, json", "text")
  .action(async (topic: string, options: SearchOptions) => {
    const exa = getClient();
    try {
      console.log(`📰 Searching news: ${topic}...\n`);
      
      const date = new Date();
      date.setDate(date.getDate() - parseInt(options.days || "7"));
      
      const results = await exa.searchAndContents(topic, {
        numResults: parseInt(options.num || "10"),
        type: "neural",
        startPublishedDate: date.toISOString(),
        summary: true,
      });
      
      console.log(formatResults(results, options.format));
    } catch (error: any) {
      console.error("❌ Error:", error.message);
      process.exit(1);
    }
  });

// Papers/academic search
program
  .command("papers")
  .description("Search academic papers on a topic")
  .argument("<topic>", "Research topic")
  .option("-n, --num <number>", "Number of results", "10")
  .option("-f, --format <format>", "Output format: text, json", "text")
  .action(async (topic: string, options: SearchOptions) => {
    const exa = getClient();
    try {
      console.log(`📚 Searching papers: ${topic}...\n`);
      
      const results = await exa.searchAndContents(topic, {
        numResults: parseInt(options.num || "10"),
        type: "neural",
        includeDomains: ["arxiv.org", "scholar.google.com", "semanticscholar.org", "papers.ssrn.com", "researchgate.net"],
        summary: true,
      });
      
      console.log(formatResults(results, options.format));
    } catch (error: any) {
      console.error("❌ Error:", error.message);
      process.exit(1);
    }
  });

program.parse();
