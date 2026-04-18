# Prepare your research

Before you write a PRD, tech spec, or sales copy, your customer research
needs to be in a format your AI assistant can actually read.

This is a **one-time prep step** at the start of the product phase. Do it
before moving on to [`write-prd.md`](./write-prd.md).

---

## Why this matters

Claude Code (the terminal) reads plain text, markdown, images, and PDFs.
**It cannot read `.pptx` files** — they're a binary format and show up as
opaque blobs. PDFs work but are lossy for quote extraction.

Markdown is the goldilocks format: the AI can grep it, quote from it
verbatim, and spot patterns across multiple files. It's also easy for you
to edit as you learn more.

## What to convert

Anything that backs up your product thinking:

- Customer interview notes / transcripts
- Survey responses
- Competitor teardowns
- The PPT deck(s) from your homework
- User story lists from earlier AI conversations
- Screens-needed lists
- Product positioning / mission / tagline drafts

## How to convert

### Best path: Claude.ai web or ChatGPT (they read `.pptx` directly)

1. Open <https://claude.ai> or <https://chat.openai.com>.
2. Drag your `.pptx` (or whatever file) into the chat.
3. Paste this prompt, filling in the blanks:

   > I'm preparing customer research for a SaaS product called
   > **`<PRODUCT_NAME>`**. Extract everything useful from this document as
   > well-structured **markdown**. Rules:
   >
   > - Preserve customer quotes **verbatim** — do not paraphrase.
   > - Organise by section. If it's a deck, use slide titles as H2s.
   > - If there are multiple interviews / personas / topics, return them
   >   as separate markdown files with clear filenames.
   > - Keep bullets as bullets. Strip slide numbers and cosmetic fluff.
   > - Return the markdown in fenced code blocks so I can copy it.

4. Copy each markdown file into `docs/research/` with a descriptive
   filename (e.g. `docs/research/interview-jane.md`,
   `docs/research/survey-results.md`,
   `docs/research/competitor-notes.md`).

### If you're stuck in Claude Code (terminal) only

Export your `.pptx` to PDF from PowerPoint / Keynote (File → Export →
PDF), drop it in `docs/research/`, and ask Claude Code:

> Read `docs/research/<file>.pdf` and convert it to a well-structured
> markdown file in the same folder. Preserve every customer quote
> verbatim.

This is lossier than the web-upload path but works.

## For non-research artifacts

- **Screens-needed list, user stories, positioning docs** — these are
  usually already text. Paste them into a fresh markdown file in
  `docs/research/` (e.g. `docs/research/user-stories.md`) and you're done.
- **Visual inspiration** — screenshots, landing pages you like, UI
  references go in `docs/inspiration/` as PNGs or JPEGs. The AI can read
  them.

## Quality bar

Before you move on to `write-prd.md`, `docs/research/` should have:

- [ ] Every customer quote you've gathered, **in the customer's own words**.
- [ ] One file per source (interview, survey, competitor) — not one giant
      dump.
- [ ] Clear filenames so the AI can find the right file from context.
- [ ] Any existing user-story / screens-needed lists as `.md`.
- [ ] At least a few pieces of visual inspiration in `docs/inspiration/`
      if you have a style in mind.

## Next step

Once the research is in markdown in `docs/research/`, move on to
[`write-prd.md`](./write-prd.md).
