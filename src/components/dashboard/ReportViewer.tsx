import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Printer, Share2, ChevronDown, ExternalLink, Calendar, User, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { type AnalysisResult, type PatientInfo, MOCK_PATIENT } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface ReportViewerProps {
  result: AnalysisResult;
  patientInfo?: PatientInfo;
}

export function ReportViewer({ result, patientInfo = MOCK_PATIENT }: ReportViewerProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleDownload = () => {
    toast({
      title: "Report Downloaded",
      description: "Your PDF report has been downloaded successfully.",
    });
  };

  const handlePrint = () => {
    window.print();
    toast({
      title: "Print Dialog Opened",
      description: "Please select your printer to print the report.",
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied",
      description: "Report link has been copied to clipboard.",
    });
  };

  const formattedDate = result.timestamp.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card className="border-border print:border-none print:shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-medical">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Medical Analysis Report</CardTitle>
              <p className="text-xs text-muted-foreground">{formattedDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 print:hidden">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4" />
            </Button>
            <Button variant="medical" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-1" />
              Download PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Patient Information */}
        <div className="p-4 bg-muted/30 rounded-xl border border-border">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            Patient Information
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Patient ID</p>
              <p className="text-sm font-medium text-foreground">{patientInfo.id}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Name</p>
              <p className="text-sm font-medium text-foreground">{patientInfo.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Age / Sex</p>
              <p className="text-sm font-medium text-foreground">{patientInfo.age}Y / {patientInfo.gender}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Study Date</p>
              <p className="text-sm font-medium text-foreground">{patientInfo.studyDate}</p>
            </div>
          </div>
        </div>

        {/* Study Information */}
        <div className="p-4 bg-muted/30 rounded-xl border border-border">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Study Information
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Modality</p>
              <p className="text-sm font-medium text-foreground">{patientInfo.modality}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Accession Number</p>
              <p className="text-sm font-medium text-foreground">{patientInfo.accessionNumber}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">AI Model Used</p>
              <p className="text-sm font-medium text-foreground">{result.modelName}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Findings Summary */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-primary" />
            AI Analysis Findings
          </h3>
          <div className="space-y-3">
            {result.findings.map((finding, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "p-3 rounded-lg border",
                  finding.severity === 'severe' && "bg-destructive/5 border-destructive/30",
                  finding.severity === 'moderate' && "bg-warning/5 border-warning/30",
                  finding.severity === 'mild' && "bg-info/5 border-info/30",
                  finding.severity === 'normal' && "bg-success/5 border-success/30"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-foreground">{finding.condition}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{finding.description}</p>
                    {finding.location && (
                      <p className="text-xs text-muted-foreground mt-1">
                        <span className="font-medium">Location:</span> {finding.location}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className={cn(
                      "text-lg font-bold",
                      finding.severity === 'severe' && "text-destructive",
                      finding.severity === 'moderate' && "text-warning",
                      finding.severity === 'mild' && "text-info",
                      finding.severity === 'normal' && "text-success"
                    )}>
                      {(finding.probability * 100).toFixed(0)}%
                    </p>
                    <p className={cn(
                      "text-xs font-medium uppercase tracking-wide",
                      finding.severity === 'severe' && "text-destructive",
                      finding.severity === 'moderate' && "text-warning",
                      finding.severity === 'mild' && "text-info",
                      finding.severity === 'normal' && "text-success"
                    )}>
                      {finding.severity}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Disclaimer */}
        <div className="p-4 bg-warning/10 border border-warning/30 rounded-xl">
          <p className="text-xs text-warning-foreground leading-relaxed">
            <strong>Disclaimer:</strong> This AI-generated report is intended for informational purposes only and should not be used as a substitute for professional medical advice, diagnosis, or treatment. All findings require verification by a qualified radiologist or healthcare provider. The AI model's confidence scores represent probability estimates and are not definitive diagnoses.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground">
            <p>Report ID: {result.id}</p>
            <p>Processing Time: {result.processingTime.toFixed(2)} seconds</p>
          </div>
          <div className="text-xs text-muted-foreground text-right">
            <p>Generated by AuToRadX AI Platform</p>
            <p>Overall Confidence: {(result.confidence * 100).toFixed(1)}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
