const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Organisation, User, Log } = require("../models");

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { orgName, adminName, email, password } = req.body;

    if (!orgName || !email || !password) {
      return res
        .status(400)
        .json({ message: "orgName, email, and password are required" });
    }

    // check if email already exists
    const isEmailExists = await User.findOne({ where: { email } });
    if (isEmailExists) {
      return res.status(409).json({ message: "Email already in use" });
    }

    // create organisation
    const organisation = await Organisation.create({
      name: orgName,
    });

    // hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // create admin user
    const user = await User.create({
      organisation_id: organisation.id,
      email,
      password_hash: passwordHash,
      name: adminName || "Admin",
    });

    // generate jwt
    const payload = {
      userId: user.id,
      organisationId: organisation.id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET);

    // log action
    await Log.create({
      organisation_id: organisation.id,
      user_id: user.id,
      action: "CREATE_ORGANISATION",
      meta: {
        orgId: organisation.id,
        orgName,
        adminEmail: email,
      },
    });

    return res.status(201).json({
      message: "Organisation and admin user created",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        organisation_id: user.organisation_id,
      },
      organisation: {
        id: organisation.id,
        name: organisation.name,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // compare password
    const isPasswordMatched = await bcrypt.compare(
      password,
      user.password_hash
    );
    if (!isPasswordMatched) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // load organisation
    const organisation = await Organisation.findByPk(user.organisation_id);

    // generate token
    const payload = {
      userId: user.id,
      organisationId: user.organisation_id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET);

    // log
    await Log.create({
      organisation_id: user.organisation_id,
      user_id: user.id,
      action: "LOGIN",
      meta: {
        email: user.email,
      },
    });

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        organisation_id: user.organisation_id,
      },
      organisation: organisation
        ? { id: organisation.id, name: organisation.name }
        : null,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { register, login };
