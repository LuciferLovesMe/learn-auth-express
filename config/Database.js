import { Sequelize } from "sequelize";

const db = new Sequelize("learn_auth_express", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
