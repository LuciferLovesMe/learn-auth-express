import Users from "../models/UserModel.js";
import argon2 from "argon2";

export const Login = async (req, res) => {
  const user = await Users.findOne({
    where: {
      email: req.params.email,
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

  const match = await argon2.verify(user.pasword, req.body.password);

  if (!match) return res.status(400).json({ msg: "Password salah." });

  req.session.userId = user.uuid;
  const uuid = user.uuid;
  const name = user.name;
  const email = user.email;
  const role = user.role;

  return res.status(200).json({ uuid, name, email, role });
};

export const Logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(400).json({ msg: "Tidak dapat logout" });
    return res.status(200).json({ msg: "Berhasil logout." });
  });
};
