import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"


export const connectDb=async()=>{
    try {
        const connectionInstance=await mongoose.connect(`${process.env.MONGO_DB_URI}`,{
            dbName:process.env.DB_NAME
        });
        console.log(`MONGODB CONNECTED!!\nHOST:-${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("Failed to connect to mongoDB Database!!",error);
        process.exit(1);
        
    }

}