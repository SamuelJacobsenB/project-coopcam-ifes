import {
  ArcElement,
  Chart as ChartJS,
  type ChartOptions,
  Legend,
  Title,
  Tooltip,
} from "chart.js";
import { Pie } from "react-chartjs-2";

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
  const options: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false, // Permite que o gráfico preencha o container definido no CSS
    plugins: {
      legend: {
        display: labelDisplay,
        position: "right", // Alterado para 'right' para melhor leitura com valores
        align: "center",
        labels: {
          font: {
            size: legendFontSize,
          },
          boxWidth: 12,
          padding: 10,
          // Esta função customiza o texto da legenda para incluir os números
          generateLabels: (chart) => {
            const datasets = chart.data.datasets;
            return chart.data.labels!.map((label, i) => ({
              text: `${label}: ${datasets[0].data[i]}`, // Formato: "Nome: Valor"
              fillStyle: (datasets[0].backgroundColor as string[])[i],
              strokeStyle: (datasets[0].backgroundColor as string[])[i],
              lineWidth: 0,
              hidden: false,
              index: i,
            }));
          },
        },
      },
      title: {
        display: !!title,
        text: title,
        font: {
          size: 16,
        },
      },
      tooltip: {
        enabled: true, // Garante que o hover funcione
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Pie className={className} data={data} options={options} />
    </div>
  );
}
