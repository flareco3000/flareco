const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

const codes = {}; // temporary storage

// EMAIL SETUP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "YOUR_GMAIL@gmail.com",
    pass: "YOUR_APP_PASSWORD"
  }
});

// SEND CODE
app.post("/send-code", (req, res) => {
  const { email } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  codes[email] = code;

  transporter.sendMail({
    from: "Flare <YOUR_GMAIL@gmail.com>",
    to: email,
    subject: "Your Login Code",
    html: `<h2>Your login code:</h2><h1>${code}</h1>`
  }, (err) => {
    if (err) return res.json({ success: false });
    res.json({ success: true });
  });
});

