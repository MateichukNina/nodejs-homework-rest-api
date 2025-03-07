const Joi = require("joi");
const { Contact, ObjectId } = require("../models/contacts");

const { ctrlWrapper } = require("../helpers");

const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

const getAll = async (req, res) => {
  const {_id : owner} = req.user;
  const {page = 1, limit = 10, } = req.query;
  const skip = (page - 1)*limit;


  const contacts = await Contact.find( {owner}, '-createdAt -updatedAt', {skip, limit}).populate("owner", "email");
  res.status(200).json(contacts);
};

const getById = async (req, res, next) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Contact not found" });
  }
  const contact = await Contact.findById(id);

  if (contact.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "You are not the owner of this contact" });
  };

  res.status(200).json(contact);
};

const add = async (req, res) => {
  const { name, email, phone } = req.body;
  const {_id: owner} = req.user;

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const newContact = await Contact.create({ ...req.body, owner});

  if (!name || !email || !phone) {
    return res.status(400).json({ message: "missing required name field" });
  }

  const addedContact = await newContact.save();

  res.status(201).json(addedContact);
};

const remove = async (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Contact not found" });
  }

  const removedContact = await Contact.findByIdAndDelete(id);

  if (removedContact.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "You are not the owner of this contact" });
  }

  if (removedContact) {
    return res.status(200).json({ message: "Contact deleted" });
  } else {
    return res.status(500).json({ message: "Contact could not be deleted" });
  }
};

const update = async (req, res, next) => {
  const id = req.params.id;
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ message: "missing required name field" });
  }

  if (!ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Contact not found" });
  }

  const updatedContact = await Contact.findByIdAndUpdate(id, {
    name,
    email,
    phone,
  }, {new: true});

  if (updatedContact.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "You are not the owner of this contact" });
  }

  if (updatedContact) {
    res.status(200).json(updatedContact);
  } else {
    res.status(500).json({ message: "Update failed" });
  }
};

const updateStatus = async (req, res) => {
  const id = req.params.id;
 

  if (!ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Contact not found" });
  }

  const updateStatusContact = await Contact.findByIdAndUpdate(id, req.body, {new: true});

  if (updateStatusContact) {
    res.status(200).json(updateStatusContact);
  } else {
    return res.status(400).json({ message: "Contact not found" });
  }
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add,
  remove,
  update,
  updateStatus,
};
