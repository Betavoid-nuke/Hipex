
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import ColorPicker from "../ColorPicker/ColorPicker"

export function TextColorSelector() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" style={{fontStyle:'normal', fontWeight:'lighter', marginBottom:'5px', backgroundColor:'#151516', fontSize:'12px', color:'darkgray'}}>Text Color</Button>
      </PopoverTrigger>
      <PopoverContent style={{marginLeft:'20px', marginTop:'20px'}}>
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">Set Text Color</h4>
            <p className="text-muted-foreground text-sm">
              Set the Text color of your page.
            </p>
            <ColorPicker btnname={'textclr'} />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
