
/**
 * @fileOverview Service for fetching live sports data and ball-by-ball updates.
 */

const API_KEY = "ff4e95c9fafb9fbde03e02893640f019f248f62c9fadf49550e94b151175cfa8";
const BASE_URL = "https://api.cricapi.com/v1"; // Placeholder for the common cricket data provider

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
  lastBall?: BallUpdate;
  commentary?: BallUpdate[];
}

export async function fetchLiveMatches(): Promise<LiveMatchData[]> {
  try {
    // In a real scenario, this would call the actual API endpoint provided by your service
    // For now, we simulate the structure based on the "ball-by-ball" requirement
    const response = await fetch(`${BASE_URL}/currentMatches?apikey=${API_KEY}`);
    const data = await response.json();
    
    // Mapping logic depends on the specific API provider's schema
    return data.data || [];
  } catch (error) {
    console.error("Failed to fetch live matches:", error);
    return [];
  }
}

export async function fetchBallByBall(matchId: string): Promise<BallUpdate[]> {
  try {
    const response = await fetch(`${BASE_URL}/match_commentary?apikey=${API_KEY}&id=${matchId}`);
    const data = await response.json();
    return data.data?.commentary || [];
  } catch (error) {
    console.error("Failed to fetch commentary:", error);
    return [];
  }
}
