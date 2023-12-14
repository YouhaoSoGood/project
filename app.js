const express = require("express"); //npm install express
const app = express();
const mongoose = require("mongoose"); //npm install mongoose
const bodyParser = require("body-parser"); //npm install body-parser
const Repair = require("./models/repair");
const Login = require("./models/login");
const Convert = require("./models/convert");
const session = require("express-session"); //npm install express-session

const dotenv = require("dotenv"); //npm install dotenv
dotenv.config();
const authRoute = require("./routes/auth-route");
require("./config/passport");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(
  session({
    secret: "mykey",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/auth", authRoute);

mongoose
  .connect("mongodb://127.0.0.1:27017/repair", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("成功連結到mongodb");
  })
  .catch((e) => {
    console.log("連接失敗");
    console.log(e);
  });

app.get("/manager", async (req, res) => {
  if (!req.session.loggedIn) {
    //檢查登入狀況
    res.redirect("/login");
    return;
  }

  let data = await Repair.find();
  data.forEach((item) => {
    item.stateText = Convert.state[item.state];
    item.stateArray = Convert.state;
  });
  res.render("manager.ejs", { data });
});

app.post("/manager/updataState", async (req, res) => {
  let data = await Repair.findOneAndUpdate(
    { _id: req.body.id },
    { state: req.body.selectState }
  );
});

app.get("/repair", (req, res) => {
  res.render("repair.ejs");
});

app.post("/repair", (req, res) => {
  let { name, phone, unit, content } = req.body; //前端post傳入的資料會進入req.body裡面
  let state = 0; //0是未查看 1是已查看 2是維修中 3是完工
  let newRepair = new Repair({
    name,
    phone,
    unit,
    content,
    state,
  });

  newRepair
    .save()
    .then(() => {
      console.log("資料已儲存");
      res.json({ code: 0 });
    })
    .catch((e) => {
      console.log("資料未儲存");
      res.json({ code: 1 });
    });
});

app.delete("/repair", async (req, res) => {
  let { id } = req.body;
  let data = await Repair.findOneAndDelete(id);
  res.json({ data: data.name });
});

app.get("/inquire", async (req, res) => {
  let data = await Repair.find();
  data.forEach((item) => {
    item.stateText = Convert.state[item.state];
  });

  res.render("inquire.ejs", { data });
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.post("/login", async (req, res) => {
  let { account, password } = req.body;
  let data = await Login.find({
    $and: [{ account: account }, { password: password }],
  });
  if (data.length !== 0) {
    req.session.loggedIn = true; // 標記用戶已登入
    res.redirect("/manager");
  } else {
    res.redirect("/login?success=false&msg=帳號或密碼錯誤");
  }
});

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.listen("3000", () => {
  console.log("伺服器已啟動");
});
