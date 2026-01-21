// Utils
function debounce (func, delay) {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(this, args), delay)
  }
}

function change_buttons_disabled_state (state) {
  document.getElementById('public-key-copy-button').disabled = state
  document.getElementById('public-key-save-button').disabled = state
  document.getElementById('private-key-copy-button').disabled = state
  document.getElementById('private-key-save-button').disabled = state
}

function remove_label_text (label_id) {
  document.getElementById(label_id).innerText = 'ㅤ'
  document.getElementById(label_id).classList = []
}

// Actions
const generateKeys = async () => {
  const keyType = document.getElementById('select-keyType').value
  const { privateKey, publicKey } = await window.utils.generateKeys(keyType)
  document.getElementById('private-key-text-area').value = privateKey
  document.getElementById('public-key-text-area').value = publicKey

  // Enable buttons
  change_buttons_disabled_state(false)
}

const generatePublicKey = async () => {
  const privateKey = document.getElementById('private-key-text-area').value
  const publicKey = await window.utils.generatePublicKey(privateKey)
  document.getElementById('public-key-text-area').value = publicKey

  if (publicKey) {
    change_buttons_disabled_state(false)
  } else {
    change_buttons_disabled_state(true)
  }
}

// Debounced version to prevent excessive calls during typing
const debouncedGeneratePublicKey = debounce(generatePublicKey, 300)

const copyKey = async (input_key) => {
  const lower_input_key = input_key.toLowerCase()
  const data = document.getElementById(`${lower_input_key}-key-text-area`).value
  await window.utils.copyKey(data)

  // Display tooltip for 5s
  const label_id = `${lower_input_key}-key-text-area-tooltip`
  document.getElementById(label_id).classList.add('text-green-500')
  document.getElementById(label_id).innerText = `${input_key} Key copied`
  setTimeout(function () { remove_label_text(label_id) }, 5000)
}

const saveKey = async (input_key) => {
  const lower_input_key = input_key.toLowerCase()
  const key = document.getElementById(`${lower_input_key}-key-text-area`).value
  const result = await window.utils.saveKey(`${input_key}_key`, key)

  const label_id = `${lower_input_key}-key-text-area-tooltip`
  let tip_color, display_result
  // Display error tooltip for 5s
  if (result && result.startsWith('Error')) {
    tip_color = 'text-red-500'
    display_result = result
  } else if (result) {
    tip_color = 'text-green-500'
    display_result = `${input_key} Key saved`
  } else {
    display_result = ''
  }

  if (display_result) {
    document.getElementById(label_id).classList.add(tip_color)
    document.getElementById(label_id).innerText = display_result
    setTimeout(function () { remove_label_text(label_id) }, 5000)
  }
}

// Event listeners
const generateKeysButton = document.getElementById('generate-keys-button')
generateKeysButton.addEventListener('click', function () {
  generateKeys()
})

const privateKeyTextArea = document.getElementById('private-key-text-area')
privateKeyTextArea.addEventListener('input', function () {
  debouncedGeneratePublicKey()
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
