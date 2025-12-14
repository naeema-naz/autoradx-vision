export interface AIModel {
  id: string;
  name: string;
  description: string;
  type: 'segmentation' | 'classification' | 'detection';
  requiresMask: boolean;
}

export interface AnalysisResult {
  id: string;
  modelName: string;
  findings: Finding[];
  gradCamUrl: string;
  maskUrl: string;
  confidence: number;
  processingTime: number;
  timestamp: Date;
}

export interface Finding {
  condition: string;
  probability: number;
  severity: 'normal' | 'mild' | 'moderate' | 'severe';
  location?: string;
  description: string;
}

export interface PipelineStage {
  id: number;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  description: string;
  duration?: number;
}

export const AI_MODELS: AIModel[] = [
  {
    id: 'unet-chest',
    name: 'U-Net Chest X-Ray Segmentation',
    description: 'Automatic lung field and cardiac silhouette segmentation',
    type: 'segmentation',
    requiresMask: false,
  },
  {
    id: 'resnet-pneumonia',
    name: 'ResNet-50 Pneumonia Classifier',
    description: 'Deep learning model for pneumonia detection',
    type: 'classification',
    requiresMask: true,
  },
  {
    id: 'densenet-multi',
    name: 'DenseNet-121 Multi-Label Classifier',
    description: 'Detects 14 thoracic pathologies including cardiomegaly, effusion, and nodules',
    type: 'classification',
    requiresMask: true,
  },
  {
    id: 'efficientnet-covid',
    name: 'EfficientNet COVID-19 Detector',
    description: 'Specialized model for COVID-19 pneumonia patterns',
    type: 'classification',
    requiresMask: true,
  },
  {
    id: 'yolo-nodule',
    name: 'YOLO Lung Nodule Detector',
    description: 'Real-time nodule detection and localization',
    type: 'detection',
    requiresMask: false,
  },
];

export const MOCK_FINDINGS: Finding[] = [
  {
    condition: 'Cardiomegaly',
    probability: 0.87,
    severity: 'moderate',
    location: 'Cardiac silhouette',
    description: 'Cardiothoracic ratio exceeds normal limits, suggesting cardiac enlargement.',
  },
  {
    condition: 'Pleural Effusion',
    probability: 0.72,
    severity: 'mild',
    location: 'Right lower lung field',
    description: 'Small amount of fluid accumulation in the right costophrenic angle.',
  },
  {
    condition: 'Pulmonary Infiltrates',
    probability: 0.45,
    severity: 'mild',
    location: 'Left mid-lung zone',
    description: 'Patchy opacity consistent with inflammatory process.',
  },
  {
    condition: 'Normal Lung Fields',
    probability: 0.92,
    severity: 'normal',
    location: 'Bilateral',
    description: 'No acute cardiopulmonary abnormality detected.',
  },
];

export const INITIAL_PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 1,
    name: 'Mask Generation',
    status: 'pending',
    progress: 0,
    description: 'U-Net automatic segmentation for lung field extraction',
  },
  {
    id: 2,
    name: 'Classification Analysis',
    status: 'pending',
    progress: 0,
    description: 'Deep learning model inference for pathology detection',
  },
  {
    id: 3,
    name: 'Grad-CAM Generation',
    status: 'pending',
    progress: 0,
    description: 'Explainable AI heatmap visualization',
  },
  {
    id: 4,
    name: 'Report Generation',
    status: 'pending',
    progress: 0,
    description: 'Comprehensive medical report compilation',
  },
];

export function generateMockAnalysisResult(modelId: string): AnalysisResult {
  const model = AI_MODELS.find(m => m.id === modelId) || AI_MODELS[0];
  const shuffledFindings = [...MOCK_FINDINGS].sort(() => Math.random() - 0.5).slice(0, 3);
  
  return {
    id: `analysis-${Date.now()}`,
    modelName: model.name,
    findings: shuffledFindings,
    gradCamUrl: '/placeholder.svg', // Would be actual heatmap in production
    maskUrl: '/placeholder.svg', // Would be actual mask in production
    confidence: 0.85 + Math.random() * 0.1,
    processingTime: 2.5 + Math.random() * 2,
    timestamp: new Date(),
  };
}

export interface PatientInfo {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  studyDate: string;
  modality: string;
  accessionNumber: string;
  referringPhysician: string;
}

export const MOCK_PATIENT: PatientInfo = {
  id: 'PAT-2024-001234',
  name: 'Demo Patient',
  age: 58,
  gender: 'male',
  studyDate: new Date().toISOString().split('T')[0],
  modality: 'CR (Computed Radiography)',
  accessionNumber: 'ACC-2024-56789',
  referringPhysician: 'Dr. Sarah Mitchell',
};
