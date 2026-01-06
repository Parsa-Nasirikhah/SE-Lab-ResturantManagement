import api from "./axios";

export const getStaffList = async () => {
  const res = await api.get("/admin/staff/");
  return res.data;
};

export const createStaff = async (payload: {
  username: string;
  email: string;
  password: string;
  role: string;
}) => {
  const res = await api.post("/admin/staff/create/", payload);
  return res.data;
};

export const updateStaffRole = async (
  userId: number,
  role: string
) => {
  const res = await api.patch(`/admin/staff/${userId}/`, { role });
  return res.data;
};

export const disableStaff = async (userId: number) => {
  const res = await api.patch(`/admin/staff/${userId}/disable/`);
  return res.data;
};
