const mongoose = require("mongoose")

const Schema = mongoose.Schema({
    url: {
        type: String,
    },
    shortedid: {
        type: String,
        required: true
    }
});

const URLmodel = mongoose.model("URL", Schema);

module.exports = URLmodel