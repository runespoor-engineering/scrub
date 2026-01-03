#! /usr/bin/env node

import { program } from "commander";

import { check } from "./commands/check";
import { checkStaged } from "./commands/checkStaged";
import { disable } from "./commands/disable";

const cliVersion = "0.0.0";

program
	.name("scrub")
	.description(
		"The automated janitor for your codebase. Stop the rot, clean the debt, and migrate with confidence.",
	)
	.version(cliVersion);

program
	.command("disable")
	.description(
		"Adds disabling comment line to the top of all files in the project that match the provided regex pattern.",
	)
	.option(
		"-r, --rootDir <path>",
		"path to directory to add disabling comment in",
	)
	.option(
		"-p, --pattern <regex...>",
		"regex pattern to match files against (e.g. \\.[cm]?[jt]sx?$ \\.test\\.[cm]?[jt]sx?$)",
	)
	.action(disable);

program
	.command("check")
	.description(
		"Checks all files in the project for disabling comments and errors if found.",
	)
	.option("-r, --rootDir <path>", "path to directory to check", "./")
	.option(
		"-p, --pattern <regex...>",
		"regex pattern to match files against (e.g. \\.[cm]?[jt]sx?$ \\.test\\.[cm]?[jt]sx?$)",
	)
	.action(check);

program
	.command("check-staged")
	.description(
		"Checks staged files for disabling comments and errors if found.",
	)
	.option("-r, --rootDir <path>", "path to directory to check", "./")
	.option(
		"-p, --pattern <regex...>",
		"regex pattern to match files against (e.g. \\.[cm]?[jt]sx?$ \\.test\\.[cm]?[jt]sx?$)",
	)
	.action(checkStaged);

program.parse();
