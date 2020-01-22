import { Op } from 'sequelize';
import * as Yup from 'yup';
import User from '../models/User';
import Gyms from '../models/Gyms';

class UserController {
  async index(req, res) {
    const { page = 1, q } = req.query;
    const users = await User.findAll(
      q
        ? {
            where: { name: { [Op.like]: `%${q}%` } },
            limit: 15,
            offset: (page - 1) * 15
          }
        : { limit: 15, offset: (page - 1) * 15 }
    );
    return res.json(users);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string()
        .min(3)
        .required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .min(6)
        .required(),
      gym_id: Yup.number()
        .integer()
        .required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails!!' });
    }
    const gymExists = await Gyms.findByPk(req.body.gym_id);

    if (!gymExists) {
      return res.status(401).json({ error: 'This Gym does not exists!' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });
    if (userExists)
      return res.status(400).json({ error: 'User Already exists' });

    const { id, name, email } = await User.create(req.body);

    return res.json({
      id,
      name,
      email
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().min(3),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      )
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails!!' });
    }
    const { email, oldPassword } = req.body;
    if (!email) {
      return res.status(401).json({ error: 'Emails field its necessary' });
    }
    const user = await User.findByPk(req.userId);

    if (email !== user.email) {
      const userExists = await User.findOne({
        where: { email }
      });
      if (userExists)
        return res.status(400).json({ error: 'User Already exists' });
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }
    const { id, name } = await user.update(req.body);
    return res.json({ id, name, email });
  }
}

export default new UserController();
