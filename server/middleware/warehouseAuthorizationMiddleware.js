const warehouseAuthorizationMiddleware = (req, res, next) => {
  try {
    const { warehouseId } = req.params;
    if (!req.user) {
      return res.status(401).json({ message: "Authentication Required" });
    }
    if (req.user.role === "ADMIN") {
      return next();
    }

    if (["MANAGER", "STAFF"].includes(req.user.role)) {
      if (req.user.warehouseId?.toString() === warehouseId) {
        return next();
      }
    }

    return res.status(403).json({ message: "Access Denied" });
  } catch (error) {
    next(error);
  }
};

module.exports = warehouseAuthorizationMiddleware;
