import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, ArrowRight, FileText, CheckCircle2 } from 'lucide-react';
import { Header } from '@/components/dashboard/Header';
import { ImageUpload } from '@/components/dashboard/ImageUpload';
import { ModelSelector } from '@/components/dashboard/ModelSelector';
import { PatientInfoForm } from '@/components/dashboard/PatientInfoForm';
import { PipelineProgress } from '@/components/dashboard/PipelineProgress';
import { AnalysisResults } from '@/components/dashboard/AnalysisResults';
import { GradCamViewer } from '@/components/dashboard/GradCamViewer';
import { ReportViewer } from '@/components/dashboard/ReportViewer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { 
  INITIAL_PIPELINE_STAGES, 
  generateMockAnalysisResult, 
  AI_MODELS,
  type PipelineStage,
  type AnalysisResult,
  type PatientInfo
} from '@/lib/mockData';

export default function Index() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [pipelineStages, setPipelineStages] = useState<PipelineStage[]>(INITIAL_PIPELINE_STAGES);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [currentStage, setCurrentStage] = useState(0);
  const [activeTab, setActiveTab] = useState('results');

  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      toast({
        title: "Image Uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
    };
    reader.readAsDataURL(file);
  }, []);

  const handleSampleLoad = useCallback((imageUrl: string) => {
    setUploadedImage(imageUrl);
    toast({
      title: "Sample Image Loaded",
      description: "Demo chest X-ray has been loaded for analysis.",
    });
  }, []);

  const handleClearImage = useCallback(() => {
    setUploadedImage(null);
    setAnalysisResult(null);
    setPipelineStages(INITIAL_PIPELINE_STAGES);
    setCurrentStage(0);
  }, []);

  const simulatePipelineStage = (stageIndex: number): Promise<void> => {
    return new Promise((resolve) => {
      const duration = 1500 + Math.random() * 1000;
      const startTime = Date.now();

      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / duration) * 100, 100);

        setPipelineStages(prev => prev.map((stage, idx) => {
          if (idx === stageIndex) {
            return { 
              ...stage, 
              status: progress < 100 ? 'processing' : 'completed',
              progress: Math.floor(progress),
              duration: progress >= 100 ? duration / 1000 : undefined
            };
          }
          return stage;
        }));

        if (progress < 100) {
          requestAnimationFrame(updateProgress);
        } else {
          resolve();
        }
      };

      setPipelineStages(prev => prev.map((stage, idx) => {
        if (idx === stageIndex) {
          return { ...stage, status: 'processing', progress: 0 };
        }
        return stage;
      }));

      requestAnimationFrame(updateProgress);
    });
  };

  const handleStartAnalysis = async () => {
    if (!uploadedImage || !selectedModel || !patientInfo) {
      toast({
        title: "Missing Requirements",
        description: "Please upload an image, select an AI model, and enter patient information.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setAnalysisResult(null);
    setPipelineStages(INITIAL_PIPELINE_STAGES);

    const model = AI_MODELS.find(m => m.id === selectedModel);

    try {
      // Run through each stage
      for (let i = 0; i < pipelineStages.length; i++) {
        // Skip mask generation if model doesn't require it
        if (i === 0 && model && !model.requiresMask) {
          setPipelineStages(prev => prev.map((stage, idx) => {
            if (idx === 0) {
              return { ...stage, status: 'completed', progress: 100, duration: 0.1 };
            }
            return stage;
          }));
          continue;
        }

        setCurrentStage(i);
        await simulatePipelineStage(i);
      }

      // Generate mock results
      const result = generateMockAnalysisResult(selectedModel);
      setAnalysisResult(result);

      toast({
        title: "Analysis Complete",
        description: "All pipeline stages completed successfully.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "An error occurred during processing.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setUploadedImage(null);
    setSelectedModel(null);
    setPatientInfo(null);
    setPipelineStages(INITIAL_PIPELINE_STAGES);
    setAnalysisResult(null);
    setCurrentStage(0);
  };

  const canStartAnalysis = uploadedImage && selectedModel && patientInfo && !isProcessing;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 px-6">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Panel - Input Controls */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="border-border shadow-sm">
                <CardContent className="p-6 space-y-6">
                  <ImageUpload
                    onImageUpload={handleImageUpload}
                    onSampleLoad={handleSampleLoad}
                    uploadedImage={uploadedImage}
                    onClear={handleClearImage}
                  />

                  <ModelSelector
                    selectedModel={selectedModel}
                    onModelSelect={setSelectedModel}
                    disabled={isProcessing}
                  />

                  {selectedModel && !patientInfo && (
                    <PatientInfoForm onSave={setPatientInfo} />
                  )}

                  <div className="flex gap-3">
                    <Button
                      variant="medical"
                      size="lg"
                      className="flex-1"
                      onClick={handleStartAnalysis}
                      disabled={!canStartAnalysis}
                    >
                      {isProcessing ? (
                        <>
                          <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Start Analysis
                        </>
                      )}
                    </Button>
                    {(analysisResult || isProcessing) && (
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={handleReset}
                        disabled={isProcessing}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Pipeline Progress */}
            <AnimatePresence>
              {(isProcessing || analysisResult) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <Card className="border-border shadow-sm">
                    <CardContent className="p-6">
                      <PipelineProgress stages={pipelineStages} currentStage={currentStage} />
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Panel - Results */}
          <div className="lg:col-span-7 space-y-6">
            <AnimatePresence mode="wait">
              {!analysisResult && !isProcessing ? (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <Card className="border-border border-dashed h-full min-h-[400px]">
                    <CardContent className="flex flex-col items-center justify-center h-full py-16">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">No Analysis Yet</h3>
                      <p className="text-sm text-muted-foreground text-center max-w-sm">
                        Upload an X-ray image and select an AI model to begin the analysis pipeline.
                      </p>
                      <div className="flex items-center gap-2 mt-6 text-sm text-muted-foreground">
                        <span>Upload Image</span>
                        <ArrowRight className="h-4 w-4" />
                        <span>Select Model</span>
                        <ArrowRight className="h-4 w-4" />
                        <span>Enter Patient Info</span>
                        <ArrowRight className="h-4 w-4" />
                        <span>Start Analysis</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : isProcessing ? (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <Card className="border-border h-full min-h-[400px]">
                    <CardContent className="flex flex-col items-center justify-center h-full py-16">
                      <div className="relative mb-6">
                        <div className="h-20 w-20 rounded-full border-4 border-muted animate-pulse" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-12 w-12 rounded-full gradient-medical animate-spin" 
                               style={{ 
                                 clipPath: 'polygon(50% 0%, 100% 0%, 100% 50%, 50% 50%)' 
                               }} 
                          />
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Processing Stage {currentStage + 1} of {pipelineStages.length}
                      </h3>
                      <p className="text-sm text-muted-foreground text-center">
                        {pipelineStages[currentStage]?.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : analysisResult ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  {/* Success Banner */}
                  <Card className="border-success/30 bg-success/5">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/20">
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Analysis Complete</p>
                        <p className="text-sm text-muted-foreground">
                          All {pipelineStages.length} stages completed in {analysisResult.processingTime.toFixed(1)} seconds
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Results Tabs */}
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-muted/50">
                      <TabsTrigger value="results" className="data-[state=active]:bg-background">
                        Findings
                      </TabsTrigger>
                      <TabsTrigger value="visualization" className="data-[state=active]:bg-background">
                        Grad-CAM
                      </TabsTrigger>
                      <TabsTrigger value="report" className="data-[state=active]:bg-background">
                        Report
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="results" className="mt-6">
                      <AnalysisResults result={analysisResult} />
                    </TabsContent>

                    <TabsContent value="visualization" className="mt-6">
                      {uploadedImage && (
                        <GradCamViewer originalImage={uploadedImage} />
                      )}
                    </TabsContent>

                    <TabsContent value="report" className="mt-6">
                      <ReportViewer result={analysisResult} patientInfo={patientInfo} />
                    </TabsContent>
                  </Tabs>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
