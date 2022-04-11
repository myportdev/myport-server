import Joi from "joi";

const update_profile_schema = Joi.object({
    profile: {
        introdution: Joi.string().empty(""),
        status: Joi.string().empty(""),
        interest_job: Joi.string().empty(""),
        sns: Joi.array().items({
            title: Joi.string().valid("github", "brunch", "instagram", "velog", "other"),
            url: Joi.string().empty(""),
        }),
    },
    user: {
        name: Joi.string().required(),
        college: Joi.string().required(),
        major: Joi.string().required(),
    },
});

const update_summury_schema = Joi.object({
    summury: Joi.array().items({
        content: Joi.string().required(),
    }),
});

const update_portfolio_education_schema = Joi.object({
    education: Joi.array().items({
        college: Joi.string().required(),
        major: Joi.string().required(),
        admisstion_date: Joi.string().required(),
        status: Joi.string().required(),
        graduation_date: Joi.string().empty(""),
    }),
});

const update_portfolio_duty_schema = Joi.object({
    duty: Joi.array().items({
        company_name: Joi.string().required(),
        department: Joi.string().empty(""),
        position: Joi.string().empty(""),
        status: Joi.string().empty(""),
        start_date: Joi.string().empty(""),
        end_date: Joi.string().empty(""),
        description: Joi.string().empty(""),
        status: Joi.string().required(),
    }),
});

const update_portfolio_award_schema = Joi.object({
    award: Joi.array().items({
        title: Joi.string().required(),
        award: Joi.string().empty(""),
        award_date: Joi.string().empty(""),
        description: Joi.string().empty(""),
    }),
});

const update_skill_schema = Joi.object({
    skill: Joi.array().items({
        title: Joi.string().required(),
    }),
});

const update_certificate_schema = Joi.object({
    certificate: Joi.array().items({
        title: Joi.string().required(),
    }),
    certificate_of_completion: Joi.array().items({
        title: Joi.string().required(),
    }),
});

const project_schema = Joi.object({
    title: Joi.string(),
    team_name: Joi.string().empty(""),
    start_date: Joi.string().empty(""),
    end_date: Joi.string().empty(""),
    status: Joi.string().empty(""),
    contents: Joi.string().empty(""),
    project_url: Joi.string().empty(""),
});

export {
    update_profile_schema,
    update_portfolio_education_schema,
    update_portfolio_duty_schema,
    update_portfolio_award_schema,
    update_certificate_schema,
    update_skill_schema,
    project_schema,
    update_summury_schema,
};
