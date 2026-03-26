import { instance } from './axiosInstance';

export const axiosBaseQuery =
    ({ baseUrl } = { baseUrl: '' }) =>
        async ({ url, method, data, params, headers }) => {
            try {
                const result = await instance({
                    url: baseUrl + url,
                    method,
                    data,
                    params,
                    headers: headers
                })
                return result
            } catch (axiosError) {
                const err = axiosError
                
                // Handle timeout errors gracefully
                if (err.code === 'ECONNABORTED' || err.message === 'Timeout') {
                    return {
                        error: {
                            status: 408,
                            data: 'Request timeout. Please check your connection and try again.',
                        },
                    }
                }
                
                return {
                    error: {
                        status: err.response?.status || 500,
                        data: err.response?.data || err.message || 'An error occurred',
                    },
                }
            }
        }