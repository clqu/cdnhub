# CDNHub

![Version](https://img.shields.io/npm/v/cdnhub)
![License](https://img.shields.io/npm/l/cdnhub)
![Downloads](https://img.shields.io/npm/dt/cdnhub)

A powerful CDN solution using GitHub repositories for file hosting and distribution.

## 📦 Installation

```bash
# Using npm
npm install cdnhub

# Using yarn
yarn add cdnhub

# Using pnpm
pnpm add cdnhub

# Using bun
bun add cdnhub
```

## 🚀 Quick Start

### Basic Usage

```typescript
import { Box } from 'cdnhub';

// Initialize with your GitHub repository
const box = new Box({
  repo: "username/repository",
  token: "your-github-token",
  branch: "main" // optional, defaults to "main"
});

// Upload a file
await box.put("assets/image.jpg", fileBuffer, "Add new image");

// Get directory contents
const files = await box.contents("assets");

// Get full repository tree
const tree = await box.tree();

// Delete a file
await box.drop("assets/old-image.jpg", "Remove old image");
```

### Real-world Example

```typescript
import { Box } from 'cdnhub';
import fs from 'fs';

const cdn = new Box({
  repo: "mycompany/assets-cdn",
  token: process.env.GITHUB_TOKEN
});

async function uploadAsset(filePath: string, content: Buffer) {
  try {
    await cdn.put(filePath, content);
    console.log(`✅ Uploaded: ${filePath}`);
    
    // Your file is now available at:
    // https://cdn.jsdelivr.net/gh/mycompany/assets-cdn/${filePath}
  } catch (error) {
    console.error(`❌ Upload failed: ${error.message}`);
  }
}

// Upload an image
const imageBuffer = fs.readFileSync('./logo.png');
await uploadAsset('images/logo.png', imageBuffer);
```

## 🌟 Features

- � **File Management**: Upload, delete, and organize files in GitHub repositories
- 🌐 **CDN Ready**: Perfect integration with CDN services like jsDelivr
- 🔄 **Tree Structure**: Get complete directory structures and file listings
- 🔒 **GitHub Integration**: Secure authentication using GitHub tokens
- ⚡ **Fast Operations**: Efficient file operations with GitHub API
- 🎯 **TypeScript Support**: Full TypeScript support with type definitions
- 🌳 **Branch Support**: Work with different branches of your repository

## 🛠️ Configuration

### GitHub Token Setup

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate a new token with `repo` permissions
3. Use the token in your Box configuration

```typescript
const box = new Box({
  repo: "username/repo-name",
  token: "ghp_your_token_here",
  branch: "main" // or any other branch
});
```

## 📚 API Reference

### `new Box(options)`

Creates a new CDNHub instance.

**Parameters:**
- `repo` (string): Repository in format "owner/repo"
- `token` (string): GitHub personal access token
- `branch` (string, optional): Branch name (defaults to "main")

### `put(path, content, message?)`

Uploads or updates a file in the repository.

**Parameters:**
- `path` (string): File path in the repository
- `content` (Buffer): File content as Buffer
- `message` (string, optional): Commit message

### `drop(path, message?)`

Deletes a file from the repository.

**Parameters:**
- `path` (string): File path to delete
- `message` (string, optional): Commit message

### `contents(path?, options?)`

Gets the contents of a directory.

**Parameters:**
- `path` (string, optional): Directory path (defaults to root)
- `options` (object, optional): Options for the request
  - `withContent` (boolean, optional): Include file content (defaults to false)

**Returns:** `Promise<File[]>`

### `tree(options?)`

Gets the complete file tree of the repository.

**Parameters:**
- `options` (object, optional): Options for the request
  - `withContent` (boolean, optional): Include file content (defaults to false)

**Returns:** `Promise<File[]>`

## 💡 Usage Examples

### Static Website Assets

```typescript
// Upload website assets
await box.put('css/style.css', cssBuffer);
await box.put('js/app.js', jsBuffer);
await box.put('images/hero.jpg', imageBuffer);

// Access via CDN
// https://cdn.jsdelivr.net/gh/username/repo/css/style.css
```

### API Documentation Assets

```typescript
// Organize documentation assets
await box.put('docs/images/architecture.png', diagramBuffer);
await box.put('docs/examples/sample.json', jsonBuffer);

// List all documentation files
const docFiles = await box.contents('docs');
```

### Backup and Archive

```typescript
// Create dated backups
const date = new Date().toISOString().split('T')[0];
await box.put(`backups/${date}/data.json`, backupData);

// Clean old backups
const backups = await box.contents('backups');
// ... cleanup logic
```

## � CDN Integration

CDNHub works perfectly with popular CDN services:

### jsDelivr
```
https://cdn.jsdelivr.net/gh/username/repo@branch/path/to/file
```

### Statically
```
https://cdn.statically.io/gh/username/repo/branch/path/to/file
```

### GitHack
```
https://raw.githack.com/username/repo/branch/path/to/file
```

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

[MIT](LICENSE) © clqu