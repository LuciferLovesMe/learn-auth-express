import Users from "../models/UserModel.js";
import argon2, { hash } from "argon2";

export const getUsers = async (req, res) => {
  try {
    const response = await Users.findAll({
      attributes: ["uuid", "name", "email", "role"],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const response = await Users.findOne({
      where: {
        UUID: req.params.id,
      },
      attributes: ["uuid", "name", "email", "role"],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;

    if (confirmPassword !== password)
      return res.status(400).json({ msg: "Konfirmasi password salah" });

    const hashPasword = await argon2.hash(password);
    await Users.create({
      name: name,
      email: email,
      password: hashPasword,
      role: role,
    });

    res.status(201).json({ msg: "User berhasil dibuat" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateUser = async (req, res) => {
  const user = await Users.findOne({
    where: {
      UUID: req.params.id,
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

  const { name, email, password, confirmPassword, role } = req.body;
  let hashPasword = "";
  if (password === "" || password === null) hashPasword = user.password;
  else {
    hashPasword = await argon2.hash(password);
  }
  if (confirmPassword !== password)
    return res.status(400).json({ msg: "Konfirmasi password salah" });
};

export const deleteUser = (req, res) => {};
