import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const RadarChartRatingsAcrossCategories = ({ restaurantData }) => {
  const categories = [...new Set(restaurantData.map((restaurant) => restaurant.category))];
  const datasets = categories.map((category) => ({
    label: category,
    data: restaurantData
      .filter((restaurant) => restaurant.category === category)
      .map((restaurant) => restaurant.stars),
    borderColor: 'rgba(75,192,192,1)',
    backgroundColor: 'rgba(75,192,192,0.4)',
    borderWidth: 2,
    pointRadius: 4,
  }));

  const data = {
    labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
    datasets: datasets,
  };

  const options = {
    scale: {
      ticks: { beginAtZero: true, max: 5 },
    },
  };

  return <Radar data={data} options={options} />;
};

export default RadarChartRatingsAcrossCategories;
