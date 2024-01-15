const router = require("express").Router();

const auth = "skskfpmWksiB3HxrLdRK8bsxj1y8ASRAoFmMtazy0RJX8HT5KTNh6XFg";
const intialURL = "https://api.pexels.com/v1/curated?page=1&per_page=15"; //page=1是第一頁 per_page=15是要15張
const searchURL = `https://api.pexels.com/v1/search?query=nature&per_page=15&page=1`;

router.get("/search/photo", (req, res) => {
  res.render("searchphoto");
});

module.exports = router;
