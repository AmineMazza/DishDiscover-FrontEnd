import React from 'react';
import { PolarArea } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const PolarAreaChartAverageRatings = ({ restaurantData }) => {
  const categories = [...new Set(restaurantData.map((restaurant) => restaurant.category))];
  const data = {
    labels: categories,
    datasets: [
      {
        data: categories.map((category) => {
          const categoryRestaurants = restaurantData.filter(
            (restaurant) => restaurant.category === category
          );
          const averageRating =
            categoryRestaurants.reduce((sum, restaurant) => sum + restaurant.stars, 0) /
            categoryRestaurants.length;
          return averageRating.toFixed(2);
        }),
        backgroundColor: 'rgba(75,192,192,0.6)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scale: { ticks: { beginAtZero: true, max: 5 } },
  };

  return <PolarArea data={data} options={options} />;
};

export default PolarAreaChartAverageRatings;
