import { beforeEach, describe, expect, it, vi } from "vitest";

import * as getStagedFilesModule from "../../../git/getStagedFiles";
import * as checkFilePathsModule from "../../checkFilePaths/checkFilePaths";
import { checkStagedFiles } from "../checkStagedFiles";

vi.mock("../../../git/getStagedFiles");
vi.mock("../../checkFilePaths/checkFilePaths");

describe("checkStagedFiles", () => {
	const MOCK_COMMENT = "/* eslint-disable */";

	beforeEach(() => {
		vi.resetAllMocks();
	});

	it("should resolve when no staged files", async () => {
		expect.hasAssertions();

		vi.spyOn(getStagedFilesModule, "getStagedFiles").mockReturnValue([]);
		vi.spyOn(checkFilePathsModule, "checkFilePaths").mockResolvedValue();

		await expect(
			checkStagedFiles({ disablingComment: MOCK_COMMENT }),
		).resolves.toBeUndefined();

		expect(getStagedFilesModule.getStagedFiles).toHaveBeenCalledWith("./");
		expect(checkFilePathsModule.checkFilePaths).toHaveBeenCalledWith({
			filePathsToCheck: [],
			disablingComment: MOCK_COMMENT,
		});
	});

	it("should filter staged files by regex and check them", async () => {
		expect.hasAssertions();

		const mockStagedFiles = [
			"/path/to/file1.ts",
			"/path/to/file2.js",
			"/path/to/file3.py",
			"/path/to/file4.jsx",
		];
		const expectedFilteredFiles = [
			"/path/to/file1.ts",
			"/path/to/file2.js",
			"/path/to/file4.jsx",
		];

		vi.spyOn(getStagedFilesModule, "getStagedFiles").mockReturnValue(
			mockStagedFiles,
		);
		vi.spyOn(checkFilePathsModule, "checkFilePaths").mockResolvedValue();

		await expect(
			checkStagedFiles({ disablingComment: MOCK_COMMENT }),
		).resolves.toBeUndefined();

		expect(checkFilePathsModule.checkFilePaths).toHaveBeenCalledWith({
			filePathsToCheck: expectedFilteredFiles,
			disablingComment: MOCK_COMMENT,
		});
	});

	it("should use custom rootDir", async () => {
		expect.hasAssertions();

		const customRootDir = "/custom/path";

		vi.spyOn(getStagedFilesModule, "getStagedFiles").mockReturnValue([]);
		vi.spyOn(checkFilePathsModule, "checkFilePaths").mockResolvedValue();

		await expect(
			checkStagedFiles({
				rootDir: customRootDir,
				disablingComment: MOCK_COMMENT,
			}),
		).resolves.toBeUndefined();

		expect(getStagedFilesModule.getStagedFiles).toHaveBeenCalledWith(
			customRootDir,
		);
	});

	it("should use custom filesRegex", async () => {
		expect.hasAssertions();

		const customRegex = [/\.test\.ts$/];
		const mockStagedFiles = [
			"/path/to/file1.ts",
			"/path/to/file2.test.ts",
			"/path/to/file3.js",
		];
		const expectedFilteredFiles = ["/path/to/file2.test.ts"];

		vi.spyOn(getStagedFilesModule, "getStagedFiles").mockReturnValue(
			mockStagedFiles,
		);
		vi.spyOn(checkFilePathsModule, "checkFilePaths").mockResolvedValue();

		await expect(
			checkStagedFiles({
				filesRegex: customRegex,
				disablingComment: MOCK_COMMENT,
			}),
		).resolves.toBeUndefined();

		expect(checkFilePathsModule.checkFilePaths).toHaveBeenCalledWith({
			filePathsToCheck: expectedFilteredFiles,
			disablingComment: MOCK_COMMENT,
		});
	});

	it("should call onFileProcessed for each filtered file", async () => {
		expect.hasAssertions();

		const mockOnFileProcessed = vi.fn();
		const mockStagedFiles = [
			"/path/to/file1.ts",
			"/path/to/file2.js",
			"/path/to/file3.py",
		];
		const expectedFilteredFiles = ["/path/to/file1.ts", "/path/to/file2.js"];

		vi.spyOn(getStagedFilesModule, "getStagedFiles").mockReturnValue(
			mockStagedFiles,
		);
		vi.spyOn(checkFilePathsModule, "checkFilePaths").mockResolvedValue();

		await expect(
			checkStagedFiles({
				onFileProcessed: mockOnFileProcessed,
				disablingComment: MOCK_COMMENT,
			}),
		).resolves.toBeUndefined();

		expect(mockOnFileProcessed).toHaveBeenCalledTimes(
			expectedFilteredFiles.length,
		);
	});

	it("should propagate errors from checkFilePaths", async () => {
		expect.hasAssertions();

		const mockError = new Error("Eslint disable found");
		const mockStagedFiles = ["/path/to/file1.ts"];

		vi.spyOn(getStagedFilesModule, "getStagedFiles").mockReturnValue(
			mockStagedFiles,
		);
		vi.spyOn(checkFilePathsModule, "checkFilePaths").mockRejectedValue(
			mockError,
		);

		await expect(
			checkStagedFiles({ disablingComment: MOCK_COMMENT }),
		).rejects.toThrow(mockError);
	});

	it("should handle multiple regex patterns", async () => {
		expect.hasAssertions();

		const multipleRegex = [/\.ts$/, /\.py$/];
		const mockStagedFiles = [
			"/path/to/file1.ts",
			"/path/to/file2.js",
			"/path/to/file3.py",
			"/path/to/file4.txt",
		];
		const expectedFilteredFiles = ["/path/to/file1.ts", "/path/to/file3.py"];

		vi.spyOn(getStagedFilesModule, "getStagedFiles").mockReturnValue(
			mockStagedFiles,
		);
		vi.spyOn(checkFilePathsModule, "checkFilePaths").mockResolvedValue();

		await expect(
			checkStagedFiles({
				filesRegex: multipleRegex,
				disablingComment: MOCK_COMMENT,
			}),
		).resolves.toBeUndefined();

		expect(checkFilePathsModule.checkFilePaths).toHaveBeenCalledWith({
			filePathsToCheck: expectedFilteredFiles,
			disablingComment: MOCK_COMMENT,
		});
	});
});
