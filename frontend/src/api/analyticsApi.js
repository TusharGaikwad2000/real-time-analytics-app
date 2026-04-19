import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const analyticsApi = {
  getMetrics: (platform) => api.get(`/metrics?platform=${platform}`),
  getTopUsers: (platform, k = 5) => api.get(`/top-users?platform=${platform}&k=${k}`),
  getWindowMetrics: (platform, minutes) => api.get(`/metrics/window?platform=${platform}&minutes=${minutes}`),
  ingestEvent: (event) => api.post('/events', event),
  ingestBulk: (events) => api.post('/events/bulk', events),
};
