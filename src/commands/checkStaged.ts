import { ERRORS, INFO, SUCCESS } from "../constants/messages";
import { DEFAULT_LINTED_FILE_REGEX } from "../constants/regex";
import { checkStagedFiles } from "../utils/core/checkStagedFiles/checkStagedFiles";

export const checkStaged = async (options: {
	rootDir?: string;
	pattern?: string[];
}) => {
	try {
		const rootDir = options.rootDir || "./";
		const filesRegex = options.pattern
			? options.pattern.map((pattern) => new RegExp(pattern))
			: [DEFAULT_LINTED_FILE_REGEX];

		console.log(INFO.checkingStagedFiles());

		await checkStagedFiles({
			rootDir,
			filesRegex,
			onFileProcessed: (filePath) => {
				console.log(INFO.fileChecked(filePath));
			},
		});

		console.log(SUCCESS.cleanFiles());
	} catch (error) {
		console.error(ERRORS.disableFoundError());
		console.error(error instanceof Error ? error.message : String(error));
		process.exit(1);
	}
};
