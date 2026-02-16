// Utils
function setButtonsDisabledState (state) {
  document.getElementById('public-key-copy-button').disabled = state
  document.getElementById('public-key-save-button').disabled = state
  document.getElementById('private-key-copy-button').disabled = state
  document.getElementById('private-key-save-button').disabled = state
}

function clearTooltipLabel (tooltipElementId) {
  document.getElementById(tooltipElementId).innerText = 'ㅤ'
  document.getElementById(tooltipElementId).classList = []
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

const copyKey = async (keyTypeLabel) => {
  const keyTypeId = keyTypeLabel.toLowerCase()
  const data = document.getElementById(`${keyTypeId}-key-text-area`).value
  await window.utils.copyKey(data)

  // Display tooltip for 5s
  const tooltipElementId = `${keyTypeId}-key-text-area-tooltip`
  document.getElementById(tooltipElementId).classList.add('text-green-500')
  document.getElementById(tooltipElementId).innerText = `${keyTypeLabel} Key copied`
  setTimeout(function () { clearTooltipLabel(tooltipElementId) }, 5000)
}

const saveKey = async (keyTypeLabel) => {
  const keyTypeId = keyTypeLabel.toLowerCase()
  const key = document.getElementById(`${keyTypeId}-key-text-area`).value
  let result = await window.utils.saveKey(`${keyTypeLabel}_key`, key)

  const tooltipElementId = `${keyTypeId}-key-text-area-tooltip`
  let tooltipColorClass
  // Display error tooltip for 5s
  if (result.startsWith('Error')) {
    tooltipColorClass = 'text-red-500'
  } else if (result) {
    tooltipColorClass = 'text-green-500'
    result = `${keyTypeLabel} Key saved`
  } else {
    result = ''
  }

  if (result) {
    document.getElementById(tooltipElementId).classList.add(tooltipColorClass)
    document.getElementById(tooltipElementId).innerText = result
    setTimeout(function () { clearTooltipLabel(tooltipElementId) }, 5000)
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
