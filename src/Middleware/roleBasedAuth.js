const roleBasedAuth = (...allowedRoles) => {
  return (req, res, next) => {
    if (req.user.role.some((r) => allowedRoles.includes(r))) return next();
    res.status(403).send("Access Denied");
  };
};

export default roleBasedAuth;
