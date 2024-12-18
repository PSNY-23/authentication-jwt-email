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
      const user = await UserModel.findOne({ _id: req.userID });
      user.password = newHashedPassword;
      await user.save();
      res.json({ message: "Password changed successfully", user: user });
    }
  } else {
    res.json({ message: "All fields are required" });
  }
};

const userProfile = async (req, res) => {
  try {
    const user = await UserModel.findById({ _id: req.userID });
    res.send({ message: "User details fetched successfully", user: user });
  } catch (error) {
    res.send({ message: "Error fetching user datails", error });
  }
};

const sendUserPasswordResetEmail = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.jspn({ message: "Email is required to reset password" });
    }

    const user = await UserModel.findOne({ email: email });
    if (!user) {
      res.json({ message: "No account exists with this email." });
    }
    // creating token for password reset
    let newSecret = process.env.JWT_SECRET_KEY + user._id;
    let resetToken = jwt.sign({ userID: user._id }, newSecret, {
      expiresIn: "1hr",
    });
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${user._id}/${resetToken}`;
    res.render("resetEmail", { name: user.name, resetLink: resetLink });
  } catch (error) {
    res.json({ message: "Error generating password reset token route" });
  }
};

const resetUserPassword = async (req, res) => {
  const { id, token } = req.params;
  const { newPassword, confirm_newPassword } = req.body;
  try {
    if (!id || !token) {
      return res
        .status(400)
        .json({ message: "Password reset link is invalid or Expired" });
    }

    if (!newPassword || !confirm_newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (newPassword !== confirm_newPassword) {
      res
        .status(400)
        .json({ message: "Password and confirm-Password must be same" });
    }
    let newSecret = process.env.JWT_SECRET_KEY + id;
    const isTokenValid = jwt.verify(token, newSecret);
    if (!isTokenValid) {
      return res.status(400).json({ message: "token is invalid or expired" });
    }
    const user = await UserModel.findOne({ _id: id });
    console.log({userBefore: user})

    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);
    console.log(newHashedPassword)
    user.password = newHashedPassword;
    console.log({userAfter: user})
    await user.save();

    res.json({ message: "Password reset successfully", user: user });
  } catch (error) {
    res.status(400).json({ message: "Error resetting password", error: error });
  }
};

export {
  userRegistration,
  userLogin,
  changeUserPassword,
  userProfile,
  sendUserPasswordResetEmail,
  resetUserPassword
};
