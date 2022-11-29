const { User } = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
// const fs = require("fs/promises");
// const path = require("path");

const dotenv = require("dotenv");
dotenv.config();

const { JWT_SECRET } = process.env;

const register = async (req, res, next) => {
    const { email, password } = req.body;
    const avatarURL = gravatar.url(email, { s: "200", r: "pg", d: "404" });
    console.log(avatarURL);
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

// const avatar = async (req, res, next) => {
//     console.log(req.file);
//     const newPath = path.join(__dirname, "../public/avatars", req.file.filename);
//     await fs.rename(req.file.path, newPath);
//     const movieId = req.params.id;
//     console.log(req.params.id);
//     const movieImage = "/public/images/" + req.file.filename;
//     const movieS = await Movie.findById(movieId);
//     console.log(movieS);
//     const savedMovie = await Movie.findByIdAndUpdate(
//         movieId,
//         {
//             image: movieImage,
//         },
//         { new: true }
//     );
//     return res.status(201).json({ data: { movie: savedMovie } });
// };

module.exports = {
    register,
    login,
    logout,
    current,
    // avatar,
};