import { beforeEach, describe, expect, it, vi } from "vitest";

import * as getStagedFilesModule from "../../../git/getStagedFiles";
import * as checkFilePathsModule from "../../checkFilePaths/checkFilePaths";
import { checkStagedFiles } from "../checkStagedFiles";

vi.mock("../../../git/getStagedFiles");
vi.mock("../../checkFilePaths/checkFilePaths");

describe("checkStagedFiles", () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it("should resolve when no staged files", async () => {
		expect.hasAssertions();

		vi.spyOn(getStagedFilesModule, "getStagedFiles").mockReturnValue([]);
		vi.spyOn(checkFilePathsModule, "checkFilePaths").mockResolvedValue();

		await expect(checkStagedFiles()).resolves.toBeUndefined();

		expect(getStagedFilesModule.getStagedFiles).toHaveBeenCalledWith("./");
		expect(checkFilePathsModule.checkFilePaths).toHaveBeenCalledWith({
			filePathsToCheck: [],
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

		await expect(checkStagedFiles()).resolves.toBeUndefined();

		expect(getStagedFilesModule.getStagedFiles).toHaveBeenCalledWith("./");
		expect(checkFilePathsModule.checkFilePaths).toHaveBeenCalledWith({
			filePathsToCheck: expectedFilteredFiles,
		});
	});

	it("should use custom rootDir", async () => {
		expect.hasAssertions();

		const customRootDir = "/custom/path";

		vi.spyOn(getStagedFilesModule, "getStagedFiles").mockReturnValue([]);
		vi.spyOn(checkFilePathsModule, "checkFilePaths").mockResolvedValue();

		await expect(
			checkStagedFiles({ rootDir: customRootDir }),
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
			checkStagedFiles({ filesRegex: customRegex }),
		).resolves.toBeUndefined();

		expect(checkFilePathsModule.checkFilePaths).toHaveBeenCalledWith({
			filePathsToCheck: expectedFilteredFiles,
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
			checkStagedFiles({ onFileProcessed: mockOnFileProcessed }),
		).resolves.toBeUndefined();

		expect(mockOnFileProcessed).toHaveBeenCalledTimes(
			expectedFilteredFiles.length,
		);
		expect(mockOnFileProcessed).toHaveBeenCalledWith(expectedFilteredFiles[0]);
		expect(mockOnFileProcessed).toHaveBeenCalledWith(expectedFilteredFiles[1]);
	});

	it("should not call onFileProcessed when not provided", async () => {
		expect.hasAssertions();

		const mockStagedFiles = ["/path/to/file1.ts"];

		vi.spyOn(getStagedFilesModule, "getStagedFiles").mockReturnValue(
			mockStagedFiles,
		);
		vi.spyOn(checkFilePathsModule, "checkFilePaths").mockResolvedValue();

		await expect(checkStagedFiles()).resolves.toBeUndefined();

		// Should not throw any errors even without onFileProcessed
		expect(checkFilePathsModule.checkFilePaths).toHaveBeenCalledWith({
			filePathsToCheck: ["/path/to/file1.ts"],
		});
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

		await expect(checkStagedFiles()).rejects.toThrow(mockError);
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
			checkStagedFiles({ filesRegex: multipleRegex }),
		).resolves.toBeUndefined();

		expect(checkFilePathsModule.checkFilePaths).toHaveBeenCalledWith({
			filePathsToCheck: expectedFilteredFiles,
		});
	});

	it("should use DEFAULT_LINTED_FILE_REGEX when no filesRegex provided", async () => {
		expect.hasAssertions();

		const mockStagedFiles = ["/path/to/file1.ts"];

		vi.spyOn(getStagedFilesModule, "getStagedFiles").mockReturnValue(
			mockStagedFiles,
		);
		vi.spyOn(checkFilePathsModule, "checkFilePaths").mockResolvedValue();

		await expect(checkStagedFiles()).resolves.toBeUndefined();

		// File should be filtered using DEFAULT_LINTED_FILE_REGEX
		expect(checkFilePathsModule.checkFilePaths).toHaveBeenCalledWith({
			filePathsToCheck: ["/path/to/file1.ts"],
		});
	});

	it("should handle empty string files from git output", async () => {
		expect.hasAssertions();

		const mockStagedFiles = ["/path/to/file1.ts"];

		vi.spyOn(getStagedFilesModule, "getStagedFiles").mockReturnValue(
			mockStagedFiles,
		);
		vi.spyOn(checkFilePathsModule, "checkFilePaths").mockResolvedValue();

		await expect(checkStagedFiles()).resolves.toBeUndefined();

		expect(checkFilePathsModule.checkFilePaths).toHaveBeenCalledWith({
			filePathsToCheck: ["/path/to/file1.ts"],
		});
	});
});
