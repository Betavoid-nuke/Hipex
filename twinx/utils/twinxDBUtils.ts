import { showNotification } from "../components/AppNotification";
import dbConnect from "../data/dbConnect";
import TwinxProject from "../models/TwinxProject.model";

/**
 * 🗑 Deletes a project document from MongoDB by its ID.
 */
export async function deleteProject(projectId: string): Promise<{ success: boolean; message: string }> {
  try {
    if (!projectId) {
      return { success: false, message: "Project ID is required" };
    }

    await dbConnect();
    const deleted = await TwinxProject.findByIdAndDelete(projectId);

    if (!deleted) {
      return { success: false, message: "Project not found" };
    }

    showNotification("Digital Twin deleted successfully.");
    return { success: true, message: "Project deleted successfully" };
  } catch (error: any) {
    console.error("❌ Error deleting project:", error);
    return { success: false, message: error.message || "Failed to delete project" };
  }
}

/**
 * ➕ Adds a new project document to MongoDB.
 */
export async function addProject(data: Record<string, any>): Promise<{ success: boolean; data?: any; message: string }> {
  try {
    await dbConnect();
    const project = await TwinxProject.create(data);

    showNotification("Digital Twin created successfully.");
    return { success: true, data: project, message: "Project created successfully" };
  } catch (error: any) {
    console.error("❌ Error adding project:", error);
    return { success: false, message: error.message || "Failed to create project" };
  }
}

/**
 * ✏️ Updates a single key of a project document by ID.
 */
export async function updateProjectKeyById(
  projectId: string,
  key: string,
  value: any
): Promise<{ success: boolean; message: string }> {
  try {
    if (!projectId || !key) {
      return { success: false, message: "Project ID and key are required" };
    }

    await dbConnect();
    const update = { [key]: value, updatedAt: new Date() };
    const updated = await TwinxProject.findByIdAndUpdate(projectId, update, { new: true });

    if (!updated) {
      return { success: false, message: "Project not found" };
    }

    showNotification(`Project ${key} updated.`);
    return { success: true, message: "Project updated successfully" };
  } catch (error: any) {
    console.error("❌ Error updating project:", error);
    return { success: false, message: error.message || "Failed to update project" };
  }
}

/**
 * 🔍 Finds a project document by its ID.
 */
export async function getProjectById(projectId: string): Promise<{ success: boolean; data?: any; message: string }> {
  try {
    if (!projectId) {
      return { success: false, message: "Project ID is required" };
    }

    await dbConnect();
    const project = await TwinxProject.findById(projectId);

    if (!project) {
      return { success: false, message: "Project not found" };
    }

    return { success: true, data: project, message: "Project fetched successfully" };
  } catch (error: any) {
    console.error("❌ Error fetching project:", error);
    return { success: false, message: error.message || "Failed to fetch project" };
  }
}

/**
 * 👤 Finds all projects associated with a specific user ID.
 */
export async function getProjectsByUserId(userId: string): Promise<{ success: boolean; data?: any; message: string }> {
  try {
    if (!userId) {
      return { success: false, message: "User ID is required" };
    }

    await dbConnect();
    const projects = await TwinxProject.find({ ownerID: userId }).sort({ createdAt: -1 });

    return { success: true, data: projects, message: "Projects fetched successfully" };
  } catch (error: any) {
    console.error("❌ Error fetching projects by user ID:", error);
    return { success: false, message: error.message || "Failed to fetch projects" };
  }
}













//USAGE

// // Create new
// await addProject({
//   title: "My Digital Twin",
//   twinxid: userId,
//   thumbnail: "",
//   videoUrl: "",
//   isFavorite: false,
//   isPublished: false,
//   currentStep: 0
// });

// // Update key
// await updateProjectKeyById(projectId, "title", "Updated Title");

// // Get one
// const { data: project } = await getProjectById(projectId);

// // Get all by user
// const { data: projects } = await getProjectsByUserId(userId);

// // Delete
// await deleteProject(projectId);
