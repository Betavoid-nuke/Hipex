import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface prop {
  lable: string,
  Placeholder: string
}

export function InputWithLabel({lable, Placeholder, ...props}:prop) {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5 mt-5">
      <Label>{lable}</Label>
      <Input type="text" style={{background:"transparent", color:"azure", fontStyle:"normal", fontWeight:"lighter", borderColor:"azure"}} placeholder={Placeholder} {...props} />
    </div>
  )
}
