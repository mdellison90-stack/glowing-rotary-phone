// Utils
function setButtonsDisabledState (state) {
  document.getElementById('public-key-copy-button').disabled = state
  document.getElementById('public-key-save-button').disabled = state
  document.getElementById('private-key-copy-button').disabled = state
  document.getElementById('private-key-save-button').disabled = state
}

function clearTooltipLabel (tooltipLabelId) {
  document.getElementById(tooltipLabelId).innerText = 'ㅤ'
  document.getElementById(tooltipLabelId).classList = []
}

// Actions
const generateKeys = async () => {
  const keyType = document.getElementById('select-keyType').value
  const { privateKey, publicKey } = await window.utils.generateKeys(keyType)
  document.getElementById('private-key-text-area').value = privateKey
  document.getElementById('public-key-text-area').value = publicKey

  // Enable buttons
  setButtonsDisabledState(false)
}

const generatePublicKey = async () => {
  const privateKey = document.getElementById('private-key-text-area').value
  const publicKey = await window.utils.generatePublicKey(privateKey)
  document.getElementById('public-key-text-area').value = publicKey

  if (publicKey) {
    setButtonsDisabledState(false)
  } else {
    setButtonsDisabledState(true)
  }
}

const copyKey = async (keyType) => {
  const lowerKeyType = keyType.toLowerCase()
  const data = document.getElementById(`${lowerKeyType}-key-text-area`).value
  await window.utils.copyKey(data)

  // Display tooltip for 5s
  const tooltipLabelId = `${lowerKeyType}-key-text-area-tooltip`
  document.getElementById(tooltipLabelId).classList.add('text-green-500')
  document.getElementById(tooltipLabelId).innerText = `${keyType} Key copied`
  setTimeout(function () { clearTooltipLabel(tooltipLabelId) }, 5000)
}

const saveKey = async (keyType) => {
  const lowerKeyType = keyType.toLowerCase()
  const key = document.getElementById(`${lowerKeyType}-key-text-area`).value
  let result = await window.utils.saveKey(`${keyType}_key`, key)

  const tooltipLabelId = `${lowerKeyType}-key-text-area-tooltip`
  let tooltipColor
  // Display error tooltip for 5s
  if (result.startsWith('Error')) {
    tooltipColor = 'text-red-500'
  } else if (result) {
    tooltipColor = 'text-green-500'
    result = `${keyType} Key saved`
  } else {
    result = ''
  }

  if (result) {
    document.getElementById(tooltipLabelId).classList.add(tooltipColor)
    document.getElementById(tooltipLabelId).innerText = result
    setTimeout(function () { clearTooltipLabel(tooltipLabelId) }, 5000)
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
