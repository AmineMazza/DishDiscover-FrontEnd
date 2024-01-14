import React from 'react';
import { Bubble } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);


const BubbleChartRatingsVsReviewsVsReviewLength = ({ restaurantData }) => {
  const data = {
    datasets: [
      {
        label: 'Ratings vs. Number of Reviews vs. Average Review Length',
        data: restaurantData.map((restaurant) => ({
          x: restaurant.numberOfReviews,
          y: restaurant.stars,
          r: restaurant?.ratingText?.length / 10, // Adjust the factor for better visualization
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

  return <Bubble data={data} options={options} />;
};

export default BubbleChartRatingsVsReviewsVsReviewLength;
