import useSWR, { SWRConfiguration } from "swr";

export const useProducts = <T>(url: string, config: SWRConfiguration = {}) => {
    const { data, error } = useSWR<T>(`/api${url}`, config);

    return {
        products: data || [],
        isLoading: !error && !data,
        error
    }
}
