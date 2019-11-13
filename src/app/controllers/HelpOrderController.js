import * as Yup from 'yup';
import HelpOrders from '../models/HelpOrders';
import Students from '../models/Students';
import Enrollments from '../models/Enrollments';
import Queue from '../../lib/Queue';
import AnswerMail from '../jobs/AnswerMail';

class HelpOrderController {
  async index(req, res) {
    const helpOrdersWithoutAnswers = await HelpOrders.findAll({
      where: { answer: null },
      include: [{ model: Students, attributes: ['name', 'email'] }]
    });
    return res.json(helpOrdersWithoutAnswers);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string()
        .min(3)
        .required()
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails!' });
    }
    const { student_id } = req.params;

    const student = await Students.findByPk(student_id);

    if (!student) {
      return res.stats(401).json({ error: 'This student does not exists!' });
    }
    const enrollment = await Enrollments.findOne({ where: { student_id } });

    if (!enrollment) {
      return res.status(401).json({ error: 'This student, is not enrolled!' });
    }

    req.body.student_id = student_id;

    const { id, question } = await HelpOrders.create(req.body);
    return res.json({ id, question });
  }

  async show(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string()
        .min(3)
        .required()
    });
    if (!schema.isValid(req.body)) {
      return res.status(401).json({ error: 'Valdiation fails!' });
    }
    const { student_id } = req.params;
    const student = await Students.findByPk(student_id);
    if (!student) {
      return res.status(401).json({ error: 'This student does not exists!' });
    }

    const enrollment = await Enrollments.findOne({ where: { student_id } });
    if (!enrollment) {
      return res.status(401).json({ error: 'this student is no enrolled!' });
    }
    const help_orders = await HelpOrders.findAll({ where: { student_id } });

    return res.json(help_orders);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string()
        .min(3)
        .required()
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails!' });
    }
    const { help_order_id } = req.params;
    const help_order = await HelpOrders.findByPk(help_order_id);
    const { Student, createdAt } = await HelpOrders.findOne({
      where: { id: help_order_id },
      include: [{ model: Students, attributes: ['name', 'email'] }]
    });

    if (!help_order) {
      return res
        .status(401)
        .json({ error: 'This Help Order does not exists!' });
    }

    const student = Student;
    const { question, answer, answer_at } = await help_order.update(req.body);

    await Queue.add(AnswerMail.key, {
      student,
      question,
      created_at: createdAt,
      answer,
      answer_at
    });

    return res.json({ student, question, createdAt, answer, answer_at });
  }
}

export default new HelpOrderController();
