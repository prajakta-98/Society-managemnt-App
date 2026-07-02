export function getCurrentUser(req, res) {
  // req.user is populated by the authenticate middleware.
  res.json({ user: req.user });
}
