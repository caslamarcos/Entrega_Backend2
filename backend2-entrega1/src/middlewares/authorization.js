export const authorization = (roles = []) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res
          .status(401)
          .send({ status: 'error', error: 'Usuario no autenticado' });
      }

      if (!roles.includes(req.user.role)) {
        return res
          .status(403)
          .send({ status: 'error', error: 'No tenés permisos para esta acción' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(500).send({ status: 'error', error: 'Error en autorización' });
    }
  };
};