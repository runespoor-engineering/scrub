<div align="center">
  <h1>@runespoorstack/scrub</h1>
  <p>The automated janitor for your codebase. Stop the rot, clean the debt, and migrate with confidence.</p>
  <div>
     <a href="https://www.buymeacoffee.com/borisshulyak" target="_blank">
      <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" >
    </a>
  </div>
  <a href="https://github.com/runespoor-engineering/scrub/blob/main/LICENSE">
    <img alt="GitHub License" src="https://img.shields.io/github/license/runespoor-engineering/scrub">
  </a>
  <a href="https://github.com/runespoor-engineering/scrub/issues">
    <img alt="GitHub issues" src="https://img.shields.io/github/issues/runespoor-engineering/scrub?color=5d2de0">
  </a>
  <a href="https://www.npmjs.com/package/@runespoorstack/scrub">
    <img alt="npm downloads" src="https://img.shields.io/npm/dw/@runespoorstack/scrub">
  </a>
</div>

## Overview

In modern development, adding a strict linting rule or a new static analysis tool to an existing project is a recipe for **thousands of errors** and **developer burnout**.

`@runespoorstack/scrub` (invoked via the `scrub` command) is a tool-agnostic CLI designed to manage "ignore" and "disable" comments. It enables a **Continuous Fixing Methodology**, allowing you to adopt strict standards (ESLint, TypeScript, Prettier, Stylelint, etc.) incrementally without breaking your CI or ruining your Git history.

## Core Workflow

The tool operates on the **"Stop the Bleed, Then Heal"** principle:

1. **Freeze (`scrub disable`)**: Inject disabling comments into every existing file that violates your new rules. This allows your CI to pass immediately.
2. **Gate (`scrub check-staged`)**: Use a pre-commit hook to ensure that no *new* disabling comments enter the codebase.
3. **Clean (Incremental)**: As developers touch files for regular features or bugs, they are tasked with "scrubbing" the file—removing the disable comment and fixing the errors.

## The Right Way vs Wrong Way

### ❌ The "Big Bang" Fix (Wrong Way)

You run an auto-fix on 500 files.

* **Result**: Massive merge conflicts for everyone. You are now the "owner" of 10,000 lines of code in `git blame`. GitHub suggests you as a reviewer for every file in the project.

### ✅ The "Scrub" Migration (Correct Way)

You baseline the project with disabling comments.

* **Result**: CI is green. No `git blame` pollution. Files are fixed naturally one by one by the people actually working on them. Progress is steady and zero-risk.

## Command Reference

### 1. `scrub disable`

**The "Baseline" Phase.** Adds a disabling comment line to the top of all files in the project that match the provided regex pattern.

| Option | Description | Default |
| --- | --- | --- |
| `-d, --disablingComment <comment>` | The comment to add (e.g. `/* eslint-disable */`). | **Required** |
| `-r, --rootDir <path>` | Path to the directory to add comments in. | `./` |
| `-p, --pattern <regex...>` | Regex patterns to match files against. | `\.[cm]?[jt]sx?$` |

**Example:**

```bash
scrub disable -d "/* eslint-disable */" -r "./src" -p "\\.[cm]?[jt]sx?$"
```

### 2. `scrub check`

**The "Audit" Phase.** Checks all files in the project for disabling comments and returns an error code if found.

| Option | Description | Default |
| --- | --- | --- |
| `-d, --disablingComment <comment>` | The comment string to search for. | **Required** |
| `-r, --rootDir <path>` | Path to the directory to check. | `./` |
| `-p, --pattern <regex...>` | Regex patterns to match files against. | `\.[cm]?[jt]sx?$` |

**Example:**

```bash
scrub check -d "// @ts-nocheck"
```

### 3. `scrub check-staged`

**The "Gatekeeper" Phase.** Checks only staged files for disabling comments. Ideal for pre-commit hooks.

| Option | Description | Default |
| --- | --- | --- |
| `-d, --disablingComment <comment>` | The comment string to search for. | **Required** |
| `-r, --rootDir <path>` | Path to the directory to check. | `./` |
| `-p, --pattern <regex...>` | Regex patterns to match files against. | `\.[cm]?[jt]sx?$` |

**Example:**

```bash
scrub check-staged -d "// @ts-nocheck"
```

## Installation & Setup

### Install

```bash
pnpm add --save-dev @runespoorstack/scrub

```

### Configure Scripts

Add your baseline targets to `package.json`:

```json
{
  "scripts": {
    "scrub:disable:eslint": "scrub disable --disablingComment '/* eslint-disable */'",
    "scrub:disable:ts": "scrub disable --disablingComment '// @ts-nocheck' --pattern '\\.ts$'",
    "scrub:check:eslint": "scrub check --disablingComment '/* eslint-disable */'",
    "scrub:check:ts": "scrub check --disablingComment '// @ts-nocheck'",
    "scrub:check-staged:eslint": "scrub check-staged --disablingComment '/* eslint-disable */'",
    "scrub:check-staged:ts": "scrub check-staged --disablingComment '// @ts-nocheck'",
  }
}

```

## Integration with Git Hooks

Integrate `scrub` into your workflow using **Husky** to ensure long-term code quality.

## Support & Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](https://github.com/runespoor-engineering/runespoorstack/blob/main/CONTRIBUTING.md).

If this tool helps you clean your codebase without the headache:
📖 [Buy Boris a book](https://bmc.link/borisshulyak)

### Special Thanks

I want to say thank you to the best woman in the world, **my wife Diana** for her love, daily support, motivation and inspiration.