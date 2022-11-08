const validationBody = (schema) => {
    return function (req, res, next) {
        const { body } = req;
        const validateBody = schema.validate(body);
        const { error } = validateBody;
        if (error) {
            console.log(error);
            return next(error);
        };
        next();
    };
};

module.exports = {
    validationBody,
};