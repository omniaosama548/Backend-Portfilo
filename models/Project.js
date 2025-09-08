import mongoose from "mongoose";
const projectSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  liveLink: { type: String },
  gitHubLink:{ type: String },
  image: { type: String }
}, { timestamps: true });

export default mongoose.model("Project", projectSchema);