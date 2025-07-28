import React from "react";
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#2E7D32", "#81C784", "#FFA000", "#2196F3", "#FFC107"];

// Dummy prediction data from your API schema
const cropPredictions = [
  { crop: "Rice", count: 3 },
  { crop: "Wheat", count: 2 },
  { crop: "Maize", count: 1 },
];

const fertilizerRecommendations = [
  { fertilizer: "Urea", count: 4 },
  { fertilizer: "DAP", count: 2 },
  { fertilizer: "NPK", count: 3 },
];

const yieldTrends = [
  { name: "Jan", yield: 6.5 },
  { name: "Feb", yield: 7.1 },
  { name: "Mar", yield: 7.3 },
  { name: "Apr", yield: 7.5 },
  { name: "May", yield: 7.8 },
];

export default function DashboardOverview() {
  const userName = JSON.parse(localStorage.getItem("user") || "{\"name\":\"User\"}").name;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {userName}!
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Crop Recommendations</CardTitle>
            <CardDescription>Most frequently recommended</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={cropPredictions}
                  dataKey="count"
                  nameKey="crop"
                  outerRadius={80}
                  label
                >
                  {cropPredictions.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fertilizer Recommendations</CardTitle>
            <CardDescription>Based on your past inputs</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={fertilizerRecommendations}>
                <XAxis dataKey="fertilizer" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#2E7D32" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Yield Predictions</CardTitle>
            <CardDescription>Recent seasonal trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={yieldTrends}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="yield" stroke="#FFA000" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Confidence</CardTitle>
            <CardDescription>Across all predictions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">95%</div>
            <Progress value={95} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Prediction confidence based on model accuracy
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Latest predictions made by you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-sm">🌾 Recommended Crop: Rice — 2 hours ago</div>
          <div className="text-sm">🧪 Fertilizer Suggestion: Urea for Loamy Soil — 4 hours ago</div>
          <div className="text-sm">📈 Yield Prediction: 7.8 t/ha for area 10.0 — 1 day ago</div>
        </CardContent>
      </Card>
    </div>
  );
}