import { Op } from 'sequelize';
import * as Yup from 'yup';
import Students from '../models/Students';
// import Gyms from '../models/Gyms';

class StudentController {
  async index(req, res) {
    const { page = 1, q } = req.query;

    const query = q ? { name: { [Op.like]: `%${q}%` } } : {};
    const { gym_id } = req;
    const students = await Students.findAll({
      where: { ...query, gym_id },
      attributes: [
        'id',
        'name',
        'age',
        'email',
        'gym_id',
        'createdAt',
        'updatedAt'
      ],

      limit: 5,
      offset: (page - 1) * 5
    });

    return res.json(students);
  }

  async show(req, res) {
    const { student_id } = req.params;

    if (!student_id) {
      return res.status(401).json({ error: 'You need to provide student_id' });
    }
    const student = await Students.findByPk(student_id);

    if (!student) {
      return res.status(401).json({ error: 'This Student DOes not exists ' });
    }

    return res.json(student);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string()
        .min(3)
        .required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number()
        .min(1)
        .required(),
      weight: Yup.number()
        .min(1)
        .required(),
      height: Yup.string()
        .min(1)
        .required(),
      password: Yup.string()
        .min(3)
        .required()
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email } = req.body;
    const checkStudentExists = await Students.findOne({ where: { email } });

    if (checkStudentExists) {
      return res.status(400).json({ error: 'Student Already exists' });
    }
    const { gym_id } = req;

    const student = await Students.create({ ...req.body, gym_id });

    return res.json(student);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email()
    });
    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Validation fails, email is required!' });
    }
    const { email } = req.body;
    const { id } = req.params;
    const student = await Students.findByPk(id);
    if (!student) {
      return res.status(401).json({ error: 'Student ID does not exists!' });
    }

    if (email) {
      if (email === student.email) {
        const studentExists = await Students.findOne({
          where: { email, id: { $not: id } }
        });
        if (studentExists) {
          return res.status(401).json({ error: 'Student Already exists!' });
        }
      }
    }

    if (student.gym_id !== req.gym_id) {
      return res.status(401).json({ error: 'You cannot update this Student!' });
    }

    const { name, age, weight, height } = await student.update(req.body);
    return res.json({
      name,
      email,
      age,
      weight,
      height
    });
  }

  async delete(req, res) {
    const { student_id } = req.params;

    const student = await Students.findOne({
      where: { id: student_id, gym_id: req.gym_id }
    });

    if (!student) {
      return res.status(401).json({ error: 'You Cannot Delete this Student!' });
    }
    await student.destroy();

    return res.json();
  }
}

export default new StudentController();
