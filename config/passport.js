const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const bcrypt = require('bcryptjs');
const mysql = require('mysql');
const dotenv = require('dotenv')

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

module.exports = function(passport){
    passport.use(new LocalStrategy({usernameField: 'email', passReqToCallback: true}, (req, email, password, done)=>{
        email = req.body.email;
        let sql = "SELECT * FROM users WHERE email = ?";
        db.query(sql, [email], (err, rows) =>{
            if(err){
                return done(err);
            }

            if(!rows.length){
                return done(null, false, req.flash('error', 'No User Found'));
            }
            if(!bcrypt.compareSync(password, rows[0].password))
            return done(null, false, req.flash('error', 'Wrong password'));

            return done(null, rows[0]);
        })

    }))

    passport.serializeUser(function(user, done){
        done(null, user.id);
       });
      
       passport.deserializeUser(function(id, done){
        db.query("SELECT * FROM users WHERE id = ? ", [id],
         function(err, rows){
          done(err, rows[0]);
         });
       });
}