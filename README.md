# Asymmetric Key Generator

A desktop application for generating and managing asymmetric cryptographic key pairs. Built with Electron, this tool provides a secure and user-friendly interface for generating RSA and Ed25519 keys in PKCS#8 format.

## Features

- **Multiple Key Types**: Support for Ed25519, RSA-2048, and RSA-4096 key pairs
- **Key Pair Generation**: Generate complete public/private key pairs with one click
- **Public Key Derivation**: Automatically derive public keys from pasted private keys
- **Key Management**: Copy keys to clipboard or save them to files
- **Secure Storage**: Keys are saved with restricted file permissions (mode 0o600)
- **Cross-Platform**: Works on Windows, macOS, and Linux

## Installation

### Prerequisites

- Node.js 18.x or higher (recommended for security and performance)
- npm 6.x or higher

### Setup

```bash
# Clone the repository
git clone https://github.com/mdellison90-stack/glowing-rotary-phone.git
cd glowing-rotary-phone

# Install dependencies
npm install

# Run the application
npm start
```

## Usage

### Generating Key Pairs

1. Select the desired key type from the dropdown menu:
   - **Ed25519** (default): Modern elliptic curve cryptography
   - **RSA (2048 bits)**: Traditional RSA with 2048-bit modulus
   - **RSA (4096 bits)**: Enhanced RSA with 4096-bit modulus

2. Click the **"Generate Key Pair"** button

3. Both private and public keys will be displayed in their respective text areas

### Deriving Public Keys

