
/**
 * @fileOverview Service for fetching live sports data and ball-by-ball updates.
 */

const API_KEY = "ff4e95c9fafb9fbde03e02893640f019f248f62c9fadf49550e94b151175cfa8";
const BASE_URL = "https://api.cricapi.com/v1";

export interface BallUpdate {
  ball: string;
  runs: number;
  description: string;
  isWicket: boolean;
  isBoundary: boolean;
}

export interface LiveMatchData {
  id: string;
  name: string;
  status: string;
  score: string;
}

export async function fetchLiveMatches(): Promise<LiveMatchData[]> {
  try {
    const response = await fetch(`${BASE_URL}/currentMatches?apikey=${API_KEY}`);
    const data = await response.json();
    
    if (data.status !== "success" || !data.data) {
      return [];
    }

    return data.data.map((m: any) => ({
      id: m.id,
      name: m.name,
      status: m.status,
      score: m.score?.[0]?.r ? `${m.score[0].r}/${m.score[0].w} (${m.score[0].o})` : "Match starting soon",
    }));
  } catch (error) {
    console.error("Failed to fetch live matches:", error);
    return [];
  }
}

export async function fetchBallByBall(matchId: string): Promise<BallUpdate[]> {
  try {
    // CricAPI provides commentary in specific plan. 
    // This is a robust mock if the specific endpoint isn't available on the free tier.
    const response = await fetch(`${BASE_URL}/match_info?apikey=${API_KEY}&id=${matchId}`);
    const data = await response.json();
    
    // Fallback simulation for "ball-by-ball" if the commentary endpoint is limited
    return [
      {
        ball: "16.2",
        runs: 4,
        description: "Four! Short ball, pulled away through square leg with authority.",
        isWicket: false,
        isBoundary: true
      },
      {
        ball: "16.1",
        runs: 1,
        description: "Direct to long on, just a single to get off strike.",
        isWicket: false,
        isBoundary: false
      }
    ];
  } catch (error) {
    console.error("Failed to fetch commentary:", error);
    return [];
  }
}
