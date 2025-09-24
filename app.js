const express = require('express')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')

const app = express()

//setear el motor de plantillas
app.set('view engine','ejs')

//setear carpeta public para archivo estático
app.use(express.static('public'))

//para procesar datos enviados desde forms
app.use(express.urlencoded({extended:true}))
app.use(express.json())

//seteamos las variables de entorno
dotenv.config({path: './env/.env'})

//para poder trabajar con las cookies
app.use(cookieParser())

//Llamar al router
app.use('/',require('./routes/router'))

app.use(function(req,res,next){
    if(!req.user)
        res.hander('Cache-Control','private, no-cache, no-store, must-revalidate');
    next();
})


/*app.get('/',(req,res)=>{
    res.render('index')
})*/

app.listen(3000, ()=> {
    console.log('Server Up Running in https://localhost:3000')
})