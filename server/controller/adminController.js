const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
let multer = require("multer");
const excelToJson = require("convert-excel-to-json");
//Validation
const validateAdminRegisterInput = require("../validation/adminRegister");
const validateVoterRegisterInput = require("../validation/voterRegister");
const validateAdminLoginInput = require("../validation/adminLogin");
var xlsx = require("xlsx");
//Models

const Admin = require("../models/admin");
const Voter = require("../models/voter");

//Config
const keys = require("../config/key");

module.exports = {
  addAdmin: async (req, res, next) => {
    try {
      const { name, email, dob, contactNumber } = req.body;

      //VALIDATE REQUEST BODY
      if (!name || !email || !dob || !contactNumber) {
        return res.status(400).json({
          success: false,
          message: "Probably you have missed certain fields",
        });
      }

      const admin = await Admin.findOne({ email });
      if (admin) {
        return res
          .status(400)
          .json({ success: false, message: "Email already exist" });
      }
      const avatar = gravatar.url(email, { s: "200", r: "pg", d: "mm" });

      let hashedPassword;
      hashedPassword = await bcrypt.hash(dob, 10);
      var date = new Date();
      const joiningYear = date.getFullYear();
      //finding username
      var str = email;
      var nameMatch = str.match(/^([^@]*)@/);
      var username = nameMatch ? nameMatch[1] : null;
      var components = ["Admin", "-", username];
      var registrationNumber = components.join("");

      const newAdmin = await new Admin({
        name,
        email,
        password: hashedPassword,
        joiningYear,
        registrationNumber,
        avatar,
        contactNumber,
        dob,
      });
      await newAdmin.save();
      return res.status(200).json({
        success: true,
        message: "Admin registerd successfully",
        response: newAdmin,
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },
  adminLogin: async (req, res, next) => {
    try {
      const { errors, isValid } = validateAdminLoginInput(req.body);

      // Check Validation
      if (!isValid) {
        return res.status(400).json(errors);
      }
      const { registrationNumber, password } = req.body;

      const admin = await Admin.findOne({ registrationNumber });
      if (!admin) {
        errors.registrationNumber = "Registration number not found";
        return res.status(404).json(errors);
      }
      const isCorrect = await bcrypt.compare(password, admin.password);
      if (!isCorrect) {
        errors.password = "Invalid Credentials";
        return res.status(404).json(errors);
      }
      const payload = {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        contactNumber: admin.contactNumber,
        avatar: admin.avatar,
        registrationNumber: admin.registrationNumber,
        joiningYear: admin.joiningYear,
      };
      jwt.sign(payload, keys.secretOrKey, { expiresIn: 7200 }, (err, token) => {
        res.json({
          success: true,
          token: "Bearer " + token,
        });
      });
    } catch (err) {
      console.log("Error in admin login", err.message);
    }
  },

  addVoter: async (req, res, next) => {
    try {
      // console.log(req.file);

      // convert excel to json
      var dataPathExcel = `./excel_file/${req.file.filename}`;

      var wb = xlsx.readFile(dataPathExcel);
      var sheetName = wb.SheetNames[0];
      var sheetValue = wb.Sheets[sheetName];

      var excelData = xlsx.utils.sheet_to_json(sheetValue);

      //iterate over excel sheet

      for (var i = 0; i < excelData.length; i++) {
        const { errors, isValid } = validateVoterRegisterInput(excelData[i]);

        if (!isValid) {
          return res.status(400).json(errors);
        }
        const {
          name,
          email,
          year,
          fatherName,
          aadharCard,
          gender,
          profession,
          dob,
          VoterMobileNumber,
        } = excelData[i];

        const voter = await Voter.findOne({ email });

        if (voter) {
          errors.email = `${email} already exist`;
          return res.status(400).json(errors);
        }
        const avatar = gravatar.url(email, { s: "200", r: "pg", d: "mm" });
        let hashedPassword;
        hashedPassword = await bcrypt.hash(dob, 10);
        var date = new Date();
        const batch = date.getFullYear();
        var str = email;
        var nameMatch = str.match(/^([^@]*)@/);
        var username = nameMatch ? nameMatch[1] : null;
        var components = ["voter", "-", username];

        var registrationNumber = components.join("");
        const newVoter = await new Voter({
          name,
          email,
          password: hashedPassword,
          year,
          fatherName,
          aadharCard,
          gender,
          registrationNumber,
          profession,
          avatar,
          dob,
          VoterMobileNumber,
        });
        await newVoter.save();
      }
      res.status(200).json({ message: "Successfully added " });
    } catch (err) {
      res
        .status(400)
        .json({ message: `error in adding new Voter", ${err.message}` });
    }
  },
};
