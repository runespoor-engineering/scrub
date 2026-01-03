import { SUCCESS } from "../constants/messages";
import { disableFiles } from "../utils/core/disableFiles/disableFiles";

export const disable = async (options: {
	rootDir?: string;
	pattern?: string[];
	disablingComment: string;
}) => {
	const processedPatterns = options.pattern?.map(
		(pattern) => new RegExp(pattern),
	);
	await disableFiles({
		rootDir: options.rootDir,
		filesRegex: processedPatterns,
		disablingComment: options.disablingComment,
		onFileProcessed: (filePath) => {
			console.info(SUCCESS.disableFile(filePath));
		},
	});
};
