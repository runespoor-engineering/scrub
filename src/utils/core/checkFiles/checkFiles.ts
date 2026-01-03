import { DEFAULT_LINTED_FILE_REGEX } from "../../../constants/regex";
import { getDeepFilesFromDir } from "../../fs/getDeepFilesFromDir/getDeepFilesFromDir";
import { checkFilePaths } from "../checkFilePaths/checkFilePaths";

/**
 * Checks if files in a directory contain the disabling comment and throws an error if they do
 * @param {Object} options - Configuration options
 * @param {string} [options.rootDir='./'] - Directory path to start searching from
 * @param {RegExp[]} [options.filesRegex=[DEFAULT_LINTED_FILE_REGEX]] - Array of RegExp patterns to match files against
 * @param {string} [options.disablingComment] - Disabling comment that will be checked in the file, e.g. \/* eslint-disable *\/
 * @returns {Promise<void>} Promise that resolves when all files have been checked, or rejects if any file contains disabling comment
 */
export const checkFiles = async ({
	rootDir = "./",
	filesRegex = [DEFAULT_LINTED_FILE_REGEX],
	disablingComment,
}: {
	rootDir?: string;
	filesRegex?: RegExp[];
	disablingComment: string;
}) => {
	// Get all files from the directory that match the regex patterns
	const filePathsToCheck = getDeepFilesFromDir(rootDir, filesRegex);

	// Check the files for eslint-disable comments
	return checkFilePaths({ filePathsToCheck, disablingComment });
};
