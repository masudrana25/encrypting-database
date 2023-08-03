const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();

const Port = process.env.PORT || 3400;
const DataBase_URL = process.env.Database_URL_Link;

const Connect_DB = async () => {
  try {
    await mongoose.connect(DataBase_URL);
    console.log('Database Connected Successfully.');
  } catch (error) {
    console.log('Database not Connected Successfully.');
    console.log(error.message);
    process.exit(1);
  }
};
Connect_DB();

const User = require('./models/userSchema.model');

app.use(cors());
app.use(express.urlencoded({extended : true}));
app.use(express.json());

app.listen(Port, () => {
  console.log(`Server Running Successfully at ${Port}`);
});

app.get('/', (req, res) => {
  res.status(200).send('Welcome to home page');
});
app.post((req, res,next) => {
  res.status(404).send('Route not Found.');
});
app.post((err,req, res,next) => {
  res.status(500).send('Server Error!!');
});

app.post('/register', async (req, res) => {
  try {
    const NewUser = new User({
      email: req.body.email,
      password: req.body.password,
    });
    await NewUser.save();
    res.status(201).json(NewUser);
  } catch (error) {
     res.status(404).send('User not Registered.');
  }
});

app.post('/login',async (req, res) => {
  try {
    const { email, password } = req.body;
    const userEmailCheck = await User.findOne({ email: email });
    if (userEmailCheck && userEmailCheck.password === password) {
      res.status(201).json({message : 'User Login is Seccessfully Success'});
    } else {
      res.status(404).json({message : 'User  login failed'});
    }
    
  } catch (error) {
     res.status(404).send(error.message);
  }
});




