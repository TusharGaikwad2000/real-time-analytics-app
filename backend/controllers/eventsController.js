const { Event } = require('../models');
const aggregationService = require('../services/aggregationService');
const cacheService = require('../services/cacheService');

const ingestEvent = async (req, res) => {
  try {
    const eventData = req.body;
    
    // Save raw event
    await Event.create(eventData);
    
    // Trigger aggregated updates (async in real world, sync here for reliability check)
    await aggregationService.processEvent(eventData);
    
    // Invalidate cache for this platform
    cacheService.invalidate(eventData.platform);
    
    res.status(201).json({ message: 'Event ingested successfully' });
  } catch (error) {
    console.error('Ingestion Error:', error);
    res.status(500).json({ error: 'Failed to ingest event' });
  }
};

const ingestBulkEvents = async (req, res) => {
  try {
    const events = req.body;
    
    // Save raw events
    await Event.bulkCreate(events);
    
    // Trigger aggregated updates
    await aggregationService.processBulkEvents(events);
    
    // Invalidate caches
    const platforms = [...new Set(events.map(e => e.platform))];
    platforms.forEach(p => cacheService.invalidate(p));
    
    res.status(201).json({ message: `${events.length} events ingested successfully` });
  } catch (error) {
    console.error('Bulk Ingestion Error:', error);
    res.status(500).json({ error: 'Failed to ingest bulk events' });
  }
};

module.exports = {
  ingestEvent,
  ingestBulkEvents
};
