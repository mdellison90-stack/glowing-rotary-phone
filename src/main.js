const electron = require('electron')
const { app, BrowserWindow, ipcMain, clipboard, dialog, nativeImage } = electron
const { generateKeyPairSync, createPublicKey } = require('crypto')
const fs = require('fs')
const path = require('path')

let is = { linux: process.platform === 'linux', macos: process.platform === 'darwin' }
try {
  ({ is } = require('electron-util'))
} catch (error) {
  // electron-util is only valid inside Electron runtime, so fall back to native platform checks.
}
const {
  CHANNEL_GENERATE_KEYS,
  CHANNEL_GENERATE_PUBLIC_KEYS,
  CHANNEL_COPY_KEY,
  CHANNEL_SAVE_KEY,
  ALL_IPC_CHANNELS
} = require('./shared')

const APP_ROOT = path.resolve(__dirname, '..')
const INDEX_PATH = path.join(APP_ROOT, 'assets', 'html', 'index.html')
const APP_ICON_PATH = path.join(APP_ROOT, 'build', 'icons', '256x256.png')

function createWindow () {
  let options = {
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  }

  if (is.linux) {
    options = { ...options, ...{ icon: nativeImage.createFromPath(APP_ICON_PATH) } }
  }

  const mainWindow = new BrowserWindow(options)

  // Events to Actions
  ipcMain.handle(CHANNEL_GENERATE_KEYS, async (event, ...args) => {
    const result = await generateKeys(...args)
    return result
  })

  ipcMain.handle(CHANNEL_GENERATE_PUBLIC_KEYS, async (event, ...args) => {
    const result = await generatePublicKey(...args)
    return result
  })

  ipcMain.handle(CHANNEL_COPY_KEY, async (event, ...args) => {
    const result = await copyKey(...args)
    return result
  })

  ipcMain.handle(CHANNEL_SAVE_KEY, async (event, ...args) => {
    const result = await saveKey(...args)
    return result
  })

  mainWindow.loadFile(INDEX_PATH)

  // mainWindow.webContents.openDevTools()
}

if (require.main === module) {
  app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })

  app.on('window-all-closed', function () {
    if (!is.macos) app.quit()
    ALL_IPC_CHANNELS.map(channel => ipcMain.removeHandler(channel))
  })
}

// Actions
function buildKeyPairOptions (keyType) {
  const commonOptions = {
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  }

  if (keyType === 'rsa-2048') {
    return {
      ...commonOptions,
      modulusLength: 2048
    }
  }

  if (keyType === 'rsa-4096') {
    return {
      ...commonOptions,
      modulusLength: 4096
    }
  }

  return commonOptions
}

async function generateKeys (keyType) {
  if (keyType === 'rsa-2048' || keyType === 'rsa-4096') {
    return generateKeyPairSync('rsa', buildKeyPairOptions(keyType))
  }

  return generateKeyPairSync('ed25519', buildKeyPairOptions(keyType))
}

async function generatePublicKey (privateKey) {
  try {
    const publicKeyObject = createPublicKey(privateKey)
    return publicKeyObject.export({ format: 'pem', type: 'spki' })
  } catch (error) {
    return ''
  }
}

async function copyKey (data) {
  clipboard.writeText(data)
}

async function saveKey (keyType, key) {
  const options = {
    title: `Save ${keyType}`,
    defaultPath: keyType,
    buttonLabel: 'Save',

    filters: [
      { name: 'txt', extensions: ['txt'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  }

  const result = await dialog.showSaveDialog(null, options).then(({ canceled, filePath }) => {
    if (!canceled) {
      try {
        fs.writeFileSync(filePath, key, { encoding: 'utf8', mode: 0o600 })
        return 'Key saved'
      } catch (err) {
        return `Error. Can not save file ${filePath}`
      }
    } else {
      console.warn('Save key dialog cancelled')
    }
  })
  return result
}

module.exports = {
  APP_ROOT,
  INDEX_PATH,
  buildKeyPairOptions,
  generateKeys,
  generatePublicKey,
  copyKey,
  saveKey,
  createWindow
}
