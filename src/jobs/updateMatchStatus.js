import { matchService } from "../di.js";

const MATCH_DURATION = 120;

const updateMatchStatuses = async () => {
  try {
    const matches = await matchService.getMatchesToUpdate();

    const now = new Date();

    for (const match of matches) {
      const start = new Date(match.date);
      const end = new Date(start.getTime() + MATCH_DURATION * 60000);

      let status = "scheduled";
      if (now >= start && now <= end) status = "live";
      if (now > end) status = "completed";

      if (status !== match.status) {
        await matchService.updateStatus(match.id, status);
        console.log(`Match ${match.id} mis à jour → ${status}`);
      }
    }
  } catch (err) {
    console.error("Erreur job match:", err);
  }
};

export const startMatchStatusJob = () => {
  setInterval(updateMatchStatuses, 60000);
  console.log("Job match OK");
};
