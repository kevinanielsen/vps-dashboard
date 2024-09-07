import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Stats {
  cpu_usage: number[];
  memory_used: number;
  memory_total: number;
}

function App() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/stats")
      .then((response) => response.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching stats:", error));
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!stats) {
    return <div>Error fetching stats</div>;
  }

  // Calculate the percentage of memory used
  const memoryPercentage = (stats.memory_used / stats.memory_total) * 100;

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* CPU Usage Per Core */}
        <Card>
          <CardHeader>
            <CardTitle>CPU Usage Per Core</CardTitle>
            <CardDescription>Usage for each core</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.cpu_usage.map((usage, index) => (
              <div key={index} className="mb-4">
                <p>Core {index + 1}: {usage.toFixed(2)}%</p>
                <Progress value={usage} max={100} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Memory Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Memory Usage</CardTitle>
            <CardDescription>Total Memory Usage of the VPS</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={memoryPercentage} max={100} />
            <p>
              {(stats.memory_used / (1024 * 1024)).toFixed(2)} MB used of {(stats.memory_total / (1024 * 1024)).toFixed(2)} MB
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
