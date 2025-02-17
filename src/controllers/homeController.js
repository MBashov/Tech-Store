import { Router } from "express";
import deviceService from "../services/deviceService.js";
import { getErrorMessage } from "../utils/errorUtils.js";

const homeController = Router();

homeController.get('/', async (req, res) => {

    try {
        const latestDevices = await deviceService.getLatest();
        res.render('home', { latestDevices });

    } catch (err) {
        res.render('404', { error: getErrorMessage(err) });
    }
});

homeController.get('/about', (req, res) => {
    res.render('about');
});

export default homeController;