const User = require('../models/User');
const jwt = require('jsonwebtoken');


const handelErrors = (err) =>{
  console.log(err.message , err.code);
  let errors = { email : '' , password : ''};

  //incorrect email
  if(err.message === 'incorrect email'){
    errors.email = 'that email is not registered';
  }

  //incorrect password 
  if(err.message === 'incorrect password'){
    errors.password = 'that password is incorrect'
  }

  if(err.code === 11000){
    errors.email = 'that email is already registered';
    
    return errors ;
  }
  if(err.message.includes('user validation failed')){
    Object.values(err.errors).forEach(error =>{
      errors[error.path] = error.message;
    });
  }

  return errors ;
}





module.exports.signup_get = (req, res) => {
  res.render('signup');
}

module.exports.login_get = (req, res) => {
  res.render('login');
}


const maxAge = 3 * 24 * 60 * 60 ;
const createToken = (id , role) =>{
  return jwt.sign({id , role} , 'net ninja secret' , {expiresIn : maxAge}); 
}

module.exports.signup_post = async (req, res) => {
  const { email, password , role } = req.body;

  try{
   const user = await User.create({email , password , role});
   const token = createToken(user._id , user.role);
   res.cookie('jwt' , token , {httpOnly : true , maxAge : maxAge * 1000});
   res.status(201).json({user: user._id});
  }
  catch(err){
  const errors = handelErrors(err);
   res.status(400).json({errors});
  }
 
  
}

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;


  try{
   const user = await User.login(email , password);
   const token = createToken(user._id , user.role);
   res.cookie('jwt' , token , {httpOnly : true , maxAge : maxAge * 1000});
   res.status(200).json({user : user._id});

  } catch(err) {
    const errors = handelErrors(err);
    res.status(400).json({errors});
  }
  

  // console.log(email, password);
  // res.send('user login');
}

module.exports.logout_get = async (req , res) => {
  res.cookie('jwt' , '' , {maxAge: 1});
  res.redirect('/');
}