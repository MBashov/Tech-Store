import { Router } from "express";
import deviceService from "../services/deviceService.js";
import { getErrorMessage } from "../utils/errorUtils.js";
import { isAuth } from "../middlewares/authMiddleware.js";

const deviceController = Router();

deviceController.get('/catalog', async (req, res) => {
    try {
        const devices = await deviceService.getAll();

        res.render('device/catalog', { devices });

    } catch (err) {
        res.render('device/catalog', { error: getErrorMessage(err) })
    }
});

deviceController.get('/:deviceId/details', async (req, res) => {

    const deviceId = req.params.deviceId;

    try {
        const device = await deviceService.getOne(deviceId);

        const isOwner = device.owner.toString() === req.user?.id;
        const isPrefered = device.preferredList.includes(req.user?.id);
        
        res.render('device/details', { device, isOwner, isPrefered });
    } catch (err) {
        res.render('device/details', { error: getErrorMessage(err) });
    }
});


deviceController.get('/create', isAuth, (req, res) => {
    res.render('device/create');
});

deviceController.post('/create', isAuth, async (req, res) => {
    const deviceData = req.body;
    const userId = req.user.id;

    try {
        await deviceService.create(deviceData, userId);
        res.redirect('/devices/catalog'); 
    } catch (err) {
        res.render('device/create', { deviceData, error: getErrorMessage(err) });
    }

});

deviceController.get('/:deviceId/edit', isAuth, async (req, res) => {
    const deviceId = req.params.deviceId;

    try {
        const device = await deviceService.getOne(deviceId);

        const isOwner = device.owner.equals(req.user.id);
        if (!isOwner) {
            return res.render('404', { error: 'You are not the device owner!' });
        }

        res.render('device/edit', { device });

    } catch (err) {
        res.render('404', { error: getErrorMessage(err) });
    }
});

deviceController.post('/:deviceId/edit', isAuth, async (req, res) => {
    const deviceId = req.params.deviceId;

    const deviceData = req.body;

    try {
        const device = await deviceService.getOne(deviceId);

        const isOwner = device.owner.equals(req.user.id);
        if (!isOwner) {
            return res.render('404', { error: 'You are not the device owner!' });
        }
        
        await deviceService.update(deviceId, deviceData);

        res.redirect(`/devices/${deviceId}/details`);

    } catch (err) {
        res.render('device/edit', { device: deviceData, error: getErrorMessage(err) });
    }
});

deviceController.get('/:deviceId/delete', isAuth, async (req, res) => {
    const deviceId = req.params.deviceId;

    try {
        const device = await deviceService.getOne(deviceId);
        const isOwner = device.owner.equals(req.user?.id);
        if (!isOwner) {
            return res.render('404', { error: 'You are not the device owner!' });
        }

        await deviceService.delete(deviceId);
        res.redirect('/devices/catalog');

    } catch (err) {
        res.render('404', { error: getErrorMessage(err) });
    }
});

deviceController.get('/:deviceId/prefer', isAuth, async (req, res) => {

    const deviceId = req.params.deviceId;
    const userId = req.user.id;
    
    try {
        const device = await deviceService.getOne(deviceId);
        
        const isOwner = device.owner.toString() === userId;
        if (isOwner) {
            return res.render('404', { error: 'Cannot prefer own offer!' });
        }
        
        const isPrefered = device.preferredList.includes(userId);
        if (isPrefered) {
            return res.render('404', {error: 'You have already prefered this offer!'});
        }

        await deviceService.prefer(deviceId, userId);

        res.redirect(`/devices/${deviceId}/details`);
        
    } catch (err) {
        res.render('404', { error: getErrorMessage(err) });
    }
});


export default deviceController;