import { HousePlug, Menu, ShoppingCart, X, User, LogOut } from "lucide-react";

// ---------------------------------------------
// Auth Form Configurations
// ---------------------------------------------
export const registerFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

// ---------------------------------------------
// Product Form Configurations
// ---------------------------------------------
export const addProductFormElements = [
  {
    name: "title",
    label: "Title",
    componentType: "input",
    placeholder: "Enter product title",
  },
  {
    name: "description",
    label: "Description",
    componentType: "textarea",
    placeholder: "Enter detailed description",
  },
  {
    name: "category",
    label: "Category",
    componentType: "select",
    options: [
      { id: "smartphones", label: "Smartphones" },
      { id: "laptops", label: "Laptops" },
      { id: "tablets", label: "Tablets" },
      { id: "cameras", label: "Cameras" },
      { id: "wearables", label: "Smartwatches & Wearables" },
      { id: "audio", label: "Audio & Headphones" },
      { id: "accessories", label: "Accessories" },
      { id: "computer_accessories", label: "Computer Accessories" },
      { id: "home_appliances", label: "Home Appliances" },
      { id: "kitchen_appliances", label: "Kitchen Appliances" },
      { id: "mens_clothing", label: "Men’s Clothing" },
      { id: "womens_clothing", label: "Women’s Clothing" },
      { id: "kids_clothing", label: "Kids’ Clothing" },
      { id: "footwear", label: "Footwear" },
    ],
  },
  {
    name: "brand",
    label: "Brand",
    componentType: "select",
    options: [
      { id: "apple", label: "Apple" },
      { id: "samsung", label: "Samsung" },
      { id: "sony", label: "Sony" },
      { id: "lg", label: "LG" },
      { id: "dell", label: "Dell" },
      { id: "hp", label: "HP" },
      { id: "asus", label: "ASUS" },
      { id: "lenovo", label: "Lenovo" },
      { id: "nike", label: "Nike" },
      { id: "adidas", label: "Adidas" },
      { id: "puma", label: "Puma" },
      { id: "reebok", label: "Reebok" },
      { id: "under_armour", label: "Under Armour" },
      { id: "new_balance", label: "New Balance" },
    ],
  },
  {
    name: "price",
    label: "Price",
    componentType: "input",
    type: "number",
    placeholder: "Enter price",
  },
  {
    name: "salePrice",
    label: "Sale Price",
    componentType: "input",
    type: "number",
    placeholder: "Enter discounted price (optional)",
  },
  {
    name: "totalStock",
    label: "Total Stock",
    componentType: "input",
    type: "number",
    placeholder: "Enter available stock",
  },
];

// ---------------------------------------------
// Header Menu Items (Shopping View)
// ---------------------------------------------
export const shoppingViewHeaderMenuItems = [
  
  { id: "home", label: "Home", path: "/shop/home" },
  {id:"products",label:'Products',path:'/shop/listing'},
  { id: "men", label: "Men", path: "/shop/listing?category=mens_clothing" },
  { id: "women", label: "Women", path: "/shop/listing?category=womens_clothing" },
  { id: "kids", label: "Kids", path: "/shop/listing?category=kids_clothing" },
  { id: "footwear", label: "Footwear", path: "/shop/listing?category=footwear" },
  { id: "accessories", label: "Accessories", path: "/shop/listing?category=accessories" },
];

// ---------------------------------------------
// Category & Brand Maps
// ---------------------------------------------
export const categoryOptionsMap = {
  smartphones: "Smartphones",
  laptops: "Laptops",
  tablets: "Tablets",
  cameras: "Cameras",
  wearables: "Smartwatches & Wearables",
  audio: "Audio & Headphones",
  accessories: "Accessories",
  computer_accessories: "Computer Accessories",
  home_appliances: "Home Appliances",
  kitchen_appliances: "Kitchen Appliances",
  mens_clothing: "Men’s Clothing",
  womens_clothing: "Women’s Clothing",
  kids_clothing: "Kids’ Clothing",
  footwear: "Footwear",
};

