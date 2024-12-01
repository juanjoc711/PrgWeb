const checkRole = (role) => {
    return (req, res, next) => {
        if (req.user && req.user.role === role) {
            next(); // Permite continuar si el usuario tiene el rol adecuado
        } else {
            res.status(403).send('Acceso denegado. No tienes los permisos necesarios.');
        }
    };
};

module.exports = checkRole;
