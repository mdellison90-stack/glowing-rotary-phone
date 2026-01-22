// Utils
function changeButtonsDisabledState (state) {
  document.getElementById('public-key-copy-button').disabled = state
  document.getElementById('public-key-save-button').disabled = state
  document.getElementById('private-key-copy-button').disabled = state
  document.getElementById('private-key-save-button').disabled = state
}

function removeLabelText (labelId) {
  document.getElementById(labelId).innerText = 'ㅤ'
  document.getElementById(labelId).classList = []
}

// Actions
const generateKeys = async () => {
  const keyType = document.getElementById('select-keyType').value
  const { privateKey, publicKey } = await window.utils.generateKeys(keyType)
  document.getElementById('private-key-text-area').value = privateKey
  document.getElementById('public-key-text-area').value = publicKey

  // Enable buttons
  changeButtonsDisabledState(false)
}

const generatePublicKey = async () => {
  const privateKey = document.getElementById('private-key-text-area').value
  const publicKey = await window.utils.generatePublicKey(privateKey)
  document.getElementById('public-key-text-area').value = publicKey

  if (publicKey) {
    changeButtonsDisabledState(false)
  } else {
    changeButtonsDisabledState(true)
  }
}

const copyKey = async (inputKey) => {
  const lowerInputKey = inputKey.toLowerCase()
  const data = document.getElementById(`${lowerInputKey}-key-text-area`).value
  await window.utils.copyKey(data)

  // Display tooltip for 5s
  const labelId = `${lowerInputKey}-key-text-area-tooltip`
  document.getElementById(labelId).classList.add('text-green-500')
  document.getElementById(labelId).innerText = `${inputKey} Key copied`
  setTimeout(function () { removeLabelText(labelId) }, 5000)
}

const saveKey = async (inputKey) => {
  const lowerInputKey = inputKey.toLowerCase()
  const key = document.getElementById(`${lowerInputKey}-key-text-area`).value
  const saveResult = await window.utils.saveKey(`${inputKey}_key`, key)

  const labelId = `${lowerInputKey}-key-text-area-tooltip`
  // Display error tooltip for 5s
  let tipColor = ''
  let result = ''

  if (saveResult.startsWith('Error')) {
    tipColor = 'text-red-500'
    result = saveResult
  } else if (saveResult) {
    tipColor = 'text-green-500'
    result = `${inputKey} Key saved`
  }

  if (result) {
    document.getElementById(labelId).classList.add(tipColor)
    document.getElementById(labelId).innerText = result
    setTimeout(function () { removeLabelText(labelId) }, 5000)
  }
}

// Event listeners
const generateKeysButton = document.getElementById('generate-keys-button')
generateKeysButton.addEventListener('click', function () {
  generateKeys()
})

const privateKeyTextArea = document.getElementById('private-key-text-area')
privateKeyTextArea.addEventListener('input', function () {
  generatePublicKey()
})

const privateKeyCopyButton = document.getElementById('private-key-copy-button')
privateKeyCopyButton.addEventListener('click', function () {
  copyKey('Private')
})

const publicKeyCopyButton = document.getElementById('public-key-copy-button')
publicKeyCopyButton.addEventListener('click', function () {
  copyKey('Public')
})

const privateKeySaveButton = document.getElementById('private-key-save-button')
privateKeySaveButton.addEventListener('click', function () {
  saveKey('Private')
})

const publicKeySaveButton = document.getElementById('public-key-save-button')
publicKeySaveButton.addEventListener('click', function () {
  saveKey('Public')
})
