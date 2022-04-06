import Joi from "joi";

const login_schema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required(),
    password: Joi.string().required().trim(),
});

const refresh_schema = Joi.object({
    authorization: Joi.string().required(),
    refresh: Joi.string().required(),
});

const register_schema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required(),
    password: Joi.string()
        .required()
        .trim()
        .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[~!@#$%^&*()+|=])[A-Za-z\d~!@#$%^&*()+|=]{8,16}$/),
    name: Joi.string().required().trim(),
    birth_date: Joi.string()
        .required()
        .length(6)
        .trim(true)
        .regex(/^[0-9]+$/),
    phone_number: Joi.string()
        .required()
        .length(11)
        .trim(true)
        .regex(/^[0-9]+$/),
    address: Joi.string().required().trim(),
    college: Joi.string().required().trim(),
    major: Joi.string().required().trim(),
    student_number: Joi.string().required().trim(),
    gender: Joi.string().valid("male", "female").required(),
    interest: Joi.string(),
    promotion: Joi.boolean(),
});

const auth_phone_schema = Joi.object({
    phone: Joi.string()
        .required()
        .length(11)
        .trim(true)
        .regex(/^[0-9]+$/),
});

const email_schema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required(),
});

const reset_password_schema = Joi.object({
    token: Joi.string().required(),
    password: Joi.string()
        .required()
        .trim()
        .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[~!@#$%^&*()+|=])[A-Za-z\d~!@#$%^&*()+|=]{8,16}$/),
});

const change_password_schema = Joi.object({
    existing_password: Joi.string()
        .required()
        .trim()
        .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[~!@#$%^&*()+|=])[A-Za-z\d~!@#$%^&*()+|=]{8,16}$/),
    new_password: Joi.string()
        .required()
        .trim()
        .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[~!@#$%^&*()+|=])[A-Za-z\d~!@#$%^&*()+|=]{8,16}$/),
});

export { login_schema, refresh_schema, register_schema, auth_phone_schema, email_schema, change_password_schema, reset_password_schema };
