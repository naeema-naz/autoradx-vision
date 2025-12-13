import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Loader2, AlertCircle, Layers, Brain, Eye, FileText } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { type PipelineStage } from '@/lib/mockData';
import { cn } from '@/lib/utils';

interface PipelineProgressProps {
  stages: PipelineStage[];
  currentStage: number;
}

const getStageIcon = (stageId: number) => {
  switch (stageId) {
    case 1:
      return Layers;
    case 2:
      return Brain;
    case 3:
      return Eye;
    case 4:
      return FileText;
    default:
      return Circle;
  }
};

export function PipelineProgress({ stages, currentStage }: PipelineProgressProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Analysis Pipeline</h2>
        <p className="text-sm text-muted-foreground">Multi-stage AI processing workflow</p>
      </div>

      <div className="space-y-3">
        {stages.map((stage, index) => {
          const StageIcon = getStageIcon(stage.id);
          const isActive = stage.status === 'processing';
          const isCompleted = stage.status === 'completed';
          const isError = stage.status === 'error';
          const isPending = stage.status === 'pending';

          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "relative p-4 rounded-xl border transition-all duration-300",
                isActive && "bg-medical-blue-light border-primary/30 shadow-md",
                isCompleted && "bg-success/5 border-success/30",
                isError && "bg-destructive/5 border-destructive/30",
                isPending && "bg-muted/30 border-border"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl shrink-0 transition-colors",
                  isActive && "bg-primary/20",
                  isCompleted && "bg-success/20",
                  isError && "bg-destructive/20",
                  isPending && "bg-secondary"
                )}>
                  {isActive ? (
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  ) : isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : isError ? (
                    <AlertCircle className="h-5 w-5 text-destructive" />
                  ) : (
                    <StageIcon className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={cn(
                      "font-medium",
                      isActive && "text-primary",
                      isCompleted && "text-success",
                      isError && "text-destructive",
                      isPending && "text-muted-foreground"
                    )}>
                      Stage {stage.id}: {stage.name}
                    </h3>
                    {isCompleted && stage.duration && (
                      <span className="text-xs text-success font-medium">
                        {stage.duration.toFixed(1)}s
                      </span>
                    )}
                    {isActive && (
                      <span className="text-xs text-primary font-medium">
                        {stage.progress}%
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {stage.description}
                  </p>

                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3"
                    >
                      <Progress value={stage.progress} className="h-2" />
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Connector line */}
              {index < stages.length - 1 && (
                <div className={cn(
                  "absolute left-7 top-14 w-0.5 h-4 transition-colors",
                  isCompleted ? "bg-success/50" : "bg-border"
                )} />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
