import { Router } from 'express';
import { Joi, celebrate, Segments } from 'celebrate';
import { searchUser } from './controllers/search';

const router = Router();

const queryValidation = celebrate({
  [Segments.QUERY]: Joi.object().keys({
    username: Joi.string().required(),
    language: Joi.string().required(),
  }),
});

// Search route
router.get('/search', queryValidation, searchUser);

export default router;
