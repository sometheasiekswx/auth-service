import express, {Request, Response} from 'express';
import bodyParser from 'body-parser';
import authRoutes from "./routes/authRoutes";
import {verifyCookie} from "./middleware/passport";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.TRANSACTIONS_TRACKER_FRONTEND,  // Transactions-tracker-frontend origin
    credentials: true,  // Allow credentials (cookies)
}));
app.use(bodyParser.text());
app.use('/api', authRoutes);

app.use('/protected-routes', verifyCookie, async (req, res) => {
    try {
        res.json({message: 'Authenticated successfully', user: req.user});
    } catch (error) {
        res.status(500).json({error: 'Authenticated unsuccessfully'});
    }
});


app.use((req: Request, res: Response) => {
    res.status(404).send({error: "Sorry, can't find that"});
});

export default app;
