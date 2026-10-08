"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Currency, HuntChartData } from "@/lib/types";
import { IconBarChart } from "@/components/ui/Icons";
import EmptyState from "@/components/ui/EmptyState";

const tooltipStyle = {
  backgroundColor: "#0d1320",
  border: "1px solid #2a3f5f",
  borderRadius: 12,
  color: "#e6edf7",
  fontSize: 12,
};

const axisStyle = { fill: "#8fa3bd", fontSize: 11 };

function ChartCard({
  title,
  empty,
  children,
}: {
  title: string;
  empty: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
      <h4 className="font-display mb-4 text-sm font-bold text-foreground">
        {title}
      </h4>
      {empty ? (
        <div className="flex h-52 items-center justify-center">
          <EmptyState
            icon={<IconBarChart />}
            title="Pas encore de données"
            description="Ajoute et collecte des slots pour voir ce graphique."
          />
        </div>
      ) : (
        <div className="h-52 sm:h-64">{children}</div>
      )}
    </div>
  );
}

export default function HuntCharts({
  data,
  currency,
}: {
  data: HuntChartData;
  currency: Currency;
}) {
  const hasCollected = data.profitEvolution.length > 0;
  const hasSlots = data.stakeVsWin.length > 0;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ChartCard title="Évolution du total gagné" empty={!hasCollected}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.profitEvolution} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
            <CartesianGrid stroke="#1c2a3f" strokeDasharray="3 3" />
            <XAxis dataKey="index" stroke="#8fa3bd" tick={axisStyle} />
            <YAxis stroke="#8fa3bd" tick={axisStyle} />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(v) => [`${Number(v)} ${currency}`, "Cumul gagné"]}
              labelFormatter={(l) => `Slot collectée n° ${l}`}
            />
            <ReferenceLine
              y={0}
              stroke="#2a3f5f"
              strokeDasharray="3 3"
            />
            <Line type="monotone" dataKey="cumulWin" name="Total gagné" stroke="#60a5fa" strokeWidth={2.5} dot={{ r: 3, fill: "#60a5fa" }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Mise vs Gain (par slot)" empty={!hasSlots}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.stakeVsWin} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
            <CartesianGrid stroke="#1c2a3f" strokeDasharray="3 3" />
            <XAxis dataKey="index" stroke="#8fa3bd" tick={axisStyle} />
            <YAxis stroke="#8fa3bd" tick={axisStyle} />
            <Tooltip contentStyle={tooltipStyle} labelFormatter={(l) => `Slot n° ${l}`} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="mise" name="Mise" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="gain" name="Gain" fill="#22d3ee" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Distribution des multiplicateurs" empty={!hasCollected}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.multiplierDistribution} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
            <CartesianGrid stroke="#1c2a3f" strokeDasharray="3 3" />
            <XAxis dataKey="bucket" stroke="#8fa3bd" tick={axisStyle} />
            <YAxis stroke="#8fa3bd" tick={axisStyle} allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => [Number(v), "Slots"]} />
            <Bar dataKey="count" name="Slots" radius={[4, 4, 0, 0]}>
              {data.multiplierDistribution.map((_, i) => (
                <Cell key={i} fill={i % 2 === 0 ? "#3b82f6" : "#22d3ee"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Top slots (par gain)" empty={data.topSlots.length === 0}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.topSlots} layout="vertical" margin={{ top: 4, right: 12, left: 8, bottom: 0 }}>
            <CartesianGrid stroke="#1c2a3f" strokeDasharray="3 3" />
            <XAxis type="number" stroke="#8fa3bd" tick={axisStyle} />
            <YAxis type="category" dataKey="slotName" stroke="#8fa3bd" tick={axisStyle} width={110} />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(v) => [`${Number(v)} ${currency}`, "Gain"]}
            />
            <Bar dataKey="winAmount" name="Gain" fill="#38bdf8" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
