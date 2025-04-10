import { getPerformance } from &quot;@/app/actions/getPerformance&quot;
import Chart from &quot;@/components/performance/Chart&quot;
import DataCard from &quot;@/components/performance/DataCard&quot;
import { auth } from &quot;@clerk/nextjs/server&quot;
import { redirect } from &quot;next/navigation&quot;

const PerformancePage = async () => {
  const { userId } = auth()

  if (!userId) {
    return redirect(&quot;/sign-in&quot;)
  }

  const { data, totalRevenue, totalSales } = await getPerformance(userId)

  return (
    <div className="p-6&quot;>
      <div className=&quot;grid grid-cols-1 md:grid-cols-2 gap-4 mb-4&quot;>
        <DataCard value={totalRevenue} label=&quot;Total Revenue&quot; shouldFormat />
        <DataCard value={totalSales} label=&quot;Total Sales" />
        <Chart data={data} />
      </div>
    </div>
  )
}

export default PerformancePage