# Repository Instructions

This repository contains an Electron desktop application for generating RSA and Ed25519 key pairs, deriving public keys from private keys, and managing cryptographic keys.

## Technology Stack

- **Runtime**: Electron v21.3.0
- **Language**: JavaScript (ES2021)
- **Build Tool**: electron-builder
- **Code Style**: ESLint with Standard config
- **Key Dependencies**:
  - electron-util for cross-platform utilities
  - Node.js built-in crypto module for key generation

## Project Structure

```
/src          - Main application source code
  main.js     - Electron main process
  preload.js  - Preload script for renderer security
  shared.js   - Shared constants and utilities
/assets       - HTML, CSS, and static resources
/build        - Build configuration and icons
/config       - Build and configuration files
```

## Development Commands

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

## Code Style and Conventions

- Follow **JavaScript Standard Style** (enforced by ESLint)
- Use **ES2021** features
- Prefer **async/await** over callbacks
- Use **const** and **let**, never **var**
- Follow existing naming conventions:
  - UPPER_CASE for constants (e.g., CHANNEL_GENERATE_KEYS)
  - camelCase for functions and variables
- IPC channels are defined in `shared.js` and should use the CHANNEL_ prefix

## Architecture Guidelines

- **Main Process**: Handle IPC communication, file system operations, and native APIs
- **Renderer Process**: Handle UI and user interactions (loaded from assets/html)
- **Preload Script**: Expose safe APIs to renderer process via contextBridge
- Define or update IPC channel names in `src/shared.js` and keep the matching string literals in `src/preload.js` consistent.
- Always validate user input before cryptographic operations
- Treat private keys as sensitive: never log or expose them outside intended user-facing flows, and preserve restrictive permissions when saving them.
- Use Electron's security best practices (no nodeIntegration in renderer)
- Avoid unrelated changes and new dependencies.

## File Modifications

### Safe to Modify
- Source files in `/src`
- HTML/CSS in `/assets`
- Configuration in `/config`
- Documentation files (README, CHANGELOG)

### Do Not Modify
- `/build/icons` - Pre-generated application icons
- `package-lock.json` - Only modify via npm commands
- `.github/workflows` - CI/CD configuration (modify with caution)

## Testing

- There is no automated test script configured in `package.json`.
- Manual testing required for all changes:
  1. Run `npm start` to test the application
  2. Test key generation functionality
  3. Test copy and save operations
  4. Verify UI renders correctly
  5. Run `npm run lint` to ensure code style compliance

## Security Considerations

- This application handles cryptographic keys - treat all key material as sensitive
- Never log or expose private keys
- Always use secure IPC communication patterns
- Validate all file paths before file operations
- Follow Electron security checklist for any new features

## Pull Request Guidelines

- All code must pass `npm run lint`
- Test the application manually with `npm start`
- Update CHANGELOG.md for user-facing changes
- Keep commits focused and atomic
- Provide clear descriptions of changes