1. Paste a private key (in PKCS#8 PEM format) into the **Private Key** text area

2. The corresponding public key will be automatically derived and displayed

### Managing Keys

#### Copy to Clipboard

Click the **COPY** button below either the private or public key to copy it to your clipboard.

#### Save to File

Click the **SAVE** button below either the private or public key to save it to a file. A save dialog will appear allowing you to choose the file location and name.

**Security Note**: Private keys are saved with restricted permissions (owner read/write only) for enhanced security.

## API Documentation

### IPC Channels

The application uses Electron's IPC (Inter-Process Communication) to communicate between the renderer and main processes. The following channels are available:

#### `generate_keys`

Generates a new key pair.

**Parameters:**
- `keyType` (string): The type of key to generate
  - `'ed25519'`: Ed25519 key pair
  - `'rsa-2048'`: RSA key pair with 2048-bit modulus
  - `'rsa-4096'`: RSA key pair with 4096-bit modulus

**Returns:**
- `object`: Key pair object
  - `privateKey` (string): Private key in PEM format (PKCS#8)
  - `publicKey` (string): Public key in PEM format (SPKI)

**Example:**
```javascript
const { privateKey, publicKey } = await window.utils.generateKeys('ed25519')
```

#### `generate_public_key`

Derives a public key from a given private key.

**Parameters:**
- `privateKey` (string): Private key in PEM format (PKCS#8)

**Returns:**
- `string`: Public key in PEM format (SPKI), or empty string if the private key is invalid

**Example:**
```javascript
const publicKey = await window.utils.generatePublicKey(privateKey)
```

#### `copy_key`

Copies the specified data to the system clipboard.

**Parameters:**
- `data` (string): The text to copy to clipboard

**Returns:**
- `Promise<void>`

**Example:**
```javascript
await window.utils.copyKey(keyData)
```

#### `save_key`

Saves a key to a file with a save dialog prompt.

**Parameters:**
- `keyType` (string): The type of key being saved (used as default filename)
- `key` (string): The key content to save

**Returns:**
- `string`: Result message
  - `'Key saved'`: Success
  - `'Error. Can not save file {path}'`: Error occurred
  - `undefined`: User canceled the save dialog

**Example:**
```javascript
const result = await window.utils.saveKey('Private_key', privateKey)
```

### Main Process Functions

#### `generateKeys(keyType)`

Main process function that generates cryptographic key pairs.

**Parameters:**
- `keyType` (string): Type of key pair to generate

**Returns:**
- `object`: Key pair with `privateKey` and `publicKey` properties

**Implementation:**
- Uses Node.js built-in `crypto.generateKeyPairSync()`
- Keys are encoded in PEM format
- Private keys use PKCS#8 encoding
- Public keys use SPKI encoding

#### `generatePublicKey(privateKey)`

Main process function that derives a public key from a private key.

**Parameters:**
- `privateKey` (string): Private key in PEM format

**Returns:**
- `string`: Public key in PEM format, or empty string on error

**Implementation:**
- Uses Node.js `crypto.createPublicKey()` to extract public key from private key
- Validates the private key format
- Returns empty string if the private key is invalid

#### `copyKey(data)`

Main process function that writes data to the system clipboard.

**Parameters:**
- `data` (string): Text to copy

**Returns:**
- `Promise<void>`

**Implementation:**
- Uses Electron's `clipboard.writeText()` API

#### `saveKey(keyType, key)`

Main process function that saves a key to a file.

**Parameters:**
- `keyType` (string): Key type for default filename
- `key` (string): Key content to save

**Returns:**
- `Promise<string>`: Result message

**Implementation:**
- Opens a native save dialog using `electron.dialog.showSaveDialog()`
- Saves file with mode `0o600` (owner read/write only) for security
- Returns success or error message

### Exposed Renderer API

The application exposes a safe API to the renderer process via the `window.utils` object:

```javascript
window.utils = {
  generateKeys: (keyType) => Promise<{privateKey: string, publicKey: string}>,
  generatePublicKey: (privateKey) => Promise<string>,
  copyKey: (data) => Promise<void>,
  saveKey: (keyType, key) => Promise<string>
}
```

## Security

This application follows Electron security best practices:

- **Context Isolation**: Enabled by default, preventing the renderer process from directly accessing Node.js APIs
- **Node Integration**: Disabled in renderer process
- **Preload Script**: Uses `contextBridge` to expose only necessary APIs to the renderer
- **Content Security Policy**: Strict CSP prevents XSS attacks
- **File Permissions**: Private keys are saved with restricted permissions (0o600)
- **No Key Logging**: Private keys are never logged or exposed unnecessarily

## Development

### Available Scripts

```bash
# Run the application in development mode
npm start

# Lint JavaScript files
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Package the app (without distribution)
npm run pack

# Build distributable packages for all platforms
npm run dist

# Install/rebuild native dependencies
npm run postinstall
```

### Project Structure

```
/src
  main.js       - Electron main process (IPC handlers, key generation)
  preload.js    - Preload script exposing safe API to renderer
  shared.js     - Shared constants (IPC channel names)
/assets
  /html
    index.html  - Main UI
  /js
    renderer.js - Renderer process logic
  /css          - Stylesheets
/build          - Build configuration and application icons
/config         - electron-builder configuration
```

### Code Style

- JavaScript Standard Style (enforced by ESLint)
- ES2021 features
- `async/await` preferred over callbacks
- `const` and `let` only (no `var`)

## Building for Production

### All Platforms

```bash
npm run dist
```

This will create distributable packages for Windows, macOS, and Linux in the `dist` directory.

### Platform-Specific Builds

```bash
# macOS only
electron-builder -m

# Windows only
electron-builder -w

# Linux only
electron-builder -l
```

## Technology Stack

- **Runtime**: Electron 21.3.0 (Note: Consider upgrading to Electron 28.x+ for improved security)
- **Language**: JavaScript (ES2021)
- **Build Tool**: electron-builder
- **Code Quality**: ESLint with Standard config
- **Dependencies**:
  - `electron-util`: Cross-platform utilities
  - Node.js `crypto` module: Cryptographic key generation

## Key Formats

All keys are generated in **PEM format**:

- **Private Keys**: PKCS#8 encoding
- **Public Keys**: SubjectPublicKeyInfo (SPKI) encoding

### Example Ed25519 Private Key (truncated for brevity)
```
-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEIE... (truncated)
-----END PRIVATE KEY-----
```

### Example Ed25519 Public Key (truncated for brevity)
```
-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEA... (truncated)
-----END PUBLIC KEY-----
```

## License

MIT License - see [LICENSE.md](LICENSE.md) for details

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Pull Request Guidelines

- All code must pass `npm run lint`
- Test the application manually with `npm start`
- Update CHANGELOG.md for user-facing changes
- Keep commits focused and atomic
- Provide clear descriptions of changes

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and changes.

## Support

For issues, questions, or contributions, please open an issue on the GitHub repository.
