import * as Yup from 'yup';
import pt, {
  addMonths,
  parseISO,
  isBefore,
  startOfHour,
  format
} from 'date-fns';
import Enrollments from '../models/Enrollments';
import Students from '../models/Students';
import Plans from '../models/Plans';
import Mail from '../../lib/Mail';

class EnrollmentController {
  async index(req, res) {
    const enrollments = await Enrollments.findAll();
    return res.json(enrollments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number()
        .integer()
        .strict()
        .required(),
      plan_id: Yup.number()
        .integer()
        .strict()
        .required(),
      start_date: Yup.date().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails!' });
    }
    const { student_id, plan_id, start_date } = req.body;

    const student = await Students.findByPk(student_id);

    if (!student) {
      return res.status(404).json({ error: 'Student not found!' });
    }
    const plan = await Plans.findByPk(plan_id);

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found!!' });
    }
    const hourStart = startOfHour(parseISO(start_date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permited' });
    }

    const end_date = addMonths(parseISO(start_date), 3);

    const price = plan.price * plan.duration;
    const formatedHourStart = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      { locale: pt }
    );
    const formatedHourEnd = format(end_date, "'dia' dd 'de' MMMM 'de' yyyy", {
      locale: pt
    });
    const enrollment = await Enrollments.create({
      student_id,
      plan_id,
      start_date,
      end_date,
      price
    });
    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Criação de Matricula',
      template: 'wellcome',
      context: {
        student: student.name,
        plan: plan.title,
        start_date: formatedHourStart,
        end_date: formatedHourEnd,
        price
      }
    });
    // console.log(`${student.name} <${student.email}>`);
    return res.json(enrollment);
  }
}

export default new EnrollmentController();
