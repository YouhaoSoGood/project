const router = require("express").Router();
const passport = require("passport");
const Login = require("../models/login");

router.get("/login", (req, res) => {
  res.render("login");
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile"],
  })
);

router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  // console.log(req.user.googleID);
  res.redirect("/profile");
});

module.exports = router;
