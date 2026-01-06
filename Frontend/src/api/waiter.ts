import api from "./axios";

export const getReadyOrders = async () => {
  const res = await api.get("/orders/");
  return res.data;
};

export const markOrderAsServed = async (orderId: string) => {
  const res = await api.patch(`/orders/${orderId}/`, {
    status: "SERVED",
  });
  return res.data;
};
