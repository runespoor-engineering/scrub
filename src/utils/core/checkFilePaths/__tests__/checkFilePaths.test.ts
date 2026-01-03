import path from "node:path";
import { ERRORS } from "../../../../constants/messages";
import * as readFileStreamModule from "../../../fs/readFileStream/readFileStream";
import { checkFilePaths } from "../checkFilePaths";

vi.mock("node:path");
vi.mock("../../../fs/readFileStream/readFileStream");

describe("checkFilePaths", () => {
	const MOCK_COMMENT = "/* test-disable */";

	beforeEach(() => {
		vi.resetAllMocks();
	});

	it("should resolve when no files to check", async () => {
		expect.hasAssertions();

		// Passing required disablingComment even for empty checks
		await expect(
			checkFilePaths({ disablingComment: MOCK_COMMENT }),
		).resolves.toBeUndefined();

		await expect(
			checkFilePaths({ filePathsToCheck: [], disablingComment: MOCK_COMMENT }),
		).resolves.toBeUndefined();
	});

	it("should resolve when files do not contain the provided disabling comment", async () => {
		expect.hasAssertions();

		const mockFiles = ["file1.ts", "file2.ts"];
		const mockContent = "export const test = true;";

		vi.mocked(path.resolve).mockReturnValue("./file1.ts");
		vi.spyOn(readFileStreamModule, "readFileStream").mockImplementation(
			(_, callback) => {
				callback(null, mockContent);
			},
		);

		await expect(
			checkFilePaths({
				filePathsToCheck: mockFiles,
				disablingComment: MOCK_COMMENT,
			}),
		).resolves.toBeUndefined();
	});

	it("should reject when files contain the provided disabling comment", async () => {
		expect.hasAssertions();

		const mockFiles = ["file1.ts"];
		// Use MOCK_COMMENT here instead of hardcoded constant
		const mockContent = `${MOCK_COMMENT}\nexport const test = true;`;

		vi.mocked(path.resolve).mockReturnValue("/absolute/path/file1.ts");
		vi.spyOn(readFileStreamModule, "readFileStream").mockImplementation(
			(_, callback) => {
				callback(null, mockContent);
			},
		);

		await expect(
			checkFilePaths({
				filePathsToCheck: mockFiles,
				disablingComment: MOCK_COMMENT,
			}),
		).rejects.toThrow(ERRORS.disableFoundError("/absolute/path/file1.ts"));
	});

	it("should handle files with only the disabling comment and whitespace", async () => {
		expect.hasAssertions();

		const mockFiles = ["file1.ts"];
		const mockContent = `  ${MOCK_COMMENT}  \n\nexport const test = true;`;

		vi.mocked(path.resolve).mockReturnValue("/absolute/path/file1.ts");
		vi.spyOn(readFileStreamModule, "readFileStream").mockImplementation(
			(_, callback) => {
				callback(null, mockContent);
			},
		);

		await expect(
			checkFilePaths({
				filePathsToCheck: mockFiles,
				disablingComment: MOCK_COMMENT,
			}),
		).rejects.toThrow(ERRORS.disableFoundError("/absolute/path/file1.ts"));
	});

	it("should handle read file errors", async () => {
		expect.hasAssertions();

		const mockFiles = ["file1.ts"];
		const mockError = new Error("Read error");

		vi.mocked(path.resolve).mockReturnValue("/absolute/path/file1.ts");
		vi.spyOn(readFileStreamModule, "readFileStream").mockImplementation(
			(_, callback) => {
				callback(mockError, null);
			},
		);

		await expect(
			checkFilePaths({
				filePathsToCheck: mockFiles,
				disablingComment: MOCK_COMMENT,
			}),
		).rejects.toThrow(ERRORS.readFileError("/absolute/path/file1.ts"));
	});

	it("should handle multiple files with mixed results using the comment", async () => {
		expect.hasAssertions();

		const mockFiles = ["file1.ts", "file2.ts", "file3.ts"];
		const cleanContent = "export const test = true;";
		const dirtyContent = `${MOCK_COMMENT}\nexport const test = true;`;

		vi.mocked(path.resolve)
			.mockReturnValueOnce("/absolute/path/file1.ts")
			.mockReturnValueOnce("/absolute/path/file2.ts")
			.mockReturnValueOnce("/absolute/path/file3.ts");

		vi.spyOn(readFileStreamModule, "readFileStream").mockImplementation(
			(filePath, callback) => {
				if (filePath === "/absolute/path/file1.ts") {
					callback(null, cleanContent);
				} else {
					callback(null, dirtyContent);
				}
			},
		);

		const expectedError = [
			ERRORS.disableFoundError("/absolute/path/file2.ts"),
			ERRORS.disableFoundError("/absolute/path/file3.ts"),
		].join("\n");

		await expect(
			checkFilePaths({
				filePathsToCheck: mockFiles,
				disablingComment: MOCK_COMMENT,
			}),
		).rejects.toThrow(expectedError);
	});

	it("should handle empty or null file content", async () => {
		expect.hasAssertions();

		const mockFiles = ["file1.ts"];

		vi.mocked(path.resolve).mockReturnValue("/absolute/path/file1.ts");
		vi.spyOn(readFileStreamModule, "readFileStream").mockImplementation(
			(_, callback) => {
				callback(null, ""); // Test empty string
			},
		);

		await expect(
			checkFilePaths({
				filePathsToCheck: mockFiles,
				disablingComment: MOCK_COMMENT,
			}),
		).resolves.toBeUndefined();
	});

	it("should resolve absolute paths for files and pass comment logic", async () => {
		expect.hasAssertions();

		const mockFiles = ["./relative/file1.ts"];
		const mockContent = "export const test = true;";

		vi.mocked(path.resolve).mockReturnValue("/absolute/path/relative/file1.ts");
		vi.spyOn(readFileStreamModule, "readFileStream").mockImplementation(
			(_, callback) => {
				callback(null, mockContent);
			},
		);

		await expect(
			checkFilePaths({
				filePathsToCheck: mockFiles,
				disablingComment: MOCK_COMMENT,
			}),
		).resolves.toBeUndefined();

		expect(path.resolve).toHaveBeenCalledWith("./relative/file1.ts");
	});
});
