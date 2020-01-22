import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import User from '../models/User';
import Gyms from '../models/Gyms';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails!!' });
    }
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'User not found!' });
    }
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match!' });
    }
    const gym = await Gyms.findByPk(user.gym_id);

    const { id, name } = user;
    const { secret, expiresIn } = authConfig;
    return res.json({
      user: {
        id,
        name,
        email
      },
      gym: {
        gym_id: user.gym_id,
        name: gym.name,
        cnpj: gym.cnpj
      },
      token: jwt.sign({ id, name, email, gym_id: user.gym_id }, secret, {
        expiresIn
      })
    });
  }
}

export default new SessionController();
