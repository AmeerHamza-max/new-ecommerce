import React from "react";
import { brandOptionsMap, categoryOptionsMap } from "@/config";

function AdminProductTile({ product, onEdit, onDelete }) {
  console.log("Product Props:", product);

  const isOnSale = !!product?.salePrice;
  console.log("Is Product on Sale?", isOnSale);

  const brandLabel = brandOptionsMap[product?.brand] || product?.brand || "Unknown";
  const categoryLabel = categoryOptionsMap[product?.category] || product?.category || "General";

  console.log("Brand Label:", brandLabel);
  console.log("Category Label:", categoryLabel);

  return (
    <div className="w-full bg-gray-900 border border-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col justify-between transform transition hover:-translate-y-1 hover:shadow-2xl hover:border-gray-700">
      <div className="relative w-full aspect-square bg-gray-800 flex items-center justify-center">
        <img
          src={product?.image}
          alt={product?.title || "Product"}
          className="w-full h-full object-contain p-3 transition-transform duration-300 hover:scale-105"
          loading="lazy"
          onError={(e) => { e.target.src = "/fallback-image.png"; console.error("Image load failed", product?.image); }}
        />
        {isOnSale && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
            SALE
          </span>
        )}
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-400 mb-1">
          <span className="capitalize">{categoryLabel}</span>
          <span className="capitalize font-medium text-gray-300">{brandLabel}</span>
        </div>

        <h3 className="text-base sm:text-lg font-semibold text-gray-100 line-clamp-1 mb-2">
          {product?.title}
        </h3>

        <div className="flex items-center gap-2 mb-3">
          {isOnSale ? (
            <>
              <span className="text-amber-400 font-bold text-lg sm:text-xl">
                ${product.salePrice}
              </span>
              <span className="text-gray-500 text-sm line-through">${product.price}</span>
            </>
          ) : (
            <span className="text-gray-100 font-bold text-lg sm:text-xl">
              ${product?.price}
            </span>
          )}
        </div>

        {product?.description && (
          <p className="text-gray-400 text-sm line-clamp-2 mb-4">{product.description}</p>
        )}

        <div className="mt-auto flex gap-3">
          <button
            onClick={() => { console.log("Edit clicked for:", product?.id); onEdit(product); }}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-transform transform hover:-translate-y-0.5 text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => { console.log("Delete clicked for:", product?.id); onDelete(product); }}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-transform transform hover:-translate-y-0.5 text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminProductTile;
