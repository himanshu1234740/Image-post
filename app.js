
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const connect = require('./services/database/conncetion');
const cookieParser = require('cookie-parser');


const path = require('path');
const app = express();

//load all the asets
app.use('/css',express.static(path.join(__dirname, 'asets/css')))
app.use('/js',express.static(path.join(__dirname, 'asets/js')))
app.use('/upload',express.static(path.join(__dirname, '/upload')))
//call database function;
connect()

//here we set view engine 
app.set('view engine', 'ejs');
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))

app.use(cookieParser());
//load the routers
app.use('/', require('./services/router/router'))


app.listen(3000, function(){
    console.log("listening on 3000...");
})