import { beforeEach, describe, expect, it, vi } from "vitest";

import { DEFAULT_LINTED_FILE_REGEX } from "../../../../constants/regex";
import * as getDeepFilesFromDirModule from "../../../fs/getDeepFilesFromDir/getDeepFilesFromDir";
import * as checkFilePathsModule from "../../checkFilePaths/checkFilePaths";
import { checkFiles } from "../checkFiles";

vi.mock("../../../fs/getDeepFilesFromDir/getDeepFilesFromDir");
vi.mock("../../checkFilePaths/checkFilePaths");

describe("checkFiles", () => {
	const MOCK_COMMENT = "/* custom-disable-comment */";

	beforeEach(() => {
		vi.resetAllMocks();
	});

	it("should resolve when no files found", async () => {
		expect.hasAssertions();

		vi.spyOn(getDeepFilesFromDirModule, "getDeepFilesFromDir").mockReturnValue(
			[],
		);
		vi.spyOn(checkFilePathsModule, "checkFilePaths").mockResolvedValue();

		await expect(
			checkFiles({ disablingComment: MOCK_COMMENT }),
		).resolves.toBeUndefined();

		expect(getDeepFilesFromDirModule.getDeepFilesFromDir).toHaveBeenCalledWith(
			"./",
			[DEFAULT_LINTED_FILE_REGEX],
		);
		expect(checkFilePathsModule.checkFilePaths).toHaveBeenCalledWith({
			filePathsToCheck: [],
			disablingComment: MOCK_COMMENT,
		});
	});

	it("should find files and check them", async () => {
		expect.hasAssertions();

		const mockFiles = ["/path/to/file1.ts", "/path/to/file2.js"];

		vi.spyOn(getDeepFilesFromDirModule, "getDeepFilesFromDir").mockReturnValue(
			mockFiles,
		);
		vi.spyOn(checkFilePathsModule, "checkFilePaths").mockResolvedValue();

		await expect(
			checkFiles({ disablingComment: MOCK_COMMENT }),
		).resolves.toBeUndefined();

		expect(checkFilePathsModule.checkFilePaths).toHaveBeenCalledWith({
			filePathsToCheck: mockFiles,
			disablingComment: MOCK_COMMENT,
		});
	});

	it("should use custom rootDir", async () => {
		expect.hasAssertions();

		const customRootDir = "/custom/path";
		const mockFiles = ["/custom/path/file1.ts"];

		vi.spyOn(getDeepFilesFromDirModule, "getDeepFilesFromDir").mockReturnValue(
			mockFiles,
		);
		vi.spyOn(checkFilePathsModule, "checkFilePaths").mockResolvedValue();

		await expect(
			checkFiles({ rootDir: customRootDir, disablingComment: MOCK_COMMENT }),
		).resolves.toBeUndefined();

		expect(getDeepFilesFromDirModule.getDeepFilesFromDir).toHaveBeenCalledWith(
			customRootDir,
			[DEFAULT_LINTED_FILE_REGEX],
		);
		expect(checkFilePathsModule.checkFilePaths).toHaveBeenCalledWith({
			filePathsToCheck: mockFiles,
			disablingComment: MOCK_COMMENT,
		});
	});

	it("should use custom filesRegex", async () => {
		expect.hasAssertions();

		const customRegex = [/\.test\.ts$/];
		const mockFiles = ["/path/to/file1.test.ts"];

		vi.spyOn(getDeepFilesFromDirModule, "getDeepFilesFromDir").mockReturnValue(
			mockFiles,
		);
		vi.spyOn(checkFilePathsModule, "checkFilePaths").mockResolvedValue();

		await expect(
			checkFiles({ filesRegex: customRegex, disablingComment: MOCK_COMMENT }),
		).resolves.toBeUndefined();

		expect(getDeepFilesFromDirModule.getDeepFilesFromDir).toHaveBeenCalledWith(
			"./",
			customRegex,
		);
		expect(checkFilePathsModule.checkFilePaths).toHaveBeenCalledWith({
			filePathsToCheck: mockFiles,
			disablingComment: MOCK_COMMENT,
		});
	});

	it("should propagate errors from checkFilePaths", async () => {
		expect.hasAssertions();

		const mockError = new Error("Eslint disable found");
		const mockFiles = ["/path/to/file1.ts"];

		vi.spyOn(getDeepFilesFromDirModule, "getDeepFilesFromDir").mockReturnValue(
			mockFiles,
		);
		vi.spyOn(checkFilePathsModule, "checkFilePaths").mockRejectedValue(
			mockError,
		);

		await expect(
			checkFiles({ disablingComment: MOCK_COMMENT }),
		).rejects.toThrow(mockError);
	});

	it("should handle multiple regex patterns", async () => {
		expect.hasAssertions();

		const multipleRegex = [/\.ts$/, /\.py$/];
		const mockFiles = ["/path/to/file1.ts", "/path/to/file2.py"];

		vi.spyOn(getDeepFilesFromDirModule, "getDeepFilesFromDir").mockReturnValue(
			mockFiles,
		);
		vi.spyOn(checkFilePathsModule, "checkFilePaths").mockResolvedValue();

		await expect(
			checkFiles({ filesRegex: multipleRegex, disablingComment: MOCK_COMMENT }),
		).resolves.toBeUndefined();

		expect(checkFilePathsModule.checkFilePaths).toHaveBeenCalledWith({
			filePathsToCheck: mockFiles,
			disablingComment: MOCK_COMMENT,
		});
	});

	it("should handle empty results from getDeepFilesFromDir", async () => {
		expect.hasAssertions();

		vi.spyOn(getDeepFilesFromDirModule, "getDeepFilesFromDir").mockReturnValue(
			[],
		);
		vi.spyOn(checkFilePathsModule, "checkFilePaths").mockResolvedValue();

		await expect(
			checkFiles({ rootDir: "/empty/dir", disablingComment: MOCK_COMMENT }),
		).resolves.toBeUndefined();

		expect(checkFilePathsModule.checkFilePaths).toHaveBeenCalledWith({
			filePathsToCheck: [],
			disablingComment: MOCK_COMMENT,
		});
	});
});
