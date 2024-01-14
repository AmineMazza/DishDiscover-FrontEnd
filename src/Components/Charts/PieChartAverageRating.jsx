import React from 'react';
import { Pie } from 'react-chartjs-2';

const PieChartAverageRating = ({ averageRatingAll, averageRatingFiltered }) => {
  const data = {
    labels: ['All Restaurants', 'Filtered Restaurants'],
    datasets: [
      {
        data: [averageRatingAll, averageRatingFiltered],
        backgroundColor: ['#FF6384', '#36A2EB'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB'],
      },
    ],
  };

  const options = {
    legend: { display: true, position: 'bottom' },
  };

  return <Pie data={data} options={options} />;
};

export default PieChartAverageRating;
