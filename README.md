# Exa Search Agent 🔍

A CLI tool for semantic search using [Exa AI](https://exa.ai). Unlike traditional keyword search, Exa uses neural search to find conceptually similar content.

## Features

- 🧠 **Semantic Search** - Find content by meaning, not just keywords
- 📄 **Similar Pages** - Find pages similar to a given URL
- 📰 **News Search** - Recent news on any topic
- 📚 **Papers Search** - Academic papers from arXiv, ResearchGate, etc.
- 🔬 **Deep Research** - Search + contents + AI summaries

## Installation

```bash
# Clone the repo
git clone https://github.com/iamtxena/exa-search-agent.git
cd exa-search-agent

# Install dependencies
bun install

# Set up your API key
cp .env.example .env
# Edit .env with your EXA_API_KEY
```

## Getting an API Key

1. Go to [exa.ai](https://exa.ai)
2. Sign up for an account
3. Get your API key from the dashboard
4. Add it to your `.env` file

## Usage

```bash
# Basic semantic search
bun run dev search "best practices for building AI agents"

# Search with contents
bun run dev search "machine learning tutorials" --contents

# Search with AI summary
bun run dev search "climate change solutions" --summary

# Find similar pages
bun run dev similar "https://openai.com/blog/chatgpt"

# Get contents of URLs
bun run dev contents https://example.com https://another.com

# Research a topic (search + contents + summary)
bun run dev research "quantum computing applications"

# Search recent news
bun run dev news "AI regulation" --days 7

# Search academic papers
bun run dev papers "transformer architecture"
```

### Commands

| Command | Description |
|---------|-------------|
| `search <query>` | Semantic web search |
| `similar <url>` | Find similar pages |
| `contents <urls...>` | Get page contents |
| `research <topic>` | Deep research with summaries |
| `news <topic>` | Recent news search |
| `papers <topic>` | Academic paper search |

### Options

| Flag | Description |
|------|-------------|
| `-n, --num <number>` | Number of results (default: 10) |
| `-t, --type <type>` | Search type: neural, keyword, auto |
| `-c, --contents` | Include page contents |
| `-s, --summary` | Include AI summary |
| `-d, --days <days>` | Limit to last N days |
| `--domain <domain>` | Limit to specific domain |
| `-f, --format <format>` | Output: text, json |

## Examples

### Find AI Agent Frameworks
```bash
bun run dev search "AI agent frameworks for production" -n 5 --summary
```

### Research a Company
```bash
bun run dev similar "https://anthropic.com" -n 10
```

### Get Recent AI News
```bash
bun run dev news "OpenAI GPT" --days 3
```

### Find Academic Papers
```bash
bun run dev papers "large language models reasoning" -n 20
```

## Why Exa?

Traditional search engines match keywords. Exa uses neural embeddings to understand the *meaning* of your query and find conceptually related content. This is especially powerful for:

- Research queries
- Finding similar content
- Discovering new sources
- Technical deep dives

## Pricing

Exa offers a free tier with limited searches. See [exa.ai/pricing](https://exa.ai/pricing) for details.

## License

MIT
