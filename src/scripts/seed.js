import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  User,
  Team,
  Tournament,
  Match,
  Bet,
  sequelize,
} from "../models/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seed() {
  try {
    console.log(" Début du seeding...");

    const sourceDir = path.join(__dirname, "../../seed-assets");
    const destDir = path.join(__dirname, "../../uploads");

    // Vérifier si le dossier source existe
    if (fs.existsSync(sourceDir)) {
      // Créer le dossier uploads s'il n'existe pas
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }

      // Lire les fichiers et les copier
      const files = fs.readdirSync(sourceDir);
      files.forEach((file) => {
        const srcFile = path.join(sourceDir, file);
        const destFile = path.join(destDir, file);

        // Copie le fichier
        fs.copyFileSync(srcFile, destFile);
      });
      console.log(
        ` ${files.length} images copiées de seed-assets vers uploads.`
      );
    } else {
      console.warn(
        " Dossier 'seed-assets' introuvable. Les images ne seront pas copiées."
      );
    }

    // 1. Reset de la base de données
    // CORRECTION ICI : On utilise directement 'sequelize' importé, et non 'db.sequelize'
    await sequelize.sync({ force: true });
    console.log(" Base de données remise à zéro.");

    // --- CRÉATION DES UTILISATEURS ---
    const passwordRaw = "MonMdp123!";

    // Création de l'Admin
    const admin = await User.create({
      username: "Admin",
      email: "admin@test.com",
      password: passwordRaw,
      isAdmin: true,
      birthdate: "1995-01-01",
      isConditionChecked: true,
      avatar: "default-avatar.jpg",
      favoritesGames: ["League of Legends", "Valorant"],
      favoritesTeams: ["Karmine Corp"],
    });

    // Création du Joueur
    const user = await User.create({
      username: "JoueurTest",
      email: "user@test.com",
      password: passwordRaw,
      isAdmin: false,
      birthdate: "2000-05-15",
      isConditionChecked: true,
      avatar: "default-avatar.jpg",
      favoritesGames: ["League of Legends"],
      favoritesTeams: ["Solary"],
      betsTotal: 0,
      betsWon: 0,
    });

    console.log(`Utilisateurs créés avec le mot de passe : ${passwordRaw}`);

    // --- CRÉATION DES ÉQUIPES ---
    const teamsData = [
      {
        teamName: "Karmine Corp",
        game: "League of Legends",
        logo: "KarmineCorp.svg.png",
        description: "Le Blue Wall.",
      },
      {
        teamName: "Fnatic",
        game: "League of Legends",
        logo: "Fnatic.svg.png",
        description: "Une équipe légendaire.",
      },
      {
        teamName: "Team Vitality",
        game: "League of Legends",
        logo: "TeamVitality.svg",
        description: "Les abeilles.",
      },
      {
        teamName: "Solary",
        game: "League of Legends",
        logo: "Solary.png",
        description: "La team d'amis.",
      },
    ];

    const teams = await Team.bulkCreate(teamsData);
    console.log("Équipes créées (KC, Fnatic, Vitality, Solary)");

    // --- CRÉATION D'UN TOURNOI ---
    const tournament = await Tournament.create({
      name: "LEC Summer Split 2025",
      game: "League of Legends",
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 60)),
      status: "live",
      description: "Le championnat européen majeur.",
    });
    console.log("Tournoi créé : LEC Summer Split");

    // --- CRÉATION DES MATCHS ---
    // Match 1 : KC vs Solary (À venir - Demain)
    const matchUpcoming = await Match.create({
      date: new Date(new Date().setDate(new Date().getDate() + 1)),
      status: "scheduled",
      format: "BO1",
      homeTeamId: teams[0].id, // Karmine Corp
      awayTeamId: teams[3].id, // Solary
      tournamentId: tournament.id,
      oddsHome: 1.45,
      oddsAway: 2.6,
      oddsDraw: 0,
    });

    // Match 2 : Fnatic vs Vitality (Terminé - Hier)
    const matchCompleted = await Match.create({
      date: new Date(new Date().setDate(new Date().getDate() - 1)),
      status: "completed",
      format: "BO1",
      homeTeamId: teams[1].id, // Fnatic
      awayTeamId: teams[2].id, // Vitality
      tournamentId: tournament.id,
      oddsHome: 1.8,
      oddsAway: 1.95,
      oddsDraw: 0,
      homeScore: 1,
      awayScore: 0,
      winnerId: teams[1].id, // Fnatic a gagné
    });
    console.log(" Matchs créés");

    // --- CRÉATION D'UN PARI ---
    await Bet.create({
      userId: user.id,
      matchId: matchCompleted.id,
      amount: 20,
      prediction: "away",
      odds: 1.95,
      potentialGain: 39,
      status: "lost",
      result: "loss",
    });

    await user.update({
      betsTotal: 1,
      betsWon: 0,
      totalEarnings: 0,
    });

    console.log(" Pari historique créé");
    console.log(" SEEDING TERMINÉ AVEC SUCCÈS !");
    process.exit(0);
  } catch (error) {
    console.error(" Erreur lors du seeding :", error);
    process.exit(1);
  }
}

seed();
