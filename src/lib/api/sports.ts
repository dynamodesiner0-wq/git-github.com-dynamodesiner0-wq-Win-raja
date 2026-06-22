/**
 * @fileOverview Service for fetching live sports data and ball-by-ball updates.
 * Supports multiple API keys for high availability.
 */

const API_KEYS = [
  "ff4e95c9fafb9fbde03e02893640f019f248f62c9fadf49550e94b151175cfa8",
  "41dfbcf5f7b7905848ab1a1cf7130ced"
];
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
  homeTeam: string;
  awayTeam: string;
}

/**
 * Helper to fetch with API key fallback
 */
async function fetchWithFallback(endpoint: string) {
  for (const key of API_KEYS) {
    try {
      const response = await fetch(`${BASE_URL}/${endpoint}&apikey=${key}`);
      const data = await response.json();
      if (data.status === "success" || data.data) {
        return data;
      }
      console.warn(`API Key ${key.substring(0, 5)}... fallback triggered: ${data.reason || 'Unknown error'}`);
    } catch (error) {
      console.error(`Network error with API Key:`, error);
    }
  }
  return null;
}

export async function fetchLiveMatches(): Promise<LiveMatchData[]> {
  const data = await fetchWithFallback("currentMatches?offset=0");
  
  if (!data || !data.data) {
    return [];
  }

  return data.data.map((m: any) => {
    const teams = m.name.split(' v ');
    return {
      id: m.id,
      name: m.name,
      status: m.status,
      score: m.score?.[0]?.r ? `${m.score[0].r}/${m.score[0].w} (${m.score[0].o} ov)` : "No score available",
      homeTeam: teams[0] || "Home Team",
      awayTeam: teams[1] || "Away Team"
    };
  });
}

export async function fetchBallByBall(matchId: string): Promise<BallUpdate[]> {
  // Mocking detailed commentary since it requires a premium API plan on most platforms
  // but using the structure expected by the UI.
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
}
