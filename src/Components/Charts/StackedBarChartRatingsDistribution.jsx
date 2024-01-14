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

const StackedBarChartRatingsDistribution = ({ restaurantData }) => {
  const categories = [...new Set(restaurantData.map((restaurant) => restaurant.category))];
  const datasets = categories.map((category) => ({
    label: category,
    data: Array.from({ length: 5 }, (_, index) =>
      restaurantData
        .filter(
          (restaurant) => restaurant.category === category && Math.floor(restaurant.stars) === index + 1
        )
        .reduce((count, restaurant) => count + 1, 0)
    ),
    backgroundColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
      Math.random() * 256
    )}, ${Math.floor(Math.random() * 256)}, 0.6)`,
    borderColor: 'rgba(255, 255, 255, 1)',
    borderWidth: 1,
  }));

  const data = {
    labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
    datasets: datasets,
  };

  const options = {
    scales: {
      x: { stacked: true },
      y: { stacked: true, beginAtZero: true, max: restaurantData.length },
    },
  };

  return <Bar data={data} options={options} />;
};

export default StackedBarChartRatingsDistribution;
