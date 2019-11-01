import Plans from '../models/Plans';
import * as Yup from 'yup';

class PlanController {
  async index(req, res){
    const plans = await Plans.findAll()
    return res.json(plans)
  }
  async store(req, res){
    const schema = Yup.object().shape({
        title: Yup.string().required(),
        duration: Yup.number()
          .integer()
          .required(),
        price: Yup.number().required()
    });
    if(!(await schema.isValid(req.body))){
      return res.status(400).json({error: 'Valdiations fails'})
    }
    const planExists = await Plans.findOne({ where: { title: req.body.title } });

    if(planExists){
      return res.status(400).json({error: 'Plan Already exists!'})
    }
    const {id,  title, duration, price } = await Plans.create(req.body)
    return res.json({
      id,
      title,
      duration,
      price
    })
  }

  async update(req, res){
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number().integer(),
      price: Yup.number()
    });
    if(!(await schema.isValid(req.body))){
      return res.status(400).json({error: 'Valdiations fails'})
    }
    const { plan_id } = req.params

    const plan = await Plans.findByPk(plan_id)

    if(!plan){
      return res.status(400).json({error: 'This Plan does not exists!'})
    }
    const { id,  title, duration, price } = await plan.update(req.body)
    return res.json({
      id,
      title,
      duration,
      price
    })
  }
  async delete(req, res){
    const { plan_id } = req.params

    const plan = await Plans.findByPk(plan_id)

    if(!plan){
      return res.status(400).json({error: 'This Plan does not exists!'})
    }
    try {
      await plan.destroy({ where: { id: plan_id } })
      return res.json()
    } catch (error) {
      return res.status(401).json({error})
    }
  }
}

export default new PlanController();
