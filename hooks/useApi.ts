import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiService } from "../services";

interface FetchOptions {
  endpoint: string;
  params?: Record<string, any>;
  enabled?: boolean;
}

/**
 * Custom hook for fetching data
 */
export const useFetchData = ({ endpoint, params = {}, enabled = true }: FetchOptions) => {
  return useQuery({
    queryKey: [endpoint, params],
    queryFn: () => ApiService.get(endpoint, params),
    enabled,
    staleTime: 1000 * 60 * 20,
    retry: 2,
  });
};

/**
 * Custom hook for posting data
 */
export const usePostData = (endpoint: string, onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => ApiService.post(endpoint, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      onSuccess?.();
    },
  });
};

/**
 * Custom hook for updating data (PUT)
 */
export const usePutData = (endpoint: string, onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => ApiService.put(endpoint, id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      onSuccess?.();
    },
  });
};

/**
 * Custom hook for deleting data
 */
export const useDeleteData = (endpoint: string, onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ApiService.delete(endpoint, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      onSuccess?.();
    },
  });
};
