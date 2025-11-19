import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useSearchParams } from "react-router-dom";

import { fetchAllProducts } from "@/store/shop/product-slice";

import ProductFilter from "./filter";

import ShoppingProductTile from "./product-tile";

import Footer from "./footer";

import { ArrowUpDown, ChevronDown } from "lucide-react";

import { sortOptions } from "@/config";



const STORAGE_KEY = "shoppingFilters";



const ShoppingListing = () => {

  const dispatch = useDispatch();

  const { productList, loading, error } = useSelector(

    (state) => state.shopProducts

  );



  const [searchParams, setSearchParams] = useSearchParams();



  const [selectedFilters, setSelectedFilters] = useState({

    category: [],

    brand: [],

  });



  const [selectedSort, setSelectedSort] = useState({

    id: "",

    label: "Sort by",

  });



  // 🛑 NEW STATE: Search Query from URL

  const [searchQuery, setSearchQuery] = useState('');



  const [sortOpen, setSortOpen] = useState(false);

  const [filtersLoaded, setFiltersLoaded] = useState(false);



  // ----------------------

  // Load filters from URL or Storage

  // ----------------------

  useEffect(() => {

    const urlCategory = searchParams.get("category");

    const urlBrand = searchParams.get("brand");

    const urlSort = searchParams.get("sort");

    // 🛑 Read search query from URL

    const urlSearch = searchParams.get("search") || ""; 



    const stored = sessionStorage.getItem(STORAGE_KEY);



    // If no category/search is in URL, load filters from storage

    if (!urlCategory && stored && !urlSearch) { 

      const parsed = JSON.parse(stored);

      setSelectedFilters(parsed.filters);

      setSelectedSort(parsed.sort);

      setFiltersLoaded(true);

      return;

    }



    const category = urlCategory ? urlCategory.split(",") : [];

    const brand = urlBrand ? urlBrand.split(",") : [];



    const sort = urlSort

      ? sortOptions.find((s) => s.id === urlSort) || { id: "", label: "Sort by" }

      : { id: "", label: "Sort by" };



    setSelectedFilters({ category, brand });

    setSelectedSort(sort);

    // 🛑 Set search query state

    setSearchQuery(urlSearch); 

    setFiltersLoaded(true);

  }, [searchParams]);



  // ----------------------

  // Sync Filters + Sort + Search to URL + Storage

  // ----------------------

  useEffect(() => {

    if (!filtersLoaded) return;



    const params = new URLSearchParams();



    if (selectedFilters.category.length > 0)

      params.set("category", selectedFilters.category.join(","));



    if (selectedFilters.brand.length > 0)

      params.set("brand", selectedFilters.brand.join(","));



    if (selectedSort.id) params.set("sort", selectedSort.id);



    // 🛑 Add search query to URL params

    if (searchQuery) params.set("search", searchQuery);



    setSearchParams(params);



    // Store filters/sort only

    sessionStorage.setItem(

      STORAGE_KEY,

      JSON.stringify({

        filters: selectedFilters,

        sort: selectedSort,

      })

    );

  }, [selectedFilters, selectedSort, searchQuery, filtersLoaded]); // Depend on searchQuery



  // ----------------------

  // Fetch Products when filters change

  // ----------------------

  useEffect(() => {

    if (!filtersLoaded) return;



    dispatch(

      fetchAllProducts({

        category: selectedFilters.category,

        brand: selectedFilters.brand,

        sortBy: selectedSort.id,

        // 🛑 Pass search query to backend if supported

        search: searchQuery

      })

    );

  }, [selectedFilters, selectedSort, searchQuery, filtersLoaded]); // Depend on searchQuery



  // ----------------------

  // Handle Filter Change (No change needed here)

  // ----------------------

  const handleFilterChange = (type, ids) => {

    setSelectedFilters((prev) => ({

      ...prev,

      [type]: Array.isArray(ids) ? ids : [ids],

    }));

    // Clear search when filters change to avoid conflicting results

    if (searchQuery) setSearchQuery(''); 

  };



  const handleSortSelect = (option) => {

    setSelectedSort(option);

    setSortOpen(false);

  };



  // ----------------------

  // Filter locally before render (Search Logic Added)

  // ----------------------

  const getFilteredProducts = () => {

    let filtered = [...productList];

    

    // 1. 🛑 Apply Search Filter (Highest priority)

    const query = searchQuery.toLowerCase().trim();

    if (query) {

        filtered = filtered.filter((p) =>

            // Match search query against product title AND description

            p.title.toLowerCase().includes(query) || 

            (p.description && p.description.toLowerCase().includes(query))

        );

    }



    // 2. Apply Category/Brand Filters

    if (selectedFilters.category.length > 0) {

      filtered = filtered.filter((p) =>

        selectedFilters.category.includes(p.category)

      );

    }



    if (selectedFilters.brand.length > 0) {

      filtered = filtered.filter((p) =>

        selectedFilters.brand.includes(p.brand)

      );

    }



    // 3. Apply Sorting

    if (selectedSort.id) {

      if (selectedSort.id === "price-lowtoHigh") {

        filtered.sort((a, b) => a.price - b.price);

      } else if (selectedSort.id === "price-hightoLow") {

        filtered.sort((a, b) => b.price - a.price);

      } else if (selectedSort.id === "newest") {

        filtered.sort((a, b) => b.id - a.id);

      }

      // add more sorting if needed

    }



    return filtered;

  };



  const filteredProducts = getFilteredProducts();



  // ----------------------

  // Loading / Error

  // ----------------------

  if (loading)

    return (

      <div className="flex justify-center items-center min-h-screen text-gray-400">

        Loading products...

      </div>

    );



  if (error)

    return (

      <div className="flex justify-center items-center min-h-screen text-red-500">

        {error}

      </div>

    );



  // ----------------------

  // Render UI

  // ----------------------

  return (

    <>

      <div className="flex flex-col md:grid md:grid-cols-[280px_1fr] gap-4 p-4 bg-black text-gray-100 min-h-screen">

        {/* Sidebar Filters */}

        <div className="hidden md:block">

          <ProductFilter

            selectedFilters={selectedFilters}

            onFilterChange={handleFilterChange}

          />

        </div>



        {/* Product Section */}

        <div className="bg-black border border-gray-800 rounded-lg shadow-sm w-full relative">

          {/* Top Bar */}

          <div className="p-4 border-b border-gray-800 flex flex-wrap justify-between items-center">

            <h2 className="text-base sm:text-lg font-bold">

              {/* 🛑 Dynamic Title based on search or filters */}

              {searchQuery 

                ? `Search Results for "${searchQuery}"`

                : selectedFilters.category.length || selectedFilters.brand.length

                ? `Filtered Products`

                : "All Products"}

            </h2>



            <div className="flex items-center gap-3 relative">

              <span className="text-xs sm:text-sm text-gray-400">

                {filteredProducts.length} products

              </span>



              <button

                onClick={() => setSortOpen(!sortOpen)}

                className="flex items-center gap-1 border border-gray-700 bg-gray-900 

                           text-gray-200 hover:bg-gray-800 px-3 py-1.5 rounded-md 

                           text-xs sm:text-sm font-medium"

              >

                <ArrowUpDown className="h-4 w-4" />

                <span>{selectedSort.label}</span>

                <ChevronDown

                  className={`h-4 w-4 transition-transform ${

                    sortOpen ? "rotate-180" : "rotate-0"

                  }`}

                />

              </button>



              {sortOpen && (

                <div className="absolute right-0 top-10 w-44 bg-gray-900 border border-gray-700 

                                rounded-md shadow-lg z-50">

                  {sortOptions.map((opt) => (

                    <button

                      key={opt.id}

                      onClick={() => handleSortSelect(opt)}

                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-800"

                    >

                      {opt.label}

                    </button>

                  ))}

                </div>

              )}

            </div>

          </div>



          {/* Product Grid */}

          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

            {filteredProducts.length > 0 ? (

              filteredProducts.map((product) => (

                <ShoppingProductTile key={product._id} product={product} />

              ))

            ) : (

              <p className="col-span-full text-center text-gray-400">

                No products match the selected filters.

              </p>

            )}

          </div>

        </div>

      </div>



      <Footer />

    </>

  );

};



export default ShoppingListing;