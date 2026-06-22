'use server';
/**
 * @fileOverview Provides a Genkit flow for generating high-probability outcome predictions for sports matches.
 *
 * - smartPredictorSuggestion - A function that handles the prediction process for a given sports match.
 * - SmartPredictorInput - The input type for the smartPredictorSuggestion function.
 * - SmartPredictorOutput - The return type for the smartPredictorSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartPredictorInputSchema = z.object({
  sport: z.string().describe('The sport of the match (e.g., football, cricket).'),
  homeTeam: z.string().describe('The name of the home team.'),
  awayTeam: z.string().describe('The name of the away team.'),
  matchDate: z.string().describe('The date of the match in YYYY-MM-DD format.'),
  historicalData: z
    .string()
    .describe('A summary of historical team performance for both teams.'),
  liveGameData: z
    .string()
    .optional()
    .describe('Optional: Real-time data or events happening during the match.'),
});
export type SmartPredictorInput = z.infer<typeof SmartPredictorInputSchema>;

const SmartPredictorOutputSchema = z.object({
  prediction: z
    .string()
    .describe('The statistically high-probability outcome prediction (e.g., "Home team win", "Draw").'),
  confidenceScore: z
    .number()
    .min(0)
    .max(1)
    .describe('A confidence score for the prediction, from 0 to 1.'),
  suggestedBet: z.string().describe('A specific betting market suggestion based on the prediction.'),
  reasoning: z
    .string()
    .describe('A detailed explanation justifying the prediction based on the provided data.'),
});
export type SmartPredictorOutput = z.infer<typeof SmartPredictorOutputSchema>;

export async function smartPredictorSuggestion(
  input: SmartPredictorInput
): Promise<SmartPredictorOutput> {
  return smartPredictorSuggestionFlow(input);
}

const smartPredictorPrompt = ai.definePrompt({
  name: 'smartPredictorPrompt',
  input: {schema: SmartPredictorInputSchema},
  output: {schema: SmartPredictorOutputSchema},
  prompt: `You are an expert sports analyst and betting predictor. Your task is to analyze match data and provide a statistically high-probability outcome prediction.

Analyze the following match details:
Sport: {{{sport}}}
Home Team: {{{homeTeam}}}
Away Team: {{{awayTeam}}}
Match Date: {{{matchDate}}}

Historical Performance Data:
{{{historicalData}}}

{{#if liveGameData}}
Live Game Data:
{{{liveGameData}}}
{{/if}}

Based on this information, provide a prediction, a confidence score, a specific suggested bet, and detailed reasoning. Focus on identifying outcomes with genuinely high statistical probability.`,
});

const smartPredictorSuggestionFlow = ai.defineFlow(
  {
    name: 'smartPredictorSuggestionFlow',
    inputSchema: SmartPredictorInputSchema,
    outputSchema: SmartPredictorOutputSchema,
  },
  async input => {
    const {output} = await smartPredictorPrompt(input);
    return output!;
  }
);
