import express from "express";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User";

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "Missing Google credential" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return res.status(400).json({ message: "Invalid Google token payload" });
    }

    const {
      sub: googleId,
      email,
      email_verified,
      given_name,
      family_name,
      name,
      picture,
    } = payload;

    if (!email_verified) {
      return res.status(403).json({ message: "Google email is not verified" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        googleId,
        firstName: given_name || "",
        lastName: family_name || "",
        displayName: name || "",
        avatar: picture || "",
        authProvider: "google",
      });
    } else {
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = "google";
      }

      if (!user.avatar && picture) user.avatar = picture;
      if (!user.displayName && name) user.displayName = name;

      await user.save();
    }

    const appToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Google authentication successful",
      token: appToken,
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Google auth error:", error);
    return res.status(401).json({ message: "Google authentication failed" });
  }
});

module.exports = router;