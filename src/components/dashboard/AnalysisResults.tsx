import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, AlertCircle, Info, TrendingUp, Clock, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { type AnalysisResult, type Finding } from '@/lib/mockData';
import { cn } from '@/lib/utils';

interface AnalysisResultsProps {
  result: AnalysisResult;
}

const getSeverityConfig = (severity: Finding['severity']) => {
  switch (severity) {
    case 'severe':
      return { icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/30' };
    case 'moderate':
      return { icon: AlertCircle, color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/30' };
    case 'mild':
      return { icon: Info, color: 'text-info', bg: 'bg-info/10', border: 'border-info/30' };
    case 'normal':
      return { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10', border: 'border-success/30' };
    default:
      return { icon: Info, color: 'text-muted-foreground', bg: 'bg-muted', border: 'border-border' };
  }
};

export function AnalysisResults({ result }: AnalysisResultsProps) {
  const overallConfidence = result.confidence * 100;
  const overallLoss = 100 - overallConfidence;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Analysis Results</h2>
        <p className="text-sm text-muted-foreground">AI-generated findings and confidence scores</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-border bg-gradient-to-br from-card to-muted/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{overallConfidence.toFixed(1)}%</p>
                  <p className="text-xs text-muted-foreground">Overall Confidence</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-border bg-gradient-to-br from-card to-muted/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                  <Zap className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{overallLoss.toFixed(1)}%</p>
                  <p className="text-xs text-muted-foreground">Overall Loss</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-border bg-gradient-to-br from-card to-muted/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
                  <Clock className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{result.processingTime.toFixed(1)}s</p>
                  <p className="text-xs text-muted-foreground">Processing Time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Findings */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Detected Findings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {result.findings.map((finding, index) => {
            const config = getSeverityConfig(finding.severity);
            const Icon = config.icon;
            const probability = finding.probability * 100;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "p-4 rounded-xl border",
                  config.bg,
                  config.border
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg shrink-0",
                    config.bg
                  )}>
                    <Icon className={cn("h-5 w-5", config.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-semibold text-foreground">{finding.condition}</h4>
                      <span className={cn("text-sm font-bold", config.color)}>
                        {probability.toFixed(0)}%
                      </span>
                    </div>
                    {finding.location && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Location: {finding.location}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground mt-1.5">
                      {finding.description}
                    </p>
                    <div className="mt-2">
                      <Progress 
                        value={probability} 
                        className={cn(
                          "h-1.5",
                          finding.severity === 'severe' && "[&>div]:bg-destructive",
                          finding.severity === 'moderate' && "[&>div]:bg-warning",
                          finding.severity === 'mild' && "[&>div]:bg-info",
                          finding.severity === 'normal' && "[&>div]:bg-success"
                        )}
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider",
                        config.bg,
                        config.color
                      )}>
                        {finding.severity}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
