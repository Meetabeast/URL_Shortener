const crypto = require("crypto");
const algorithm = 'aes-256-cbc';

function makeId(length) {
    let id = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let counter = 0;

    while(counter < length) {
        id += characters.charAt(Math.floor(Math.random() * characters.length));
        counter += 1;
    }
    return id;
}

function checkUrl(url) {
    const urlRegex = /^((https?|ftp):\/\/)?([a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,63}|([0-9]{1,3}\.){3}[0-9]{1,3})(:[0-9]{1,5})?(\/.*)?$/i;

    if(urlRegex.test(url)) {
        return true;
    } else {
        return false;
    }
}

function encrypt(text, key) {
    const iv = crypto.randomBytes(16); 
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}
  
function decrypt(text, key) {
    const parts = text.split(':');
    const iv = Buffer.from(parts.shift(), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(parts.join(':'), 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

module.exports = {
    makeId,
    encrypt,
    decrypt,
    checkUrl
}