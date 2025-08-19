import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import axios from "axios";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement
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
  userId: string;
  modelType: "crop" | "yield" | "fertilizer";
  inputData: any;
  predictionResult: any;
  createdAt: string;
}

interface Review {
  _id: string;
  userId: {
    _id: string;
    username: string;
  };
  modelType: "crop" | "yield" | "fertilizer";
  rating: number;
  comment: string;
  createdAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [reviews] = useState<Review[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const predictionResponse = await api.get("/api/predictions/all");
      console.log("Predictions API Response:", predictionResponse);

      let predictionsArray: Prediction[] = [];
      if (
        predictionResponse.data.status === "success" &&
        Array.isArray(predictionResponse.data.data)
      ) {
        predictionsArray = predictionResponse.data.data;
      } else {
        throw new Error("Invalid predictions data format");
      }
      console.log("Predictions Data:", predictionsArray);

      setPredictions(predictionsArray);

      const userResponse = await api.get("/api/user/all");
      let usersArray: User[] = [];
      if (Array.isArray(userResponse.data)) {
        usersArray = userResponse.data;
      } else {
        throw new Error("Invalid users data format");
      }
      setUsers(usersArray);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to load data";
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

  const userRegistrationsData = {
    labels: [...new Set(users.map((u) => new Date(u.createdAt).toLocaleDateString()))].sort(),
    datasets: [
      {
        label: "User Registrations",
        data: [...new Set(users.map((u) => new Date(u.createdAt).toLocaleDateString()))].map(
          (date) => users.filter((u) => new Date(u.createdAt).toLocaleDateString() === date).length
        ),
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const modelTypeCounts = predictions.reduce((acc, pred) => {
    acc[pred.modelType] = (acc[pred.modelType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const modelTypeData = {
    labels: Object.keys(modelTypeCounts),
    datasets: [
      {
        label: "Predictions by Model Type",
        data: Object.values(modelTypeCounts),
        backgroundColor: ["#4CAF50", "#2196F3", "#FFC107"],
      },
    ],
  };

  const cropCounts = predictions
    .filter((p) => p.modelType === "crop")
    .reduce((acc, pred) => {
      const crop = pred.predictionResult?.crop || "Unknown";
      acc[crop] = (acc[crop] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const cropData = {
    labels: Object.keys(cropCounts),
    datasets: [
      {
        label: "Count",
        data: Object.values(cropCounts),
        backgroundColor: "#4CAF50",
      },
    ],
  };

  const fertilizerCounts = predictions
    .filter((p) => p.modelType === "fertilizer")
    .reduce((acc, pred) => {
      const fertilizer = pred.predictionResult?.fertilizer || "Unknown";
      acc[fertilizer] = (acc[fertilizer] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const fertilizerData = {
    labels: Object.keys(fertilizerCounts),
    datasets: [
      {
        label: "Count",
        data: Object.values(fertilizerCounts),
        backgroundColor: "#2196F3",
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <Loader2 className="animate-spin h-12 w-12 text-agro-primary" />
        <p className="text-lg">Loading admin data...</p>
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
    <div className="space-y-8">
      <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>

      {/* Row 1 */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="agro-card-shadow hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>User Registrations Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <Line data={userRegistrationsData} />
          </CardContent>
        </Card>

        <Card className="agro-card-shadow hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Most Common Predicted Crops</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={cropData} />
          </CardContent>
        </Card>
      </div>

      {/* Row 2 */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="agro-card-shadow hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Predictions by Model Type</CardTitle>
          </CardHeader>
          <CardContent>
            <Doughnut data={modelTypeData} />
          </CardContent>
        </Card>

        <Card className="agro-card-shadow hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Most Common Recommended Fertilizers</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar
              data={fertilizerData}
              options={{
                indexAxis: "y",
                responsive: true,
                plugins: {
                  legend: { display: false },
                  title: {
                    display: true,
                    text: "Fertilizer Frequency",
                  },
                },
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
