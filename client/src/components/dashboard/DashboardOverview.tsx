import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip as ChartJSTooltip,
  Legend as ChartJSLegend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

ChartJS.register(
  Title,
  ChartJSTooltip,
  ChartJSLegend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement
);

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

interface Prediction {
  _id: string;
  modelType: "crop" | "yield" | "fertilizer";
  inputData: any;
  predictionResult: any;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export default function DashboardOverview() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const userResponse = await api.get("/api/user");
      const userData = userResponse.data;
      const user = userData.data?.user || userData;

      if (!user?.id || !user?.name) {
        throw new Error(`Invalid user data format`);
      }

      setUser({
        id: user.id,
        name: user.name,
        email: user.email || "N/A",
      });

      const predictionResponse = await api.get("/api/predictions");
      const predictionData = predictionResponse.data;
      let predictionsArray: Prediction[] = [];

      if (predictionData.status === "success" && Array.isArray(predictionData.data)) {
        predictionsArray = predictionData.data;
      } else if (Array.isArray(predictionData)) {
        predictionsArray = predictionData;
      } else if (Array.isArray(predictionData.predictions)) {
        predictionsArray = predictionData.predictions;
      } else {
        throw new Error(`Invalid predictions data format`);
      }

      predictionsArray = predictionsArray.filter(pred => {
        const isValid =
          pred._id &&
          pred.modelType &&
          pred.createdAt &&
          (pred.modelType !== "yield" || (pred.predictionResult && typeof pred.predictionResult.yield === "number")) &&
          (pred.modelType !== "crop" || (pred.predictionResult && pred.predictionResult.crop && typeof pred.predictionResult.confidence === "number")) &&
          (pred.modelType !== "fertilizer" || (pred.predictionResult && pred.predictionResult.fertilizer && typeof pred.predictionResult.confidence === "number"));
        return isValid;
      });

      setPredictions(predictionsArray);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to load data";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const cropPredictions = predictions.filter(p => p.modelType === "crop");
  const yieldPredictions = predictions.filter(p => p.modelType === "yield");
  const fertilizerPredictions = predictions.filter(p => p.modelType === "fertilizer");

  const latestCrop = cropPredictions[0];
  const latestYield = yieldPredictions[0];
  const latestFertilizer = fertilizerPredictions[0];

  const yieldChartData = yieldPredictions.slice(0, 5).map(pred => ({
    name: pred.inputData?.Item || "Crop",
    yield: pred.predictionResult?.yield ? (pred.predictionResult.yield / 10000).toFixed(1) : "0.0",
    date: new Date(pred.createdAt).toLocaleDateString(),
  }));

