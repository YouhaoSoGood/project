const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("../models/login");

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((_id, done) => {
  User.findById({ _id }).then((user) => {
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
      User.findOne({ googleID: profile.id }).then((foundUser) => {
        if (foundUser) {
          console.log("使用者存在");
          done(null, foundUser);
        } else {
          new User({
            account: profile.displayName,
            googleID: profile.id,
            photo: profile.photos[0].value,
          })
            .save()
            .then((newUser) => {
              console.log("新Uer已建立");
              done(null, newUser);
            });
        }
      });
    }
  )
);
