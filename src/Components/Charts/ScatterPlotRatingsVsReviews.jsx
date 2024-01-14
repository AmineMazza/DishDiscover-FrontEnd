import React from 'react';
import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);


const ScatterPlotRatingsVsReviews = ({ restaurantData }) => {
  const data = {
    datasets: [
      {
        label: 'Ratings vs. Number of Reviews',
        data: restaurantData.map((restaurant) => ({
          x: restaurant.numberOfReviews,
          y: restaurant.stars,
        })),
        backgroundColor: 'rgba(75,192,192,0.6)',
      },
    ],
  };

  const options = {
    scales: {
      x: { type: 'linear', position: 'bottom' },
      y: { beginAtZero: true, max: 5 },
    },
  };

  return <Scatter data={data} options={options} />;
};

export default ScatterPlotRatingsVsReviews;
