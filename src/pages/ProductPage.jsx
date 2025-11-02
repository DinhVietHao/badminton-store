import { Container, Row, Col, Spinner, Alert, Card } from "react-bootstrap";
import React, { useState, useEffect, useContext, useMemo } from "react";
import ProductSidebar from "../components/layouts/ProductSidebar";
import { ProductContext } from "../context/ProductContext";

const INITIAL_FILTERS = {
  search: "",
  price: [],
  brand: [],
  status: [],
  playerLevel: [],
  playType: [],
  playingStyle: [],
  shaftFlexibility: [],
  balancePoint: [],
  weight: [],
};

const PRICE_OPTIONS = [
  { label: "Dưới 500.000đ", value: "0-500000" },
  { label: "500.000đ - 1 triệu", value: "500000-1000000" },
  { label: "1 - 2 triệu", value: "1000000-2000000" },
  { label: "2 - 3 triệu", value: "2000000-3000000" },
  { label: "Trên 3 triệu", value: "3000000-0" },
];

const ProductPage = () => {
  const {
    products: allProducts,
    loading: contextLoading,
    error: contextError,
  } = useContext(ProductContext);

  // Filter
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState(INITIAL_FILTERS);
  const [isFiltering, setIsFiltering] = useState(false);

  const filterOptions = useMemo(() => {
    const getUniqueOptions = (key) => {
      if (!allProducts || allProducts.length === 0) return [];
      const allValues = allProducts.map((p) => p[key]).filter(Boolean);
      const uniqueValues = [...new Set(allValues)];
      return uniqueValues
        .map((value) => ({
          value: value,
          label: value,
        }))
        .sort((a, b) => a.label.localeCompare(b.label, "vi"));
    };

    return {
      price: PRICE_OPTIONS,
      brand: getUniqueOptions("brand"),
      status: getUniqueOptions("status"),
      playerLevel: getUniqueOptions("playerLevel"),
      playType: getUniqueOptions("playType"),
      playingStyle: getUniqueOptions("playingStyle"),
      shaftFlexibility: getUniqueOptions("shaftFlexibility"),
      balancePoint: getUniqueOptions("balancePoint"),
      weight: getUniqueOptions("weight"),
    };
  }, [allProducts]);

  useEffect(() => {
    if (allProducts.length === 0) return;
    setIsFiltering(true);
    let products = [...allProducts];

    // Search
    const term = selectedFilters.search.toLowerCase();
    if (term) {
      products = products.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          p.sku.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term)
      );
    }

    // Filter by price
    if (selectedFilters.price.length > 0) {
      products = products.filter((p) => {
        const productPrice = p.salePrice || p.originalPrice;
        return selectedFilters.price.some((range) => {
          const [minStr, maxStr] = range.split("-");
          const min = parseInt(minStr, 10);
          const max = parseInt(maxStr, 10);
          if (max === 0) return productPrice >= min;
          return productPrice >= min && productPrice <= max;
        });
      });
    }

    // 2.3 Filter by other attribute (checkbox)
    const filterByCheckbox = (groupName) => {
      if (selectedFilters[groupName].length > 0) {
        products = products.filter((p) =>
          selectedFilters[groupName].includes(p[groupName])
        );
      }
    };

    [
      "brand",
      "status",
      "playerLevel",
      "playType",
      "playingStyle",
      "shaftFlexibility",
      "balancePoint",
      "weight",
    ].forEach(filterByCheckbox);

    setFilteredProducts(products);
    setTimeout(() => setIsFiltering(false), 300);
  }, [selectedFilters, allProducts]);

  const handleFilterChange = (group, value, isChecked) => {
    setSelectedFilters((prevFilters) => {
      if (group === "search") {
        return { ...prevFilters, search: value };
      }
      const currentValues = prevFilters[group] || [];
      let newValues;
      if (isChecked) {
        newValues = [...currentValues, value];
      } else {
        newValues = currentValues.filter((item) => item !== value);
      }
      return {
        ...prevFilters,
        [group]: newValues,
      };
    });
  };

  const clearAllFilters = () => {
    setSelectedFilters(INITIAL_FILTERS);
  };

  if (contextLoading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>Đang tải danh sách sản phẩm...</p>
      </Container>
    );
  }

  if (contextError) {
    return <Alert variant="danger">Lỗi tải dữ liệu: {contextError}</Alert>;
  }

  if (!allProducts || allProducts.length === 0) {
    return (
      <Alert variant="warning">Không có sản phẩm nào trong cửa hàng.</Alert>
    );
  }

  return (
    <Container fluid className="mt-3">
      <Row>
        <Col md={3}>
          <ProductSidebar
            filters={selectedFilters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearAllFilters}
            options={filterOptions}
          />
        </Col>

        <Col md={9}>
          <h2>Danh sách sản phẩm</h2>
          {isFiltering ? (
            <div className="text-center">
              <Spinner animation="border" size="sm" />
              <p>Đang lọc...</p>
            </div>
          ) : (
            <Row xs={1} md={2} lg={3} className="g-4">
              {filteredProducts.map((product) => (
                <Col key={product.id}>
                  <Card>
                    <Card.Img variant="top" src={product.thumbnailUrl} />
                    <Card.Body>
                      <Card.Title>{product.title}</Card.Title>
                      <Card.Text>
                        {product.salePrice || product.originalPrice} VNĐ
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProductPage;
