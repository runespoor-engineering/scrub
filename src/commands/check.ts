import { ERRORS, INFO, SUCCESS } from "../constants/messages";
import { DEFAULT_LINTED_FILE_REGEX } from "../constants/regex";
import { checkFiles } from "../utils/core/checkFiles/checkFiles";

export const check = async (options: {
	rootDir?: string;
	pattern?: string[];
	disablingComment: string;
}) => {
	try {
		const rootDir = options.rootDir || "./";
		const filesRegex = options.pattern
			? options.pattern.map((pattern) => new RegExp(pattern))
			: [DEFAULT_LINTED_FILE_REGEX];

		console.log(INFO.checkingFilesInDir(rootDir));

		await checkFiles({
			rootDir,
			filesRegex,
			disablingComment: options.disablingComment,
		});

		console.log(SUCCESS.cleanFiles());
	} catch (error) {
		console.error(ERRORS.disableFoundError());
		console.error(error instanceof Error ? error.message : String(error));
		process.exit(1);
	}
};
