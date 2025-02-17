import { Schema, model, Types } from "mongoose";

const deviceSchema = new Schema({
    brand: {
        type: String,
        required: [true, 'Brand is required!'],
        minLength: [2, 'Brand should be at least 2 characters'],
    },
    model: {
        type: String,
        required: [true, 'Model is required!'],
        minLength: [5, 'Model should be at least 5 characters'],
    },
    hardDisk: {
        type: String,
        required: [true, 'Hard disk is required!'],
        minLength: [5, 'Hard Disk should be at least 5 characters'],
    },
    screenSize: {
        type: String,
        required: [true, 'Screen size is required!'],
        minLength: [1, 'Screen Size should be at least 1 characters'],
    },
    ram: {
        type: String,
        required: [true, 'Ram is required!'],
        minLength: [2, 'Ram should be at least 2 characters'],
    },
    operatingSystem: {
        type: String,
        required: [true, 'Operating System is required!'],
        minLength: [5, 'Operating System should be between 5 and 20 characters long'],
        maxLength: [20, 'Operating System should be between 5 and 20 characters long'],
    },
    cpu: {
        type: String,
        required: [true, 'CPU is required!'],
        minLength: [10, 'CPU should be between 10 and 50 characters long'],
        maxLength: [50, 'CPU should be between 10 and 50 characters long'],
    },
    gpu: {
        type: String,
        required: [true, 'GPU is required!'],
        minLength: [10, 'GPU should be between 10 and 50 characters long'],
        maxLength: [50, 'GPU should be between 10 and 50 characters long'],
    },
    price: {
        type: Number,
        required: [true, 'Price is required!'],
        min: [1, 'Price should be positive number'],
    },
    color: {
        type: String,
        required: [true, 'Color is required!'],
        minLength: [2, 'Color should be between 2 and 10 characters long'],
        maxLength: [10, 'Color should be between 2 and 10 characters long'],
    },
    weight: {
        type: String,
        required: [true, 'Weight is required!'],
        minLength: [1, 'Weight should be at least 1 characters long'],
    },
    image: {
        type: String,
        required: [true, 'Image is required!'],
        match: [/^https?:\/\//, 'Image should start with http:// or https://'],
    },
    preferredList: [{
        type: Types.ObjectId,
        ref: 'User',
    }],
    owner: {
        type: Types.ObjectId,
        ref: 'User',
    }
}, { timestamps: true });

const Device = model('Device', deviceSchema);

export default Device;