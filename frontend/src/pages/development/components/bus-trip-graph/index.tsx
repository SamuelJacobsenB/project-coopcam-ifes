import {
  ArcElement,
  type ChartData,
  Chart as ChartJS,
  type ChartOptions,
  Legend,
  Title,
  Tooltip,
} from "chart.js";
import { Pie } from "react-chartjs-2";

// Registrando os componentes do ChartJS globalmente
ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface PizzaProps {
  title?: string;
  data: ChartData<"pie">;
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
  const options: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false, // Importante para se adaptar ao container
    plugins: {
      legend: {
        display: labelDisplay,
        position: "right", // Legenda à direita fica mais elegante em cards horizontais
        labels: {
          font: {
            size: legendFontSize,
            family: "'Inter', sans-serif",
          },
          usePointStyle: true, // Bolinhas em vez de quadrados
          boxWidth: 8,
          padding: 15,
        },
      },
      title: {
        display: !!title,
        text: title,
        font: { size: 16 },
      },
    },
    layout: {
      padding: 0,
    },
  };

  return (
    <div
      className={className}
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      <Pie data={data} options={options} />
    </div>
  );
}
