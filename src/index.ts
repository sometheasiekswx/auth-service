import * as dotenv from "dotenv";
import app from "./app";
import {checkEnv} from "./config/env";
import {connectDB} from "./config/db";

dotenv.config();
checkEnv(["PORT", "MONGODB_URI", "MONGODB_DB_NAME", "JWT_SECRET"]);
connectDB();

app.listen(process.env.PORT, () => {
    console.log(`auth-service listening on port ${process.env.PORT}`)
})