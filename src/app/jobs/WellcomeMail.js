import pt from 'date-fns/locale/pt';
import { format, parseISO } from 'date-fns';
import Mail from '../../lib/Mail';

class WellcomeMail {
  get key() {
    return 'WellcomeMail';
  }

  async handle({ data }) {
    const { student, plan, hourStart, end_date, price } = data;
    const formatedHourStart = format(
      parseISO(hourStart),
      "'dia' dd 'de' MMMM 'de' yyyy",
      { locale: pt }
    );
    const formatedHourEnd = format(
      parseISO(end_date),
      "'dia' dd 'de' MMMM 'de' yyyy",
      {
        locale: pt
      }
    );
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
  }
}

export default new WellcomeMail();
