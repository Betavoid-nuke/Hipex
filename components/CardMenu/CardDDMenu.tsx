import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import PendingSharpIcon from '@mui/icons-material/PendingSharp';
import { useState } from "react";

interface Project {
  CDID: string;
  initialPublished : boolean;
  onTogglePublish: () => void; // this is the callback
  onDelete: () => void; // callback for delete action
}

export function CardMenu({CDID, initialPublished, onTogglePublish, onDelete }: Project) {

  const [published, setPublished] = useState(initialPublished);
  const [loading, setLoading] = useState(false);

  let publishStatus
  if(published){
    publishStatus = "Unpublish";
  } else {
    publishStatus = "Publish";
  }
  
  // Function to handle publish/unpublish toggle
  const handlePublishToggle = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/toggle-publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ CDID }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Toggle failed:", data.error);
        return;
      }

      // Toggle local state to reflect change in UI
      setPublished((prev) => !prev);
      onTogglePublish(); // Call the callback to notify parent component

    } catch (err: any) {
      console.error("Toggle error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/delete-project", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ CDID }),
      });

      const data = await res.json();

      onDelete(); // Call the callback to notify parent component

      if (!res.ok) {
        console.error("Delete failed:", data.error);
        return;
      }

    } catch (err: any) {
      console.error("Delete error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* <Button variant="ghost" style={{zIndex:'99', position:'absolute', margin:'10px', marginLeft:'250px'}}>
            <MenuIcon />
        </Button> */}
        <div style={{zIndex:'99', position:'absolute', margin:'10px', marginLeft:'240px'}} ><PendingSharpIcon /></div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start" style={{backgroundColor: 'hsl(240deg 7.17% 13.96%)', color: 'darkgray', padding: '10px', border:'none'}}>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>

        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handlePublishToggle}>
            {loading ? "Processing..." : published ? "Unpublish" : "Publish"}
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            List on Marketplace
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onClick={handleDelete}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>

      </DropdownMenuContent>
    </DropdownMenu>
  )
}
