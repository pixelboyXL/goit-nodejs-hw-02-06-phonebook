const validationBody = (schema) => {
    return function (req, res, next) {
        const emptyReqBody = Object.keys(req.body).length === 0;
        if (emptyReqBody) {
            throw new Error("Missing fields");
        };
        const validateBody = schema.validate(req.body);
        if (validateBody.error) {
            next(validateBody.error);
        };
        next();
    };
};

module.exports = {
    validationBody,
};