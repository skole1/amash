const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const dotenv = require('dotenv')
const { ensureAuthenticated } = require('../helper/auth')

dotenv.config({path: './config/config.env'})

const db = mysql.createConnection({
    'host': process.env.HOST,
    'user':process.env.USER,
    'password':process.env.PASSWORD,
    'database': process.env.DATABASE
})

    db.connect(()=>{
        console.log(`Mysql Connected to ${db.connect.host}`);
    })
    

    router.get('/', (req, res)=>{
        res.render('pages/dashboard',{
            title:'Amash Pay | Modern Payment gateway for Africa'
        })
    })

module.exports = router  