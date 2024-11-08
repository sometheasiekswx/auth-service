import {Request, Response} from 'express';
import User from "../models/User";
import jwt from 'jsonwebtoken';
import {reqBodyIsEmpty} from "../utils/expressRequest";

const tokenExpires = '2d';
// const tokenExpires = '10s';
const cookieMaxAge = 2 * 24 * 60 * 60 * 1000;  // 2 day in milliseconds,
// const cookieMaxAge = 10 * 1000;  // 10s in milliseconds,

export async function register(req: Request, res: Response) {
    if (reqBodyIsEmpty(req.body)) {
        return res.status(400).send("Request body is empty");
    }

    try {
        const {email, password} = req.body;
        const user = await User.create({email: email, password: password});
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET!, {
            expiresIn: tokenExpires,
        });
        // Set JWT as an HTTP-Only cookie
        res.cookie('jwt', token, {
            httpOnly: true,  // Prevent JavaScript access to the cookie
            secure: process.env.NODE_ENV === 'production',  // Use secure flag in production
            sameSite: 'strict', maxAge: cookieMaxAge
        });
        // res.json({token, user});

        res.status(200).json({message: 'Register successful', user});
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
            expiresIn: tokenExpires
        });
        // Set JWT as an HTTP-Only cookie
        res.cookie('jwt', token, {
            httpOnly: true,  // Prevent JavaScript access to the cookie
            secure: process.env.NODE_ENV === 'production',  // Use secure flag in production
            sameSite: 'strict', maxAge: cookieMaxAge
        });
        // res.json({token, user});

        res.status(200).json({message: 'Login successful', user});
    } catch (err) {
        console.error(err);
        return res.status(500).send("Database connection error");
    }
}