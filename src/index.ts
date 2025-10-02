import { Octokit } from "octokit";
interface File {
	name: string;
	path: string;
	type: "file" | "dir";
	size: number;
	content?: File[];
	raw_content?: string;
};

export class Box {
	private octokit: Octokit;
	private owner: string;
	private repo: string;
	private branch: string;

	constructor(options: { repo: string; branch?: string; token: string }) {
		const [owner, repo] = options.repo.split("/");
		if (!owner || !repo) {
			throw new Error("Invalid repository format. Use 'owner/repo'.");
		}
		this.owner = owner;
		this.repo = repo;
		this.branch = options.branch || "main";
		this.octokit = new Octokit({ auth: options.token });
	}

	put = async (path: string, content: Buffer, message?: string): Promise<void> => {
		const encodedContent = content.toString("base64");
		const commitMessage = message || `Add ${path}`;

		let sha: string | undefined;
		try {
			const { data: existingFile } = await this.octokit.rest.repos.getContent({
				owner: this.owner,
				repo: this.repo,
				path,
				ref: this.branch
			});
			if ("sha" in existingFile) {
				sha = existingFile.sha;
			}
		} catch (error: any) {
			if (error.status !== 404) {
				throw error;
			}
		}

		await this.octokit.rest.repos.createOrUpdateFileContents({
			owner: this.owner,
			repo: this.repo,
			path,
			message: '[npm/cdnhub]: ' + commitMessage,
			content: encodedContent,
			branch: this.branch,
			...(sha && { sha })
		});
	}

	drop = async (path: string, message?: string): Promise<void> => {
		const { data: fileData } = await this.octokit.rest.repos.getContent({
			owner: this.owner,
			repo: this.repo,
			path,
			ref: this.branch
		});

		if (!("sha" in fileData)) {
			throw new Error(`File at path ${path} not found.`);
		}

		const commitMessage = message || `Delete ${path}`;

		await this.octokit.rest.repos.deleteFile({
			owner: this.owner,
			repo: this.repo,
			path,
			message: '[npm/cdnhub]: ' + commitMessage,
			sha: fileData.sha,
			branch: this.branch
		});
	}

	contents = async (path: string = "", options: { withContent?: boolean } = {}): Promise<File[]> => {
		try {
			const data = await this.octokit.rest.repos.getContent({
				owner: this.owner,
				repo: this.repo,
				path,
				ref: this.branch
			});

			if (Array.isArray(data.data)) {
				return data.data.map((item: any) => ({ name: item.name, path: item.path, type: item.type, size: item.size, raw_content: options.withContent && item.type === "file" ? item.content : undefined }));
			} else return [];
		} catch (error: any) {
			throw error;
		}
	}

	tree = async (options: { withContent?: boolean } = {}): Promise<File[]> => {
		const traverse = async (path: string): Promise<File[]> => {
			const items = await this.contents(path, { withContent: options.withContent || false });

			const result: File[] = [];

			for (const item of items) {
				if (item.type === "dir") {
					const dir: File = {
						name: item.name,
						path: item.path,
						type: "dir",
						size: item.size,
						content: await traverse(item.path)
					};
					result.push(dir);
				} else if (item.type === "file") {
					result.push({
						name: item.name,
						path: item.path,
						type: "file",
						size: item.size
					});
				}
			}

			return result;
		};

		const tree = await traverse("");
		return tree;
	}
}