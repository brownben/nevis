'use strict'
const encryptor = require('simple-encryptor')({
    hmac: true,
    key: 'OrienteerInTheWoods',
})

function encrypt (input, key) {
    if (!key) {
        throw new Error('A key is required to encrypt')
    }
    try {
        return {
            version: 'Nevis 2.0.0',
            type: 'Full Event',
            date: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
            value: encryptor.encrypt(input),
        }
    }
    catch (err) {
        throw new Error('Unable to encrypt value due to: ' + err)
    }
}

function decrypt (input, key) {
    // Ensure we have something to decrypt
    if (!input) {
        throw new Error('You must provide a value to decrypt')
    }
    // Ensure we have the key used to encrypt this value
    if (!key) {
        throw new Error('A key is required to decrypt')
    }

    // If we get a string as input, turn it into an object
    if (typeof input !== 'object') {
        try {
            input = JSON.parse(input)
        }
        catch (err) {
            throw new Error('Unable to parse string input as JSON')
        }
    }

    try {
        return encryptor.decrypt(input.value)
    }
    catch (err) {
        throw new Error('Unable to decrypt value due to: ' + err)
    }
}

function LokiCryptedFileAdapter () { }

LokiCryptedFileAdapter.prototype.setKey = function setKey (key) {
    this.key = key
}

LokiCryptedFileAdapter.prototype.loadDatabase = function loadDatabase (dbname, callback) {
    let decrypted
    const key = this.key
    fs.exists(dbname, function (exists) {
        if (exists) {
            const decryptInput = fs.readFileSync(dbname, 'utf8')
            decrypted = decrypt(decryptInput, key)
        }
        if (typeof (callback) === 'function') {
            callback(decrypted)
        }
    })
}

LokiCryptedFileAdapter.prototype.saveDatabase = function saveDatabase (dbname, dbstring, callback) {
    const encrypted = encrypt(dbstring, this.key)
    fs.writeFileSync(dbname, JSON.stringify(encrypted, null, '  '), 'utf8')
    if (typeof (callback) === 'function') {
        callback()
    }
}

module.exports = new LokiCryptedFileAdapter()
exports.LokiCryptedFileAdapter = LokiCryptedFileAdapter()
