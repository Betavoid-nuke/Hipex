"use client";
import { useMemo } from "react";
import dataManager from "../data/data";
import {
  Copy,
  Eye,
  EyeOff,
  MoreVertical,
  Star,
  Trash2,
} from "lucide-react";
import {
  deleteProject,
  toggleFavoriteProject,
  updateProjectKeyById,
} from "../utils/twinxDBUtils.action";
import { Project } from "../types/TwinxTypes";
import { showNotification } from "./AppNotification";
import { copyToClipboard } from "../utils/TwinxUtils";
import "../../app/(twinx)/globals.css";
import SpotlightCard from "@/components/SpotlightCard";
import { motion } from 'framer-motion';
import { useRouter } from "next/router";
import Link from "next/link";

interface Props {
  project?: Project;
  activeDropdown: string | null;
  setActiveDropdown: (id: string | null) => void;
  dropdownRef?: React.RefObject<HTMLDivElement>;
  userId: string;
  keyUni: string;
}

export default function ProjectCardCore({
  userId,
  project,
  activeDropdown,
  setActiveDropdown,
  dropdownRef,
  keyUni
}: Props) {
  if (!project) return null;

  // const router = useRouter();
  const Data = dataManager();
  const progress = (project.currentStep / Data.TotalPipelineSteps) * 100;

  // ✅ create a stable unique dropdown ID per card
  const dropdownId = useMemo(
    () => `${project.id}-${Math.random().toString(36).substring(2, 8)}`,
    [project.id]
  );

  const isDropdownOpen = activeDropdown === dropdownId;

  // ✅ Fixed toggleFavorite logic
  const toggleFavorite = async (projectId: string, isFavorite: boolean) => {
    if (!userId) return;
    const res = await toggleFavoriteProject(userId, projectId, isFavorite);
    if (!res.success) {
      console.error(res.message);
      showNotification(
        "Can't add this project to Favorites. Please try again later!",
        "error"
      );
    } else {
      showNotification(
        isFavorite
          ? "Removed from Favorites!"
          : "Added to your Favorites!",
        "normal"
      );
    }
  };

  const togglePublish = async (projectId: string, isPublished: boolean) => {
    await updateProjectKeyById(projectId, "published", !isPublished);
    showNotification(
      !isPublished
        ? "Project Published Successfully!"
        : "Project Unpublished.",
      "normal"
    );
  };

  const uniqueCardID = `project-card-${project.twinxid}`;

  return (
    <Link href={`/twinx/project/${project._id}`} className="block">  
    <div key={keyUni} className="twinxproject-card rounded-xl">
    <motion.div
      key={uniqueCardID}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl"
      style={{zIndex:'999'}}
    >
    <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(100, 102, 241, 0.5)">
        <div
          className={`rounded-xl shadow-md border border-[#3A3A3C] flex flex-col overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:border-[#4A4A4C]`}
          style={{ backgroundColor: "transparent", margin:'-35px', border:'none' }}
        >
          {/* Thumbnail */}
          <div className="relative">
        <img
          src={
            project.thumbnail ||
            "https://placehold.co/400x225/262629/3A3A3C?text=No+Preview"
          }
          alt={project.title}
          className="w-full h-44 object-cover rounded-t-xl"
        />
        <div className="absolute top-2 right-2 flex gap-2" style={{top:'10px'}}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(project.id, project.isFavorite);
            }}
            className={`p-1.5 rounded-full transition-colors bg-black/50 ${
              project.isFavorite
                ? "text-yellow-400"
                : "text-[#A0A0A5] hover:text-yellow-400"
            }`}
          >
            <Star
              size={18}
              fill={project.isFavorite ? "currentColor" : "none"}
            />
          </button>
        </div>
          </div>

          {/* Info Section */}
          <div className="p-4 flex flex-col flex-grow justify-between">

            <div>
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-white text-sm leading-tight pr-2 flex-1 line-clamp-2">
              {project.title || "Untitled Project"}
            </h3>
            <div
              className="relative"
              ref={isDropdownOpen ? dropdownRef : null}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveDropdown(isDropdownOpen ? null : dropdownId);
                }}
                className="text-[#A0A0A5] hover:text-white p-1"
              >
                <MoreVertical size={18} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-[#323236] border border-[#4A4A4C] rounded-lg shadow-lg overflow-hidden z-20 animate-fadeIn">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      togglePublish(project.id, project.isPublished);
                      setActiveDropdown(null);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-white hover:bg-[#4A4A4C]"
                  >
                    {project.isPublished ? (
                      <>
                        <EyeOff size={16} /> Unpublish
                      </>
                    ) : (
                      <>
                        <Eye size={16} /> Publish
                      </>
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      deleteProject(project.id);
                      setActiveDropdown(null);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-400 hover:bg-[#4A4A4C]"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2 text-xs text-[#A0A0A5] font-mono">
            <span className="truncate">{project.twinxid}</span>
            <Copy
              size={14}
              className="hover:text-white shrink-0 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(project.twinxid, "Copied to clipboard!");
              }}
            />
          </div>
            </div>

            {/* Progress */}
            <div className="mt-4">
          <div className="w-full bg-[#3A3A3C] rounded-full h-2">
            <div
              className="bg-[#6366F1] h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-[#A0A0A5] text-right mt-1">
            {project.currentStep}/{Data.TotalPipelineSteps} Steps
          </p>
            </div>

          </div>
        </div>
    </SpotlightCard>
    </motion.div>
    </div>
    </Link>
  );
}