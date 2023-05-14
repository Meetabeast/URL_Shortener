const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const { makeId, encrypt, decrypt, checkUrl } = require("./utils.js");
const URLmodel = require("./models/URL.Model.js");
const crypto = require("crypto");
const path = require("path");

const app = express();

const key = crypto.createHash('sha256').update(process.env.SECURE_KEY).digest('hex').substring(0, 32);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "views"));
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/url/generate', (req, res) => {   
    const querys = req.query;

    if(!querys) {
        return res.status(404).json({ message: 'Please enter a valid query to get a custom url!'});
    }

    const url = querys.url;

    if(!url) {
        return res.status(404).json({ message: 'Please enter a valid URL query.'});
    }

    if(checkUrl(url) == false) {
        return res.status(404).json({ message: 'Please enter a valid URL query.'});
    }

    let urlid = makeId(10)

    const newUrl = new URLmodel({
        url: encrypt(url, key),
        shortedid: urlid
    });

    newUrl.save().then(() => {
        return res.status(200).json({ message: 'URL saved!', id: urlid});
    }).catch(() => {
        return res.status(404).json({ message: 'Something went wrong!'});
    })
});

app.get('/url', (req, res) => {
    const querys = req.query;

    if(!querys) {
        return res.status(404).json({ message: 'No URL with this query found.'});
    }

    URLmodel.findOne({ shortedid: querys.id }).then(response => {
        let urlDecrypted = decrypt(response.url, key);
        
        return res.redirect(urlDecrypted);
    }).catch(err => {
        console.log('Error occured: ', err.message);
        return res.status(404).json({ message: 'Something went wrong, please check your url!'});
    });
})

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('MONGODB is connected!');
}).catch(() => {
    console.log('MONGODB Error');
});

app.listen(process.env.PORT, () => console.log('Server is listening on port: ' + process.env.PORT));