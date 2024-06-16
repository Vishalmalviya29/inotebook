const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var fetchuser = require("../middleware/fetchuser");



const JWT_SECRET = "vishalisa$goodboy"; //secret to sign json web token

// ROUTE 1: create a user using: POST "/api/auth/createuser"  (hitting a post request on /api/auth and send data).
// no login required
router.post(
  "/createuser",
  [
    body("name", "enter a valid name").isLength({ min: 3 }),
    body("email", "enter a valid email").isEmail(),
    body("password", "password length is short").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success = false;
    // if there are errors then return errors and bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    // check whether the user with this email exists already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success, error: "sorry a user with this email already exists" });
      }

      const salt = await bcrypt.genSalt(10); // generate a bcrypt salt
      const secpass = await bcrypt.hash(req.body.password, salt); // generate a password hash

      // create a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secpass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authToken: authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("some error occured");
    }
  }
);

// ROUTE 2: authenticate a user using: POST "/api/auth/login"  (hitting a post request on /api/auth and send data).
router.post(
  "/login",
  [
    body("email", "enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    // if there are errors then return errors and bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ success, error: "try to login with correct credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ success, error: "try to login with correct credentials" });
        }

      const payload = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(payload, JWT_SECRET);
      success = true;
      res.json({ success, authToken: authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

// ROUTE 3: get logged in user details using: POST "/api/auth/getuser"  (hitting a post request on /api/auth and send data).
// login required. we wiil fetch userid from auth token and then get the user details by the help of user id
router.post( "/getuser", fetchuser, async (req, res) => {
    
    try {
      userid = req.user.id;
      const user = await User.findById(userid).select("-password");
      res.send(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

module.exports = router;
