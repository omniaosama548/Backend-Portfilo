import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import Project from "./models/Project.js"; 

dotenv.config();

// Connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch(err => console.error(err));

// Config Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const __dirname = path.resolve();

const migrate = async () => {
  try {
    const projects = await Project.find();

    for (const project of projects) {
      if (project.image && project.image.startsWith("/uploads")) {
        const localPath = path.join(__dirname, project.image);

        if (fs.existsSync(localPath)) {
          console.log("Uploading:", localPath);

          // رفع الصورة
          const result = await cloudinary.uploader.upload(localPath, {
            folder: "portfolio",
          });

          // تحديث الصورة في DB
          project.image = result.secure_url;
          await project.save();

          console.log("✅ Migrated:", project.title);
        }
      }
    }

    console.log("🎉 Migration Done!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

migrate();
