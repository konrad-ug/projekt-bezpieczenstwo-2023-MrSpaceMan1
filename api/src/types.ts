import { Request, RequestHandler } from "express";
import { ParamsDictionary } from "express-serve-static-core";

interface Node {
  identity: {
    low: number;
    high: number;
  };
  labels: string[];
  properties: {
    id: string;
  };
}

export type Category = Node & {
  properties: {
    name: string;
  };
};

export type Item = Node & {
  properties: {
    price: number;
    name: string;
  };
};

export type Menu = {
  category: Category;
  item: Item;
}[];

export type MenuModel = {
  [key: string]: {
    name: string;
    price: number;
    id: string;
  }[];
};

export type Delivery = "TAKEOUT" | "ONPREMISE";

export type OrderItem = Node & {
  properties: {
    amount: number;
  };
};

export type Order = Node & {
  properties: {
    delivery: Delivery;
    orderNumber?: number;
    date?: string;
  };
};

export interface OrderNode {
  order: Order;
  orderItem: OrderItem;
  item: Item;
}

export interface OrderModel {
  orderId: string;
  delivery: Delivery;
  orderNumber?: number;
  orderDate?: string;
  items: {
    name: string;
    price: number;
    amount: number;
    id: string;
  }[];
}

export interface ReqWithToken extends Request {
  token?: string;
}
