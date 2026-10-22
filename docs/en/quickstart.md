# Quickstart

This guide takes you from zero to Claude working on its first ticket by itself.

## What you need on your laptop

- **Claude Code**, version 2.1.299 or later. You can use the CLI or the Code tab in Claude Desktop.
- **Git and the GitHub CLI (`gh`)**. Log in with `gh auth login`.
  - The login token needs the `repo` and `workflow` scopes, because the kit writes CI files.
  - If the `workflow` scope is missing, add it with `gh auth refresh -s workflow`.
- **`jq`.**
- **For the default stack (Next.js + PostgreSQL):**
  - Node.js 24 LTS;
  - pnpm (turn it on with `corepack enable`);
  - Docker that works without `sudo`.

## 1. Install the plugin (once per laptop)

In a Claude Code session, type these one at a time:

```
/plugin marketplace add anthropics/claude-plugins-official
/plugin marketplace add mandalikadev/jalankan-tiket
/plugin install tiket@jalankan-tiket
```

Then open a new session or type `/reload-plugins`. mattpocock-skills is installed automatically along with it.

To always have the latest version of the kit, turn on auto-update: `/plugin` → Marketplaces → `jalankan-tiket` → Enable auto-update.

## 2. Set up the project

1. Prepare the folder:
   - **new project:** create an empty folder;
   - **existing project:** open the existing repo. There is more to read in [Existing projects](existing-projects.md).
2. Open a Claude Code session in that folder, then choose the **Auto** permission mode.
3. Type:

   ```
   /tiket:siapkan-proyek
   ```

Claude will ask about:
- the language;
- the product name;
- the GitHub repo;
- the stack;
- the type of CI;
- whether the product has a user interface.

Each question has one recommended option, so you can answer "agree to all".

The result:
- a GitHub repo;
- labels and the milestone M1;
- CI;
- all the starting documents, still empty.

At the end, Claude gives you one command that protects the `main` branch. You only get this command if your repo is public or your GitHub account is on a paid plan. Run the command yourself by typing `!` in front of it.

## 3. Plan the product

1. Put all your material about the product in `docs/input/`: notes, documents and sample files.
2. Type:

   ```
   /tiket:rencanakan-produk
   ```

This is the longest question-and-answer session. Claude asks you questions until every rule, number and formula is clear. Then Claude writes:
- the PRD;
- the glossary;
- the list of open decisions;
- the UAT scenarios;
- the calculation examples.

All of these documents arrive in a PR. Add the owner-approved label to that PR (`disetujui-pemilik` in Indonesian projects, `owner-approved` in English ones).

## 4. Plan the first milestone

```
/tiket:rencanakan-tahap
```

Claude proposes what goes into milestone M1, asks for the decisions it needs, then creates the tickets on GitHub. The first ticket is always the foundation ticket, `[T00]`.

## 5. Run

```
/tiket:jalankan
```

Let it run. Claude works through the tickets one at a time, in this order:
1. write the code;
2. review the result;
3. open a PR;
4. wait for CI;
5. merge.

When Claude finds a business question, it parks that ticket and moves on to another one. At the end, you get a report with the questions and a recommendation for each one.

## 6. Answer, then continue

```
/tiket:catat-keputusan
```

Answer "agree to all", or name the numbers where your answer is different. After the decision PR is merged, run `/tiket:jalankan` again.

Not sure what to do next? Type `/tiket:cek-proyek`. Claude checks the project and tells you the next step.

Read next: [How it works](how-it-works.md) · [Commands](commands.md) · [Existing projects](existing-projects.md)
