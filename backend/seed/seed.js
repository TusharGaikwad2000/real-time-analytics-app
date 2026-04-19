const axios = require('axios');

const API_URL = 'http://localhost:5000/events/bulk';
const platforms = ['amazon', 'ebay', 'walmart', 'shopify'];
const actions = ['view', 'click', 'add_to_cart', 'purchase'];

const generateEvents = (count) => {
  const events = [];
  const now = Math.floor(Date.now() / 1000);

  for (let i = 0; i < count; i++) {
    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const amount = action === 'purchase' ? Math.floor(Math.random() * 1000) + 10 : 0;
    
    events.push({
      userId: `u${Math.floor(Math.random() * 50) + 1}`,
      platform,
      action,
      amount,
      timestamp: now - Math.floor(Math.random() * 3600) // events within last hour
    });
  }
  return events;
};

const seed = async () => {
  try {
    const events = generateEvents(200);
    console.log(`Seeding ${events.length} events...`);
    const response = await axios.post(API_URL, events);
    console.log('Seed response:', response.data);
    console.log('Seeding completed successfully.');
  } catch (error) {
    console.error('Seeding failed:', error.message);
    console.log('Make sure the server is running on port 5000 before seeding.');
  }
};

seed();
