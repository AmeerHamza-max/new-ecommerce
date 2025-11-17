import { filterOptions } from "@/config";
import * as Label from "@radix-ui/react-label";
import React from "react";

function ProductFilter({ selectedFilters = {}, onFilterChange }) {

  // ----------------------------------------
  // Update a checkbox in a stable way
  // ----------------------------------------
  const handleCheckboxChange = (categoryKey, optionId) => {
    const existing = selectedFilters[categoryKey] || [];

    const updated = existing.includes(optionId)
      ? existing.filter((id) => id !== optionId)
      : [...existing, optionId];

    onFilterChange(categoryKey, updated);
  };

  return (
    <div className="bg-black text-gray-100 rounded-lg shadow-md border border-gray-800">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-lg font-bold tracking-wide">Filters</h2>
      </div>

      <div className="p-4 space-y-6">
        {Object.keys(filterOptions).map((categoryKey) => (
          <div key={categoryKey}>
            {/* Category Title */}
            <h3 className="text-base font-semibold text-gray-200 capitalize border-b border-gray-800 pb-1 mb-2">
              {categoryKey}
            </h3>

            {/* Options */}
            <div className="grid gap-2">
              {filterOptions[categoryKey].map((option) => (
                <Label.Root
                  key={option.id}
                  className="flex items-center gap-2 text-gray-300 hover:text-gray-100 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedFilters[categoryKey]?.includes(option.id) || false}
                    onChange={() => handleCheckboxChange(categoryKey, option.id)}
                    className="w-4 h-4 accent-amber-500 cursor-pointer bg-gray-900 border border-gray-700 rounded"
                  />
                  {option.label}
                </Label.Root>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductFilter;
