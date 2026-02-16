# Asymmetric Key Generator

A desktop application for generating RSA and Ed25519 key pairs built with Electron.

## Features

- **Generate RSA Key Pairs**: Support for 2048-bit and 4096-bit RSA keys
- **Generate Ed25519 Key Pairs**: Support for modern Ed25519 elliptic curve cryptography
- **Derive Public Keys**: Extract public keys from existing private keys
- **Copy to Clipboard**: Easy one-click copy for generated keys
- **Save to File**: Export keys to secure files with proper permissions
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **Secure**: Keys are generated using Node.js built-in crypto module
- **PKCS#8 Format**: Industry-standard format for key encoding

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 14 or higher)
- **npm** (comes with Node.js)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/binance/asymmetric-key-generator.git
cd asymmetric-key-generator
```

2. Install dependencies:
```bash
npm install
```

## How to Execute

### Development Mode

To run the application in development mode:

```bash
npm start
```

This will launch the Electron application window.

### Build Distributable Packages

To build distributable packages for all platforms (Windows, macOS, Linux):

```bash
npm run dist
```

To package the app without creating distributables:

```bash
npm run pack
```

## Usage

1. **Generate a New Key Pair**:
   - Select the desired key type from the dropdown (Ed25519, RSA 2048-bit, or RSA 4096-bit)
   - Click the "Generate Key Pair" button
   - Both private and public keys will appear in their respective text areas

2. **Extract Public Key from Private Key**:
   - Paste a private key into the "Private Key" text area
   - The corresponding public key will automatically be derived and displayed

3. **Copy Keys**:
   - Click the "COPY" button below either key to copy it to your clipboard

4. **Save Keys**:
   - Click the "SAVE" button below either key to save it to a file
   - Choose a location and filename in the save dialog
   - Private keys are saved with restrictive file permissions (0600)

## Development

### Available Scripts

- `npm start` - Run the application in development mode
- `npm run pack` - Package the app without distribution
- `npm run dist` - Build distributable packages for all platforms
- `npm run lint` - Check code style with ESLint
- `npm run lint:fix` - Auto-fix linting issues
- `npm run postinstall` - Install/rebuild native dependencies

### Code Style

This project uses ESLint with the Standard JavaScript style guide. All code must pass linting before submission.

```bash
npm run lint
```

To automatically fix linting issues:

```bash
npm run lint:fix
```

## Technology Stack

- **Electron** v35.7.5 - Cross-platform desktop framework
- **Node.js Crypto** - Native cryptographic functions
- **electron-util** - Cross-platform utilities
- **electron-builder** - Package and build for distribution

## Security Considerations

- Private keys are generated using cryptographically secure random number generators
- Keys never leave your machine unless you explicitly save or copy them
- Saved private keys have restrictive file permissions (0600 on Unix-like systems)
- No telemetry or data collection

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Support

For issues, questions, or contributions, please visit the [GitHub repository](https://github.com/binance/asymmetric-key-generator).
