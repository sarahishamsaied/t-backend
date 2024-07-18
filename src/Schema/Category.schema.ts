import Joi from 'joi';

export const categorySchema = Joi.object({
  name: Joi.string().required().min(1).max(255),
  userId: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/),
  isDeleted: Joi.boolean().optional().default(false),
  deletedAt: Joi.date().optional().allow(null),
  createdAt: Joi.date()
    .optional()
    .default(() => new Date()),
});
