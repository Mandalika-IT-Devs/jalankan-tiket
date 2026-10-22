---
name: uji-pasang
description: Temporary installation check for the tiket plugin. Dispatches the uji-agen subagent and reports what loaded.
disable-model-invocation: true
---

This is a temporary diagnostic. Do exactly these steps and nothing else:

1. Dispatch the subagent `tiket:uji-agen` with the prompt "ping".
2. Report as a short list:
   - the subagent's reply, verbatim;
   - whether the skills `mattpocock-skills:grilling` and `mattpocock-skills:domain-modeling` are available to you;
   - this plugin's root path: ${CLAUDE_PLUGIN_ROOT}
