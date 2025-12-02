const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const {requireAuth , checkUser} = require('./middleware/authmiddleware');
const authorize = require('./middleware/authorize');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://seif:ojqRizeUlG81FpvB@cluster0.vo55w6l.mongodb.net/?appName=Cluster0';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));


  //cookies
  // app.get('/set-cookie' , (req , res) =>{
    //res.setHeader('set-Cookie' , 'newUser=true');

  //   res.cookie('isEmployee', true , {maxAge : 1000 * 60 * 60 * 24 , httpOnly : true});
  //   res.send('you got the cookies!');
  // });

  // app.get('/read-cookie' , (req, res) =>{
  //   const cookies = req.cookies ;
  //   console.log(cookies);
  //   res.json(cookies);
  // })

  
// routes
app.get('*' , checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies',requireAuth ,  (req, res) => res.render('smoothies'));
app.use(authRoutes);