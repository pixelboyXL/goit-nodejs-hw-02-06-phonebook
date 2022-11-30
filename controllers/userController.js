const { User } = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const fs = require("fs/promises");
const path = require("path");
const jimp = require("jimp");

const dotenv = require("dotenv");
dotenv.config();

const { JWT_SECRET } = process.env;

const register = async (req, res, next) => {
    const { email, password } = req.body;
    const avatarURL = gravatar.url(email);
    const user = await User.findOne({ email });
    if (user) {
        return res.status(409).json({ message: "Email is already in use" });
    };
    try {
        const newUser = new User({ email, password, avatarURL });
        await newUser.save();
        return res.status(201).json({
        data: {
            user: {
                email: newUser.email,
                subscription: newUser.subscription,
            },
        },
    });
    } catch (error) {
        next(error);
    };
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const isPasswordTheSame = await bcrypt.compare(password, user.password);
    if (!user || !isPasswordTheSame) {
        return res.status(401).json({ message: "Email or password is wrong" });
    }
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "15m",
    });
    user.token = token;
    await User.findByIdAndUpdate(user._id, user);
    return res.json({
        data: {
            token: user.token,
            user: {
                email: user.email,
                subscription: user.subscription,
            },
        },
    });
};

const logout = async (req, res) => {
    const { user } = req;
    user.token = null;
    await User.findByIdAndUpdate(user._id, user);
    return res.status(204).json({});
};

const current = async (req, res) => {
    const { user } = req;
    if (user) {
        return res.status(200).json({
            data: {
                email: user.email,
                subscription: user.subscription,
            },
        });
    };
    return res.status(401).json({ message: "Not authorized" });
};

const avatar = async (req, res, next) => {
    const { user, file } = req;
    if (user) {
        file.filename = user._id + ".jpeg";
        const image = await jimp.read(file.path);
        image.resize(250, 250);
        await image.writeAsync(file.path);
        const newPath = path.join(__dirname, "../public/avatars", file.filename);
        await fs.rename(file.path, newPath);
        user.avatarURL = "/avatars/" + file.filename;
        await User.findByIdAndUpdate(user._id, user);
        return res.json({
            avatarURL: "/avatars/" + file.filename
        });
    };
    return res.status(401).json({ message: "Not authorized" });
};

module.exports = {
    register,
    login,
    logout,
    current,
    avatar,
};