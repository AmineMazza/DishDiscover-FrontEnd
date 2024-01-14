import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChartAverageRatingsOverTime = ({ restaurantData }) => {
  const dates = restaurantData.map((restaurant) => restaurant.date); // Assuming you have a date property in your data
  const ratings = restaurantData.map((restaurant) => restaurant.stars);

  const data = {
    labels: dates,
    datasets: [
      {
        label: 'Average Rating Over Time',
        data: ratings,
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  const options = {
    scales: {
      x: { type: 'time', time: { unit: 'day' } },
      y: { beginAtZero: true, max: 5 },
    },
  };

  return <Line data={data} options={options} />;
};

export default LineChartAverageRatingsOverTime;
