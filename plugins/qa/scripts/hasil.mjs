#!/usr/bin/env node
// Records results in a cycle's results.json, in the format of reference/workspace.md.
// Made by the qa plugin of the jalankan-tiket kit. The newest result of a case wins; git keeps the history.
//
//   node hasil.mjs <cycle dir> init
//   node hasil.mjs <cycle dir> set <case id> <state> [--priority P1] [--evidence a.png,b.png] [--bug BUG-003]
//                                                    [--owner "developer"] [--note "…"]
//   node hasil.mjs <cycle dir> charter <charter id> [--probes 12] [--bugs BUG-004] [--questions Q-005]
//   node hasil.mjs <cycle dir> retest <bug id> <state> --note "…"
//   node hasil.mjs <cycle dir> summary
//
// States: PASS, FAIL, BLOCKED, "NOT RUN" (or NOT_RUN), INCONCLUSIVE. A BLOCKED case needs --owner, who can
// unblock it, and --note, why. FAIL needs --bug or --note. NOT RUN and INCONCLUSIVE need --note.
import { existsSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';

const STATES = ['PASS', 'FAIL', 'BLOCKED', 'NOT RUN', 'INCONCLUSIVE'];

function fail(message) {
  console.error(message);
  process.exit(2);
}

function options(args) {
  const named = {};
  const positional = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      if (i + 1 >= args.length) fail(`${args[i]} needs a value.`);
      named[args[i].slice(2)] = args[++i];
    } else positional.push(args[i]);
  }
  return { named, positional };
}

function stateOf(raw) {
  const state = String(raw ?? '').toUpperCase().replace('_', ' ');
  if (!STATES.includes(state)) fail(`"${raw}" is not a state. Use one of: ${STATES.join(', ')}.`);
  return state;
}

function list(value) {
  return value ? value.split(',').map((item) => item.trim()).filter(Boolean) : undefined;
}

function now() {
  const date = new Date();
  const offset = -date.getTimezoneOffset();
  const sign = offset >= 0 ? '+' : '-';
  const pad = (n) => String(Math.floor(Math.abs(n))).padStart(2, '0');
  const local = new Date(date.getTime() + offset * 60_000).toISOString().slice(0, 19);
  return `${local}${sign}${pad(offset / 60)}:${pad(offset % 60)}`;
}

const [dirArg, command, ...rest] = process.argv.slice(2);
if (!dirArg || !command) fail('usage: node hasil.mjs <cycle dir> init | set | charter | retest | summary …');
const dir = resolve(dirArg);
if (!existsSync(join(dir, 'cycle.json'))) fail(`${dir} has no cycle.json. Name the folder of one cycle.`);
const file = join(dir, 'results.json');

function load() {
  if (!existsSync(file)) fail(`${file} does not exist yet. Run "init" first.`);
  return JSON.parse(readFileSync(file, 'utf8'));
}

function save(results) {
  results.updatedAt = now();
  const temporary = `${file}.tmp`;
  writeFileSync(temporary, `${JSON.stringify(results, null, 2)}\n`);
  renameSync(temporary, file);
}

const { named, positional } = options(rest);

if (command === 'init') {
  if (existsSync(file)) fail(`${file} exists already. It is kept as it is.`);
  const cycle = JSON.parse(readFileSync(join(dir, 'cycle.json'), 'utf8')).id ?? basename(dir);
  save({ cycle, updatedAt: '', cases: [], charters: [], retests: [] });
  console.log(`${file} created for cycle ${cycle}.`);
} else if (command === 'set') {
  const [id, rawState] = positional;
  if (!id || !rawState) fail('usage: set <case id> <state> [--priority …] [--evidence …] [--bug …] [--owner …] [--note …]');
  const state = stateOf(rawState);
  if (state === 'BLOCKED' && (!named.owner || !named.note)) fail(`${id}: BLOCKED needs --owner (who can unblock it) and --note.`);
  if (state === 'FAIL' && !named.bug && !named.note) fail(`${id}: FAIL needs --bug, or --note naming the candidate.`);
  if ((state === 'NOT RUN' || state === 'INCONCLUSIVE') && !named.note) fail(`${id}: ${state} needs --note.`);
  const results = load();
  const old = results.cases.find((entry) => entry.id === id);
  const entry = {
    id,
    priority: named.priority ?? old?.priority ?? null,
    state,
    evidence: list(named.evidence) ?? [],
    bug: named.bug ?? null,
    note: named.note ?? '',
  };
  if (state === 'BLOCKED') entry.owner = named.owner;
  if (old) results.cases[results.cases.indexOf(old)] = entry;
  else results.cases.push(entry);
  save(results);
  console.log(`${id}: ${old ? `${old.state} -> ` : ''}${state}`);
} else if (command === 'charter') {
  const [id] = positional;
  if (!id) fail('usage: charter <charter id> [--probes …] [--bugs …] [--questions …]');
  const results = load();
  const old = results.charters.find((entry) => entry.id === id);
  const entry = {
    id,
    probes: named.probes ? Number(named.probes) : (old?.probes ?? 0),
    bugs: list(named.bugs) ?? old?.bugs ?? [],
    questions: list(named.questions) ?? old?.questions ?? [],
  };
  if (old) results.charters[results.charters.indexOf(old)] = entry;
  else results.charters.push(entry);
  save(results);
  console.log(`${id}: ${entry.probes} probes, bugs ${entry.bugs.join(', ') || '-'}, questions ${entry.questions.join(', ') || '-'}`);
} else if (command === 'retest') {
  const [bug, rawState] = positional;
  if (!bug || !rawState || !named.note) fail('usage: retest <bug id> <state> --note "…"');
  const state = stateOf(rawState);
  const results = load();
  const old = results.retests.find((entry) => entry.bug === bug);
  const entry = { bug, state, note: named.note };
  if (old) results.retests[results.retests.indexOf(old)] = entry;
  else results.retests.push(entry);
  save(results);
  console.log(`retest ${bug}: ${state}`);
} else if (command === 'summary') {
  const results = load();
  const counts = Object.fromEntries(STATES.map((state) => [state, {}]));
  for (const entry of results.cases) {
    const priority = entry.priority ?? '-';
    counts[entry.state][priority] = (counts[entry.state][priority] ?? 0) + 1;
  }
  console.log(`cycle ${results.cycle}, updated ${results.updatedAt}, ${results.cases.length} cases`);
  for (const state of STATES) {
    const byPriority = counts[state];
    const total = Object.values(byPriority).reduce((sum, n) => sum + n, 0);
    const detail = Object.entries(byPriority).sort().map(([p, n]) => `${p} ${n}`).join(', ');
    console.log(`  ${state.padEnd(13)} ${String(total).padStart(4)}${detail ? `  (${detail})` : ''}`);
  }
  for (const retest of results.retests) console.log(`  retest ${retest.bug}: ${retest.state}`);
  const ownerless = results.cases.filter((entry) => entry.state === 'BLOCKED' && !entry.owner);
  if (ownerless.length) console.log(`  BLOCKED without an owner: ${ownerless.map((entry) => entry.id).join(', ')}`);
} else {
  fail(`Unknown command "${command}". Use init, set, charter, retest or summary.`);
}
