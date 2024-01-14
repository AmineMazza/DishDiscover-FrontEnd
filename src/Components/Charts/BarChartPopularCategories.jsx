import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChartPopularCategories = ({ categoryCounts }) => {
  const data = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        label: 'Number of Restaurants',
        data: Object.values(categoryCounts),
        backgroundColor: 'rgba(75,192,192,0.6)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      x: { title: { display: true, text: 'Categories' } },
      y: { title: { display: true, text: 'Number of Restaurants' }, beginAtZero: true },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarChartPopularCategories;
