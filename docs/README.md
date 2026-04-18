# Product docs

This folder is where your **product thinking** lives — the stuff that
isn't code but drives what you build.

Keep it in the repo (not in Notion, not in Google Drive) so your AI
assistant can read it alongside the code when you're working.

## What goes here

```
docs/
  research/      ← customer interviews, surveys, competitor notes, tweets,
                   anything you learned about the problem
  inspiration/   ← screenshots, landing pages you like, UI references,
                   colour palettes, logo ideas
  prd.md         ← the Product Requirements Document (see below)
  tech-spec.md   ← the technical spec derived from the PRD
```

## How to produce `prd.md` and `tech-spec.md`

The template ships with two prompt files that walk you through it:

1. Do your customer research and drop everything into `docs/research/`.
2. Follow [`prompts/product/write-prd.md`](../prompts/product/write-prd.md)
   to generate `docs/prd.md`.
3. Follow
   [`prompts/product/write-tech-spec.md`](../prompts/product/write-tech-spec.md)
   to generate `docs/tech-spec.md`.
4. Build against `docs/tech-spec.md` using the recipes in
   `prompts/features/`.

## Tips

- **Quote aggressively in `research/`.** Raw customer words are more
  valuable than your summary of them. The AI will pick up patterns you
  missed.
- **One file per interview** is easier to scan than one giant document.
- **Screenshots are fine** — most AI assistants can read them.
- **Update `prd.md` and `tech-spec.md` as you learn.** They're living
  documents, not launch artifacts.
