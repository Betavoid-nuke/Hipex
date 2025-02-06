import { MongoClient } from "mongodb";
import { FormSchema } from "../types.ts/FormSchema";
import { connectToDB } from "@/lib/mongoose";

interface props {
  collectionName: string, schema: FormSchema
}

export async function createCollection({collectionName, schema}: props) {
  
  try {

    await connectToDB();

    //make a mongo model genrator and use that here to make amodel using schema and then use it
    //in this -
    // const newCountdown = new Countdowns({
    //   time,
    //   CDname,
    //   CDDescription,
    //   CDlink,
    //   Instagram,
    //   Facebook,
    //   Youtube,
    //   LinkedIn,
    //   Twitch,
    //   Twitter,
    //   userid: user?.id
    // });
    // await newCountdown.save(); // Save the new countdown
    // 
    // 
    // instead of Countdowns use the genrated model

  } catch (error) {
    console.error("Error creating collection:", error);
  }

}