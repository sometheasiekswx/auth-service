import * as dotenv from "dotenv";
import app from "./app";
import {checkEnv} from "./config/env";
import {connectDB} from "./config/db";

dotenv.config();
checkEnv(["PORT", "MONGODB_URI", "MONGODB_DB_NAME", "JWT_SECRET", "NODE_ENV", "TRANSACTIONS_TRACKER_FRONTEND"]);
connectDB();

app.listen(process.env.PORT, () => {
    console.log(`auth-service listening on port ${process.env.PORT}`)
})