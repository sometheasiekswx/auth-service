import {Request, Response} from 'express';
import User from "../models/User";
import jwt from 'jsonwebtoken';
import {reqBodyIsEmpty} from "../utils/expressRequest";

export async function register(req: Request, res: Response) {
    if (reqBodyIsEmpty(req.body)) {
        return res.status(400).send("Request body is empty");
    }

    try {
        const {email, password} = req.body;
        const user = await User.create({email: email, password: password});
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET!, {
            expiresIn: '1d',
        });
        res.json({token, user});

    } catch (err) {
        console.error(err);
        return res.status(500).send("Database connection error");
    }
}

export async function login(req: Request, res: Response) {
    if (reqBodyIsEmpty(req.body)) {
        return res.status(400).send("Request body is empty");
    }

    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({message: 'Invalid credentials'});
        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET!, {
            expiresIn: '1d',
        });
        res.json({token, user});

    } catch (err) {
        console.error(err);
        return res.status(500).send("Database connection error");
    }
}