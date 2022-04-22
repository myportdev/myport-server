import jwt_util from "../util/jwt_util.js";

const auth_token = (req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split("Bearer ")[1];
        const result = jwt_util.verify(token);

        if (result.ok) {
            res.locals.user_id = result.id;
            next();
            return;
        }
        res.status(401).json({
            message: result.message,
        });
        return;
    }
    res.status(401).json({
        message: "no access token",
    });
};

export default auth_token;
