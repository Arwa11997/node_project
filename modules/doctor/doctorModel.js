const mongoose = require("mongoose");
const doctorSchema = require("./doctorSchema");
const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
