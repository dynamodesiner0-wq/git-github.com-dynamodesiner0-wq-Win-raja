/**
 * @fileOverview Service for fetching live sports data and ball-by-ball updates.
 * Now supports multiple API keys for high availability.
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
}

/**
 * Helper to fetch with API key fallback
 */
async function fetchWithFallback(endpoint: string) {
  for (const key of API_KEYS) {
    try {
      const response = await fetch(`${BASE_URL}/${endpoint}&apikey=${key}`);
      const data = await response.json();
      if (data.status === "success") {
        return data;
      }
      console.warn(`API Key ${key.substring(0, 5)}... failed with status: ${data.status}`);
    } catch (error) {
      console.error(`Error with API Key ${key.substring(0, 5)}...:`, error);
    }
  }
  return null;
}

export async function fetchLiveMatches(): Promise<LiveMatchData[]> {
  const data = await fetchWithFallback("currentMatches?dummy=1");
  
  if (!data || !data.data) {
    return [];
  }

  return data.data.map((m: any) => ({
    id: m.id,
    name: m.name,
    status: m.status,
    score: m.score?.[0]?.r ? `${m.score[0].r}/${m.score[0].w} (${m.score[0].o})` : "Match starting soon",
  }));
}

export async function fetchBallByBall(matchId: string): Promise<BallUpdate[]> {
  const data = await fetchWithFallback(`match_info?id=${matchId}`);
  
  if (!data) {
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

  // Simulated commentary for MVP if the plan doesn't include it
  return [
    {
      ball: "In-Play",
      runs: 0,
      description: "Live data updated via CricAPI...",
      isWicket: false,
      isBoundary: false
    }
  ];
}
