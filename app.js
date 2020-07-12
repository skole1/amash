const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session =  require('express-session')
const dotenv = require('dotenv')
const morgan = require('morgan')
const passport = require('passport') 
const flash = require('connect-flash')
const exphbs = require('express-handlebars')
const bcrypt = require('bcryptjs')

//Load config
dotenv.config({path: './config/config.env'})

const app = express()

//Load routes
const dashboard = require('./routes/index');
const users = require('./routes/users');

require('./config/passport')(passport);

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}


//Handlebars Middleware
app.engine('.hbs', exphbs({defaultLayout:'main', extname: '.hbs'}));
app.set('view engine', '.hbs');
//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//Public folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(methodOverride('_method'));

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
  }));

  //Passport Middleware
  app.use(passport.initialize());
  app.use(passport.session());

app.use(flash());

//Global variable
app.use((req, res, next)=>{
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

//Static Folder
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', dashboard)
app.use('/users', users)

const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))