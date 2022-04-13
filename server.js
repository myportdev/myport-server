import express, { json, urlencoded } from "express";
import connect from "./models/index.js";
import configuration from "./configuration.js";
import admin from "./middlewares/admin.js";
import api from "./api/index.js";
import cors from "cors";
import logger from "./middlewares/logger.js";
import helmet from "helmet";
import cache from "./util/cache.js";
import { api_limiter } from "./middlewares/api_limit.js";
import { scheduleJob } from "node-schedule";

const express_server = () => {
    const app = express();
    connect();

    app.use(cors());
    app.use(logger());
    app.use(admin().admin_bro.options.rootPath, admin().router);
    app.use(helmet());
    app.use(json());
    app.use(urlencoded({ extended: false }));
    app.use("/api", api_limiter, api);

    app.use(function (err, req, res, next) {
        console.error(err.stack);
        res.status(500).send("Something broke!");
    });

    scheduleJob("* * 0 * * *", async () => {
        await cache.set("today_join", 0);
    });

    app.listen(configuration().port, () => {
        console.log(`server is running ${configuration().port}`);
    });
};

express_server();
