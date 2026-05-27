import mongoose from "mongoose";
import logger from "../utils/logger";
export const connectDB = async () =>{
    try{
        const uri = process.env.MONGO_URI as string;
        await mongoose.connect(uri);
        logger.info("MongoDB connect");
    }catch(error){
        console.error("DB error:",error);
        process.exit(1);
    }
};