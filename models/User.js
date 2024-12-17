import mongoose from "mongoose";

//Defining schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    unique: true,
    type: String,
    required: true, // Corrected key
    trim: true,
  },

  password: {
    type: String,
    required: true,
    trim: true,
  },
  tc: {
    type: String,
    required: true,
  },
});

const UserModel = mongoose.model("user", userSchema);

export default UserModel;
