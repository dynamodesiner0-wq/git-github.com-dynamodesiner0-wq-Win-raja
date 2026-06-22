/**
 * @fileOverview Service for fetching live sports data and ball-by-ball updates.
 * Supports multiple API keys for high availability and realistic simulation fallback.
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
  sport: string;
}

const MOCK_MATCHES: LiveMatchData[] = [
  {
    id: "mock-1",
    name: "England vs New Zealand",
    status: "England Need 281 Runs To Win",
    score: "142/3 (18.4 ov)",
    homeTeam: "England",
    awayTeam: "New Zealand",
    sport: "CRICKET"
  },
  {
    id: "mock-2",
    name: "India vs Australia",
    status: "India won the toss and elected to bat",
    score: "210/4 (32.1 ov)",
    homeTeam: "India",
    awayTeam: "Australia",
    sport: "CRICKET"
  },
  {
    id: "mock-3",
    name: "Pakistan vs South Africa",
    status: "In Play - 2nd Innings",
    score: "98/2 (12.0 ov)",
    homeTeam: "Pakistan",
    awayTeam: "South Africa",
    sport: "CRICKET"
  }
];

/**
 * Helper to fetch with API key fallback
 */
async function fetchWithFallback(endpoint: string) {
  for (const key of API_KEYS) {
    try {
      const response = await fetch(`${BASE_URL}/${endpoint}&apikey=${key}`);
      if (!response.ok) continue;
      
      const data = await response.json();
      if (data.status === "success" && data.data && data.data.length > 0) {
        return data;
      }
    } catch (error) {
      console.error(`Error with API Key:`, error);
    }
  }
  return null;
}

export async function fetchLiveMatches(): Promise<LiveMatchData[]> {
  const data = await fetchWithFallback("currentMatches?offset=0");
  
  if (!data || !data.data || data.data.length === 0) {
    console.log("No live API data found, loading Simulation matches...");
    return MOCK_MATCHES;
  }

  return data.data.map((m: any) => {
    const teams = m.name.split(' v ');
    return {
      id: m.id,
      name: m.name,
      status: m.status || "Match In Progress",
      score: m.score?.[0]?.r ? `${m.score[0].r}/${m.score[0].w} (${m.score[0].o} ov)` : "Live Score Updating...",
      homeTeam: teams[0] || "Home Team",
      awayTeam: teams[1] || "Away Team",
      sport: "CRICKET"
    };
  });
}

export async function fetchBallByBall(matchId: string): Promise<BallUpdate[]> {
  // Mocking detailed commentary for realistic simulation
  return [
    {
      ball: "18.4",
      runs: 4,
      description: "FOUR! Beautiful timing. Cox drives it through the covers.",
      isWicket: false,
      isBoundary: true
    },
    {
      ball: "18.3",
      runs: 1,
      description: "Pushed to long off for a comfortable single.",
      isWicket: false,
      isBoundary: false
    },
    {
      ball: "18.2",
      runs: 0,
      description: "Length ball, defended solidly back to the bowler.",
      isWicket: false,
      isBoundary: false
    }
  ];
}
