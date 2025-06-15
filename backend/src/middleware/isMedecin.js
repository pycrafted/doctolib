
const isMedecin = (req, res, next) => {
  if (req.user.role !== 'Médecin') {
    console.error('Accès interdit : utilisateur non médecin', req.user.role);
    return res.status(403).json({ message: 'Accès réservé aux médecins' });
  }
  next();
};

module.exports = isMedecin;