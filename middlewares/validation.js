
const { Joi, celebrate } = require('celebrate');
const validator = require('validator');

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
}

module.exports.validate =
  celebrate({
    body: Joi.object().keys({
      weather: Joi.string().valid('hot','warm','cold').required(),
      name: Joi.string().required().min(2).max(30).messages({
        "string.min": 'The minimum length of the "name" field is 2',
        "string.max": 'The maximum length of the "name" field is 30',
        "string.empty": 'The "name" field must be filled in',
      }),
      imageUrl: Joi.string().required().custom(validateURL).messages({
        "string.empty": 'The "imageUrl" field must be filled in',
        "string.uri": 'the "imageUrl" field must be a valid url',
      }),
    }),
    params: Joi.object().keys({
      _id: Joi.string().alphanum().length(24).messages({
        'string.alphanum': 'Id must only contain letters and numbers.',
        "string.max": 'The maximum length of the "id" field is 24',
        "string.empty": 'The "id" field must be filled in',
      }),
      itemId: Joi.string().alphanum().length(24).messages({
        'string.alphanum': 'itemId must only contain letters and numbers.',
        "string.max": 'The maximum length of the "itemId" field is 24',
        "string.empty": 'The "itemId" field must be filled in',
      })
    }),
  });
