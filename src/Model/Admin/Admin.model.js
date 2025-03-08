const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const AdminSchema = new Schema({
  EmailOrUsername: {
    type: String,
    trim: true,
    required: [true, "Email or Username Required!"],
  },
  Password: {
    type: String,
    required: true,
    trim: true,
  },
  Image: {
    type: String,
  },
});

const AdminModel = mongoose.model("Admin", AdminSchema);
module.exports = { AdminModel };
