import { FC, useState } from "react";
import { KeyRound, Plus, Info, Edit, Trash2 } from "lucide-react";
import { ApiKey, DeleteConfirmationModalProps, EditKeyModalProps } from "../types/TwinxTypes";
import EditKeyModal from "../components/EditKeyModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";

interface props {
    showNotificationIn: (message: string) => void;
    handleNavigateIn: (view: string) => void;
}

function ApiPagePage({showNotificationIn, handleNavigateIn}: props) {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [keyToEdit, setKeyToEdit] = useState<ApiKey | null>(null);
  const [keyToDelete, setKeyToDelete] = useState<ApiKey | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteKeyModalOpen, setIsDeleteKeyModalOpen] = useState(false);

  const createNewKey = () => {
    const newKey: ApiKey = {
      id: Date.now(),
      name: `New Key ${apiKeys.length + 1}`,
      secret: `sk-...${[...Array(4)]
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("")}`,
      created: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      lastUsed: "Never",
      createdBy: "Simon Prusin",
      permissions: "All",
    };
    setApiKeys([...apiKeys, newKey]);
    showNotificationIn("New secret key created successfully!");
  };

  const handleEditClick = (key: ApiKey) => {
    setKeyToEdit(key);
    setIsEditModalOpen(true);
  };

  const handleSaveKey = (id: number, newName: string) => {
    setApiKeys(
      apiKeys.map((key) => (key.id === id ? { ...key, name: newName } : key))
    );
    showNotificationIn("API Key updated successfully!");
  };

  const handleDeleteClick = (key: ApiKey) => {
    setKeyToDelete(key);
    setIsDeleteKeyModalOpen(true);
  };

  const confirmDeleteKey = () => {
    if (!keyToDelete) return;
    setApiKeys(apiKeys.filter((key) => key.id !== keyToDelete.id));
    setIsDeleteKeyModalOpen(false);
    setKeyToDelete(null);
    showNotificationIn("API Key deleted.");
  };

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8 text-white">
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <KeyRound size={28} /> API Keys
          </h2>
          <button
            onClick={createNewKey}
            className="bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-600 transition-colors flex items-center gap-2"
          >
            <Plus size={20} /> Create new secret key
          </button>
        </header>

        <div className="bg-blue-500/10 border border-blue-500/30 text-blue-300 p-4 rounded-lg mb-6 flex items-start gap-3">
          <Info size={20} className="shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold">
              Project API keys have replaced user API keys.
            </h3>
            <p className="text-sm">
              We recommend using project based API keys for more granular
              control over your resources.{" "}
              <a href="#" className="underline hover:text-white">
                Learn more
              </a>
            </p>
          </div>
        </div>

        <div className="space-y-4 text-[#A0A0A5] text-sm mb-8">
          <p>
            As an owner of this project, you can view and manage all API keys in
            this project.
          </p>
          <p>
            Do not share your API key with others, or expose it in the browser
            or other client-side code. In order to protect the security of your
            account, Twinx may also automatically disable any API key that has
            leaked publicly.
          </p>
          <p>
            View usage per API key on the{" "}
            <a
              href="#"
              onClick={() => handleNavigateIn("apiusage")}
              className="text-indigo-400 hover:underline"
            >
              Usage page
            </a>
            .
          </p>
        </div>

        {apiKeys.length > 0 ? (
          <div className="bg-[#262629] border border-[#3A3A3C] rounded-lg overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead className="text-xs text-[#8A8A8E] uppercase border-b border-[#3A3A3C]">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Secret Key</th>
                  <th className="p-4">Created</th>
                  <th className="p-4">Last Used</th>
                  <th className="p-4">Created By</th>
                  <th className="p-4">Permissions</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {apiKeys.map((key) => (
                  <tr
                    key={key.id}
                    className="border-b border-[#3A3A3C] last:border-b-0 hover:bg-[#3A3A3C]/50"
                  >
                    <td className="p-4 font-semibold text-white">{key.name}</td>
                    <td className="p-4 font-mono">{key.secret}</td>
                    <td className="p-4">{key.created}</td>
                    <td className="p-4">{key.lastUsed}</td>
                    <td className="p-4">{key.createdBy}</td>
                    <td className="p-4">{key.permissions}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(key)}
                          className="text-[#A0A0A5] hover:text-white"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(key)}
                          className="text-[#A0A0A5] hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20 bg-[#262629] border-2 border-dashed border-[#3A3A3C] rounded-lg">
            <KeyRound size={48} className="mx-auto text-[#A0A0A5]" />
            <h3 className="mt-4 text-xl font-bold text-white">No API Keys</h3>
            <p className="mt-2 text-sm text-[#A0A0A5]">
              You don't have any API keys yet. Create one to get started.
            </p>
            <button
              onClick={createNewKey}
              className="mt-6 bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-600 transition-colors flex items-center gap-2 mx-auto"
            >
              <Plus size={20} /> Create API Key
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <EditKeyModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveKey}
        apiKey={keyToEdit}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteKeyModalOpen}
        onClose={() => setIsDeleteKeyModalOpen(false)}
        onConfirm={confirmDeleteKey}
        title="Delete API Key"
        text={`Are you sure you want to delete the API key "${keyToDelete?.name}"? This action cannot be undone.`}
      />
    </>
  );
};

export default ApiPagePage;
