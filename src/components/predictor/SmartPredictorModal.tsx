
"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Loader2, Sparkles, CheckCircle2, AlertTriangle } from "lucide-react";
import { smartPredictorSuggestion, type SmartPredictorOutput } from "@/ai/flows/smart-predictor-suggestion";
import { Progress } from "@/components/ui/progress";

interface SmartPredictorModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchData: any;
}

export function SmartPredictorModal({ isOpen, onClose, matchData }: SmartPredictorModalProps) {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<SmartPredictorOutput | null>(null);

  async function handleGenerate() {
    if (!matchData) return;
    setLoading(true);
    try {
      const result = await smartPredictorSuggestion({
        sport: matchData.sport,
        homeTeam: matchData.homeTeam,
        awayTeam: matchData.awayTeam,
        matchDate: new Date().toISOString().split('T')[0],
        historicalData: `${matchData.homeTeam} has won 4 of their last 5 home games. ${matchData.awayTeam} tends to score early but concedes in the second half. Average goals per game for both is 2.8.`,
        liveGameData: matchData.score ? `Current score is ${matchData.score}. Possesion: ${matchData.homeTeam} 55% - ${matchData.awayTeam} 45%.` : undefined
      });
      setPrediction(result);
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px] bg-card border-accent/20">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-accent/20 text-accent">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <DialogTitle className="font-headline text-xl">Smart Predictor</DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground">
            StakeSync AI analyzes thousands of data points to find high-probability outcomes for {matchData?.homeTeam} vs {matchData?.awayTeam}.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 min-h-[300px] flex flex-col justify-center">
          {!prediction && !loading && (
            <div className="text-center space-y-6">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-full" />
                <Sparkles className="h-16 w-16 text-accent relative mx-auto" />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">Ready to Analyze</h4>
                <p className="text-sm text-muted-foreground px-12">
                  Our neural network is calibrated for this match. Click below to generate insights.
                </p>
              </div>
              <Button 
                onClick={handleGenerate} 
                className="bg-accent text-accent-foreground font-bold rounded-xl h-12 px-8 hover:scale-105 transition-transform"
              >
                GENERATE PREDICTION
              </Button>
            </div>
          )}

          {loading && (
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 text-accent animate-spin mx-auto" />
              <div className="space-y-2">
                <p className="text-sm font-bold text-accent uppercase tracking-tighter">Crunching Market Dynamics</p>
                <div className="w-full max-w-xs mx-auto">
                   <Progress value={66} className="h-1" />
                </div>
                <p className="text-xs text-muted-foreground">Analyzing historical head-to-head performance...</p>
              </div>
            </div>
          )}

          {prediction && !loading && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-secondary/40 p-4 rounded-xl border border-accent/20">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs font-bold text-accent uppercase tracking-widest mb-1">High-Prob Outcome</p>
                    <h3 className="text-2xl font-bold font-headline">{prediction.prediction}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Confidence</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-mono font-bold text-white">{(prediction.confidenceScore * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
                <Progress value={prediction.confidenceScore * 100} className="h-2 bg-background" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary/10 p-4 rounded-xl border border-primary/20">
                  <p className="text-[10px] font-bold text-primary mb-1 uppercase tracking-widest">Suggested Bet</p>
                  <p className="text-sm font-bold text-white">{prediction.suggestedBet}</p>
                </div>
                <div className="bg-green-500/10 p-4 rounded-xl border border-green-500/20">
                  <p className="text-[10px] font-bold text-green-500 mb-1 uppercase tracking-widest">Risk Level</p>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-white">
                    <CheckCircle2 className="h-4 w-4 text-green-500" /> Low
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">AI Reasoning</p>
                <p className="text-sm text-muted-foreground leading-relaxed bg-secondary/20 p-4 rounded-lg">
                  {prediction.reasoning}
                </p>
              </div>

              <Button 
                onClick={() => {}} 
                className="w-full bg-primary text-white font-bold h-12 rounded-xl glow-blue"
              >
                PLACE SUGGESTED BET
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
