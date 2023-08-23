const Joi = require('joi');

const ExportNotesPayloadSchema = Joi.object({
  // specify that the email address being validated must have a valid top-level domain.
  targetEmail: Joi.string().email({ tlds: true }).required(),
});

module.exports = ExportNotesPayloadSchema;
