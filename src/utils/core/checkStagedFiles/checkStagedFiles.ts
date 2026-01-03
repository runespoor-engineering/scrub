import { DEFAULT_LINTED_FILE_REGEX } from "../../../constants/regex";
import { getStagedFiles } from "../../git/getStagedFiles";
import { checkFilePaths } from "../checkFilePaths/checkFilePaths";

/**
 * Checks if staged files contain the disabling comment and throws an error if they do
 * @param {Object} options
 * Configuration options
 * @param {string} [options.rootDir='./']
 * Root directory to execute git command from
 * @param {RegExp[]} [options.filesRegex=[DEFAULT_LINTED_FILE_REGEX]]
 * Array of RegExp patterns to filter files
 * @param {function} [options.onFileProcessed]
 * Disabling comment that will be checked in the file, e.g. \/* eslint-disable *\/
 * @param {string} [options.disablingComment]
 * Callback function called after each file is processed with the file path
 * @returns {Promise<void>}
 * Promise that resolves when all staged files have been checked,
 * or rejects if any file contains disabling comment
 */
export const checkStagedFiles = async ({
	rootDir = "./",
	filesRegex = [DEFAULT_LINTED_FILE_REGEX],
	onFileProcessed,
	disablingComment,
}: {
	rootDir?: string;
	filesRegex?: RegExp[];
	onFileProcessed?: (filePath: string) => void;
	disablingComment: string;
}) => {
	// Get all staged files
	const stagedFiles = getStagedFiles(rootDir);

	// Filter staged files based on the provided regex patterns
	const filteredFiles = stagedFiles.filter((filePath) =>
		filesRegex.some((regex) => regex.test(filePath)),
	);

	// Check the filtered files for eslint-disable comments
	const result = await checkFilePaths({
		filePathsToCheck: filteredFiles,
		disablingComment,
	});

	// Call onFileProcessed for each file if provided
	if (onFileProcessed) {
		filteredFiles.forEach((filePath) => onFileProcessed(filePath));
	}

	return result;
};
