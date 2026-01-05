import api from "./axios";

export const getChefOrders = async () => {
  const res = await api.get("/orders/");
  return res.data;
};

export const updateOrderStatus = async (
  orderId: string,
  status: "PREPARING" | "READY"
) => {
  const res = await api.patch(
    `/orders/${orderId}/update_status/`,
    { status }
  );
  return res.data;
};



