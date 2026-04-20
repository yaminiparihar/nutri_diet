import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const NutritionChart = ({ consumed }) => {
  const required = { calories: 2000, protein: 50, iron: 18 };

  const data = {
    labels: ['Calories', 'Protein (g)', 'Iron (mg)'],
    datasets: [
      {
        label: 'Consumed',
        data: [consumed.calories, consumed.protein, consumed.iron],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Required',
        data: [required.calories, required.protein, required.iron],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Consumed vs Required Nutrients',
      },
    },
  };

  return (
    <div className="nutrition-chart">
      <h2>Nutrition Chart</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default NutritionChart;