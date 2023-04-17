const { Event } = require("../models");

module.exports = {
  index: async (req, res) => {
    try {
      const events = await Event.findAll();
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  show: async (req, res) => {
    try {
      const event = await Event.findByPk(req.params.id);
      res.status(200).json(event);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
