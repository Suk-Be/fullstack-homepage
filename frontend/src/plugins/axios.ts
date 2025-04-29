import axios from 'axios';
import Cookies from 'js-cookie';

const LaravelAxiosClient = axios.create({
	baseURL: import.meta.env.VITE_BACKEND_URL,
	headers: {
		'X-Requested-With': 'XMLHttpRequest',
		Accept: 'application/json',
	},
});

LaravelAxiosClient.defaults.withCredentials = true; // allow sending cookies

LaravelAxiosClient.interceptors.request.use(async (config) => {
	if ((config.method as string).toLowerCase() !== 'get') {
		await LaravelAxiosClient.get('/csrf-cookie').then();
		config.headers['X-XSRF-TOKEN'] = Cookies.get('XSRF-TOKEN');
	}

	return config;
});

export default LaravelAxiosClient;
