import Joi from "joi";

const loginSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required(),
    password: Joi.string().required().trim(),
});

const refreshSchema = Joi.object({
    authorization: Joi.required(),
    refresh: Joi.required(),
});

const registerSchema = Joi.object({
    image_url: Joi.string(),
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
    interest: Joi.string().required(),
    promotion: Joi.boolean().required(),
});

const authPhoneSchema = Joi.object({
    phone: Joi.string()
        .required()
        .length(11)
        .trim(true)
        .regex(/^[0-9]+$/),
});

const authEmailSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required(),
});

const existEmailSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required(),
});

const changePasswordSchema = Joi.object({
    token: Joi.required(),
    password: Joi.string()
        .required()
        .trim()
        .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[~!@#$%^&*()+|=])[A-Za-z\d~!@#$%^&*()+|=]{8,16}$/),
});

export { loginSchema, refreshSchema, registerSchema, authPhoneSchema, authEmailSchema, changePasswordSchema, existEmailSchema };
