const express = require('express')
const bcrypt = require('bcryptjs')
const router = express.Router()
const mysql = require('mysql')
const dotenv = require('dotenv')
const passport = require('passport')

//const passport  = require('../config/passport')

// const connectDB = require('../config/db')
// connectDB()
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
    
router.get('/login', (req, res)=>{
    res.render('users/login', {
        title:'Register | AmashPay'
    })
}) 

router.get('/register', (req, res)=>{
    res.render('users/register', {
        title:'Register | AmashPay'
    })
}) 

//@desc Dashboard
//@route  GET /Forget
router.get('/forget', (req, res)=>{
    res.render('users/forget_password')
}) 


//Login Handle
router.post('/login', (req, res, next)=>{
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})

//Post Registration Form
router.post('/register', (req, res)=>{
    const { name, email, password, password2 } = req.body;
    let errors = [];

    //Validation
    if(!name || !email || !password || !password2){
        errors.push({text:'Please fill in all fields'})
    }

    if(password !== password2){
        errors.push({text:'Password do not match'})
    }

    if(password.length < 6){
        errors.push({text:'Password should be atleast 6 characters'})
    }

    if(errors.length > 0){

      res.render('users/register', {
          errors,
          name,
          email,
          password,
          password2
      })
    }else {
        const email = req.body.email;
        let sql = "SELECT * FROM users WHERE email = ?";
        db.query(sql, [email], (err, rows) =>{
            if(err){
                console.log(err);
            }
            if(rows.length){
                req.flash('error_msg', 'Email is already Registered');
                req.redirect('/users/register');
            }else{
                const newUser = {
                    name: name,
                    email: email,
                    password: password
                };

                bcrypt.genSalt(10, (err, salt)=>{
                    bcrypt.hash(newUser.password, salt, (err, hash) =>{
                        if(err){
                            console.log(err);
                        }
                        newUser.password = hash;

                        let sql = "INSERT INTO users SET ?";
                        db.query(sql, [newUser], (err, rows)=>{
                            if(err){
                                console.log(err);
                            }else{
                                req.flash('success_msg', 'You are now registered an can login');
                                res.redirect('/users/login');
                            }
                        })   
                    })
                })
            }
        })
    }
})

//Logout user
router.get('/logout', (req, res)=>{
    req.logout();
    req.flash('success_msg', 'You are logged out')
    res.redirect('/users/login');
})



module.exports = router