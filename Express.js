const express = require('express');
const crypto = require('crypto');
const app = express();

const key = '12345678901234567890123456789012';

function decrypt(text, key) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'utf8'), Buffer.alloc(16, 0));
    let decrypted = decipher.update(text, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

app.get('/redirect', (req, res) => {
    const encryptedUrl = req.query.url;
    if (encryptedUrl) {
        try {
            const decryptedUrl = decrypt(encryptedUrl, key);
            res.redirect(decryptedUrl);
        } catch (error) {
            res.status(400).send('Invalid URL');
        }
    } else {
        res.status(400).send('No URL provided');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
