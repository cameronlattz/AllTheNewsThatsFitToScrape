const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const FeedsSchema = new Schema({
  url: {
    type: String,
    trim: true,
    required: "Url is required"
  },
  site: {
    type: String,
    trim: true,
    required: "Site is required"
  }
});

const Feeds = mongoose.model("Feeds", FeedsSchema);

module.exports = Feeds;