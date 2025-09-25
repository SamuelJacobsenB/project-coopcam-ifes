import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface PizzaProps {
  title?: string;
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
      borderColor?: string[];
      borderWidth?: number;
    }[];
  };
  className?: string;
  legendFontSize?: number;
  labelDisplay?: boolean;
}

export function Pizza({
  title,
  data,
  className,
  legendFontSize = 12,
  labelDisplay = true,
}: PizzaProps) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: labelDisplay,
        position: "left",
        align: "start",
        labels: {
          font: {
            size: legendFontSize,
          },
          boxWidth: 12,
          padding: 2,
        },
      },
      title: {
        display: !!title,
        text: title,
        font: {
          size: 16,
        },
      },
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
    },
  };

  return <Pie className={className} data={data} options={options as any} />;
}
