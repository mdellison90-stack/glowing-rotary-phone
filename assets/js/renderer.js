// Cache DOM element references
const elements = {
    publicKeyCopyButton: document.getElementById('public-key-copy-button'),
    publicKeySaveButton: document.getElementById('public-key-save-button'),
    privateKeyCopyButton: document.getElementById('private-key-copy-button'),
    privateKeySaveButton: document.getElementById('private-key-save-button'),
    privateKeyTextArea: document.getElementById('private-key-text-area'),
    publicKeyTextArea: document.getElementById('public-key-text-area'),
    selectKeyType: document.getElementById('select-keyType'),
    generateKeysButton: document.getElementById('generate-keys-button')
}

// Utils
function change_buttons_disabled_state(state) {
    elements.publicKeyCopyButton.disabled = state
    elements.publicKeySaveButton.disabled = state
    elements.privateKeyCopyButton.disabled = state
    elements.privateKeySaveButton.disabled = state
}

function remove_label_text(label_id) {
    document.getElementById(label_id).innerText = "ㅤ"
    document.getElementById(label_id).classList = []
}

// Actions
const generateKeys = async () => {
    keyType = elements.selectKeyType.value
    let { privateKey, publicKey } = await window.utils.generateKeys(keyType)
    elements.privateKeyTextArea.value = privateKey
    elements.publicKeyTextArea.value = publicKey

    //Enable buttons
    change_buttons_disabled_state(false)

}

const generatePublicKey = async () => {
    privateKey = elements.privateKeyTextArea.value
    let publicKey = await window.utils.generatePublicKey(privateKey)
    elements.publicKeyTextArea.value = publicKey

    if (publicKey) {
        change_buttons_disabled_state(false)
    } else {
        change_buttons_disabled_state(true)
    }
}

const copyKey = async (input_key) => {
    let lower_input_key = input_key.toLowerCase()
    let textArea = lower_input_key === 'private' ? elements.privateKeyTextArea : elements.publicKeyTextArea
    let data = textArea.value
    await window.utils.copyKey(data)

    // Display tooltip for 5s
    let label_id = `${lower_input_key}-key-text-area-tooltip`
    let label = document.getElementById(label_id)
    label.classList.add('text-green-500');
    label.innerText = `${input_key} Key copied`
    setTimeout(function () { remove_label_text(label_id) }, 5000);
}

const saveKey = async (input_key) => {
    let lower_input_key = input_key.toLowerCase();
    let textArea = lower_input_key === 'private' ? elements.privateKeyTextArea : elements.publicKeyTextArea
    let key = textArea.value;
    result = await window.utils.saveKey(`${input_key}_key`, key);

    let label_id = `${lower_input_key}-key-text-area-tooltip`
    let label = document.getElementById(label_id)
    // Display error tooltip for 5s
    if (result.startsWith('Error')) {
        tip_color = 'text-red-500';
    } else if (result) {
        tip_color = 'text-green-500';
        result = `${input_key} Key saved`;
    } else {
        result = ""
    }

    if (result) {
        label.classList.add(tip_color);
        label.innerText = result;
        setTimeout(function () { remove_label_text(label_id) }, 5000);
    }
    
}

// Event listeners
elements.generateKeysButton.addEventListener('click', function () {
    generateKeys()
})

let debounceTimer
elements.privateKeyTextArea.addEventListener('input', function () {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
        generatePublicKey()
    }, 500)
})

elements.privateKeyCopyButton.addEventListener('click', function () {
    copyKey("Private")
})

elements.publicKeyCopyButton.addEventListener('click', function () {
    copyKey("Public")
})

elements.privateKeySaveButton.addEventListener('click', function () {
    saveKey("Private")
})

elements.publicKeySaveButton.addEventListener('click', function () {
    saveKey("Public")
})
