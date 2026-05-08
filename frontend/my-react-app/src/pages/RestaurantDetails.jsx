import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMenuByRestaurantId } from "../api/restaurantApi";
import { getReviewsByRestaurantId, addReview } from "../api/reviewApi";
import { useCart } from "../context/CartContext";

function RestaurantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart, cartItems } = useCart();

  const [menuItems, setMenuItems] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });

  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewMessageType, setReviewMessageType] = useState("error");
  const [submittingReview, setSubmittingReview] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
  }, []);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await getMenuByRestaurantId(id);
        setMenuItems(data);
      } catch (error) {
        console.error("Menu error:", error.response?.data || error.message);
        setMessage("Failed to load menu");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [id]);

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const data = await getReviewsByRestaurantId(id);
      setReviews(data);
    } catch (error) {
      console.error("Reviews error:", error.response?.data || error.message);
      setReviewMessageType("error");
      setReviewMessage("Failed to load reviews");
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const isFavorite = (itemId) => {
    return favorites.some((item) => item.id === itemId);
  };

  const toggleFavorite = (item) => {
    let updatedFavorites;

    if (isFavorite(item.id)) {
      updatedFavorites = favorites.filter((fav) => fav.id !== item.id);
    } else {
      updatedFavorites = [
        ...favorites,
        {
          ...item,
          restaurantId: Number(id),
        },
      ];
    }

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const handleAddToCart = (item) => {
    addToCart(item, id);
  };

  const handleReviewChange = (e) => {
    setReviewForm({
      ...reviewForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    setReviewMessage("");

    if (!reviewForm.comment.trim()) {
      setReviewMessageType("error");
      setReviewMessage("Please write a review comment");
      return;
    }

    try {
      setSubmittingReview(true);

      const reviewData = {
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment,
        customerId: user?.id,
        customerName: user?.name,
        restaurant: {
          id: Number(id),
        },
      };

      await addReview(reviewData);

      setReviewMessageType("success");
      setReviewMessage("Review added successfully");

      setReviewForm({
        rating: 5,
        comment: "",
      });

      await fetchReviews();
    } catch (error) {
      console.error("Add review error:", error.response?.data || error.message);
      setReviewMessageType("error");
      setReviewMessage(error.response?.data?.message || "Failed to add review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (rating) => {
    const value = Number(rating || 0);
    return "⭐".repeat(value);
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) /
          reviews.length
        ).toFixed(1)
      : "0.0";

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <p className="text-orange-600 font-semibold text-lg animate-pulse">
          Loading menu...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <nav className="sticky top-0 z-50 bg-white/75 backdrop-blur-md border-b border-orange-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/restaurants")}
            className="text-2xl font-bold text-orange-600 hover:text-orange-700 hover:-translate-y-0.5 transition duration-300"
          >
            Food Ordering
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/favorites")}
              className="bg-white text-orange-600 border border-orange-600 px-4 py-2 rounded-lg font-semibold hover:bg-orange-50 hover:-translate-y-0.5 hover:shadow-md active:scale-95 transition duration-300"
            >
              Favorites
            </button>

            <button
              onClick={() => navigate("/cart")}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-700 hover:-translate-y-0.5 hover:shadow-lg active:scale-95 transition duration-300"
            >
              Cart ({cartItems.length})
            </button>

            <button
              onClick={() => navigate("/restaurants")}
              className="bg-white text-orange-600 border border-orange-600 px-4 py-2 rounded-lg font-semibold hover:bg-orange-50 hover:-translate-y-0.5 hover:shadow-md active:scale-95 transition duration-300"
            >
              Back Restaurants
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-orange-600">
            Restaurant Menu
          </h1>

          <p className="text-gray-500 mt-2">
            Choose your favorite meals from restaurant #{id}.
          </p>
        </div>

        {message && (
          <div className="mb-6 text-center text-red-700 bg-red-100 rounded-lg py-3">
            {message}
          </div>
        )}

        {menuItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center mb-12">
            <p className="text-gray-500 mb-6">No menu items found.</p>

            <button
              onClick={() => navigate("/restaurants")}
              className="bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 hover:shadow-lg hover:-translate-y-1 active:scale-95 transition duration-300"
            >
              Back to Restaurants
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-14">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="group relative bg-white/90 backdrop-blur rounded-3xl shadow-md overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition duration-300"
              >
                <button
                  onClick={() => toggleFavorite(item)}
                  className={`absolute top-5 right-5 z-10 w-11 h-11 rounded-full flex items-center justify-center text-xl shadow-md transition duration-300 active:scale-90 ${
                    isFavorite(item.id)
                      ? "bg-red-100 text-red-600 hover:bg-red-200"
                      : "bg-white/90 text-gray-400 hover:text-red-500 hover:bg-red-50"
                  }`}
                  title="Add to favorites"
                >
                  {isFavorite(item.id) ? "❤️" : "🤍"}
                </button>

                <div className="h-44 bg-orange-100 overflow-hidden flex items-center justify-center">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <span className="text-6xl group-hover:scale-110 transition duration-300">
                      🍽️
                    </span>
                  )}
                </div>

                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 group-hover:text-orange-600 transition duration-300">
                    {item.name}
                  </h2>

                  <p className="text-gray-500 mt-2 min-h-[48px]">
                    {item.description || "No description available"}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-orange-600 font-extrabold text-xl">
                      {item.price} EGP
                    </p>

                    {isFavorite(item.id) && (
                      <span className="text-xs font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full">
                        Favorite
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleAddToCart(item)}
                    className="mt-6 w-full bg-orange-600 text-white py-3 rounded-xl font-semibold hover:bg-orange-700 hover:shadow-lg hover:-translate-y-1 active:scale-95 transition duration-300"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-md p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">
                Restaurant Reviews
              </h2>

              <p className="text-gray-500 mt-1">
                Average Rating:{" "}
                <span className="font-bold text-orange-600">
                  {averageRating}
                </span>{" "}
                / 5 from {reviews.length} reviews
              </p>
            </div>

            <div className="text-3xl">
              {Number(averageRating) > 0
                ? renderStars(Math.round(averageRating))
                : "⭐"}
            </div>
          </div>

          {reviewMessage && (
            <div
              className={`mb-6 text-center rounded-xl py-3 font-semibold ${
                reviewMessageType === "success"
                  ? "text-green-700 bg-green-100"
                  : "text-red-700 bg-red-100"
              }`}
            >
              {reviewMessage}
            </div>
          )}

          <form
            onSubmit={handleSubmitReview}
            className="bg-orange-50 rounded-2xl p-5 mb-8"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Add Your Review
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rating
                </label>

                <select
                  name="rating"
                  value={reviewForm.rating}
                  onChange={handleReviewChange}
                  className="w-full rounded-xl border border-orange-100 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Very Good</option>
                  <option value="3">3 - Good</option>
                  <option value="2">2 - Fair</option>
                  <option value="1">1 - Poor</option>
                </select>
              </div>

              <div className="md:col-span-3">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Comment
                </label>

                <textarea
                  name="comment"
                  value={reviewForm.comment}
                  onChange={handleReviewChange}
                  placeholder="Write your review about this restaurant..."
                  rows="3"
                  className="w-full rounded-xl border border-orange-100 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submittingReview}
              className="mt-4 bg-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-700 hover:shadow-lg hover:-translate-y-1 active:scale-95 transition duration-300 disabled:bg-orange-300"
            >
              {submittingReview ? "Submitting..." : "Submit Review"}
            </button>
          </form>

          {reviewsLoading ? (
            <p className="text-orange-600 font-semibold animate-pulse">
              Loading reviews...
            </p>
          ) : reviews.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <p className="text-gray-500">
                No reviews yet. Be the first to review this restaurant.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-gray-50 rounded-2xl p-5 hover:shadow-md transition"
                >
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div>
                      <p className="font-bold text-gray-900">
                        {review.customerName ||
                          `Customer #${review.customerId || "Unknown"}`}
                      </p>

                      <p className="text-sm text-orange-600 font-semibold">
                        {renderStars(review.rating)} ({review.rating}/5)
                      </p>
                    </div>

                    <span className="text-xs text-gray-400">
                      Review #{review.id}
                    </span>
                  </div>

                  <p className="text-gray-600">
                    {review.comment || "No comment"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RestaurantDetails;