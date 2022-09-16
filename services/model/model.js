
const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    img: String,
    desc: String,
    title: String,
    id: String,
})


const Blog = mongoose.model('Image', schema);

module.exports = Blog;
