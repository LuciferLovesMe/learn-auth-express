import Products from "../models/ProductModel.js";
import Users from "../models/UserModel.js";
import { Op } from "sequelize";

export const getProducts = async (req, res) => {
  try {
    let response;
    if (req.role === "admin") {
      response = await Products.findAll({
        attributes: ["uuid", "name", "price"],
        include: [
          {
            model: Users,
            attributes: ["name", "email"],
          },
        ],
      });
    } else {
      response = await Products.findAll({
        where: {
          userId: req.userId,
        },
        attributes: ["uuid", "name", "price"],
        include: [
          {
            model: Users,
            attributes: ["name", "email"],
          },
        ],
      });
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Products.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    if (!product) return res.status(404).json({ msg: "Product not found" });

    let response;
    if (req.role === "admin") {
      response = await Products.findOne({
        attributes: ["uuid", "name", "price"],
        where: {
          id: product.id,
        },
        include: [
          {
            model: Users,
            attributes: ["name", "email"],
          },
        ],
      });
    } else {
      response = await Products.findOne({
        where: {
          [Op.and]: [{ id: product.id }, { userId: req.userId }],
          id: product.id,
        },
        attributes: ["uuid", "name", "price"],
        include: [
          {
            model: Users,
            attributes: ["name", "email"],
          },
        ],
      });
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, price } = req.body;
    await Products.create({
      name: name,
      price: price,
      userId: req.userId,
    });
    res.status(201).json({ msg: "Product created successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Products.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    if (!product) return res.status(404).json({ msg: "Product not found" });

    const { name, price } = req.body;

    if (req.role === "admin") {
      await Products.update(
        {
          name: name,
          price: price,
        },
        {
          where: {
            id: product.id,
          },
        }
      );
    } else {
      const productSearch = await Products.findOne({
        where: {
          id: product.id,
          [Op.and]: [{ id: product.id }, { userId: req.userId }],
        },
      });

      if (!productSearch)
        return res.status(404).json({ msg: "Product not found" });

      await Products.update(
        {
          name: name,
          price: price,
        },
        {
          where: {
            id: product.id,
          },
        }
      );
    }

    res.status(201).json({ msg: "Product updated" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Products.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    if (!product) return res.status(404).json({ msg: "Product not found" });

    const { name, price } = req.body;

    if (req.role === "admin") {
      await Products.destroy({
        where: {
          id: product.id,
        },
      });
    } else {
      const productSearch = await Products.findOne({
        where: {
          id: product.id,
          [Op.and]: [{ id: product.id }, { userId: req.userId }],
        },
      });

      if (!productSearch)
        return res.status(404).json({ msg: "Product not found" });

      await Products.destroy({
        where: {
          id: product.id,
        },
      });
    }

    res.status(201).json({ msg: "Product deleted" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
