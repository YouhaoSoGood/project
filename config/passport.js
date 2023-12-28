const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("../models/login");

passport.serializeUser((user, done) => {
  console.log("now");
  done(null, user._id);
});

passport.deserializeUser((_id, done) => {
  console.log("DES");
  User.findById({ _id }).then((user) => {
    console.log("Find");
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/redirect",
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ password: profile.id }).then((foundUser) => {
        if (foundUser) {
          console.log("使用者存在");
          done(null, foundUser);
        } else {
          new User({
            account: profile.displayName,
            password: profile.id,
          })
            .save()
            .then((newUser) => {
              console.log("新Uer已建立");
              done(null, newUser);
            });
        }
      });
    }
    // (accessToken, refreshToken, profile, done) => {
    //   User.findOne({ googleID: profile.id }).then((foundUser) => {
    //     if (foundUser) {
    //       console.log("使用者已存在");
    //       done(null, foundUser);
    //     } else {
    //       new User({
    //         // name: profile.displayName,
    //         googleID: profile.id,
    //       })
    //         .save()
    //         .then((newUser) => {
    //           console.log("新User已建立");
    //           done(null, newUser);
    //         });
    //     }
    //   });
    // }
  )
);
