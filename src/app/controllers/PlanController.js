import * as Yup from 'yup';
import Plans from '../models/Plans';

class PlanController {
  async index(req, res) {
    const { gym_id } = req;

    const plans = await Plans.findAll({ where: { gym_id } });
    return res.json(plans);
  }

  async show(req, res) {
    const { gym_id } = req;

    const plan = await Plans.findOne({
      where: { id: req.params.plan_id, gym_id }
    });

    return res.json(plan);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required('O Titulo é Obrigatório!'),
      duration: Yup.number()
        .integer('A duração deve ser um numero inteiro!')
        .required('A duração é Obrigatória!'),
      price: Yup.number().required('O Preço é Obrigatório!')
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Valdiations fails' });
    }
    const { gym_id } = req;

    const planExists = await Plans.findOne({
      where: { title: req.body.title }
    });

    if (planExists) {
      return res.status(400).json({ error: 'Plan Already exists!' });
    }

    const { id, title, duration, price } = await Plans.create({
      ...req.body,
      gym_id
    });

    return res.json({
      id,
      title,
      duration,
      price,
      gym_id
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(
        'é necessário quie o tipo de dado informado seja uma STRING'
      ),
      duration: Yup.number().integer(),
      price: Yup.number()
    });
    const schemaValidation = await schema.validate(req.body);
    if (!schemaValidation) {
      return res.status(400).json({ error: schemaValidation });
    }
    const { plan_id } = req.params;

    const plan = await Plans.findByPk(plan_id);

    if (!plan) {
      return res.status(400).json({ error: 'This Plan does not exists!' });
    }

    const { gym_id } = req;
    if (plan.gym_id !== gym_id) {
      return res.status(401).json({ error: 'You cannot update this Plan!' });
    }

    const { id, title, duration, price } = await plan.update(req.body);
    return res.json({
      id,
      title,
      duration,
      price
    });
  }

  async delete(req, res) {
    const { plan_id } = req.params;

    const plan = await Plans.findByPk(plan_id);

    if (plan.gym_id !== req.gym_id) {
      return res.status(401).json({ error: 'You cannot delete this plan' });
    }

    if (!plan) {
      return res.status(400).json({ error: 'This Plan does not exists!' });
    }
    try {
      await plan.destroy({ where: { id: plan_id } });
      return res.json();
    } catch (error) {
      return res.status(401).json({ error });
    }
  }
}

export default new PlanController();
