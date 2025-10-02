import { Box } from "../src";

const {
	put,
	drop,
	contents,
	tree
} = new Box({
	repo: "clqu/cdnhub",
	token: ""
});

(async () => {
	await put("test-folder/hello.txt", Buffer.from("Hello, CDNHub!"));
	const files = await contents("test-folder").catch(() => []);
	const fileTree = await tree();
	console.log("Contents of 'test-folder':", files);
	console.log("Full file tree:", fileTree);
	await drop("test-folder/hello.txt");
})();