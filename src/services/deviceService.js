import Device from "../models/Device.js";

export default {

    getOne(deviceId) {
        return Device.findById(deviceId);
    },

    getLatest() {
        // return Device.find({}).sort({ _id: 'desc' }).limit(3);
        return Device.find({})
            .sort({ createdAt: 'desc', _id: 'desc' })
            .select({ brand: true, model: true, price: true, image: true })
            .limit(3);
    },

    getAll: (filter = {}) => {

        let query = Device.find({});

        if (filter.owner) {
            query = query.find({ owner: filter.owner });
        }

        if (filter.preferd) {
            query = query.find({ preferredList: filter.preferd });
            // query = query.in('preferredList', filter.preferd);
        }

        return query;
    },

    create(deviceData, userId) {
        return Device.create({
            ...deviceData,
            owner: userId,
        });
    },

    update(deviceId, deviceData) {
        return Device.findByIdAndUpdate(deviceId, deviceData, { runValidators: true });
    },

    delete(deviceId) {
        return Device.findByIdAndDelete(deviceId);
    },

    async prefer(deviceId, userId) {
        // const device = await Device.findById(deviceId);

        // device.preferredList.push(userId);

        // return Device.findByIdAndUpdate(deviceId, device, { runValidators: true });

        return Device.findByIdAndUpdate(deviceId, { $push: { preferredList: userId } });

    }
}