const { User } = require("../models/user.model");
// const { Conflict, Unauthorized } = require("http-errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { JWT_SECRET } = process.env;

const register = async (req, res, next) => {
    const { email, password } = req.body;
    const user = new User({ email, password });
    try {
        await user.save();
    } catch (error) {
        if (error.message.includes("duplicate key error collection")) {
            // throw new Conflict("Email in use");
            throw new Error("Email in use");
        };
        throw error;
    };
    return res.status(201).json({
        data: {
            user: {
                email: user.email,
                subscription: user.subscription,
            },
        },
    });
};

const login = async (req, res, next) => {
    // const authHeader = req.headers.authorization || "";
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        // throw new Unauthorized("User does not exists");
        throw new Error("User does not exists");
    };
    const isPasswordTheSame = await bcrypt.compare(password, user.password);
    if (!isPasswordTheSame) {
        // throw new Unauthorized("wrong password");
        throw new Error("wrong password");
    };
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "15m",
    });
    user.token = token;
    await User.findByIdAndUpdate(user._id, user);
    return res.json({
        data: {
            token,
        },
    });
};

const logout = async (req, res, next) => {
    console.log("logout");
    const { user } = req;
    user.token = null;
    await User.findByIdAndUpdate(user._id, user);
    return res.json({});
};

module.exports = {
    register,
    login,
    logout,
};