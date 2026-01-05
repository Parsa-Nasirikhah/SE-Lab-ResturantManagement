import api from "./axios"

export type MenuItem = {
  item_id: string
  name: string
  description: string
  price: string | number
  available: boolean
}

export type OrderItemPayload = {
  menu_item: string
  quantity: number
  note?: string
}

export type CreateOrderPayload = {
  table?: string | null
  applied_discount?: string | null
  items: OrderItemPayload[]
}

export const cancelOrder = async (orderId: string) => {
  const res = await api.patch(`/orders/${orderId}/`, {
    status: "CANCELLED",
  });
  return res.data;
};


export const listCategories = async () => {
  const res = await api.get("/categories/");
  return res.data;
};


type OrderItem = {
  menu_item: string | number;
  quantity: number;
  note?: string;
  line_total?: number;
  menu_item_detail?: {
    name?: string;
    price?: number;
  };
};

type Order = {
  order_id: string;
  created_at: string;
  status: string;
  estimated_time?: string | null;
  total_price?: number;
  items: OrderItem[];
};


export const listMenuItems = async () => {
  const res = await api.get("/menu-items/")
  return res.data as MenuItem[]
}

export const createOrder = async (payload: CreateOrderPayload) => {
  const res = await api.post("/orders/", payload)
  return res.data
}

export const getOrderDetail = async (orderId: string) => {
  const res = await api.get(`/orders/${orderId}/`);
  return res.data;
};


export const listMyOrders = async () => {
  const res = await api.get("/orders/")
  return res.data
}
