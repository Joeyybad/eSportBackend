class UserController {
  constructor(userService) {
    this.service = userService;
  }
  // Récupérer le profile user
  getProfile = async (req, res, next) => {
    try {
      const user = await this.service.getById(req.user.id);
      res.json(user);
    } catch (err) {
      next(err);
    }
  };
  // Inscription utilisateur
  signup = async (req, res, next) => {
    try {
      const user = await this.service.create(req.body);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  };
  //Connexion utilisateur
  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const data = await this.service.login(email, password);

      res.json(data);
    } catch (err) {
      next(err);
    }
  };
  // Modification du profil user
  updateProfile = async (req, res, next) => {
    try {
      // transformer les champs Array qui ont été envoyé en json
      const data = {
        ...req.body,
        favoritesGames: JSON.parse(req.body.favoritesGames || "[]"),
        favoritesTeams: JSON.parse(req.body.favoritesTeams || "[]"),
      };

      const updatedUser = await this.service.updateProfile(
        req.user.id,
        data,
        req.file
      );

      res.json({ user: updatedUser });
    } catch (err) {
      next(err);
    }
  };
  verifyToken = async (req, res, next) => {
    res.sendStatus(200);
  };
}
export default UserController;
