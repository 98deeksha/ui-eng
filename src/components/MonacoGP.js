import React, { useEffect, useState } from "react";

const MonacoGP = () => {
  const [products, setProducts] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchWord, setSearchWord] = useState("");
  const [sortItems, setSortItems] = useState("relevance");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const minVal = [0, 500, 1000, 1500, 2000, 2500];
  const maxVal = [
    500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500,
  ];
  const [selectedMinVal, setSelectedMinVal] = useState(minVal[0]);
  const [selectedMaxVal, setSelectedMaxVal] = useState(
    maxVal[maxVal.length - 1]
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await fetch("https://dummyjson.com/products");
    const data = await response.json();
    setProducts(data.products);
    setFilteredData(data.products);
  };

  const handleSort = (criteria) => {
    let sortedItems = [...filteredData];
    if (criteria === "low-high") {
      sortedItems.sort((a, b) => a.price - b.price);
    } else if (criteria === "high-low") {
      sortedItems.sort((a, b) => b.price - a.price);
    } else {
      sortedItems.sort((a, b) => a.id - b.id);
    }
    setFilteredData(sortedItems);
    setSortItems(criteria);
  };

  const handleSearchChange = (searchQuery) => {
    setSearchWord(searchQuery);
    applyFilters(searchQuery, selectedBrands, selectedMinVal, selectedMaxVal);
  };

  const handleBrandFilter = (brand) => {
    const updatedBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];
    setSelectedBrands(updatedBrands);
    applyFilters(searchWord, updatedBrands, selectedMinVal, selectedMaxVal);
  };

  const handleMinVal = (min) => {
    const res = parseInt(min);
    setSelectedMinVal(res);
    applyFilters(searchWord, selectedBrands, res, selectedMaxVal);
  };

  const handleMaxVal = (max) => {
    const res = parseInt(max);
    setSelectedMaxVal(res);
    applyFilters(searchWord, selectedBrands, selectedMinVal, res);
  };

  const applyFilters = (searchQuery, brands, min, max) => {
    const filtered = products.filter((item) => {
      const matchesSearch = item.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesBrand = brands.length === 0 || brands.includes(item.brand);
      const matchesPrice = item.price >= min && item.price <= max;
      return matchesSearch && matchesBrand && matchesPrice;
    });
    setFilteredData(filtered);
  };

  return (
    <div className="container">
      <div className="filters">
        <h3>Filters</h3>
        <hr />
        <label>
          <h5>PRICE</h5>
        </label>
        <select onChange={(e) => handleMinVal(e.target.value)}>
          {minVal.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        to
        <select onChange={(e) => handleMaxVal(e.target.value)}>
          {maxVal.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <label>
          <h5>BRAND</h5>
        </label>
        <input
          type="text"
          placeholder="🔍Search Brand"
          onChange={(e) => handleSearchChange(e.target.value)}
        />
        {products.map((item) => {
          return (
            <div key={item.id}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(item.brand)}
                  onChange={() => handleBrandFilter(item.brand)}
                />
                {item.brand}
              </label>
            </div>
          );
        })}
      </div>
      <div className="products-container">
        <h4>
          Showing {filteredData.length} results for {searchWord}
        </h4>
        <div className="sort">
          <p>
            <b>Sort By</b>
          </p>
          <p
            onClick={() => handleSort("relevance")}
            style={{ cursor: "pointer" }}
          >
            Relevance
          </p>
          <p
            onClick={() => handleSort("low-high")}
            style={{ cursor: "pointer" }}
          >
            Price -- Low to High
          </p>
          <p
            onClick={() => handleSort("high-low")}
            style={{ cursor: "pointer" }}
          >
            Price -- High to Low
          </p>
        </div>
        <div className="products">
          {filteredData.length > 0 ? (
            filteredData.map((item) => {
              return (
                <div className="products-item" key={item.id}>
                  <img src={item.thumbnail} alt={item.title} />
                </div>
              );
            })
          ) : (
            <p>No items found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonacoGP;
