import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Info, CheckCircle, Sprout } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface RecommendationResult {
  cropName: string;
  confidence: number;
  description: string;
  suitability: "Excellent" | "Good" | "Moderate";
}

const cropDescriptions: Record<string, string> = {
  Rice: "A staple food crop and source of income for many farmers. Grows well in waterlogged conditions.",
  Wheat:
    "A major cereal grain, globally cultivated as a staple food. Prefers moderate temperatures and well-drained soil.",
  Maize:
    "Also known as corn, it's used for both human consumption and animal feed. Requires moderate water and plenty of sunlight.",
  Cotton:
    "A soft, fluffy staple fiber that grows in a boll around the seeds of cotton plants. Prefers warm conditions and rich soil.",
  Sugarcane:
    "A tropical grass cultivated for sugar production. Requires high rainfall or irrigation and fertile soil.",
};

export default function CropRecommendationForm() {
  const [nitrogen, setNitrogen] = useState<string>("");
  const [phosphorus, setPhosphorus] = useState<string>("");
  const [potassium, setPotassium] = useState<string>("");
  const [temperature, setTemperature] = useState<string>("");
  const [humidity, setHumidity] = useState<string>("");
  const [ph, setPh] = useState<string>("");
  const [rainfall, setRainfall] = useState<string>("");
  // const [soilType, setSoilType] = useState<string>("loamy");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<RecommendationResult[]>([]);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !nitrogen ||
      !phosphorus ||
      !potassium ||
      !temperature ||
      !humidity ||
      !ph ||
      !rainfall
    ) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/api/recommend", {
        N: Number(nitrogen),
        P: Number(phosphorus),
        K: Number(potassium),
        temperature: Number(temperature),
        humidity: Number(humidity),
        ph: Number(ph),
        rainfall: Number(rainfall),
      });

      const { crop } = response.data;

      if (crop.status === "success") {
        const recommendedCrops: RecommendationResult[] = [
          {
            cropName: crop.prediction,
            confidence: Math.round(crop.confidence * 100),
            description:
              cropDescriptions[crop.prediction] ||
              `Based on your soil and climate conditions, ${crop.prediction} would be the most suitable crop for cultivation.`,
            suitability: getSuitability(crop.confidence),
          },
        ];

        setResults(recommendedCrops);
        toast({
          title: "Analysis complete",
          description: "Crop recommendations are ready",
        });
      } else {
        throw new Error("API returned an unsuccessful status");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.response?.data?.message ||
          "Failed to get recommendations. Please try again.",
      });
      console.error("API Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSuitability = (
    confidence: number
  ): "Excellent" | "Good" | "Moderate" => {
    if (confidence > 0.85) return "Excellent";
    if (confidence > 0.7) return "Good";
    return "Moderate";
  };

  const handleReset = () => {
    setNitrogen("");
    setPhosphorus("");
    setPotassium("");
    setTemperature("");
    setHumidity("");
    setPh("");
    setRainfall("");
    // setSoilType("loamy");
    setResults([]);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <Card className="lg:col-span-2 agro-card-shadow">
          <CardHeader>
            <CardTitle>Crop Recommendation</CardTitle>
            <CardDescription>
              Enter your soil and environmental data to get personalized crop
              recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Form Fields */}
                <div className="space-y-2">
                  <Label htmlFor="nitrogen">Nitrogen (N) in kg/ha</Label>
                  <Input
                    id="nitrogen"
                    type="number"
                    placeholder="e.g. 90"
                    value={nitrogen}
                    onChange={(e) => setNitrogen(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phosphorus">Phosphorus (P) in kg/ha</Label>
                  <Input
                    id="phosphorus"
                    type="number"
                    placeholder="e.g. 45"
                    value={phosphorus}
                    onChange={(e) => setPhosphorus(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="potassium">Potassium (K) in kg/ha</Label>
                  <Input
                    id="potassium"
                    type="number"
                    placeholder="e.g. 40"
                    value={potassium}
                    onChange={(e) => setPotassium(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature (°C)</Label>
                  <Input
                    id="temperature"
                    type="number"
                    placeholder="e.g. 25"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="humidity">Humidity (%)</Label>
                  <Input
                    id="humidity"
                    type="number"
                    placeholder="e.g. 75"
                    value={humidity}
                    onChange={(e) => setHumidity(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ph">pH Value</Label>
                  <Input
                    id="ph"
                    type="number"
                    step="0.1"
                    placeholder="e.g. 6.5"
                    value={ph}
                    onChange={(e) => setPh(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rainfall">Rainfall (mm)</Label>
                  <Input
                    id="rainfall"
                    type="number"
                    placeholder="e.g. 80"
                    value={rainfall}
                    onChange={(e) => setRainfall(e.target.value)}
                  />
                </div>
                 
              </div>

              {/* Buttons */}
              <div className="flex space-x-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sprout className="mr-2 h-4 w-4" />
                      Get Recommendation
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={handleReset}>
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {results.length > 0 && (
            <Card className="border-crop shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Top Recommendation</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-center">
                <div className="text-3xl font-bold text-crop capitalize">
                  {results[0].cropName}
                </div>
                <Badge variant="secondary">
                  {results[0].confidence}% Confidence
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Based on your soil and environment, we recommend growing{" "}
                  {results[0].cropName}.
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Info className="h-5 w-5 text-blue-600" />
                <span>How it works</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Our AI model analyzes:</p>
              <ul className="space-y-1 ml-4 list-disc">
                <li>Soil nutrient levels (N, P, K)</li>
                <li>Environmental conditions</li>
                <li>Historical data patterns</li>
                <li>Regional crop performance</li>
              </ul>
              <p>
                The recommendation is based on ML models trained on thousands of
                agricultural datasets.
              </p>
            </CardContent>
          </Card>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Sample values:</strong> N: 36, P: 53, K: 44, Temp:
              20.87°C, Humidity: 82%, pH: 6.5, Rainfall: 202.93mm
            </AlertDescription>
          </Alert>
        </div>
      </div>

      {/* Pro Tips */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base">💡 Pro Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>• Test soil regularly for accurate readings</p>
          <p>• Consider seasonal variations</p>
          <p>• Check local market demands</p>
          <p>• Consult local agricultural experts</p>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card className="agro-card-shadow">
          <CardHeader>
            <CardTitle>All Recommended Crops</CardTitle>
            <CardDescription>Based on detailed analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              {results.map((result) => (
                <div
                  key={result.cropName}
                  className="flex flex-col border rounded-lg overflow-hidden"
                >
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg">
                        {result.cropName}
                      </h3>
                      <div
                        className={`px-2 py-1 text-xs rounded-full ${
                          result.suitability === "Excellent"
                            ? "bg-green-100 text-green-800"
                            : result.suitability === "Good"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {result.suitability}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-agro-primary h-2.5 rounded-full"
                          style={{ width: `${result.confidence}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm font-medium">
                        {result.confidence}%
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground flex-1">
                      {result.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            Recommendations are based on soil characteristics and environmental
            conditions.
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
