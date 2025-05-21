import axios from 'axios'

const getToken = () => localStorage.getItem('token')

const applyInterceptors = (axiosInstance: any) => {
    axiosInstance.interceptors.request.use((config: any) => {
        const token = getToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    }, (error: any) => {
        return Promise.reject(error)
    })
}

export const Api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL
})

applyInterceptors(Api)