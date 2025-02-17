import { Router } from "express";

import authService from "../services/authService.js";
import { AUTH_COOKIE_NAME } from "../config.js";
import { isAuth } from "../middlewares/authMiddleware.js";
import { getErrorMessage } from "../utils/errorUtils.js";
import deviceService from "../services/deviceService.js";


const authController = Router();

authController.get('/login', (req, res) => {

    if (req.user) {
        return res.render('404', { error: 'You are already logged in!' });
    }

    res.render('auth/login');
});

authController.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const token = await authService.login(email, password);

        res.cookie(AUTH_COOKIE_NAME, token, { httpOnly: true });

        res.redirect('/');
    } catch (err) {
        res.render('auth/login', { error: getErrorMessage(err), email });
    }
});

authController.get('/register', (req, res) => {

    if (req.user) {
        return res.render('404', { error: 'You are logged in!' });
    }

    res.render('auth/register');
});

authController.post('/register', async (req, res) => {
    const userData = req.body;

    try {
        const token = await authService.register(userData);

        res.cookie(AUTH_COOKIE_NAME, token, { httpOnly: true });

        res.redirect('/');
    } catch (err) {
        res.render('auth/register', { error: getErrorMessage(err), userData });
    }
});

authController.get('/logout', isAuth, (req, res) => {
    res.clearCookie(AUTH_COOKIE_NAME);
    res.redirect('/');
});

authController.get('/profile/:userId', isAuth, async (req, res) => {

    const userId = req.params.userId;

    try {

        const createdLaptops = await deviceService.getAll({ owner: userId});
        const preferedLaptops = await deviceService.getAll({ preferd: userId });

        res.render('auth/profile', { createdLaptops, preferedLaptops });

    } catch (err) {

        res.render('404', { error: getErrorMessage(err) });
    }
});

export default authController;