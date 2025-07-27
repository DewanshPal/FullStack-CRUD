import mongoose from "mongoose";
import { dbName } from "../../constants.js";

const connect_db = async () =>
{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_DB_URI}/${dbName}`)
        if(connectionInstance)
        {
            console.log("MongoDB Connected !! DB Host:" , connectionInstance.connection.host)
        }
    } catch (error) {
        console.log("DataBase Connection failed ", error)
        process.exit(1);
    }
}

export default connect_db