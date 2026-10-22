# Installing the kit

Run these commands in a Claude Code session. Each one is safe to run again.

```
/plugin marketplace add anthropics/claude-plugins-official
/plugin marketplace add mandalikadev/jalankan-tiket
/plugin install tiket@jalankan-tiket
```

What they do:
- **The first command** adds Anthropic's official marketplace. A fresh Claude Code may not have it yet, and without it mattpocock-skills cannot install.
- **The third command** installs mattpocock-skills automatically, as a dependency of `tiket`.

Start a new session, or run `/reload-plugins`, to load the plugins.

To receive kit releases automatically, open `/plugin` → Marketplaces → `jalankan-tiket` → Enable auto-update. Projects set up with `/tiket:siapkan-proyek` turn this on for themselves in `.claude/settings.json`.

"Skills For Real Engineers" from claude.ai is an older copy of mattpocock-skills. If you have it turned on, the copy installed from the marketplace takes precedence. Turn the claude.ai copy off to avoid confusion.
