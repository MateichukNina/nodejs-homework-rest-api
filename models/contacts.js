

const mongoose = require("mongoose");
const {Schema} = mongoose;

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: String,
  phone: String,
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Contact = mongoose.model("Contact", contactSchema);
const ObjectId = mongoose.Types.ObjectId;



module.exports = {

  Contact,
  ObjectId
};
