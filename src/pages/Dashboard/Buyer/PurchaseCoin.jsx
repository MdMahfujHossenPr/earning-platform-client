import React from "react";
import { useNavigate } from "react-router-dom";

const packages = [
  { coins: 10, price: 1 },
  { coins: 150, price: 10 },
  { coins: 500, price: 20 },
  { coins: 1000, price: 35 },
];

const PurchaseCoin = () => {
  const navigate = useNavigate();

  const handlePurchase = (price) => {
    alert(`Redirecting to payment gateway for $${price}`);
    navigate("/dashboard/buyer/payment-history");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Purchase Coins</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.coins}
            className="bg-white border border-gray-200 rounded-lg shadow-md p-6 hover:shadow-xl cursor-pointer transition-all duration-300"
            onClick={() => handlePurchase(pkg.price)}
          >
            <h3 className="text-2xl font-semibold text-blue-600 mb-2">
              {pkg.coins} Coins
            </h3>
            <p className="text-lg text-gray-700">${pkg.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PurchaseCoin;
