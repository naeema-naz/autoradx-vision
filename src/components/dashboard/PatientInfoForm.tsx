import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type PatientInfo } from '@/lib/mockData';
import { toast } from '@/hooks/use-toast';

interface PatientInfoFormProps {
  onSave: (patientInfo: PatientInfo) => void;
  initialData?: Partial<PatientInfo>;
}

export function PatientInfoForm({ onSave, initialData }: PatientInfoFormProps) {
  const [formData, setFormData] = useState({
    id: initialData?.id || '',
    name: initialData?.name || '',
    age: initialData?.age?.toString() || '',
    gender: initialData?.gender || 'male' as 'male' | 'female' | 'other',
  });

  const handleSave = () => {
    if (!formData.id || !formData.name || !formData.age) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const patientInfo: PatientInfo = {
      id: formData.id,
      name: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender,
      studyDate: new Date().toISOString().split('T')[0],
      modality: 'CR (Computed Radiography)',
      accessionNumber: `ACC-${Date.now()}`,
      referringPhysician: 'Dr. Sarah Mitchell',
    };

    onSave(patientInfo);
    toast({
      title: "Patient Information Saved",
      description: "Patient details have been saved successfully.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            Enter Patient Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patient-id">Patient ID *</Label>
              <Input
                id="patient-id"
                placeholder="Enter patient ID"
                value={formData.id}
                onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patient-name">Patient Name *</Label>
              <Input
                id="patient-name"
                placeholder="Enter patient name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patient-age">Age *</Label>
              <Input
                id="patient-age"
                type="number"
                placeholder="Enter age"
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patient-gender">Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(value: 'male' | 'female' | 'other') =>
                  setFormData(prev => ({ ...prev, gender: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleSave}
            className="w-full"
            variant="medical"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Patient Information
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}