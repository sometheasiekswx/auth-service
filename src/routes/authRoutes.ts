import {Router} from 'express';
import {login, register} from "../controllers/authController";
import {verifyJwt, verifyCookie} from "../middleware/passport";

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify-token', verifyJwt, async (req, res) => {
    try {
        res.json({message: 'Authenticated successfully', user: req.user});
    } catch (error) {
        res.status(500).json({error: 'Authenticated unsuccessfully'});
    }
});
router.get('/verify-cookie', verifyCookie, async (req, res) => {
    try {
        res.status(200).json({
            message: 'Token is valid',
            user: req.user,  // Send the decoded user info back to the frontend if needed
        });
    } catch (error) {
        res.status(500).json({error: 'Authenticated unsuccessfully'});
    }
});


export default router;
