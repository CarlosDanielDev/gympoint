import pt from 'date-fns/locale';
import { format, parseISO } from 'date-fns';
import Mail from '../../lib/Mail';

class AnswerMail {
  get key() {
    return 'AnswerMail';
  }

  async handle({ data }) {
    const { student, question, created_at, answer, answer_at } = data;
    const formatCreatedAt = format(
      parseISO(created_at),
      "'dia' dd 'de' MMMM', às ' H:mm'h'",
      { locale: pt }
    );
    const formatAnswerAt = format(
      parseISO(answer_at),
      "'dia' dd 'de' MMMM', às ' H:mm'h'",
      { locale: pt }
    );

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Resposta',
      template: 'answer',
      context: {
        student: student.name,
        question,
        created_at: formatCreatedAt,
        answer,
        answer_at: formatAnswerAt
      }
    });
  }
}

export default new AnswerMail();
