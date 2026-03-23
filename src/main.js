const { app, BrowserWindow, ipcMain, clipboard, dialog, nativeImage } = require('electron')
const { is } = require('electron-util')
const { generateKeyPairSync, createPublicKey } = require('crypto')
const fs = require('fs')
const path = require('path')
const {
  CHANNEL_GENERATE_KEYS,
  CHANNEL_GENERATE_PUBLIC_KEYS,
  CHANNEL_COPY_KEY,
  CHANNEL_SAVE_KEY,
  GET_ALL_CHANNELS
} = require('./shared')

function createWindow () {
  let options = {
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  }

  if (is.linux) {
    options = { ...options, ...{ icon: nativeImage.createFromPath(path.join(__dirname, '../build/icons/256x256.png')) } }
  }

  const mainWindow = new BrowserWindow(options)

  // Events to Actions
  const handlers = {
    [CHANNEL_GENERATE_KEYS]: generateKeys,
    [CHANNEL_GENERATE_PUBLIC_KEYS]: generatePublicKey,
    [CHANNEL_COPY_KEY]: copyKey,
    [CHANNEL_SAVE_KEY]: saveKey
  }

  Object.entries(handlers).forEach(([channel, handler]) => {
    ipcMain.handle(channel, async (event, ...args) => {
      const result = await handler(...args)
      return result
    })
  })

  mainWindow.loadFile('assets/html/index.html')

  // mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (!is.macos) app.quit()
  GET_ALL_CHANNELS.map(channel => ipcMain.removeHandler(channel))
})

// Constants
const KEY_ENCODINGS = {
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem'
  }
}

// Actions
async function generateKeys (keyType) {
  if (keyType === 'rsa-2048') {
    return generateKeyPairSync('rsa', {
      modulusLength: 2048,
      ...KEY_ENCODINGS
    })
  } else if (keyType === 'rsa-4096') {
    return generateKeyPairSync('rsa', {
      modulusLength: 4096,
      ...KEY_ENCODINGS
    })
  } else {
    return generateKeyPairSync('ed25519', {
      ...KEY_ENCODINGS
    })
  }
}

async function generatePublicKey (privateKey) {
  try {
    const publickKeyObject = createPublicKey(privateKey)
    return publickKeyObject.export({ format: 'pem', type: 'spki' })
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
