import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { PRODUCTS } from "../data/Product";

export default function CategoryListing({ gender }) {
  const { slug } = useParams();

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const categoryMatch = p.category === slug;

      // agar gender prop nahi aaya (undefined) to sirf category filter hoga
      if (!gender) return categoryMatch;

      // product me gender key honi chahiye: "men" / "women" / "unisex"
      const genderMatch =
        p.gender === gender || p.gender === "unisex";

      return categoryMatch && genderMatch;
    });
  }, [slug, gender]);

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <h1 className="text-3xl font-semibold mb-2 capitalize">
        {slug.replace("-", " ")}
      </h1>

      {gender && (
        <p className="mb-8 text-gray-500 capitalize">
          Showing for: <b>{gender}</b>
        </p>
      )}

      {filteredProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="border rounded-xl overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={product.image}
                alt={product.title}
                className="h-64 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="font-medium">{product.title}</h3>
                <p className="mt-2 text-gray-600">₹ {product.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}