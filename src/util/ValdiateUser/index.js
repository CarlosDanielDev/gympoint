export default function ValidateUser(model, req, res) {
  const { gym_id } = req;
  if (model.gym_id !== gym_id) {
    return res.status(401).json({ error: 'Tou cannot update this' });
  }
}
