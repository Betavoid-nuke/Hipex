import { FC } from "react";
import { ChevronLeft, Copy, Check } from "lucide-react";
import ThreeViewport from "../components/ThreeViewport";
import { PipelineStep, Project } from "../types/TwinxTypes";

interface ProjectViewProps {
  selectedProject: Project | null;
  projects: Project[];
  TOTAL_STEPS: number;
  PIPELINE_CONFIG: PipelineStep[];
  simulatingProjectId: string | null;
  setSimulatingProjectId: (id: string | null) => void;
  handleNavigate: (path: string) => void;
  showNotification: (message: string) => void;
  copyToClipboard: (text: string, successMessage: string) => void;
}

const ProjectViewPage: FC<ProjectViewProps> = ({
  selectedProject,
  projects,
  TOTAL_STEPS,
  PIPELINE_CONFIG,
  simulatingProjectId,
  setSimulatingProjectId,
  handleNavigate,
  showNotification,
  copyToClipboard,
}) => {
  if (!selectedProject) return null;

  const project = projects.find((p) => p.id === selectedProject.id);
  if (!project) {
    handleNavigate("dashboard");
    return (
      <div className="p-8 text-white">
        Digital Twin not found. Redirecting to dashboard...
      </div>
    );
  }

  const isCompleted = project.currentStep === TOTAL_STEPS;
  const isProcessing =
    project.currentStep > 0 && project.currentStep < TOTAL_STEPS;

  const handleCopyId = () => {
    if (!project.isPublished) {
      showNotification("Digital Twin must be published to copy ID.");
      return;
    }
    copyToClipboard(project.twinxid, "Twinx ID copied to clipboard!");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 text-white">
      {/* Back Button */}
      <button
        onClick={() => handleNavigate("dashboard")}
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
              onClick={() => setSimulatingProjectId(project.id)}
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
        {PIPELINE_CONFIG.map((step) => {
          const status =
            project.currentStep >= step.id
              ? "completed"
              : simulatingProjectId === project.id &&
                project.currentStep + 1 === step.id
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
