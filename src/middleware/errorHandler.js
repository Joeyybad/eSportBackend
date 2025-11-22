export function errorHandler(err, req, res, next) {
  console.error("ERREUR:", err);

  return res.status(err.status || 500).json({
    success: false,
    message: err.message || "Erreur serveur interne",
  });
}
