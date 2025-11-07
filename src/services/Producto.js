import axios from 'axios';

const API = import.meta.env.VITE_API_URL;
const BASE_URL = `${API}/api/products`;

class ProductService {
  getAll() {
    return axios.get(BASE_URL);
  }
  getById(id) {
    return axios.get(`${BASE_URL}/${id}`);
  }
  create(product) {
    return axios.post(BASE_URL, product);
  }
  update(id, product) {
    return axios.put(`${BASE_URL}/${id}`, product);
  }
  remove(id) {
    return axios.delete(`${BASE_URL}/${id}`);
  }
}

export default new ProductService();
