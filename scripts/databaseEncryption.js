'use strict'

function DatabaseEncryptionAdapter () { }

function hmac (text, key) {
    return crypto.createHmac('sha256', key).update(text).digest('hex')
}

DatabaseEncryptionAdapter.prototype.setKey = function setKey (key) {
    this.key = crypto.createHash('sha256').update(key).digest()
}

DatabaseEncryptionAdapter.prototype.loadDatabase = function loadDatabase (dbname, callback) {
    const key = this.key
    fs.exists(dbname, function (exists) {
        if (exists) {
            let file = fs.readFileSync(dbname, 'utf8')
            let data = JSON.parse(file).value
            if (data) {
                let expectedHmac = data.substring(0, 64)
                data = data.substring(64)
                let actualHmac = hmac(data, key)
                if (actualHmac === expectedHmac) {
                    let iv = Buffer.from(data.substring(0, 32), 'hex')
                    let encryptedJson = data.substring(32)
                    let decipher = crypto.createDecipheriv('aes256', key, iv)
                    let json = decipher.update(encryptedJson, 'base64', 'utf8') + decipher.final('utf8')
                    if (typeof (callback) === 'function') callback(json)
                }
                else {
                    if (typeof (callback) === 'function') callback(new Error('Wrong Password'))
                }
            }
        }
    })
}

DatabaseEncryptionAdapter.prototype.saveDatabase = function saveDatabase (dbname, dbstring, callback) {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv('aes256', this.key, iv)
    const encryptedJson = cipher.update(dbstring, 'utf8', 'base64') + cipher.final('base64')
    let result = iv.toString('hex') + encryptedJson
    result = hmac(result, this.key) + result
    const toWrite = {
        version: 'Nevis 3',
        type: 'Full Event',
        date: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
        value: result,
    }
    fs.writeFileSync(dbname, JSON.stringify(toWrite, null, '  '), 'utf8')
    if (typeof (callback) === 'function') callback()
}

function ArchiveEncryptionAdapter () { }

ArchiveEncryptionAdapter.prototype.key = crypto.createHash('sha256').update('IOrienteerInTheWoods').digest()

ArchiveEncryptionAdapter.prototype.loadDatabase = function loadArchive (dbname, callback) {
    const key = this.key
    fs.exists(dbname, function (exists) {
        if (exists) {
            let file = JSON.parse(fs.readFileSync(dbname, 'utf8')).value
            file = file.substring(64)
            let iv = Buffer.from(file.substring(0, 32), 'hex')
            let encryptedJson = file.substring(32)
            let decipher = crypto.createDecipheriv('aes256', key, iv)
            let json = decipher.update(encryptedJson, 'base64', 'utf8') + decipher.final('utf8')
            if (typeof (callback) === 'function') callback(json)
        }
        else {
            let json = {}
            if (typeof (callback) === 'function') callback(json)
        }
    })
}

ArchiveEncryptionAdapter.prototype.saveDatabase = function saveArchive (dbname, dbstring, callback) {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv('aes256', this.key, iv)
    const encryptedJson = cipher.update(dbstring, 'utf8', 'base64') + cipher.final('base64')
    let result = iv.toString('hex') + encryptedJson
    result = hmac(result, this.key) + result
    const toWrite = {
        version: 'Nevis 3',
        type: 'SI Card Archive',
        date: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
        value: result,
    }
    fs.writeFileSync(dbname, JSON.stringify(toWrite, null, '  '), 'utf8')
    if (typeof (callback) === 'function') callback()
}

exports.LokiCryptedFileAdapter = new DatabaseEncryptionAdapter()
exports.ArchiveEncryptionAdapter = new ArchiveEncryptionAdapter()
