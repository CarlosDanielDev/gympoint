import { subDays, startOfDay, endOfDay, getHours, isAfter } from 'date-fns';
import Checkin from '../schemas/Checkin';
import Students from '../models/Students';
import Enrollment from '../models/Enrollments';

class CheckinController {
  async index(req, res) {
    const { student_id } = req.params;
    const checkin = await Checkin.find({
      student_id
    });
    if (!checkin) {
      return res.status(401).json({ error: 'This student has no one checkin' });
    }
    return res.json(checkin);
  }

  async store(req, res) {
    const { student_id } = req.params;
    // check if Student exists
    const student = await Students.findByPk(student_id);
    if (!student) {
      return res.status(400).json({ error: 'This Student does not exists' });
    }
    // check is student is enrolled
    const enrollment = await Enrollment.findOne({ where: { student_id } });

    if (!enrollment) {
      return res.status(401).json({ error: 'This student is not enrolled' });
    }
    // between enrollment ?
    if (isAfter(new Date(), enrollment.end_date)) {
      return res.status(401).json({ error: 'This enrollment is expired!' });
    }
    // get current day
    const current_day = startOfDay(new Date());

    // get last 7 days
    const last7days = subDays(current_day, 7);

    // counting checking in 7 days
    const countCheckins = await Checkin.find({ student_id })
      .gte('createdAt', startOfDay(last7days))
      .lte('createdAt', endOfDay(current_day))
      .countDocuments();

    // applying role
    if (countCheckins > 5) {
      return res
        .status(400)
        .json({ error: 'You can only do 5 checkins in 7 days' });
    }

    // get last checkin
    const [lastCheckin] = await Checkin.find({ student_id }).sort({
      updatedAt: 'desc'
    });
    if (lastCheckin) {
      // extract hour from the alst checkin
      const { createdAt } = lastCheckin;

      // add 3 hours
      const hourPermited = getHours(createdAt) + 12;

      // get current hour
      const currentHour = getHours(new Date());

      // hours waiting to do a new Checkin
      const hoursWait = hourPermited - currentHour;

      // applying role
      if (hourPermited > currentHour) {
        return res
          .status(401)
          .json({ error: `You've to wait ${hoursWait} hours to next checkin` });
      }
    }
    // end :)
    const checkin = await Checkin.create({
      student_id
    });

    return res.json(checkin);
  }
}

export default new CheckinController();
