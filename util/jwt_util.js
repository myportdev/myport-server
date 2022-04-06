import jwt from "jsonwebtoken";
import configuration from "../configuration.js";
import cache from "./cache.js";
const secret = configuration().secret;

const jwt_util = {
    sign: (id) => {
        return jwt.sign({ id }, secret, {
            algorithm: "HS256",
            expiresIn: "6h",
        });
    },
    verify: (token) => {
        let decoded = null;
        try {
            decoded = jwt.verify(token, secret);
            return {
                ok: true,
                id: decoded.id,
            };
        } catch (err) {
            return {
                ok: false,
                message: err.message,
            };
        }
    },
    refresh: () => {
        return jwt.sign({}, secret, {
            algorithm: "HS256",
            expiresIn: "14d",
        });
    },
    refreshVerify: async (token, userId) => {
        try {
            const data = await cache.get(userId);

            if (token === data) {
                try {
                    jwt.verify(token, secret);
                    return true;
                } catch (err) {
                    return false;
                }
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    },
};

export default jwt_util;
