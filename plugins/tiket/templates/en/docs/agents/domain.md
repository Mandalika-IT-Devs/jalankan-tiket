# Domain docs

This file explains how skills use the domain docs of this repo while they explore the code. This repo has only one context.

## Before exploring, read

- `GLOSSARY.md` at the root: the glossary of terms, with their _Avoid_ lists.
- `docs/adr/`: the ADRs that touch the area you will work on.
- `docs/PRD.md`: the sections that the ticket refers to. A `▶ Decision` block overrides the text above it.

```
/
├── GLOSSARY.md
├── docs/adr/
└── {{DOMAIN_MODULE_PATH}}
```

## Use the glossary vocabulary

Domain concept names in issue titles, test names, function names and hypotheses use the exact terms from `GLOSSARY.md`.

The concept you need may not be in the glossary yet. That means one of two things:
- you are inventing language that the project does not use, so rethink your choice of words;
- there is a real gap in the glossary. Record the gap as a proposed term in an issue comment for the owner, because `GLOSSARY.md` is a protected file.

## Flag conflicts with an ADR

If your work conflicts with an ADR, name the conflict explicitly, then park the ticket. An ADR is never overridden silently.
