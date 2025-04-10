"use client&quot;

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from &quot;recharts&quot;;
import { Card } from &quot;@/components/ui/card&quot;;

const Chart = ({ data }: { data: { name: string; total: number }[] }) => {
  return (
    <Card>
      <ResponsiveContainer width=&quot;100%&quot; height={400}>
        <BarChart data={data}>
          <XAxis
            dataKey=&quot;name&quot;
            stroke=&quot;888888&quot;
            fontSize={12}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            stroke=&quot;888888&quot;
            fontSize={12}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `NGN${value}`}
          />
          <Tooltip />
          <Bar dataKey=&quot;total&quot; fill=&quot;#8884d8" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default Chart;
