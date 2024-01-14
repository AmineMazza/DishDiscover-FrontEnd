import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import {
  IconChartDots2,
  IconLogout,
  IconMap2,
  IconUser,
} from "@tabler/icons-react";
import { Circle, GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { useCallback, useEffect, useState } from "react";
import jsData from "../data/restaurants.json";
import Modal from "../Components/Shared/Modal";
import RadarChartRatingsAcrossCategories from "../Components/Charts/RadarChartRatingsAcrossCategories";
import BarChartPopularCategories from "../Components/Charts/BarChartPopularCategories";
import BubbleChartRatingsVsReviewsVsReviewLength from "../Components/Charts/BubbleChartRatingsVsReviewsVsReviewLength";
import DoughnutChartRatingDistribution from "../Components/Charts/DoughnutChartRatingDistribution";
import HorizontalBarChartAverageReviewsPerCategory from "../Components/Charts/HorizontalBarChartAverageReviewsPerCategory";
import LineChartAverageRatingsOverTime from "../Components/Charts/LineChartAverageRatingsOverTime";
import PieChartAverageRating from "../Components/Charts/PieChartAverageRating";
import PolarAreaChartAverageRatings from "../Components/Charts/PolarAreaChartAverageRatings";
import ScatterPlotRatingsVsReviews from "../Components/Charts/ScatterPlotRatingsVsReviews";
import StackedBarChartRatingsDistribution from "../Components/Charts/StackedBarChartRatingsDistribution";
import axios from "axios";
import { useAuth } from "../Store/useAuth";
import { useNavigate } from "react-router-dom";

const containerStyle = {
  width: "90vw",
  height: "80vh",
  borderRadius: "20px",
};

const center = {
  lat: 31.6304,
  lng: -8.0111,
};

function calculateSuccessProbability(averageRating, numberOfReviews) {
  const ratingWeight = 0.7;
  const reviewsWeight = 0.3;

  const normalizedRating = (averageRating / 5) * 100;

  const weightedSum =
    ratingWeight * normalizedRating + reviewsWeight * (numberOfReviews / 1000);

  const probability = 100 / (1 + Math.exp(-weightedSum));

  return probability.toFixed(2);
}

function calculateCategoryPopularityPercentage(filteredData) {
  if (filteredData.length === 0) {
    return {};
  }

  const totalRestaurants = filteredData.length;

  const categoryCounts = filteredData.reduce((counts, restaurant) => {
    const { category } = restaurant;
    counts[category] = (counts[category] || 0) + 1;
    return counts;
  }, {});

  const categoryPercentages = {};
  for (const category in categoryCounts) {
    const count = categoryCounts[category];
    const percentage = (count / totalRestaurants) * 100;
    categoryPercentages[category] = percentage.toFixed(2);
  }

  return categoryPercentages;
}

function calculateSuccessPercentageForArea(areaFilteredData) {
  if (areaFilteredData.length === 0) {
    return 50;
  }

  const ratingWeight = 0.7;
  const reviewsWeight = 0.3;

  const averageRating =
    areaFilteredData.reduce((sum, restaurant) => sum + restaurant.stars, 0) /
    areaFilteredData.length;
  const totalReviews = areaFilteredData.reduce(
    (sum, restaurant) => sum + restaurant.numberOfReviews,
    0
  );

  const normalizedRating = (averageRating / 5) * 100;

  const weightedSum =
    ratingWeight * normalizedRating + reviewsWeight * (totalReviews / 1000);
  const probability = 100 / (1 + Math.exp(-weightedSum));

  return probability.toFixed(2);
}

const Home = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "",
  });
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [map, setMap] = useState(null);
  const [circleCenter, setCircleCenter] = useState(null);
  const [rests, setRests] = useState(jsData);
  const [filRes, setFilRest] = useState([]);
  const [stats, setStats] = useState({});

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const handleMapClick = (event) => {
    const clickedLatLng = event.latLng;
    setCircleCenter({ lat: clickedLatLng.lat(), lng: clickedLatLng.lng() });

    const restaurantsInRadius = rests.filter((restaurant) => {
      const distance = getDistance(
        clickedLatLng.lat(),
        clickedLatLng.lng(),
        restaurant.latitude,
        restaurant.longitude
      );

      return distance <= 2;
    });
    setFilRest(restaurantsInRadius);

    const filteredRating = restaurantsInRadius.reduce(
      (sum, restaurant) => sum + restaurant.stars,
      0
    );
    const averageRatingFiltered = filteredRating / restaurantsInRadius.length;
    const mostReviewedRestaurant = restaurantsInRadius.reduce(
      (maxReviews, restaurant) => {
        return restaurant.numberOfReviews > maxReviews.numberOfReviews
          ? restaurant
          : maxReviews;
      },
      restaurantsInRadius[0]
    );

    const categoryCounts = restaurantsInRadius.reduce((counts, restaurant) => {
      counts[restaurant.category] = (counts[restaurant.category] || 0) + 1;
      return counts;
    }, {});

    const highestRatedRestaurant = restaurantsInRadius.reduce(
      (maxRating, restaurant) => {
        return restaurant.stars > maxRating.stars ? restaurant : maxRating;
      },
      restaurantsInRadius[0]
    );

    const lowestRatedRestaurant = restaurantsInRadius.reduce(
      (minRating, restaurant) => {
        return restaurant.stars < minRating.stars ? restaurant : minRating;
      },
      restaurantsInRadius[0]
    );

    const filteredReviews = restaurantsInRadius.reduce(
      (sum, restaurant) => sum + restaurant.numberOfReviews,
      0
    );
    const averageReviewsFiltered = filteredReviews / restaurantsInRadius.length;

    const sortedCategories = Object.entries(categoryCounts).sort(
      (a, b) => b[1] - a[1]
    );
    const mostPopularCategories = sortedCategories.slice(0, 3);

    const highRatedRestaurantsCount = restaurantsInRadius.filter(
      (restaurant) => restaurant.stars > 4.5
    ).length;

    const filteredReviewLength = restaurantsInRadius.reduce(
      (sum, restaurant) => {
        if (restaurant.ratingText) {
          return sum + restaurant.ratingText.length;
        }
        return sum;
      },
      0
    );

    const averageReviewLengthFiltered =
      restaurantsInRadius.length > 0
        ? filteredReviewLength / restaurantsInRadius.length
        : 0;

    const averageDistanceBetweenRestaurants = () => {
      let totalDistance = 0;
      let pairsCount = 0;

      for (let i = 0; i < restaurantsInRadius.length - 1; i++) {
        for (let j = i + 1; j < restaurantsInRadius.length; j++) {
          const distance = getDistance(
            restaurantsInRadius[i].latitude,
            restaurantsInRadius[i].longitude,
            restaurantsInRadius[j].latitude,
            restaurantsInRadius[j].longitude
          );

          totalDistance += distance;
          pairsCount++;
        }
      }

      return pairsCount > 0 ? totalDistance / pairsCount : 0;
    };

    const precent = calculateSuccessPercentageForArea(restaurantsInRadius);
    const catPercent =
      calculateCategoryPopularityPercentage(restaurantsInRadius);

    setStats({
      averageRatingFiltered,
      mostReviewedRestaurant,
      categoryCounts,
      highestRatedRestaurant,
      lowestRatedRestaurant,
      averageReviewsFiltered,
      mostPopularCategories,
      highRatedRestaurantsCount,
      averageReviewLengthFiltered,
      avg: averageDistanceBetweenRestaurants(),
      precent,
      catPercent,
    });
    console.log({
      averageRatingFiltered,
      mostReviewedRestaurant,
      categoryCounts,
      highestRatedRestaurant,
      lowestRatedRestaurant,
      averageReviewsFiltered,
      mostPopularCategories,
      highRatedRestaurantsCount,
      averageReviewLengthFiltered,
      avg: averageDistanceBetweenRestaurants(),
      precent,
      catPercent,
    });
    setOpen(true);
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  useEffect(() => {
    const getRest = async () => {
      try {
        const res = await axios.get("http://localhost:8000/ScrapResto");
        const { data } = res;
        setRests(data?.scrapResto);
      } catch (err) {
        console.log(err);
      }
    };
    getRest();
  }, []);

  return (
    <div className="min-h-screen flex-1 flex bg-[#F0F0F0]">
      <div className="flex flex-col px-6 pt-16">
        <ul className="flex flex-col space-y-8 items-center">
          <li className="p-2 bg-blue-500 rounded-full">
            <IconMap2 className="text-white h-6 w-6" />
          </li>
          <li>
            <IconChartDots2 className="h-6 w-6" />
          </li>
          <li>
            <IconUser className="h-6 w-6" />
          </li>
          <li
            className="absolute bottom-12 cursor-pointer"
            onClick={() => {
              signOut();
              navigate("/login");
            }}
          >
            <IconLogout className="h-6 w-6" />
          </li>
        </ul>
      </div>
      <div className="flex-1 flex flex-col bg-white items-center justify-center">
        {rests.length}
        <br />
        {filRes.length}
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={20}
            onLoad={onLoad}
            onUnmount={onUnmount}
            onClick={handleMapClick}
          >
            <></>
            {circleCenter && (
              <Circle
                center={circleCenter}
                radius={2000}
                options={{
                  fillColor: "#0088FF",
                  fillOpacity: 0.35,
                  strokeColor: "#0088FF",
                  strokeOpacity: 1,
                  strokeWeight: 1,
                }}
              />
            )}
          </GoogleMap>
        ) : (
          <></>
        )}
        <Modal open={open} onClose={() => setOpen(false)}>
          <div className=" w-[95vw]">
            <div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <h2>Nombre des Restaurnats</h2>
                  <h2> {filRes?.length} </h2>
                </div>
                <div>
                  <h2>Most Reviewed Restaurant</h2>
                  <h2> {stats?.mostReviewedRestaurant?.storeName} </h2>
                </div>
                <div>
                  <h2>Rating Average</h2>
                  <h2> {Number(stats?.averageRatingFiltered)?.toFixed(2)} </h2>
                </div>
                <div>
                  <h2>Number of reviews</h2>
                  <h2> {stats?.averageReviewsFiltered?.toFixed(2)} </h2>
                </div>
                <div>
                  <h2>Highest Rated Restaurant</h2>
                  <h2> {stats?.highestRatedRestaurant?.storeName} </h2>
                </div>
                <div>
                  <h2>Lowest Rated Restaurant</h2>
                  <h2> {stats?.lowestRatedRestaurant?.storeName} </h2>
                </div>
                <div>
                  <h2>Most Popular Categories</h2>
                  {stats?.mostPopularCategories?.map((o, i) => (
                    <div
                      className="flex flex-row items-center gap-3 mb-2"
                      key={i}
                    >
                      <div className="h-8 w-8 rounded-full flex items-center justify-center border-2  border-blue-500">
                        <span className="font-bold text-blue-500">{i + 1}</span>
                      </div>
                      <div>
                        <p> {o[0]} </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Categorie
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Nombre des Restaurants
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats?.categoryCounts &&
                      Object.entries(stats?.categoryCounts).map(
                        ([key, value]) => (
                          <tr key={key} className="bg-white border-b ">
                            <td className="px-6 py-4">{key}</td>
                            <td className="px-6 py-4">{value} Restaurants</td>
                          </tr>
                        )
                      )}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <RadarChartRatingsAcrossCategories restaurantData={filRes} />
                </div>
                <div>
                  <BarChartPopularCategories
                    categoryCounts={stats?.categoryCounts || []}
                  />
                </div>
                <div>
                  <BubbleChartRatingsVsReviewsVsReviewLength
                    restaurantData={filRes}
                  />
                </div>
                <div>
                  <DoughnutChartRatingDistribution restaurantData={filRes} />
                </div>
                <div>
                  <HorizontalBarChartAverageReviewsPerCategory
                    restaurantData={filRes}
                  />
                </div>
                <div>
                  <PolarAreaChartAverageRatings restaurantData={filRes} />
                </div>
                <div>
                  <ScatterPlotRatingsVsReviews restaurantData={filRes} />
                </div>
                <div>
                  <StackedBarChartRatingsDistribution restaurantData={filRes} />
                </div>
              </div>
              <h2 className="py-4 text-4xl font-bold">Les Predictions</h2>
              <h2 className="text-3xl font-extralight mb-3">
                {" "}
                Percentage de réussite de restaurant{" "}
              </h2>
              <div className="h-20 w-20 rounded-full flex items-center justify-center border-4  border-green-500">
                <span className="font-bold text-green-500">
                  {Number(stats?.precent)?.toFixed(0)} %
                </span>
              </div>
              <h2 className="text-3xl font-extralight mb-3">
                {" "}
                Percentage de réussite des categories{" "}
              </h2>
              <div className="grid grid-cols-8 gap-2">
                {stats?.catPercent &&
                  Object.entries(stats?.catPercent).map(([key, value]) => (
                    <div key={key}>
                      <p> {key} </p>
                      <div className="h-16 w-16 rounded-full flex items-center justify-center border-[5px]  border-green-500">
                        <span className="font-bold text-xs text-green-500">
                          {value} %
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Home;
