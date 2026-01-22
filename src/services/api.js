import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const bookService = {
  getAllBooks: () => api.get('/books'),
  getBookById: (id) => api.get(`/books/${id}`),
  createBook: (book) => api.post('/books', book),
  updateBook: (id, book) => api.put(`/books/${id}`, book),
  deleteBook: (id) => api.delete(`/books/${id}`),
  updateStatus: (id, status) => api.patch(`/books/${id}/status?status=${status}`),
  updateProgress: (id, currentPage) => api.patch(`/books/${id}/progress?currentPage=${currentPage}`),
  getBooksByStatus: (status) => api.get(`/books/status/${status}`),
  searchBooks: (query) => api.get(`/books/search?query=${query}`),
  getStats: () => api.get('/books/stats'),
  getCurrentlyReading: () => api.get('/books/currently-reading'),
  getCompletedBooks: () => api.get('/books/completed'),
};

export default api;