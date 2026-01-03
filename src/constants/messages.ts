export const ERRORS = {
	writeFileError: (filePath: string) =>
		`[Error] Failed to write to ${filePath} file.`,
	readFileError: (filePath: string) =>
		`[Error] Failed to read ${filePath} file.`,
	disableFoundError: (filePath?: string) =>
		filePath
			? `[Error] File ${filePath} contains disabling comment. Please remove it.`
			: `[Error] File contains disabling comment. Please remove it.`,
};

export const SUCCESS = {
	disableFile: (filePath: string) =>
		`[Success] Successfully added disabling comment for ${filePath}`,
	cleanFiles: () =>
		`[Success] All files are clean - no disabling comments found.`,
};

export const INFO = {
	checkingFilesInDir: (dir: string) =>
		`[Info] Checking files in ${dir} for disabling comments...`,
	checkingStagedFiles: () =>
		`[Info] Checking staged files for disabling comments...`,
	fileChecked: (filePath: string) => `✓ Checked: ${filePath}`,
};
