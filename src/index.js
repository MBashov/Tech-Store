import express from "express";
import handlebars from 'express-handlebars';
import mongoose from "mongoose";
import cookieParser from 'cookie-parser';

import routes from "./routes.js";
import { auth } from './middlewares/authMiddleware.js';

const app = express();

//* Db set up
try {
    // TODO: Change db name 
    await mongoose.connect('mongodb://localhost:27017/techStore');
    console.log('DB conected succesfully!');
} catch (err) {
    console.log('Cannot conect to DB!');
    console.error(err.message);
}

//* Handlebars set up
app.engine('hbs', handlebars.engine({
    extname: 'hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
    },
    helpers: {
        setTitle(title) {
            this.pageTitle = title;
        }
    }
}));
app.set('view engine', 'hbs');
app.set('views', './src/views');



//* Express set up
app.use(express.static('src/public'));
app.use(express.urlencoded({ extended: false })); // Learn express to parse form data
app.use(cookieParser());
app.use(auth);

//* Set up routes
app.use(routes);

//* Start express
app.listen(3000, () => console.log('Server is listening on http://localhost:3000...'));