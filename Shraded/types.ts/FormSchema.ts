export interface FormSchema {
    fields: {
      name: string;
      type: "text" | "number" | "email" | "date"; // Add more types as needed
      label: string;
      required?: boolean;
    }[];
  }