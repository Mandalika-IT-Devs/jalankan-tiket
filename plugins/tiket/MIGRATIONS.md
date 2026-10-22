# Migrations for project files

Some releases change files that the kit writes into projects: templates, CI, settings or scripts. Each such release adds a section here. `/tiket:cek-proyek` applies every section newer than the project's `kitVersion` on one branch, `kit-v<newest version>`, in one PR for the owner.

Format of a section:

```
## <version>

- **<file>**: what changes, and how to apply it to a project that may have edited the file.
- Last step: set `kitVersion` in `.github/jalankan-tiket.json` to `<version>`.
```

There are no migrations yet. 0.1.0 is the first version.
