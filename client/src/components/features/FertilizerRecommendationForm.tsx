import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, BarChart3, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartConfig 
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from 'axios';

// Configure axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000',
});

// Add auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interfaces
interface FertilizerRecommendation {
  prediction: string;
  remark: string;
  confidence: number;
}

interface FormData {
  temperature: string;
  moisture: string;
  rainfall: string;
  ph: string;
  soilN: string;
  soilP: string;
  soilK: string;
  carbon: string;
  soilType: string;
  cropName: string;
}

export default function FertilizerRecommendationForm() {
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    temperature: '',
    moisture: '',
    rainfall: '',
    ph: '',
    soilN: '',
    soilP: '',
    soilK: '',
    carbon: '',
    soilType: '',
    cropName: ''
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<FertilizerRecommendation | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Chart data for nutrient levels
  const chartData = result ? [
    { name: 'Nitrogen', value: Math.min(parseFloat(formData.soilN || '0'), 200) },
    { name: 'Phosphorus', value: Math.min(parseFloat(formData.soilP || '0'), 150) },
    { name: 'Potassium', value: Math.min(parseFloat(formData.soilK || '0'), 300) },
    { name: 'Carbon', value: Math.min(parseFloat(formData.carbon || '0'), 205) }
  ] : [];

  // Chart configuration
  const chartConfig = {
    value: {
      label: 'Level (ppm)',
      color: 'hsl(var(--chart-1))',
    },
  } satisfies ChartConfig;

  // Handle form input changes
  const handleChange = (key: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form inputs
    const { temperature, moisture, rainfall, ph, soilN, soilP, soilK, carbon, soilType, cropName } = formData;
    if (!temperature || !moisture || !rainfall || !ph || !soilN || !soilP || !soilK || !carbon || !soilType || !cropName) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields",
      });
      return;
    }

    const temperatureNum = parseFloat(temperature);
    const moistureNum = parseFloat(moisture);
    const rainfallNum = parseFloat(rainfall);
    const phNum = parseFloat(ph);
    const soilNNum = parseFloat(soilN);
    const soilPNum = parseFloat(soilP);
    const soilKNum = parseFloat(soilK);
    const carbonNum = parseFloat(carbon);

    if (isNaN(temperatureNum) || temperatureNum < -10 || temperatureNum > 50) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Temperature must be between -10 and 50°C",
      });
      return;
    }
    if (isNaN(moistureNum) || moistureNum < 0 || moistureNum > 1) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Moisture must be between 0 and 1",
      });
      return;
    }
    if (isNaN(rainfallNum) || rainfallNum < 0 || rainfallNum > 5000) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Rainfall must be between 0 and 5000 mm",
      });
      return;
    }
    if (isNaN(phNum) || phNum < 0 || phNum > 14) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Soil pH must be between 0 and 14",
      });
      return;
    }
    if (isNaN(soilNNum) || soilNNum < 0 || soilNNum > 200) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Nitrogen must be between 0 and 200 ppm",
      });
      return;
    }
    if (isNaN(soilPNum) || soilPNum < 0 || soilPNum > 150) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Phosphorus must be between 0 and 150 ppm",
      });
      return;
    }
    if (isNaN(soilKNum) || soilKNum < 0 || soilKNum > 300) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Potassium must be between 0 and 300 ppm",
      });
      return;
    }
    if (isNaN(carbonNum) || carbonNum < 1 || carbonNum > 205) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Carbon must be between 1 and 205 ppm",
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    const requestBody = {
      Temperature: temperatureNum,
      Moisture: moistureNum,
      Rainfall: rainfallNum,
      PH: phNum,
      Nitrogen: soilNNum,
      Phosphorous: soilPNum,
      Potassium: soilKNum,
      Carbon: carbonNum,
      Soil: soilType,
      Crop: cropName
    };

    try {
      const response = await api.post('/api/fertilizer', requestBody);

      if (!response.data || !response.data.fertilizer) {
        throw new Error('Invalid response format from server');
      }

      setResult(response.data.fertilizer);

      toast({
        title: "Recommendation Complete",
        description: `Recommended fertilizer: ${response.data.fertilizer.prediction}`,
      });

      setTimeout(() => {
        document.getElementById('fertilizerResult')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred while fetching the recommendation. Please try again.';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form reset
  const handleReset = () => {
    setFormData({
      temperature: '',
      moisture: '',
      rainfall: '',
      ph: '',
      soilN: '',
      soilP: '',
      soilK: '',
      carbon: '',
      soilType: '',
      cropName: ''
    });
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <Card className="lg:col-span-2 agro-card-shadow">
          <CardHeader>
            <CardTitle>Fertilizer Recommendation</CardTitle>
            <CardDescription>
              Enter soil and environmental data to get personalized fertilizer recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Temperature */}
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature (°C)</Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    placeholder="e.g. 25"
                    value={formData.temperature}
                    onChange={(e) => handleChange('temperature', e.target.value)}
                    required
                    min="-10"
                    max="50"
                  />
                </div>

                {/* Moisture */}
                <div className="space-y-2">
                  <Label htmlFor="moisture">Moisture</Label>
                  <Input
                    id="moisture"
                    type="number"
                    step="0.1"
                    placeholder="e.g. 0.5"
                    value={formData.moisture}
                    onChange={(e) => handleChange('moisture', e.target.value)}
                    required
                    min="0"
                    max="1"
                  />
                </div>

                {/* Rainfall */}
                <div className="space-y-2">
                  <Label htmlFor="rainfall">Rainfall (mm)</Label>
                  <Input
                    id="rainfall"
                    type="number"
                    placeholder="e.g. 1500"
                    value={formData.rainfall}
                    onChange={(e) => handleChange('rainfall', e.target.value)}
                    required
                    min="0"
                    max="5000"
                  />
                </div>

                {/* Soil pH */}
                <div className="space-y-2">
                  <Label htmlFor="ph">Soil pH</Label>
                  <Input
                    id="ph"
                    type="number"
                    step="0.1"
                    placeholder="e.g. 6.5"
                    value={formData.ph}
                    onChange={(e) => handleChange('ph', e.target.value)}
                    required
                    min="0"
                    max="14"
                  />
                </div>

                {/* Nitrogen */}
                <div className="space-y-2">
                  <Label htmlFor="soilN">Nitrogen (ppm)</Label>
                  <Input
                    id="soilN"
                    type="number"
                    step="0.1"
                    placeholder="e.g. 40"
                    value={formData.soilN}
                    onChange={(e) => handleChange('soilN', e.target.value)}
                    required
                    min="0"
                    max="200"
                  />
                </div>

                {/* Phosphorus */}
                <div className="space-y-2">
                  <Label htmlFor="soilP">Phosphorus (ppm)</Label>
                  <Input
                    id="soilP"
                    type="number"
                    step="0.1"
                    placeholder="e.g. 35"
                    value={formData.soilP}
                    onChange={(e) => handleChange('soilP', e.target.value)}
                    required
                    min="0"
                    max="150"
                  />
                </div>

                {/* Potassium */}
                <div className="space-y-2">
                  <Label htmlFor="soilK">Potassium (ppm)</Label>
                  <Input
                    id="soilK"
                    type="number"
                    step="0.1"
                    placeholder="e.g. 200"
                    value={formData.soilK}
                    onChange={(e) => handleChange('soilK', e.target.value)}
                    required
                    min="0"
                    max="300"
                  />
                </div>

                {/* Carbon */}
                <div className="space-y-2">
                  <Label htmlFor="carbon">Carbon (ppm)</Label>
                  <Input
                    id="carbon"
                    type="number"
                    placeholder="e.g. 50"
                    value={formData.carbon}
                    onChange={(e) => handleChange('carbon', e.target.value)}
                    required
                    min="1"
                    max="205"
                  />
                </div>

                {/* Soil Type */}
                <div className="space-y-2">
                  <Label htmlFor="soilType">Soil Type</Label>
                  <Select
                    value={formData.soilType}
                    onValueChange={(value) => handleChange('soilType', value)}
                    required
                  >
                    <SelectTrigger id="soilType">
                      <SelectValue placeholder="Select soil type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Loamy Soil">Loamy Soil</SelectItem>
                      <SelectItem value="Peaty Soil">Peaty Soil</SelectItem>
                      <SelectItem value="Acidic Soil">Acidic Soil</SelectItem>
                      <SelectItem value="Neutral Soil">Neutral Soil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Crop Name */}
                <div className="space-y-2">
                  <Label htmlFor="cropName">Crop Name</Label>
                  <Select
                    value={formData.cropName}
                    onValueChange={(value) => handleChange('cropName', value)}
                    required
                  >
                    <SelectTrigger id="cropName">
                      <SelectValue placeholder="Select crop" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rice">Rice</SelectItem>
                      <SelectItem value="wheat">Wheat</SelectItem>
                      <SelectItem value="pomegranate">Pomegranate</SelectItem>
                      <SelectItem value="watermelon">Watermelon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleReset}>
                  Reset
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Get Recommendation
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Right Side Column */}
        <div className="space-y-6">
          {/* Result Card */}
          {result && !error && (
            <Card id="fertilizerResult" className="border-accent shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-accent" />
                  <span>Fertilizer Recommendation</span>
                </CardTitle>
                <CardDescription>For {formData.cropName} on {formData.soilType}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                  <h3 className="font-semibold text-xl">{result.prediction}</h3>
                  <p className="text-sm text-muted-foreground">{result.remark}</p>
                  <p className="text-sm font-medium mt-2">Confidence: {(result.confidence * 100).toFixed(1)}%</p>
                </div>

              </CardContent>
            </Card>
          )}

          {/* Error Card */}
          {error && (
            <Card id="fertilizerResult" className="border-destructive shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Info className="h-5 w-5 text-destructive" />
                  <span>Error</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-destructive">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => setError(null)}
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Analysis Factors Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Info className="h-5 w-5 text-blue-600" />
                <span>Analysis Factors</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Our model analyzes:</p>
              <ul className="space-y-1 ml-4 list-disc">
                <li>Temperature and moisture levels</li>
                <li>Rainfall patterns</li>
                <li>Soil pH and nutrient levels (N, P, K, C)</li>
                <li>Soil type and crop requirements</li>
              </ul>
              <p>Based on machine learning models trained on fertilizer effectiveness data.</p>
            </CardContent>
          </Card>

          {/* Sample Data Alert */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Sample values:</strong> Temperature: 25°C, Moisture: 10, Rainfall: 1500 mm, 
              Soil pH: 6.5, Nitrogen: 40 ppm, Phosphorus: 35 ppm, Potassium: 200 ppm, 
              Carbon: 50 ppm, Soil Type: Loamy Soil, Crop: Rice
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}