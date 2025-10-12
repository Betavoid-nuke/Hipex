"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  Copy,
  Check,
  UploadCloud,
  Settings,
  FileText,
  Search,
  Briefcase,
  User,
  MoreVertical,
  Star,
  Eye,
  Trash2,
  Loader2,
} from "lucide-react";
import ThreeViewport from "@/twinx/components/ThreeViewport";
import { copyToClipboard } from "@/twinx/utils/TwinxUtils";
import { showNotification } from "@/twinx/components/AppNotification";
import { getProjectById } from "@/twinx/utils/twinxDBUtils.action";
import { Project } from "@/twinx/types/TwinxTypes";

const ProjectViewPage = () => {

  const [projectid, setprojectid] = useState<string | null>(null);
  const [project, setProject] = useState<Project>({} as Project);
  const [loading, setLoading] = useState(true);

  let TOTAL_STEPS = 0;
  let PIPELINE_CONFIG:any = [];

  if(project.totalSteps){
    TOTAL_STEPS = project.totalSteps || 12;
    PIPELINE_CONFIG = project.pipelineConfig || [];
  } else {
    TOTAL_STEPS = 12; //default
    PIPELINE_CONFIG = [ //default config
      { id: 1, name: "Upload", description: "Uploading assets", icon: UploadCloud },
      { id: 2, name: "Preprocess", description: "Preparing data", icon: Settings }, 
      { id: 3, name: "Feature Extraction", description: "Extracting features", icon: Search },
      { id: 4, name: "Model Training", description: "Training model", icon: Briefcase },
      { id: 5, name: "3D Reconstruction", description: "Building 3D model", icon: FileText },
      { id: 6, name: "Texturing", description: "Applying textures", icon: Star },
      { id: 7, name: "Optimization", description: "Optimizing model", icon: Eye },
      { id: 8, name: "Validation", description: "Validating model", icon: Check },
      { id: 9, name: "Export", description: "Exporting assets", icon: Copy },
      { id: 10, name: "Integration", description: "Integrating components", icon: User },
      { id: 11, name: "Testing", description: "Testing functionality", icon: MoreVertical },
      { id: 12, name: "Deployment", description: "Deploying solution", icon: Trash2 },
    ];
  }

  const isCompleted = project.currentStep === TOTAL_STEPS;
  const isProcessing = project.currentStep > 0 && project.currentStep < TOTAL_STEPS;

  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | null;

  //get id from url
  useEffect(() => {
    if (id) {
      setprojectid(id);
    }
  }, [id]);

  //get project
  useEffect(() => {

    if (!projectid){return};

    const fetchProject = async () => {
      try {
        setLoading(true);
        const data = await getProjectById(projectid);
        setProject(data.data);
      } catch (err) {
        console.error("Failed to load project:", err);
        showNotification("Failed to load project data.", "error");
        router.push('/twinx'); //send back to authentication, this page makes user login
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectid]);

  const prevPage = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/twinx');
    }
  };

  const handleCopyId = () => {
    if (!project?.isPublished) {
      showNotification("Digital Twin must be published to copy ID.", "error");
      return;
    }
    copyToClipboard(project.twinxid, "Twinx ID copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white">
        <Loader2 size={40} className="animate-spin mb-4 text-[#6366F1]" />
        <p>Loading project...</p>
      </div>
    );
  }

  if (!project) {
    prevPage();
    return (
      <div className="p-8 text-white">
        Digital Twin not found. Redirecting to dashboard...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 text-white">

      {/* Back Button */}
      <button
        onClick={() => prevPage()}
        className="flex items-center gap-2 text-[#A0A0A5] hover:text-white mb-6"
      >
        <ChevronLeft size={20} /> Back to Dashboard
      </button>

      {/* Project Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold">{project.title}</h2>
          <div className="flex items-center flex-wrap gap-4 mt-2">
            <p
              className={`text-sm font-semibold px-3 py-1 rounded-full inline-block ${
                project.isPublished
                  ? "bg-green-500/20 text-green-400"
                  : "bg-yellow-500/20 text-yellow-400"
              }`}
            >
              {project.isPublished ? "Published" : "Unpublished"}
            </p>
            <div
              className="flex items-center gap-2 text-[#A0A0A5] font-mono text-sm cursor-pointer"
              onClick={handleCopyId}
            >
              <span>{project.twinxid}</span>
              <Copy size={16} className="hover:text-[#6366F1]" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isCompleted && (
            <div className="bg-green-500/20 border border-green-500 text-green-300 px-4 py-2 rounded-lg text-center">
              <h3 className="font-bold text-sm">Processing Complete!</h3>
            </div>
          )}
        </div>
      </div>

      {/* Video + 3D Viewer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#262629] rounded-lg border border-[#3A3A3C] p-4 flex flex-col">
          <video
            key={project.id}
            controls
            poster={project.thumbnail}
            className="w-full h-full rounded-md object-cover flex-grow"
            src={project.videoUrl}
          >
            Your browser does not support the video tag.
          </video>

          {project.currentStep === 0 && (
            <button
              className="mt-4 w-full bg-[#6366F1] text-white font-semibold py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors"
            >
              Generate Digital Twin
            </button>
          )}

          {isProcessing && (
            <div className="mt-4 w-full text-center py-2 px-4 rounded-md bg-[#3A3C3C] text-[#A0A0A5]">
              Processing...
            </div>
          )}
        </div>
        <div className="bg-[#262629] rounded-lg border border-[#3A3A3C] p-4 min-h-[300px]">
          <ThreeViewport />
        </div>
      </div>

      {/* Processing Pipeline */}
      <h3 className="text-xl font-semibold mb-4">Processing Pipeline</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {PIPELINE_CONFIG.map((step: any) => {
          const status =
            project.currentStep >= step.id
              ? "completed"
              : project.currentStep + 1 === step.id
              ? "in-progress"
              : "pending";

          const Icon = step.icon;
          return (
            <div
              key={step.id}
              className={`p-4 rounded-lg border transition-all duration-300
                ${
                  status === "completed"
                    ? "bg-green-500/10 border-green-500/30"
                    : ""
                }
                ${
                  status === "in-progress"
                    ? "bg-blue-500/10 border-blue-500/50 animate-pulse"
                    : ""
                }
                ${status === "pending" ? "bg-[#262629] border-[#3A3A3C]" : ""}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`p-2 rounded-full ${
                    status === "completed"
                      ? "bg-green-500/20 text-green-400"
                      : ""
                  } ${
                    status === "in-progress"
                      ? "bg-blue-500/20 text-blue-400"
                      : ""
                  } ${
                    status === "pending" ? "bg-[#3A3C3C] text-[#A0A0A5]" : ""
                  }`}
                >
                  {status === "completed" ? (
                    <Check size={20} />
                  ) : (
                    <Icon size={20} />
                  )}
                </div>
                <span className="font-mono text-xs text-[#A0A0A5]">
                  Step {step.id}
                </span>
              </div>
              <h4 className="font-semibold mb-1">{step.name}</h4>
              <p className="text-xs text-[#A0A0A5]">{step.description}</p>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default ProjectViewPage;
