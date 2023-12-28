const router = require("express").Router();

router.get("/", (req, res) => {
  req.session.loggedIn = true;
  res.redirect("manager");
});

module.exports = router;
