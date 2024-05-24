import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    mese: "Gen",
    ordini: 240,
  },
  {
    mese: "Feb",
    ordini: 300,
  },
  {
    mese: "Mar",
    ordini: 200,
  },
  {
    mese: "Apr",
    ordini: 278,
  },
  {
    mese: "Mag",
    ordini: 189,
  },
  {
    mese: "Giu",
    ordini: 239,
  },
  {
    mese: "Lug",
    ordini: 278,
  },
  {
    mese: "Ago",
    ordini: 189,
  },
];

function useWindowSize() {
  const [windowSize, setWindowSize] = useState<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}

export default function BarChartComponent() {
  const size = useWindowSize();

  const isMobile = size!.width <= 768;

  return (
    <div className="w-full h-64 md:h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: isMobile ? 10 : 30,
            left: isMobile ? 10 : 20,
            bottom: 5,
          }}
        >
          <XAxis
            dataKey="mese"
            scale="point"
            padding={{ left: isMobile ? 20 : 50, right: isMobile ? 20 : 50 }}
          />
          <YAxis type="number" domain={[0, "auto"]} />
          <Tooltip />
          <Legend />
          <Bar dataKey="ordini" background={{ fill: "transparent" }} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
