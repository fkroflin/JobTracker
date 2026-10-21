import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://jobtracker-api-6yge.onrender.com/api' 
    : 'http://localhost:5102/api')

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default apiClient