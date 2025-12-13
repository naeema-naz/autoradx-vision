import { ChevronDown, Brain, Layers, Search, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AI_MODELS, type AIModel } from '@/lib/mockData';
import { cn } from '@/lib/utils';

interface ModelSelectorProps {
  selectedModel: string | null;
  onModelSelect: (modelId: string) => void;
  disabled?: boolean;
}

const getModelIcon = (type: AIModel['type']) => {
  switch (type) {
    case 'segmentation':
      return Layers;
    case 'classification':
      return Brain;
    case 'detection':
      return Search;
    default:
      return Brain;
  }
};

const getTypeLabel = (type: AIModel['type']) => {
  switch (type) {
    case 'segmentation':
      return 'Segmentation';
    case 'classification':
      return 'Classification';
    case 'detection':
      return 'Detection';
    default:
      return type;
  }
};

export function ModelSelector({ selectedModel, onModelSelect, disabled }: ModelSelectorProps) {
  const selectedModelData = AI_MODELS.find(m => m.id === selectedModel);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Select AI Model</h2>
        <p className="text-sm text-muted-foreground">Choose the analysis model for your X-ray</p>
      </div>

      <Select value={selectedModel || undefined} onValueChange={onModelSelect} disabled={disabled}>
        <SelectTrigger className={cn(
          "w-full h-auto py-3 px-4 border-border bg-card hover:bg-muted/50 transition-colors",
          selectedModel && "border-primary/50 bg-medical-blue-light"
        )}>
          <SelectValue placeholder="Choose an AI model...">
            {selectedModelData && (
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  {(() => {
                    const Icon = getModelIcon(selectedModelData.type);
                    return <Icon className="h-4 w-4 text-primary" />;
                  })()}
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">{selectedModelData.name}</p>
                  <p className="text-xs text-muted-foreground">{getTypeLabel(selectedModelData.type)}</p>
                </div>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-80">
          <SelectGroup>
            <SelectLabel className="text-xs uppercase tracking-wider text-muted-foreground px-2">
              Available Models
            </SelectLabel>
            {AI_MODELS.map((model) => {
              const Icon = getModelIcon(model.type);
              const isSelected = selectedModel === model.id;
              
              return (
                <SelectItem
                  key={model.id}
                  value={model.id}
                  className="py-3 px-2 cursor-pointer focus:bg-muted"
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg shrink-0 transition-colors",
                      isSelected ? "bg-primary/20" : "bg-secondary"
                    )}>
                      <Icon className={cn(
                        "h-4 w-4",
                        isSelected ? "text-primary" : "text-muted-foreground"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground truncate">{model.name}</p>
                        {isSelected && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                        {model.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider",
                          model.type === 'segmentation' && "bg-accent/20 text-accent",
                          model.type === 'classification' && "bg-primary/20 text-primary",
                          model.type === 'detection' && "bg-warning/20 text-warning"
                        )}>
                          {getTypeLabel(model.type)}
                        </span>
                        {model.requiresMask && (
                          <span className="text-[10px] text-muted-foreground">
                            Auto-mask enabled
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>

      {selectedModelData?.requiresMask && (
        <div className="flex items-start gap-2 p-3 bg-medical-teal-light rounded-lg border border-accent/20">
          <Layers className="h-4 w-4 text-accent mt-0.5 shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-accent">Auto-segmentation Enabled</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              This model requires mask input. U-Net will automatically generate lung segmentation before classification.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
