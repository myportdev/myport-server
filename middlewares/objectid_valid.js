import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;

const check_read_update_team_object_id = (req, res, next) => {
    const { team_id, member_id } = req.params;
    if (!ObjectId.isValid(team_id)) {
        res.status(400).send("objectid 형식이 잘못되었습니다.");
        return;
    }
    if (member_id) {
        if (!ObjectId.isValid(member_id)) {
            res.status(400).send("objectid 형식이 잘못되었습니다.");
            return;
        }
    }
    return next();
};

const check_create_team_object_id = (req, res, next) => {
    const { relation_contest, relation_extracurricular } = req.body;
    if (relation_contest) {
        if (!ObjectId.isValid(relation_contest)) {
            res.status(400).send("objectid 형식이 잘못되었습니다.");
            return;
        }
    }
    if (relation_extracurricular) {
        if (!ObjectId.isValid(relation_extracurricular)) {
            res.status(400).send("objectid 형식이 잘못되었습니다.");
            return;
        }
    }
    return next();
};

export { check_read_update_team_object_id, check_create_team_object_id };
