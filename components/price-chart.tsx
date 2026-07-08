"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { PricePoint } from "@/lib/data-provider";

interface PriceChartProps {
  data: PricePoint[];
  isPositive: boolean;
}

export default function PriceChart({ data, isPositive }: PriceChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const chartColor = isPositive ? "#10b981" : "#ef4444"; // Emerald vs Red
  const gradientId = `colorPrice-${isPositive ? "pos" : "neg"}`;

  // Custom Tooltip component for Recharts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl shadow-xl">
          <p className="text-xs text-zinc-500 font-semibold mb-0.5">
            {payload[0].payload.date}
          </p>
          <p className="text-sm text-white font-extrabold">
            ${payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (!mounted) {
    return (
      <div className="w-full h-80 flex items-center justify-center bg-zinc-900/10 border border-zinc-850 rounded-2xl animate-pulse">
        <span className="text-zinc-500 text-sm font-medium">Loading price history...</span>
      </div>
    );
  }

  // Calculate dynamic domain to keep chart centered and zoomed on fluctuations
  const prices = data.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const padding = (maxPrice - minPrice) * 0.1 || 1; // Fallback pad
  const domainMin = Math.max(0, minPrice - padding);
  const domainMax = maxPrice + padding;

  return (
    <div className="w-full">
      {/* Price History Section Label */}
      <div className="mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Price history
        </h3>
      </div>

      {/* Chart Wrapper */}
      <div className="h-80 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.25} />
                <stop offset="95%" stopColor={chartColor} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#27272a"
              opacity={0.3}
              vertical={false}
            />
            <XAxis
              dataKey="date"
              stroke="#52525b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dy={10}
              fontWeight={500}
            />
            <YAxis
              domain={[domainMin, domainMax]}
              stroke="#52525b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dx={-5}
              fontWeight={500}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#3f3f46", strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="price"
              stroke={chartColor}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#${gradientId})`}
              activeDot={{ r: 6, strokeWidth: 0, fill: chartColor }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
