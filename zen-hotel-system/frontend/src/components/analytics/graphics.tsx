import { Bar } from "@/components/analytics/bar";
import { Line } from "@/components/analytics/line";
import { getAnalytics } from "@/lib/data";
import { format } from "date-fns";

export async function Graphics() {
  const analytics = await getAnalytics({});

  function getBarAnalytics(data: Analytic[]) {
    const results: {
      [key: string]: { location: string; web: number; rest: number };
    } = {};

    for (const analytic of data) {
      if (!results[analytic.location]) {
        results[analytic.location] = {
          location: analytic.location,
          web: 0,
          rest: 0,
        };
      }
      results[analytic.location][analytic.source] += 1;
    }
    return Object.values(results);
  }

  function getLineAnalytics(data: Analytic[]) {
    const results: {
      [key: string]: { location: string; [key: string]: number };
    } = {};

    const cleanData = data.map((analytic) => ({
      ...analytic,
      madeAt: format(new Date(analytic.madeAt), "MM/dd/yyyy"),
    }));

    const dates: string[] = [];
    for (const analytic of cleanData) {
      if (!dates.includes(analytic.madeAt)) {
        dates.push(analytic.madeAt);
      }

      if (!results[analytic.location]) {
        results[analytic.location] = {
          location: analytic.location,
        };
      }

      if (results[analytic.location][analytic.madeAt]) {
        results[analytic.location][analytic.madeAt] += 1;
      } else {
        results[analytic.location][analytic.madeAt] = 1;
      }
    }

    for (const property in results) {
      for (const date of dates) {
        if (!results[property][date]) {
          results[property][date] = 0;
        }
      }
    }

    for (const property in results) {
      results[property] = Object.fromEntries(
        Object.entries(results[property]).sort()
      );
    }

    console.log(results);
    return Object.values(results).map((result) => {
      const { location, ...rest } = result;
      return {
        id: location,
        data: Object.entries({ ...rest }).map(([key, value]) => ({
          x: key,
          y: value,
        })),
      };
    });
  }

  const barAnalytics = getBarAnalytics(analytics);
  const lineAnalytics = getLineAnalytics(analytics);

  return (
    <>
      <div className="h-96 bg-white my-5 text-black">
        <Bar data={barAnalytics} />
      </div>
      <div className="h-96 bg-white my-5 text-black">
        <Line data={lineAnalytics} />
      </div>
    </>
  );
}
