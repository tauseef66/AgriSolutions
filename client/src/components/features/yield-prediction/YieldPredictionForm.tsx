import { useState, useEffect } from "react";
import { BarChart3, Info, MapPin, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import axios from "axios";

// Configure axios instance
const api = axios.create({
  baseURL: "http://localhost:5000",
});

// Add auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interfaces
export interface PredictionResult {
  crop: string;
  predictedYield: number;
  confidenceLevel: number;
  unit: string;
  historicalAverage: number;
  potentialRange: [number, number];
  factors: {
    temperature: string;
    rainfall: string;
    humidity: string;
    season: string;
  };
  recommendations: string[];
}

export interface FormData {
  year: string;
  rainfall: string;
  pesticides: string;
  temperature: string;
  area: string;
  crop: string;
}

const areas = [
  "Albania",
  "Algeria",
  "Angola",
  "Argentina",
  "United Kingdom",
  "Uruguay",
  "Zambia",
  "Zimbabwe",
];

const crops = [
  "Cassava",
  "Maize",
  "Potatoes",
  "Rice, paddy",
  "Sorghum",
  "Soybeans",
  "Sweet potatoes",
  "Wheat",
];

export default function YieldPredictionForm() {
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    year: new Date().getFullYear().toString(),
    rainfall: "",
    pesticides: "",
    temperature: "",
    area: "",
    crop: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

  // Chart data
  const chartData = result
    ? [
        {
          name: "Temperature",
          value: Math.min(
            (parseFloat(formData.temperature || "25") / 50) * 100,
            100
          ),
        },
        {
          name: "Rainfall",
          value: Math.min(
            (parseFloat(formData.rainfall || "750") / 2000) * 100,
            100
          ),
        },
        { name: "Humidity", value: 65 },
        { name: "Soil Quality", value: 90 },
      ]
    : [];

  // Chart configuration
  const chartConfig = {
    value: {
      label: "Impact (%)",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  // Handle form input changes
  const handleFormChange = (key: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form inputs
    const { year, rainfall, pesticides, temperature, area, crop } = formData;
    if (!year || !rainfall || !pesticides || !temperature || !area || !crop) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields",
      });
      return;
    }
    const yearNum = parseInt(year);
    const rainfallNum = parseFloat(rainfall);
    const pesticidesNum = parseFloat(pesticides);
    const temperatureNum = parseFloat(temperature);
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > 2100) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Year must be between 1900 and 2100",
      });
      return;
    }
    if (isNaN(rainfallNum) || rainfallNum < 0 || rainfallNum > 2000) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Rainfall must be between 0 and 2000 mm",
      });
      return;
    }
    if (isNaN(pesticidesNum) || pesticidesNum < 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Pesticides cannot be negative",
      });
      return;
    }
    if (isNaN(temperatureNum) || temperatureNum < -10 || temperatureNum > 50) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Temperature must be between -10 and 50°C",
      });
      return;
    }

    setIsLoading(true);

    try {
      const requestBody = {
        Year: yearNum,
        average_rain_fall_mm_per_year: rainfallNum,
        pesticides_tonnes: pesticidesNum,
        avg_temp: temperatureNum,
        Area: area,
        Item: crop,
      };

      const response = await api.post("/api/predict", requestBody);

      if (!response.data || typeof response.data.yield !== "number") {
        throw new Error("Invalid response format from server");
      }

      const predictedYield = response.data.yield.toFixed(2);

      const predictionResult: PredictionResult = {
        crop: crop.charAt(0).toUpperCase() + crop.slice(1),
        predictedYield: parseFloat(predictedYield),
        confidenceLevel: response.data.confidence || 85,
        unit: "hg/ha",
        historicalAverage: 58000, // 5.8 tons/ha * 10000
        potentialRange: [
          parseFloat(predictedYield) * 0.9,
          parseFloat(predictedYield) * 1.1,
        ],
        factors: {
          temperature: temperature || "25.0",
          rainfall: rainfall || "750",
          humidity: "65%",
          season: "Kharif",
        },
        recommendations: [
          "Adjust irrigation schedule based on predicted rainfall",
          "Consider planting dates for optimal temperature ranges",
          "Monitor soil moisture levels regularly",
          "Prepare storage and logistics based on expected yield",
        ],
      };

      setResult(predictionResult);

      toast({
        title: "Prediction Complete",
        description: `Predicted yield: ${predictedYield} ${predictionResult.unit}`,
      });

      // Scroll to result
      setTimeout(() => {
        document
          .getElementById("yieldResult")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.response?.data?.message ||
          error.message ||
          "Failed to get prediction. Please try again.",
      });
      console.error("Yield prediction error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form reset
  const handleReset = () => {
    setFormData({
      year: new Date().getFullYear().toString(),
      rainfall: "",
      pesticides: "",
      temperature: "",
      area: "",
      crop: "",
    });
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <Card className="lg:col-span-2 agro-card-shadow">
          <CardHeader>
            <CardTitle>Crop Yield Prediction</CardTitle>
            <CardDescription>
              Enter crop and environmental data to predict your expected yield
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Year */}
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <input
                    id="year"
                    type="number"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="e.g. 2025"
                    value={formData.year}
                    onChange={(e) => handleFormChange("year", e.target.value)}
                    required
                    min="1900"
                    max="2100"
                  />
                </div>

                {/* Crop Type */}
                <div className="space-y-2">
                  <Label htmlFor="crop">Crop Type</Label>
                  <select
                    id="crop"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.crop}
                    onChange={(e) => handleFormChange("crop", e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Select a crop type
                    </option>
                    {crops.map((crop) => (
                      <option key={crop} value={crop}>
                        {crop}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Area */}
                <div className="space-y-2">
                  <Label htmlFor="area">Area (Country/Region)</Label>
                  <select
                    id="area"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.area}
                    onChange={(e) => handleFormChange("area", e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Select a country/region
                    </option>
                    {areas.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rainfall */}
                <div className="space-y-2">
                  <Label htmlFor="rainfall">Rainfall (mm/year)</Label>
                  <input
                    id="rainfall"
                    type="number"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="e.g. 1500"
                    value={formData.rainfall}
                    onChange={(e) =>
                      handleFormChange("rainfall", e.target.value)
                    }
                    required
                    min="0"
                    max="2000"
                    step="0.1"
                  />
                </div>

                {/* Pesticides */}
                <div className="space-y-2">
                  <Label htmlFor="pesticides">Pesticides (tonnes)</Label>
                  <input
                    id="pesticides"
                    type="number"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="e.g. 0.5"
                    value={formData.pesticides}
                    onChange={(e) =>
                      handleFormChange("pesticides", e.target.value)
                    }
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                {/* Temperature */}
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature (°C)</Label>
                  <input
                    id="temperature"
                    type="number"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="e.g. 25"
                    value={formData.temperature}
                    onChange={(e) =>
                      handleFormChange("temperature", e.target.value)
                    }
                    required
                    min="-10"
                    max="50"
                    step="0.001"
                  />
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
                      Predicting...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Predict Yield
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
          {result && (
            <Card id="yieldResult" className="border-accent shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-accent" />
                  <span>Yield Prediction</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold text-center">
                  {result.predictedYield} {result.unit}
                </div>
                <div className="text-sm text-muted-foreground text-center">
                  for{" "}
                  {formData.area ? `${formData.area} region` : "your region"}
                </div>

                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">
                      Confidence Level
                    </span>
                    <span className="text-sm font-medium">
                      {result.confidenceLevel}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-green-600 h-2.5 rounded-full"
                      style={{ width: `${result.confidenceLevel}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="text-sm text-muted-foreground">
                      Historical Average
                    </div>
                    <div className="text-lg font-semibold">
                      {result.historicalAverage} {result.unit}
                    </div>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="text-sm text-muted-foreground">
                      Potential Range
                    </div>
                    <div className="text-lg font-semibold">
                      {result.potentialRange[0].toFixed(1)} -{" "}
                      {result.potentialRange[1].toFixed(1)} {result.unit}
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="text-sm font-medium mb-2">Factors</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Temperature
                      </div>
                      <div className="text-base font-semibold">
                        {result.factors.temperature}°C
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Rainfall
                      </div>
                      <div className="text-base font-semibold">
                        {result.factors.rainfall} mm
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Humidity
                      </div>
                      <div className="text-base font-semibold">
                        {result.factors.humidity}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Season
                      </div>
                      <div className="text-base font-semibold">
                        {result.factors.season}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="text-sm font-medium mb-2">
                    Recommendations
                  </div>
                  <ul className="list-disc ml-4 text-sm">
                    {result.recommendations.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Model Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Info className="h-5 w-5 text-blue-600" />
                <span>Model Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Our model considers:</p>
              <ul className="space-y-1 ml-4 list-disc">
                <li>Year of planting</li>
                <li>Rainfall patterns</li>
                <li>Pesticide usage</li>
                <li>Average temperature</li>
                <li>agricultural data</li>
              </ul>
              <p>
                Based on machine learning models trained on global agricultural
                datasets.
              </p>
            </CardContent>
          </Card>

          {/* Unit Converter Card */}
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-base flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Unit Converter</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <strong>1 hg/ha =</strong>
              </p>
              <p>0.01 kg/ha</p>
              <p>0.00892 lbs/acre</p>
              <p>0.000004047 tonnes/acre</p>
            </CardContent>
          </Card>

          {/* Sample Data Alert */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Sample values:</strong> Year: 2025, Crop: Rice, Area:
              India, Rainfall: 1500 mm/year, Pesticides: 0.5 tonnes,
              Temperature: 25°C
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
