import { Router } from "express";
import {
  addItem,
  createOrder,
  deleteOrder,
  finishOrder,
  getOrder,
  isOrderEmpty,
  modifyItem,
  updateItem,
} from "../repository";
import { OrderModel, OrderNode } from "../types";

const orders = Router();

orders
  .post("/", async (req, res) => {
    const { delivery, userId } = req.body;

    if (!userId) return res.status(400).send("No user");

    createOrder("TAKEOUT", userId)
      .then((success: Partial<OrderNode>[]) => {
        //@ts-ignore
        return res.send({ id: success?.[0]?.order?.order?.properties.id });
      })
      .catch((err) => {
        res.send(err);
      });
  })
  .post("/:orderId/add", async (req, res) => {
    const { orderId } = req.params;
    const { itemId, amount } = req.body;
    if ([itemId, amount, orderId].some((v) => !v))
      return res.status(400).send("Bad body");

    addItem(orderId, itemId, parseFloat(amount))
      .then((success) => {
        res.send(success);
      })
      .catch((err) => res.status(400).send(err));
  })
  .post("/:orderId/item/:itemId/modify", async (req, res) => {
    const { orderId, itemId } = req.params;
    const { text } = req.body;
    if ([itemId, text].some((v) => !v)) return res.status(400).send("Bad body");

    modifyItem(itemId, text)
      .then((success) => {
        res.send(success);
      })
      .catch((err) => res.send(err));
  })
  .get("/:orderId", async (req, res) => {
    const { orderId } = req.params;
    getOrder(orderId)
      .then((success: OrderNode[]) => {
        const date = success[0]?.order?.properties?.date;

        //@ts-ignore
        const order = success.reduce((acc: OrderModel, node): OrderModel => {
          const orderId = node.order.properties.id;
          const delivery = node.order.properties.delivery;
          const number = node.order.properties?.orderNumber;
          const item = {
            name: node?.item?.properties?.name,
            price: node?.item?.properties?.price,
            id: node?.orderItem?.properties?.id,
            amount: node?.orderItem?.properties?.amount,
          };

          return {
            orderId,
            delivery,
            orderNumber: number,
            orderDate: date,
            items: item.name ? [...(acc.items || []), item] : [],
          };
        }, {});
        return res.send(order);
      })
      .catch((err) => res.send(err));
  })
  .delete("/:orderId", async (req, res) => {
    const { orderId } = req.params;
    const order = await getOrder(orderId);
    if (!order.at(0)) return res.send("Order doesn't exist");

    deleteOrder(orderId).then((success) => {
      return res.send({
        deletedNodes: success.updateStatistics.updates().nodesDeleted,
      });
    });
  })
  .put("/:orderId/:orderItemId", async (req, res) => {
    const { orderItemId } = req.params;
    const { amount } = req.body;
    if (Number.parseInt(amount) < 0)
      return res.send(400).send("Negative amount");
    updateItem(orderItemId, parseFloat(amount))
      .then((success) => {
        res.send(success);
      })
      .catch((err) => res.send(err));
  })
  .put("/:orderId//:orderItemId/modify", async (req, res) => {
    const { orderItemId } = req.params;
    const { text } = req.body;
    updateItem(orderItemId, text)
      .then((success) => {
        console.log(success);

        res.send(success);
      })
      .catch((err) => res.send(err));
  })
  .post("/:orderId/finish", async (req, res) => {
    const { orderId } = req.params;
    const isEmpty = (await isOrderEmpty(orderId))[0].isOrderEmpty;
    console.log(isEmpty);

    if (isEmpty) return res.status(400).send("Cannot finish empty order");

    finishOrder(orderId)
      .then(async () => {
        const order = await getOrder(orderId);
        console.log(order);

        res.send(order);
      })
      .catch((err) => res.send(err));
  });
export default orders;
