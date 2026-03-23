const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://localhost:5050/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value || "";

        let user = await User.findOne({ googleId: profile.id });

        if (!user && email) {
          user = await User.findOne({ email });
        }

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            username:
              profile.displayName || `googleuser_${new Date().getTime()}`,
            email: email,
            password: "oauth_temp_password",
            first_name: "Google",
            last_name: "User",
            role: "user",
          });
        } else {
          if (!user.googleId) {
            user.googleId = profile.id;
          }
          if (!user.username) {
            user.username = profile.displayName || user.username;
          }
          if (!user.email && email) {
            user.email = email;
          }
          user.authProvider = "google";
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
