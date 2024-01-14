import React from 'react';
import { Bar } from 'react-chartjs-2';

const HorizontalBarChartAverageReviewsPerCategory = ({ restaurantData }) => {
  const categoryAverageReviews = restaurantData.reduce((averageReviews, restaurant) => {
    averageReviews[restaurant.category] =
      (averageReviews[restaurant.category] || 0) + restaurant.numberOfReviews;
    return averageReviews;
  }, {});

  Object.keys(categoryAverageReviews).forEach(
    (category) =>
      (categoryAverageReviews[category] =
        categoryAverageReviews[category] / restaurantData.filter((r) => r.category === category).length)
  );

  const data = {
    labels: Object.keys(categoryAverageReviews),
    datasets: [
      {
        label: 'Average Reviews per Category',
        data: Object.values(categoryAverageReviews),
        backgroundColor: 'rgba(75,192,192,0.6)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      x: { beginAtZero: true },
      y: { title: { display: true, text: 'Categories' } },
    },
  };

  return <Bar data={data} options={options} />;
};

export default HorizontalBarChartAverageReviewsPerCategory;
