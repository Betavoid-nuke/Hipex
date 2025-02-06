import { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createCollection } from "./Actions/shraderForm.actions";


interface FormSchema {
  fields: {
    name: string;
    type: "text" | "number" | "email" | "date"; // Add more types as needed
    label: string;
    required?: boolean;
  }[];
}

interface FormProps {
  schema: FormSchema;
}

const ShraderForm: React.FC<FormProps> = ({ schema }) => {

  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    await createCollection({
      collectionName: 'trying', 
      schema: schema
    })
  };

  return (
    <form onSubmit={handleSubmit}>
      {schema.fields.map((field) => (
        <div key={field.name}>
          <Label>{field.label}</Label>
          <Input
            type={field.type}
            value={formData[field.name] || ""}
            onChange={(e) => handleChange(field.name, e.target.value)}
            required={field.required}
          />
        </div>
      ))}
      <Button type="submit">Submit</Button>
    </form>
  );

};

export default ShraderForm;