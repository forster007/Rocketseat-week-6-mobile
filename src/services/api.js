import axios from 'axios';

const api = axios.create({
    baseURL: 'https://omnistack-week-6-backend.herokuapp.com'
});

export default api;