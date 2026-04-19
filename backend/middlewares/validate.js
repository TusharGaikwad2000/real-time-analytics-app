const Joi = require('joi');

const eventSchema = Joi.object({
  userId: Joi.string().required(),
  platform: Joi.string().required(),
  action: Joi.string().valid('view', 'click', 'add_to_cart', 'purchase').required(),
  amount: Joi.number().min(0).default(0),
  timestamp: Joi.number().integer().required()
});

const bulkEventSchema = Joi.array().items(eventSchema).min(1).required();

const validateEvent = (req, res, next) => {
  const { error } = eventSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validateBulkEvents = (req, res, next) => {
  const { error } = bulkEventSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = {
  validateEvent,
  validateBulkEvents
};
