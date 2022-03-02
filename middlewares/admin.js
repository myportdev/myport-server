import AdminBro from "admin-bro";
import AdminBroExpress from "@admin-bro/express";
import AdminBroMongoose from "@admin-bro/mongoose";

import configuration from "../configuration.js";

import mongoose from "mongoose";
import User from "../models/User.js";
import Contest from "../models/Contest.js";
import Extracurricular from "../models/Extracurricular.js";
import Interest from "../models/Interest.js";
import Portfolio from "../models/Portfolio.js";
import Profile from "../models/Profile.js";
import Project from "../models/Project.js";
import Team from "../models/Team.js";
import University from "../models/University.js";
import Certificate from "../models/Certificate.js";

AdminBro.registerAdapter(AdminBroMongoose);

const admin_bro = new AdminBro({
    databases: [mongoose],
    rootPath: "/admin",
});
const ADMIN = {
    email: configuration().admin_email,
    password: configuration().admin_password,
};

const router = AdminBroExpress.buildAuthenticatedRouter(
    admin_bro,
    {
        cookieName: "myport",
        cookiePassword: "myport1*",
        authenticate: async (email, password) => {
            if (ADMIN.password === password && ADMIN.email === email) {
                return ADMIN;
            }
            return null;
        },
    },
    null,
    {
        resave: false,
        saveUninitialized: true,
    }
);

export default () => ({
    router,
    admin_bro,
});
