# Copilot Instructions

## Project overview

This is an Electron desktop application for generating RSA and Ed25519 key pairs and deriving public keys from private keys.

## Project structure

- `src/main.js` contains the Electron main process, cryptographic operations, and file operations.
- `src/preload.js` exposes the renderer API through `contextBridge`.
- `src/shared.js` defines IPC channel names shared by the main and preload processes.
- `assets/html`, `assets/js`, and `assets/css` contain the renderer UI.
- `config/electron-builder.js` configures packaging.

## Development guidance

- Preserve Electron process boundaries: keep privileged APIs in the main process and expose only the required operations through the preload script.
- Define or update IPC channel names in `src/shared.js` and keep their use consistent between the main and preload scripts.
- Validate inputs before cryptographic or file operations. Treat private keys as sensitive: never log or expose them, and preserve restrictive permissions when saving them.
- Follow the existing JavaScript Standard Style and conventions. Avoid unrelated changes and new dependencies.
- Update `CHANGELOG.md` for user-facing behavior changes.

## Validation

- Run `npm run lint` after JavaScript changes.
- There is no automated test script configured in `package.json`; manually verify changed behavior when practical.
- `npm start` launches the app. `npm run pack` and `npm run dist` package it.
