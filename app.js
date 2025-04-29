require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const ejs = require("ejs");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("./config/db.config.js");
const usermodel = require("./models/user.model.js");
const chatModel = require("./models/chat.model.js"); // Import Chat model
const { log } = require("console");
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { cp } = require("fs");
app.use(cookieParser());
const bcrypt = require("bcrypt");


const authMiddleware = async (req, res, next) => {
  const jwtToken = req.cookies.jwt;
  //console.log(jwt);
  if (!jwtToken) {
     res.redirect("/auth/google");
  }
  const decoded =  jwt.verify(jwtToken, process.env.JWT_SECRET);
  if (!decoded) {
    res.redirect("/auth/google");
  }
  else {
    const user = await usermodel.findById(decoded.id);
    if (!user) {
      res.redirect("/auth/google");
    } else {
      req.user = user;
      next();
    }
   
  }
  
}  

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      // Here you can save the user profile to your database
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get("/", (req, res) => {
  res.render('homepage');
});

app.get('/login' , (req, res) => {
  res.render('login')
});

app.post('/login' , async (req, res) => {
  const { email, password } = req.body;
  const user = await usermodel.findOne({ email });
  
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  const id = user._id;
  const token = await jwt.sign({ id }, process.env.JWT_SECRET, );
  
  res.cookie("jwt", token, { httpOnly: true });
  res.redirect("/profile");
});

app.get('/signup' , (req, res) => { 
  res.render('signup');
});

app.post('/signup' , async (req, res) => {
  const { email, password, displayName , imageUrl } = req.body;

  const user = await usermodel.create({
    email, password, displayName 
  });
  if(imageUrl) {
    user.image = imageUrl;
  }
  await user.save();
  res.redirect('/login');
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res) => {
    const email = req.user.emails[0].value;
    const displayName = req.user.displayName;
    const image = req.user.photos[0].value;
    const user = await usermodel.findOne({ email });

    if (!user) {
      const newuser = new usermodel({
        email,
        displayName,
        image,
      });
      const user = await newuser.save();
      
    }
    const id = user._id;
    const token = await jwt.sign({ id }, process.env.JWT_SECRET, );
    
    res.cookie("jwt", token, { httpOnly: true });
    res.redirect("/profile");
  }
);

app.get("/profile", authMiddleware , async (req, res) => {

 
  const LoggedInUser = await usermodel.findOne({
    
    email: req.user.email,
  });

  const onlineUser = await usermodel.find({
    socketId: {
      $ne: null,
    },
    _id: {
      $ne: LoggedInUser._id,
    },
  });

  res.render("chat", { user: LoggedInUser, onlineUser });
});

const server = require("http").createServer(app);
const io = require("socket.io")(server);
io.on("connection", (socket) => {
  
  

  socket.on("join", async (id) => {
    
    await usermodel.findByIdAndUpdate(id, { socketId: socket.id });
  });

  socket.on("message", async (obj) => {
    

    // Validate the message content
    if (!obj.message || obj.message.trim() === "") {
      console.error("Message content is empty");
      return;
    }

    // Validate the receiver ID
    if (!obj.id || obj.id.trim() === "") {
      console.error("Receiver ID is empty");
      return;
    }

    // Find the sender (current user) using the socket ID
    const sender = await usermodel.findOne({ socketId: socket.id });
    if (!sender) {
      console.error("Sender not found");
      return;
    }

    // Find the receiver
    const receiver = await usermodel.findOne({ _id: obj.id });
    if (!receiver) {
      console.error("Receiver not found");
      return;
    }

    // Save chat to database
    const chat = new chatModel({
      senderId: sender._id, // Use the sender's ObjectId
      receiverId: receiver._id, // Use the receiver's ObjectId
      message: obj.message,
    });
    await chat.save();

    // Emit message to receiver
    socket.to(receiver.socketId).emit("msg", {
      senderId: sender._id,
      message: obj.message,
    });
  });

  socket.on("disconnect", async () => {
    await usermodel.findOneAndUpdate(
      { socketId: socket.id },
      { socketId: null }
    );
  });
});

// Endpoint to fetch chat history
app.get("/chats/:receiverId",authMiddleware , async (req, res) => {
  const senderId = req.user._id; // Assuming user is authenticated
  const receiverId = req.params.receiverId;
  const chats = await chatModel
    .find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    })
    .sort({ timestamp: 1 });

  res.json(chats);
  
  
});





server.listen(3000);
