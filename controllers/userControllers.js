import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userRegistration = async (req, res) => {
  const { name, email, password, confirm_password, tc } = req.body;
  const user = await UserModel.findOne({ email: email });
  if (user) {
    res.status(500).json({ message: "User already exists" });
  } else {
    if (name && email && password && confirm_password && tc) {
      if (password == confirm_password) {
        try {
          const salt = await bcrypt.genSalt(10);
          const hashPassword = await bcrypt.hash(password, salt);
          let user = new UserModel({
            name: name,
            email: email,
            password: hashPassword,
            tc: tc,
          });
          await user.save();
          const registered_user = await UserModel.findOne({ email: email });
          //Generate token
          const token = jwt.sign(
            { userID: registered_user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "5d" }
          );
          res.status(200).json({
            message: "user registered successfully",
            user: user,
            token: token,
          });
        } catch (error) {
          res.json(error);
        }
      } else {
        res.status(500).json({ message: "Password didn't match" });
      }
    } else {
      res.status(500).json({ message: "All fields are required" });
    }
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const user = await UserModel.findOne({ email: email });
      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          //Generate token
          const token = jwt.sign(
            { userID: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "5d" }
          );
          res.json({
            message: "User logged in successfully",
            user: user,
            token: token,
          });
        } else {
          res.json({ message: "User or password is wrong" });
        }
      } else {
        res.json({ message: "No account exists with this email id" });
      }
    } else {
      res.json({ message: "email or password missing" });
    }
  } catch (error) {
    res.json({ message: "Error Login", error });
  }
};

const changeUserPassword = async (req, res) => {
  const { password, confirm_password } = req.body;
  if (password && confirm_password) {
    if (password !== confirm_password) {
      res.json({ message: "password and confirm password didn't match" });
    } else {
      const salt = await bcrypt.genSalt(10);
      const newHashedPassword = await bcrypt.hash(password, salt);
    }
  } else {
    res.json({ message: "All fields are required" });
  }
};

export { userRegistration, userLogin, changeUserPassword };