  const fertilizerCounts = fertilizerPredictions.reduce((acc, pred) => {
    const fertilizer = pred.predictionResult?.fertilizer || "Unknown Fertilizer";
    acc[fertilizer] = (acc[fertilizer] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const fertilizerChartData = {
    labels: Object.keys(fertilizerCounts),
    datasets: [
      {
        label: "Fertilizer Recommendations",
        data: Object.values(fertilizerCounts),
        backgroundColor: ["#4CAF50", "#2196F3", "#FFC107", "#FF5722"],
        borderWidth: 1,
      },
    ],
  };

  const npkData = cropPredictions.reduce((acc, pred) => {
    const crop = pred.predictionResult?.crop || "Unknown Crop";
    const N = typeof pred.inputData?.N === "number" ? pred.inputData.N : 0;
    const P = typeof pred.inputData?.P === "number" ? pred.inputData.P : 0;
    const K = typeof pred.inputData?.K === "number" ? pred.inputData.K : 0;
    if (!acc[crop]) {
      acc[crop] = { N: [], P: [], K: [] };
    }
    acc[crop].N.push(N);
    acc[crop].P.push(P);
    acc[crop].K.push(K);
    return acc;
  }, {} as Record<string, { N: number[]; P: number[]; K: number[] }>);

  const npkChartData = {
    labels: Object.keys(npkData),
    datasets: [
      {
        label: "Nitrogen (N)",
        data: Object.keys(npkData).map(crop => {
          const values = npkData[crop].N;
          return values.length ? Math.round(values.reduce((sum, val) => sum + val, 0) / values.length) : 0;
        }),
        backgroundColor: "#4CAF50",
        barThickness: 20,
      },
      {
        label: "Phosphorous (P)",
        data: Object.keys(npkData).map(crop => {
          const values = npkData[crop].P;
          return values.length ? Math.round(values.reduce((sum, val) => sum + val, 0) / values.length) : 0;
        }),
        backgroundColor: "#2196F3",
        barThickness: 20,
      },
      {
        label: "Potassium (K)",
        data: Object.keys(npkData).map(crop => {
          const values = npkData[crop].K;
          return values.length ? Math.round(values.reduce((sum, val) => sum + val, 0) / values.length) : 0;
        }),
        backgroundColor: "#FFC107",
        barThickness: 20,
      },
    ],
  };

  const handleChartClick = (data: any, type: string) => {
    if (data && data.activePayload) {
      toast({
        title: `${type} Prediction`,
        description: `Selected: ${data.activePayload[0].payload.name} on ${data.activePayload[0].payload.date}`,
      });
    }
  };

  const handleChartJSClick = (event: any, elements: any[], type: string) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      const label = type === "Fertilizer" ? fertilizerChartData.labels[index] : npkChartData.labels[index];
      toast({
        title: `${type} Chart`,
        description: `Selected: ${label}`,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <Loader2 className="animate-spin h-12 w-12 text-agro-primary" />
        <p className="text-lg">Loading your farm data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <div className="bg-red-100 p-4 rounded-lg max-w-md text-center">
          <h2 className="text-lg font-bold text-red-800">Error Loading Data</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-agro-primary text-white rounded hover:bg-agro-primary-dark transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {user?.name || "User"}!
        </h1>
        <div className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Quick Stats */}
      {/* ... your quick stats code here ... */}

      {/* Charts Section */}
      <div className="space-y-6">
        {/* Row 1: Yield + NPK */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Yield Chart */}
          {yieldPredictions.length > 0 && (
            <Card className="agro-card-shadow hover:shadow-lg hover:scale-[1.02] transition-transform duration-300 cursor-pointer">
              <CardHeader>
                <CardTitle>Recent Yield Predictions</CardTitle>
                <CardDescription>Your crop yield estimates</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={yieldChartData} onClick={(data) => handleChartClick(data, "Yield")}>
                    <XAxis dataKey="date" />
                    <YAxis label={{ value: "Yield (t/ha)", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="yield" name="Yield" stroke="#7C3AED" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* NPK Chart */}
          {cropPredictions.length > 0 && (
            <Card className="agro-card-shadow hover:shadow-lg hover:scale-[1.02] transition-transform duration-300 cursor-pointer">
              <CardHeader>
                <CardTitle>Average NPK per Predicted Crop</CardTitle>
                <CardDescription>NPK values for recommended crops</CardDescription>
              </CardHeader>
              <CardContent>
                <Bar
                  data={npkChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    onClick: (event, elements) => handleChartJSClick(event, elements, "NPK"),
                  }}
                  height={300}
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Row 2: Fertilizer */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Fertilizer Chart */}
          {fertilizerPredictions.length > 0 && (
            <Card className="agro-card-shadow hover:shadow-lg hover:scale-[1.02] transition-transform duration-300 cursor-pointer">
              <CardHeader>
                <CardTitle>Fertilizer Recommendations Share</CardTitle>
                <CardDescription>Distribution of fertilizer recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <Pie
                  data={fertilizerChartData}
                  options={{
                    responsive: true,
                    onClick: (event, elements) => handleChartJSClick(event, elements, "Fertilizer"),
                  }}
                />
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}
