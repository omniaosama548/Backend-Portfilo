// controllers/messageController.js
import Message from "../models/Message.js";
import nodemailer from "nodemailer";

export const sendMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Save message to database
    const newMessage = new Message({ name, email, message });
    await newMessage.save();

    // Send message via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS, // app password
      },
    });

    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: `New Message from ${name}`,
      text: `
      Name: ${name}
      Email: ${email}
      -----------------------
      Message:
      ${message}
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "Message sent & emailed successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

