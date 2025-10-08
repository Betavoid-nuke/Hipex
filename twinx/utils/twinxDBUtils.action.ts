"use server"

import User from "@/lib/models/user.model";
import { showNotification } from "../components/AppNotification";
import TwinxProject from "../models/TwinxProject.model";
import { revalidatePath } from "next/cache";
import { connectToDB } from "@/lib/mongoose";
import Community from "@/lib/models/community.model";

/**
 * 🗑 Deletes a project document from MongoDB by its ID.
 */
export async function deleteProject(projectId: string): Promise<{ success: boolean; message: string }> {
  try {
    if (!projectId) {
      return { success: false, message: "Project ID is required" };
    }

    await connectToDB();
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
export async function createProject(data: Record<string, any>, author:string, path:string): Promise<{ success: boolean; data?: any; message: string }> {
  try {
    await connectToDB();

    //creating new project doc in mongo
    const project = await TwinxProject.create(data);

    //adding the peroject id to the user model
    await User.findByIdAndUpdate(author, {
      $push: { twinxprojects: project._id }
    })
    revalidatePath(path);

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

    await connectToDB();
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

    await connectToDB();
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

    await connectToDB();

    const projects = await TwinxProject.find({ ownerID: userId })
    .sort({ createdAt: -1 })
    .lean();

    // const projects = TwinxProject.find()
    // .sort({ createdAt: 'desc'})
    // .populate({ path: 'author', model: User })

    return { success: true, data: projects, message: "Projects fetched successfully" };
  } catch (error: any) {
    console.error("❌ Error fetching projects by user ID:", error);
    return { success: false, message: error.message || "Failed to fetch projects" };
  }
}


/**
 * ➕ Adds a project ID to the `twinxprojects` array for a user.
 *
 * @param {string} userId - The Clerk user ID.
 * @param {string} projectId - The Mongo project ID to add.
 */
export async function addProjectToUser(userId: string, projectId: string) {
  try {
    await connectToDB();

    const updatedUser = await User.findOneAndUpdate(
      { id: userId },
      { $addToSet: { twinxprojects: projectId } }, // ✅ prevents duplicates
      { new: true, upsert: false }
    );

    if (!updatedUser) {
      return { success: false, message: "User not found" };
    }

    return { success: true, message: "Project added successfully", data: updatedUser };
  } catch (error: any) {
    console.error("❌ Error adding project to user:", error);
    return { success: false, message: error.message || "Failed to add project" };
  }
}

/**
 * ⭐ Adds a project ID to the `twinxfavprojects` array for a user.
 *
 * @param {string} userId - The Clerk user ID.
 * @param {string} projectId - The Mongo project ID to add to favorites.
 */
export async function toggleFavoriteProject(
  userId: string | null,
  projectId: string,
  isFavorite: boolean
): Promise<{ success: boolean; message: string }> {
  try {
    if (!userId || !projectId) {
      return { success: false, message: "User ID and Project ID are required" };
    }

    await connectToDB();

    if (!isFavorite) {
      // ⭐ Add to favorites
      await User.findOneAndUpdate(
        { id: userId },
        { $addToSet: { twinxfavprojects: projectId } },
        { new: true }
      );
      return { success: true, message: "Added to favorites" };
    } else {
      // ❌ Remove from favorites
      await User.findOneAndUpdate(
        { id: userId },
        { $pull: { twinxfavprojects: projectId } },
        { new: true }
      );
      return { success: true, message: "Removed from favorites" };
    }
  } catch (error: any) {
    console.error("❌ Error toggling favorite:", error);
    return { success: false, message: error.message || "Failed to toggle favorite" };
  }
}


/**
 * 🧠 Fetches a user by ID and returns a fully plain JS object
 * (no Mongoose metadata, no serialization errors).
 */
export async function getUserById(userId: string) {
  try {
    await connectToDB();

    const userDoc = await User.findOne({ id: userId })
      .lean()
      .exec();
    if (!userDoc) return null;

    // 🔥 This is the magic line — converts everything to plain JSON (ObjectIds, Dates, etc.)
    return JSON.parse(JSON.stringify(userDoc));
  } catch (error: any) {
    console.error("❌ getUserById error:", error);
    return null;
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
