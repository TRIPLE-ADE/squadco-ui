import api from "./api"; // Axios instance

const ApiService = {
  get: async (endpoint: string, params?: Record<string, any>) => {
    const { data } = await api.get(endpoint, { params });
    return data;
  },

  post: async (endpoint: string, payload: any) => {
    const { data } = await api.post(endpoint, payload);
    return data;
  },

  put: async (endpoint: string, id: string, payload: any) => {
    const { data } = await api.put(`${endpoint}/${id}`, payload);
    return data;
  },

  delete: async (endpoint: string, id: string) => {
    const { data } = await api.delete(`${endpoint}/${id}`);
    return data;
  },
};

export default ApiService;
