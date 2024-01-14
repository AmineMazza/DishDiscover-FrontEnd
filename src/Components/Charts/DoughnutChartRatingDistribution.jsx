import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChartRatingDistribution = ({ restaurantData }) => {
  const ratingDistribution = restaurantData.reduce(
    (distribution, restaurant) => {
      const rating = Math.floor(restaurant.stars);
      distribution[rating] = (distribution[rating] || 0) + 1;
      return distribution;
    },
    {}
  );

  const data = {
    labels: Object.keys(ratingDistribution),
    datasets: [
      {
        data: Object.values(ratingDistribution),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  const options = {
    legend: { display: true, position: "bottom" },
  };

  return <Doughnut data={data} options={options} />;
};

export default DoughnutChartRatingDistribution;
