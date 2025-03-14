import api from "./api";

const ApiService = {
  get: async (endpoint: string, params?: Record<string, any>) => {
    try {
      const { data } = await api.get(endpoint, { params });
      return data;
    } catch (error) {
      console.error("GET error:", error);
      throw error; // Re-throw for React Query to handle
    }
  },
  post: async (endpoint: string, payload: any) => {
    try {
      console.log("payload", payload)
      const { data } = await api.post(endpoint, payload);
      return data;
    } catch (error) {
      console.error("POST error:", error);
      throw error; // Re-throw for React Query to handle
    }
  },
    

  put: async (endpoint: string, id: string, payload: any) => {
    try {
      const { data } = await api.put(`${endpoint}/${id}`, payload);
      return data;
    } catch (error) {
      console.error("PUT error:", error);
      throw error; // Re-throw for React Query to handle
    }
  },

  delete: async (endpoint: string, id: string) => {
    try {
      const { data } = await api.delete(`${endpoint}/${id}`);
      return data;
    } catch (error) {
      console.error("DELETE error:", error);
      throw error; // Re-throw for React Query to handle
    }
  },
};

export default ApiService;
