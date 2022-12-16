const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const dbUrl =
  "mongodb+srv://mushroom:mushroom@cluster0.6utmlin.mongodb.net/?retryWrites=true&w=majority";
const User = require("./models/User");
const ejs = require("ejs");
const session = require("express-session");
const flash = require("connect-flash");
const { query } = require("express");
const { findOne } = require("./models/User");

//const localStorage = require("localStorage");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//register view engine
app.use(express.static("public"));
app.set("view engine", "ejs");
//save css and imgs in public

//session set up
app.set("trust proxy", 1);
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);
//flash set up
app.use(flash());
//connect to mongodb
app.use((req, res, next) => {
  req.flash("wrongPassword", "wrong password");
  req.flash("userNameUsed", "username taken");
  req.flash("userNotFound", "user not found");
  req.flash("error", "Error. Try again.");
  next();
});
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

app.get("/home", (req, res) => {
  res.render("home");
});
app.get("/", (req, res) => {
  res.redirect("home");
});

app.get("/game2", async (req, res) => {
  try {
    const results = await User.find().sort("-score").limit(10);
    //res.json(await User.find().sort("-score"));
    return res.render("game2", { results: results, userName: null });
  } catch {
    res.send("error");
  }
});
app.get("/register", (req, res) => {
  // res.render("register", { message: req.flash("userNameUsed") });
  res.render("register", { message: "" });
});

//create a user through /post, use bcrypt to hash the password, store user info in req.body in database
app.post("/register", async (req, res) => {
  try {
    const hashedP = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      name: req.body.name,
      password: hashedP,
    });
    //check if the user exists, if so, don't save into db,redirect to register
    if (await User.exists({ name: req.body.name })) {
      return res.render("register", { message: req.flash("userNameUsed") });
    }
    // user name has been checked, save this new user in db
    const newUser = await user.save();
    res.render("login", { message: "" });
  } catch {
    return res.render("register", { message: req.flash("error") });
  }
});

app.get("/login", (req, res) => {
  res.render("login", { message: req.flash("login") });
});

//login page, check info in req.body with info in the db
app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ name: req.body.name });
    if (user == null) {
      //return immediately if no user
      return res.render("login", { message: req.flash("userNotFound") });
    }
    if (await bcrypt.compare(req.body.password, user.password)) {
      const results = await User.find().sort("-score").limit(10);
      return res.render("game2", { results: results, userName: req.body.name });
    } else {
      res.render("login", { message: req.flash("wrongPassword") });
    }
  } catch {
    res.render("login", { message: req.flash("loginError") });
  }
});

// express to get data from the page
app.get("/api", async (req, res) => {
  console.log(req.query);
  try {
    const user = await User.findOne({ name: req.query.name });
    user.score = req.query.score > user.score ? req.query.score : user.score;
    const updatedUser = await User.findOneAndUpdate(
      { name: req.query.name },
      { score: user.score },
      { returnOriginal: false }
    );
    const thisUpdatedUser = await updatedUser.save();
    res.send("You have updated your score");
  } catch (e) {
    console.log(e);
  }
});

app.get("*", (req, res) => {
  res.render("404");
});

app.listen(3000, () => {
  console.log("on port 3000");
});
