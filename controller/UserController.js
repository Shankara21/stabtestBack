const { User } = require("../models");
const bcrypt = require("bcryptjs");
const validator = require("fastest-validator");
const v = new validator();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  index: async (req, res) => {
    try {
      const users = await User.findAll();
      res.status(200).json({
        message: "Success",
        data: users,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal Server Error",
        data: error,
      });
    }
  },
  show: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({
        message: "Internal Server Error",
        data: error,
      });
    }
  },
  register: async (req, res) => {
    try {
      const schema = {
        username: { type: "string", min: 3, max: 20 },
        fullname: { type: "string", min: 3, max: 50 },
        email: { type: "email" },
        password: { type: "string", min: 3, max: 20 },
        confirmPassword: { type: "equal", field: "password" },
      };
      const validate = v.validate(req.body, schema);
      if (validate.length) {
        return res.status(400).json({
          message: validate,
        });
      }
      const { body } = req;
      // validate email
      const emailFound = await User.findOne({
        where: {
          email: body.email,
        },
      });
      if (emailFound) {
        return res.status(400).json({
          message: "Email already registered",
        });
      }
      // validate username
      const usernameFound = await User.findOne({
        where: {
          username: body.username,
        },
      });
      if (usernameFound) {
        return res.status(400).json({
          message: "Username already registered",
        });
      }
      // hash password
      const password = await bcrypt.hash(body.password, 10);

      const user = await User.create({
        ...body,
        password,
      });

      delete user.dataValues.password;

      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  },
  login: async (req, res) => {
    try {
      const schema = {
        email: { type: "email" },
        password: { type: "string", min: 3, max: 20 },
      };
      const validate = v.validate(req.body, schema);
      if (validate.length) {
        return res.status(400).json({
          message: validate,
        });
      }
      const user = await User.findOne({
        where: {
          email: req.body.email,
        },
      });
      if (!user) {
        return res.status(400).json({
          message: "Email not registered",
        });
      }
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        return res.status(400).json({
          message: "Invalid Password",
        });
      }
      const data = {
        id: user.id,
        username: user.username,
        fullname: user.fullname,
        email: user.email,
      };
      const token = jwt.sign(data, process.env.SECRET_KEY);
      res.status(200).json({
        token,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  },
};
