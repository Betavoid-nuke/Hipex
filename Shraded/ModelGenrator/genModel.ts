import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// Define the FormSchema interface
export interface FormSchema {
  fields: {
    name: string;
    type: "text" | "number" | "email" | "date"; // Add more types as needed
    label: string;
    required?: boolean;
  }[];
}

// Function to generate a Mongoose model
export function genModel(schema: FormSchema, modelName: string): mongoose.Model<any> {
  // Define the Mongoose schema based on the FormSchema
  const mongooseSchema = new mongoose.Schema({
    ...schema.fields.reduce((acc, field) => {
      acc[field.name] = {
        type: mapFieldTypeToMongooseType(field.type),
        required: field.required || false,
      };
      return acc;
    }, {} as { [key: string]: any }),
  });

  // Create the Mongoose model
  const Model = mongoose.models[modelName] || mongoose.model(modelName, mongooseSchema);

  // Generate the model file content
  const modelFileContent = `import mongoose from "mongoose";

const ${modelName}Schema = new mongoose.Schema(${JSON.stringify(mongooseSchema.obj, null, 2)});

const ${modelName} = mongoose.models.${modelName} || mongoose.model("${modelName}", ${modelName}Schema);
export default ${modelName};
`;

  // Define the correct path where the model will be saved
  const rootDir = path.resolve('F:/4. fun projects/countdown'); // Root directory of your project
  const modelFilePath = path.join(rootDir, 'lib', 'models', `${modelName}.model.ts`);

  // Ensure the directory exists
  fs.mkdirSync(path.dirname(modelFilePath), { recursive: true });

  // Write the model file
  fs.writeFileSync(modelFilePath, modelFileContent);

  // Return the model reference
  return Model;
}

// Helper function to map FormSchema field types to Mongoose types
function mapFieldTypeToMongooseType(fieldType: "text" | "number" | "email" | "date"): any {
  switch (fieldType) {
    case "text":
      return String;
    case "number":
      return Number;
    case "email":
      return String;
    case "date":
      return Date;
    default:
      return String;
  }
}