const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SongSchema = Schema({
    songname: {
        type: String,
        required: true,
        unique: true
    },
    songlink: {
        type: String,
        required: true
    },
    login_count: Number
}, {
    timestamps: true
});

module.exports = mongoose.model("Song", SongSchema);