export const brandOptionsMap = {
  apple: "Apple",
  samsung: "Samsung",
  sony: "Sony",
  lg: "LG",
  dell: "Dell",
  hp: "HP",
  asus: "ASUS",
  lenovo: "Lenovo",
  nike: "Nike",
  adidas: "Adidas",
  puma: "Puma",
  reebok: "Reebok",
  under_armour: "Under Armour",
  new_balance: "New Balance",
};

// ---------------------------------------------
// Filter Options for Product Listing
// ---------------------------------------------
export const filterOptions = {
  category: [
    { id: "smartphones", label: "Smartphones" },
    { id: "laptops", label: "Laptops" },
    { id: "tablets", label: "Tablets" },
    { id: "cameras", label: "Cameras" },
    { id: "wearables", label: "Smartwatches & Wearables" },
    { id: "audio", label: "Audio & Headphones" },
    { id: "accessories", label: "Accessories" },
    { id: "computer_accessories", label: "Computer Accessories" },
    { id: "home_appliances", label: "Home Appliances" },
    { id: "kitchen_appliances", label: "Kitchen Appliances" },
    { id: "mens_clothing", label: "Men’s Clothing" },
    { id: "womens_clothing", label: "Women’s Clothing" },
    { id: "kids_clothing", label: "Kids’ Clothing" },
    { id: "footwear", label: "Footwear" },
  ],
  brand: [
    { id: "apple", label: "Apple" },
    { id: "samsung", label: "Samsung" },
    { id: "sony", label: "Sony" },
    { id: "lg", label: "LG" },
    { id: "dell", label: "Dell" },
    { id: "hp", label: "HP" },
    { id: "asus", label: "ASUS" },
    { id: "lenovo", label: "Lenovo" },
    { id: "nike", label: "Nike" },
    { id: "adidas", label: "Adidas" },
    { id: "puma", label: "Puma" },
    { id: "reebok", label: "Reebok" },
    { id: "under_armour", label: "Under Armour" },
    { id: "new_balance", label: "New Balance" },
  ],
};

// ---------------------------------------------
// Sorting Options
// ---------------------------------------------
export const sortOptions = [
  { id: "price-lowtoHigh", label: "Price: Low to High" },
  { id: "price-hightoLow", label: "Price: High to Low" },
  { id: "newest", label: "Newest Arrivals" },
  { id: "best-rated", label: "Best Rated" },
];

// ---------------------------------------------
// Sample Products (for UI testing/demo)
// ---------------------------------------------
export const products = [
  {
    id: 1,
    title: "Wireless Headphones",
    description: "High-quality sound with active noise cancellation.",
    price: 99.99,
    salePrice: 79.99,
    category: "accessories",
    image:
      "https://plus.unsplash.com/premium_photo-1677158265072-5d15db9e23b2?auto=format&fit=crop&q=60&w=600",
  },
  {
    id: 2,
    title: "Smart Watch",
    description: "Advanced fitness tracking and smart notifications.",
    price: 149.99,
    salePrice: null,
    category: "accessories",
    image:
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=60&w=600",
  },
  {
    id: 3,
    title: "Gaming Mouse",
    description: "Ergonomic design with adjustable DPI and RGB lighting.",
    price: 49.99,
    salePrice: 39.99,
    category: "accessories",
    image:
      "https://images.unsplash.com/photo-1632160871990-be30194885aa?auto=format&fit=crop&q=60&w=600",
  },
  {
    id: 4,
    title: "4K Monitor",
    description: "Ultra HD display with vibrant colors and fast refresh rate.",
    price: 299.99,
    salePrice: 249.99,
    category: "computer_accessories",
    image:
      "https://images.unsplash.com/photo-1593642532744-d377ab507dc8?auto=format&fit=crop&q=80&w=600",
  },
];

export const addressFormControls = [
  {
    label: "Full Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Pakistan"
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Lahore"
  },
  {
    label: "Postal Code",
    name: "pinCode",
    componentType: "input",
    type: "text",
    placeholder: "54000"
  },
  {
    label: "Phone Number",
    name: "phone",
    componentType: "input",
    type: "tel",
    placeholder: "+923218895764"
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    type: "text",
    placeholder: "Any delivery instructions..."
  }
];

