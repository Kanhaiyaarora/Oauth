import express from "express";
import dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const app = express();
app.use(passport.initialize());

const html = `
<div style="color: red; background-color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;width: 100vw">
<h1 style="color:red">Welcome Back </h1> 
<a href="${process.env.GOOGLE_OAUTH_URL}">Login with Google</a>
</div>`;

app.get("/", (req, res) => {
  res.send(html);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    (_, __, profile, done) => {
      return done(null, profile);
    },
  ),
);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  (req, res) => {
    console.log(req.user);
    res.send("Google authentication successful");
  },
);

app.listen(3000, () => {
  console.log("🔔 Server 🚀 started.");
});
