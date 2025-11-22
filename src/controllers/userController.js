class UserController {
  constructor(userService) {
    this.service = userService;
  }
  // Récupérer le profile user
  getProfile = async (req, res) => {
    try {
      const user = await this.service.getById(req.user.id);
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  // Inscription utilisateur
  signup = async (req, res) => {
    try {
      const user = await this.service.create(req.body);
      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  //Connexion utilisateur
  login = async (req, res) => {
    try {
      const { token, user } = await this.service.login(req.body);
      res.json({ token, user });
    } catch (err) {
      res.status(401).json({ message: err.message });
    }
  };
  // Modification du profil user
  updateProfile = async (req, res) => {
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
      res.status(400).json({ message: err.message });
    }
  };
  verifyToken = async (req, res) => {
    res.sendStatus(200);
  };
}
export default UserController;
