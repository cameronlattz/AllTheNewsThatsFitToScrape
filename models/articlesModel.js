const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArticlesSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: "Title is required"
  },
  url: {
    type: String,
    trim: true,
    required: "URL is required"
  },
  summary: {
    type: String,
    trim: true,
    required: "Summary is required"
  },
  site: {
    type: String,
    trim: true,
    required: "Site is required"
  },
  comments: Array
});

const Articles = mongoose.model("Articles", ArticlesSchema);

module.exports = Articles;