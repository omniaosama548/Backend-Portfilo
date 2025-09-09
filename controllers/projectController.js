import Project from "../models/Project.js";
import cloudinary from "../config/cloudinary.js"
//add project
export const addProject = async (req, res) => {
  try {
    const { title, description, liveLink, gitHubLink } = req.body;

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "projects", 
    });

    const newProject = new Project({
      title,
      description,
      liveLink,
      gitHubLink,
      image: result.secure_url, 
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find();

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const updatedProjects = projects.map(project => ({
      ...project._doc,
      image: project.image ? `${baseUrl}/${project.image}` : null
    }));

    res.json(updatedProjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



//update project
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProject = await Project.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Delete project
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//get single project
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};