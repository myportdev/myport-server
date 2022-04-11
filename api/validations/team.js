import Joi from "joi";

const create_team_schema = Joi.object({
    team_name: Joi.string().required(),
    short_explanation: Joi.string().required(),
    detail_explanation: Joi.string().required(),
    recruitment_field: Joi.string().required(),
    team_type: Joi.string().required(),
    gender: Joi.string().required(),
    relation_contest: Joi.string(),
    relation_extracurricular: Joi.string(),
});

export { create_team_schema };
