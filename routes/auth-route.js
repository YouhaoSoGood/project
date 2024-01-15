const router = require("express").Router();
const passport = require("passport");
const Login = require("../models/login");

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  res.redirect("/profile");
});

router.get("/logout", (req, res) => {
  req.session.loggedIn = false;
  res.redirect("/login");
});

module.exports = router;
