import express from "express";
import user from "./controllers/user.js";
import team from "./controllers/team.js";
import profile from "./controllers/profile.js";
import home from "./controllers/home.js";

const router = express.Router();

router.use("/user", user);
router.use("/team", team);
router.use("/profile", profile);
router.use("/home", home);

export default router;
