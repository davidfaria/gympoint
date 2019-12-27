import { Op } from 'sequelize';
import { addMonths, parseISO } from 'date-fns';
import Queue from '../../lib/Queue';
import EnrollmentMail from '../jobs/EnrollmentMail';

import Enrollment from '../models/Enrollment';
import Plan from '../models/Plan';
import Student from '../models/Student';

class EnrollmentController {
  async index(req, res) {
    const term = req.query.term || '';
    const page = parseInt(req.query.page || 1, 10);
    const perPage = parseInt(req.query.perPage || 5, 10);
    const enrollments = await Enrollment.findAndCountAll({
      order: ['id'],
      where: {
        [Op.or]: [
          {
            '$student.name$': {
              [Op.iLike]: `%${term}%`,
            },
          },
          {
            '$plan.title$': {
              [Op.iLike]: `%${term}%`,
            },
          },
        ],
      },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'duration', 'price', 'total'],
        },
      ],
      limit: perPage,
      offset: (page - 1) * perPage,
    });

    // return res.json(enrollments);

    const totalPage = Math.ceil(enrollments.count / perPage);

    return res.json({
      page,
      perPage,
      data: enrollments.rows,
      total: enrollments.count,
      totalPage,
    });
  }

  async show(req, res) {
    const { id } = req.params;
    // const enrollment = await Enrollment.findByPk(id);

    const enrollment = await Enrollment.findOne({
      where: {
        id,
      },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'duration', 'price', 'total'],
        },
      ],
    });

    if (!enrollment)
      return res.status(404).json({ error: 'Enrollment Not Found' });

    return res.json(enrollment);
  }

  async store(req, res) {
    const plan = await Plan.findByPk(req.body.plan_id);

    if (!plan) return res.status(400).json({ error: 'Plan not found' });

    const end_date = addMonths(parseISO(req.body.start_date), plan.duration);

    const enrollmentCreated = await Enrollment.create({
      ...req.body,
      end_date,
      price: plan.total,
    });

    const enrollment = await enrollmentCreated.reload({
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'duration', 'price', 'total'],
        },
      ],
    });

    /**
     *  Send email with details of enrollment
     */

    await Queue.add(EnrollmentMail.key, { enrollment });

    return res.status(201).json(enrollment);
  }

  async update(req, res) {
    const enrollment = await Enrollment.findByPk(req.params.id);
    if (!enrollment)
      return res.status(400).json({ error: 'Enrollment not found' });

    const plan = await Plan.findByPk(req.body.plan_id);
    if (!plan) return res.status(400).json({ error: 'Plan not found' });

    const end_date = addMonths(parseISO(req.body.start_date), plan.duration);

    await enrollment.update({ ...req.body, end_date, price: plan.total });

    return res.json(enrollment);
  }

  async delete(req, res) {
    const enrollment = await Enrollment.findByPk(req.params.id);

    if (!enrollment)
      return res.status(400).json({ error: 'Enrollment not found' });

    await enrollment.destroy();
    return res.status(204).send();
  }
}

export default new EnrollmentController();
