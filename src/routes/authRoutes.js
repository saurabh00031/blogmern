import express from "express";
import middleware from "./../middlewares/index";
import { validateSignup, validateSignin } from "./../middlewares/validator";
import User from "./../models/user";
import Strategy from "passport-local";
const LocalStrategy = Strategy.Strategy;
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/signup", [middleware.isNotLoggedIn], async (req, res) => {
  const reqUser = req.body.user;

  // Validation
  const { errors, isValid } = validateSignup(reqUser);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  //Create a new user in the db
  try {
    const user = await User.findOne({ email: reqUser.email });
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    }
    const newUser = await new User({ ...reqUser });
    newUser.password = newUser.encryptPassword(reqUser.password);
    await newUser.save();
    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

router.post("/login", async (req, res) => {
  const reqUser = req.body.user;

  // Validation
  const { errors, isValid } = validateSignin(reqUser);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = reqUser.email;
  const password = reqUser.password;

  // Find user
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "Email not found" });
    if (!user.validPassword(password)) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    // Create and send the JWT token
    const payload = {
      id: user._id,
      userName: user.userName,
      imagePath: user.imagePath,
    };
    jwt.sign(
      payload,
     "sG/1CKsjpAdpq6bSdGwlRU/8vOtHSk6Bbek2Qrd8bQdA3oynvapc1pTDGR+ZpDAIdSpdwjScUWC11dcjxP+uyTDliTcMiWGbxgMFghwaumhGfFOjJdMyCtXzWgl/sek4k5E/5FT2OGEERivH++wOhFvqSZBwNdckbXvHa6uIW2SGWs57VDiBTIzTJgVp/WgPji2DN8OLki9+hvyNm+KxcyUkieJqE9LunEPer09LG2lfq3oXKXXmb/saT0dGc3zmaV+De+TXqN7XN9Os+chfRQKzxswmc4fDqWlETkDQLVGtMfHmtnmXoDF+FQW/5iCWSv2sfekAgMtPaWKO0uGMgQ==",
      {
        expiresIn: 31556926, // 1 year in seconds
      },
      (err, token) => {
        res.json({
          token: token,
        });
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

export default router;
