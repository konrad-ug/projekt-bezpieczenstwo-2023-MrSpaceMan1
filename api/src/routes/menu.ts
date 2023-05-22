import { Router } from "express";
import {
  addMenuItem,
  deleteMenuItem,
  editMenuItem,
  getMenu,
  getMenuItem,
} from "../repository";
import { Menu, MenuModel } from "../types";

const menu = Router();

menu
  .get("/", async (req, res) => {
    getMenu()
      .then((success: Menu) => {
        const readable = success.reduce((acc: MenuModel, curr): MenuModel => {
          const { category, item } = curr;
          const categoryName = category.properties.name;
          const itemProperties = item.properties;
          itemProperties.id = item.properties.id;

          return {
            ...acc,
            [categoryName]: [...(acc[categoryName] ?? []), itemProperties],
          };
        }, {});
        return res.send(readable);
      })
      .catch((err) => {
        console.log(err);
      });
  })
  .get("/item/:itemId", async (req, res) => {
    const { itemId } = req.params;
    getMenuItem(itemId)
      .then((success) => {
        res.send(success);
      })
      .catch((err) => {
        res.send(err);
      });
  })
  .put("/item/:itemId", async (req, res) => {
    const { itemId } = req.params;
    const { name, price } = req.body;
    editMenuItem(itemId, name, price)
      .then((success) => {
        res.send(success);
      })
      .catch((err) => {
        res.send(err);
      });
  })
  .delete("/item/:itemId", async (req, res) => {
    const { itemId } = req.params;
    const item = await getMenuItem(itemId);
    if (!item.at(0)) return res.status(404).send("No item found");
    deleteMenuItem(itemId).then((success) => {
      res.send({
        deletedNodes: success.updateStatistics.updates().nodesDeleted,
      });
    });
  })
  .post("/item", async (req, res) => {
    const { name, price, category } = req.body;

    if ([name, price, category].some((v) => !v))
      return res.status(400).send("Bad body");

    addMenuItem(name, price, category)
      .then((success) => {
        res.send(success);
      })
      .catch((err) => {
        res.send(err);
      });
  });

export default menu;
