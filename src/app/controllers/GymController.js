import { Op } from 'sequelize';
import * as Yup from 'yup';
import Gyms from '../models/Gyms';
import User from '../models/User';

class GymController {
  async index(req, res) {
    const { page = 1, q } = req.query;

    const gyms = await Gyms.findAll(
      q
        ? {
            where: { name: { [Op.like]: `%${q}%` } },
            limit: 15,
            offset: (page - 1) * 15
          }
        : { limit: 15, offset: (page - 1) * 15 }
    );

    return res.json(gyms);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string()
        .min(3)
        .required(),
      cnpj: Yup.string()
        .min(18)
        .max(18)
        .required(),
      coords: Yup.array()
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails!!' });
    }
    const { name, cnpj } = req.body;

    const gymExists = await Gyms.findOne({
      where: {
        [Op.or]: [{ name }, { cnpj }]
      }
    });

    if (gymExists) {
      return res.status(401).json({ error: 'This Gym already exists!' });
    }

    const gym = await Gyms.create(req.body);

    return res.json(gym);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().min(3),
      cnpj: Yup.string()
        .min(18)
        .max(18)
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation Fails!' });
    }
    const { gym_id } = await User.findByPk(req.userId, {
      attributes: ['gym_id']
    });
    const { name, cnpj } = req.body;

    const queryCnpj = cnpj ? { cnpj } : '';

    const queryName = name ? { name } : '';

    const gymExists = await Gyms.findOne({
      where: { [Op.or]: [queryCnpj, queryName] }
    });

    if (gymExists) {
      return res
        .status(401)
        .json({ error: 'This name, CNPJ or Coords already exists!' });
    }

    const gym = await Gyms.findByPk(gym_id);

    const update = await gym.update(req.body);

    return res.json(update);
  }

  async delete(req, res) {
    const { gym_id } = req;

    await Gyms.destroy(gym_id);

    return res.json();
  }
}
export default new GymController();
