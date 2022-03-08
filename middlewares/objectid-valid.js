import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;

export const check_object_id = (req, res, next) => {
    const { user_id } = req.params;
    if (!ObjectId.isValid(user_id)) {
        res.status(400).json({
            message: "objectid 형식이 맞지 않습니다.",
        });
        return;
    }
    return next();
};
