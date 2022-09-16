const mongoose = require('mongoose')
let connetDB = async ()=>{
    mongoose.connect("mongodb+srv://himanshu:gautamgod@cluster0.vxoh94y.mongodb.net/image_post").then(()=>{
        console.log("Successfully connect")
    }).catch((error)=>{
        console.log(error)
    })
}
module.exports = connetDB;