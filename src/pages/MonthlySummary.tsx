import { useEffect, useState } from "react";
import { listenToTransactions, Transaction } from "@/lib/db";
import PageWrapper from "@/components/PageWrapper";
import NetMonthlyBarChart from "@/components/charts/NetMonthlyBarChart";

const normalizeDate = (t: Transaction) => {
  if (t.date?.seconds) return new Date(t.date.seconds * 1000);
  return new Date(t.date);
};

const getMonthKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

const formatMonthLabel = (key: string) => {
  const [year, month] = key.split("-");
  const date = new Date(Number(year), Number(month) - 1);

  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

const formatShortMonthLabel = (key: string) => {
  const [year, month] = key.split("-");
  const date = new Date(Number(year), Number(month) - 1);

  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "2-digit",
  });
};

const formatMoney = (value: number) => {
  return `$${Math.abs(value).toFixed(2)}`;
};

type MonthlyData = {
  income: number;
  expenses: number;
  safedropSaved: number;
  safedropWithdrawn: number;
  net: number;
};

export default function MonthlySummary() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const stop = listenToTransactions(setTransactions);
    return () => stop();
  }, []);

  const normalized = transactions.map((t) => ({
    ...t,
    amount: Number(t.amount) || 0,
    dateObj: normalizeDate(t),
  }));

  const monthlyTotals: Record<string, MonthlyData> = {};

  normalized.forEach((t) => {
    const key = getMonthKey(t.dateObj);

    if (!monthlyTotals[key]) {
      monthlyTotals[key] = {
        income: 0,
        expenses: 0,
        safedropSaved: 0,
        safedropWithdrawn: 0,
        net: 0,
      };
    }

    if (t.type === "income") {
      monthlyTotals[key].income += Math.abs(t.amount);
    }

    if (t.type === "expense") {
      monthlyTotals[key].expenses += Math.abs(t.amount);
    }

    if (t.type === "safedrop" && t.amount > 0) {
      monthlyTotals[key].safedropSaved += Math.abs(t.amount);
    }

    if (t.type === "safedrop" && t.amount < 0) {
      monthlyTotals[key].safedropWithdrawn += Math.abs(t.amount);
    }
  });

  Object.keys(monthlyTotals).forEach((key) => {
    const month = monthlyTotals[key];

    // Net available movement for the month.
    // SafeDrop withdrawals are not added here because they already become
    // either income or expense through the paired transaction.
    month.net = month.income - month.expenses - month.safedropSaved;
  });

  const labelsAsc = Object.keys(monthlyTotals).sort();
  const labelsDesc = [...labelsAsc].reverse();

  // Chart shows latest 6 months, left-to-right from older to newer.
  const latestChartKeys = labelsDesc.slice(0, 6).reverse();

  const chartLabels = latestChartKeys.map(formatShortMonthLabel);
  const chartValues = latestChartKeys.map((key) => monthlyTotals[key].net);

  return (
    <PageWrapper>
      <div className="p-4 pb-24 space-y-6">
        <h1 className="text-2xl font-bold">Monthly Summary</h1>

        {labelsAsc.length === 0 ? (
          <p className="text-gray-500">No data yet</p>
        ) : (
          <>
            <div className="p-4 bg-white rounded-xl shadow-sm">
              <div className="mb-4">
                <h2 className="font-semibold">Latest Monthly Net</h2>
                <p className="text-sm text-gray-500">
                  Green means you kept money. Red means you spent more than you
                  brought in.
                </p>
              </div>

              <NetMonthlyBarChart
                labels={chartLabels}
                dataPoints={chartValues}
              />
            </div>

            <div className="space-y-4">
              {labelsDesc.map((key) => {
                const month = monthlyTotals[key];

                return (
                  <div key={key} className="p-4 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-semibold">{formatMonthLabel(key)}</h2>

                      <p
                        className={`font-bold ${
                          month.net >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {month.net >= 0 ? "+" : "-"}
                        {formatMoney(month.net)}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="p-3 bg-green-50 rounded-xl">
                        <p className="text-gray-500">Income</p>
                        <p className="font-semibold text-green-600">
                          +{formatMoney(month.income)}
                        </p>
                      </div>

                      <div className="p-3 bg-red-50 rounded-xl">
                        <p className="text-gray-500">Expenses</p>
                        <p className="font-semibold text-red-600">
                          -{formatMoney(month.expenses)}
                        </p>
                      </div>

                      <div className="p-3 bg-blue-50 rounded-xl">
                        <p className="text-gray-500">SafeDrop Saved</p>
                        <p className="font-semibold text-blue-600">
                          -{formatMoney(month.safedropSaved)}
                        </p>
                      </div>

                      <div className="p-3 bg-purple-50 rounded-xl">
                        <p className="text-gray-500">SafeDrop Withdrawn</p>
                        <p className="font-semibold text-purple-600">
                          {formatMoney(month.safedropWithdrawn)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </PageWrapper>
  );
}