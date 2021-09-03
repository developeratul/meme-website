import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface User extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  portfolio: string;
  time: number;
  generateWebToken: () => "";
}

const dataSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  portfolio: { type: String, required: true },
  time: { type: Number, required: true, default: Date.now() },
  tokens: [{ token: String }],
});

// hashing the password before save
dataSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  }
});

// generating a web token
dataSchema.methods.generateWebToken = async function () {
  try {
    const token = jwt.sign({ id: this._id.toString() }, `${process.env.JWT_SECRET}`);
    this.tokens = this.tokens.concat({ token });
    await this.save();
    return token;
  } catch (err: any) {
    console.log(err.message || err);
  }
};

const User: mongoose.Model<User> = mongoose.model("User", dataSchema);

export default User;
