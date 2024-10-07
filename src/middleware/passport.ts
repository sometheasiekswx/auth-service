import passport from 'passport';
import {ExtractJwt, Strategy as JwtStrategy} from 'passport-jwt';
import {NextFunction, Request, Response} from 'express';
import dotenv from 'dotenv';
import jwt, {JwtPayload} from "jsonwebtoken";

// Load environment variables
dotenv.config();

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: process.env.JWT_SECRET!,
};

passport.use(new JwtStrategy(jwtOptions, (jwtPayload, done) => {
    if (jwtPayload) {
        return done(null, jwtPayload);
    } else {
        return done(null, false);
    }
}));

export const authenticateJwt = passport.authenticate('jwt', {session: false});

// A middleware to check authentication before accessing a route
export const verifyJwt = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', {session: false}, (err: any, user: any) => {
        if (err || !user) {
            return res.status(401).json({message: 'Unauthorized'});
        }
        req.user = user;
        next();
    })(req, res, next);
};

// Middleware to verify JWT token from cookies
export function verifyCookie(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({message: 'Unauthorized: No token provided'});
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET as string, (err: jwt.VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
        if (err) {
            return res.status(403).json({message: 'Token is invalid or expired'});
        }

        // Attach the user ID or other payload to the request
        req.user = decoded;
        console.log(req.user, decoded);
        next();
    });
}