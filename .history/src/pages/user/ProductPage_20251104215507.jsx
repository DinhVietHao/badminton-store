import {
  Container,
  Row,
  Col,
  Spinner,
  Alert,
  Card,
  Nav,
  Button,
} from "react-bootstrap";
import React, { useState, useEffect, useContext, useMemo } from "react";
<<<<<<< HEAD:src/pages/ProductPage.jsx
import ProductSidebar from "../components/layouts/ProductSidebar";
import { ProductContext } from "../context/ProductContext";
import { Link } from "react-router";
=======
import ProductSidebar from "../../components/layouts-user/ProductSidebar";
import { ProductContext } from "../../contexts/ProductContext";
>>>>>>> d6dc7976a9e0d99b7bb816688549b52d6a368f70:src/pages/user/ProductPage.jsx

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
    const STATUS_MAP = {
      "IN-STOCK": "Còn hàng",
      "OUT-OF-STOCK": "Hết hàng",
    };

    const getUniqueOptions = (key, map = null) => {
      if (!allProducts || allProducts.length === 0) return [];
      const allValues = allProducts.map((p) => p[key]).filter(Boolean);
      const uniqueValues = [...new Set(allValues)];
      return uniqueValues
        .map((value) => ({
          value: value,
          label: map ? map[value] || value : value,
        }))
        .sort((a, b) => a.label.localeCompare(b.label, "vi"));
    };

    return {
      price: PRICE_OPTIONS,
      brand: getUniqueOptions("brand"),
      status: getUniqueOptions("status", STATUS_MAP),
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

  const fmt = (value) =>
    typeof value === "number" && !Number.isNaN(value)
      ? value.toLocaleString()
      : "0";

  return (
    <Container fluid className="mt-3">
      <Row>
        <Col md={2}>
          <ProductSidebar
            filters={selectedFilters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearAllFilters}
            options={filterOptions}
          />
        </Col>

        <Col md={10}>
          <h2>Danh sách sản phẩm</h2>
          {isFiltering ? (
            <div className="text-center">
              <Spinner animation="border" size="sm" />
              <p>Đang lọc...</p>
            </div>
          ) : (
            <Row xs={2} md={3} lg={5} className="g-4">
              {filteredProducts.map((product) => {
                const original = product.originalPrice;
                const sale = Number(product.salePrice) || 0;
                const discountPercent =
                  original > 0 && sale > 0 && original > sale
                    ? Math.round(((original - sale) / original) * 100)
                    : 0;

                const hasSale = discountPercent > 0;
                const displayPrice = hasSale ? sale : original;
                const strikethroughPrice = hasSale ? original : null;

                return (
                  <Col key={product.id}>
                    <Card
                      className="h-100 border-0 rounded-4 position-relative overflow-hidden"
                      style={{
                        backgroundColor: "#fff",
                        boxShadow:
                          "0 4px 8px rgba(0,0,0,0.15), 0 8px 20px rgba(0,0,0,0.10)",
                        transform: "translateY(0)",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-8px)";
                        e.currentTarget.style.boxShadow =
                          "0 10px 20px rgba(0,0,0,0.25), 0 15px 35px rgba(0,0,0,0.20)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 8px rgba(0,0,0,0.15), 0 8px 20px rgba(0,0,0,0.10)";
                      }}
                    >
                      {discountPercent > 0 && (
                        <div
                          className="position-absolute text-white fw-bold d-flex align-items-center justify-content-center"
                          style={{
                            top: "10px",
                            left: "10px",
                            backgroundColor: "#d0021b",
                            borderTopRightRadius: "20px",
                            borderBottomRightRadius: "20px",
                            height: "28px",
                            padding: "0 12px 0 16px",
                            fontSize: "13px",
                            zIndex: 10,
                            boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
                            position: "relative",
                          }}
                        >
                          -{discountPercent}%
                          <div
                            style={{
                              content: '""',
                              position: "absolute",
                              left: "-6px",
                              width: "0",
                              height: "0",
                              borderTop: "7px solid transparent",
                              borderBottom: "7px solid transparent",
                              borderRight: "6px solid #d0021b",
                            }}
                          ></div>
                        </div>
                      )}
                      <Nav.Link to={`/product/${product.id}`} as={Link}>
                        <div
                          className="d-flex align-items-center justify-content-center bg-white"
                          style={{ height: "200px", overflow: "hidden" }}
                        >
                          <Card.Img
                            variant="top"
                            src={
                              product.thumbnailUrl
                                ? product.thumbnailUrl
                                : "/images/no-image.png"
                            }
                            alt={product.title}
                            className="p-3"
                            style={{
                              maxHeight: "180px",
                              objectFit: "contain",
                              width: "auto",
                            }}
                          />
                        </div>
                      </Nav.Link>
                      <Card.Body>
                        <Card.Title
                          className="fs-6"
                          title={product.title}
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            minHeight: "3rem",
                          }}
                        >
                          {product.title}
                        </Card.Title>

                        <div className="mb-2">
                          <span className="text-danger fw-bold">
                            {fmt(displayPrice)}₫
                          </span>{" "}
                          {strikethroughPrice && (
                            <span className="text-muted text-decoration-line-through small">
                              {fmt(strikethroughPrice)}₫
                            </span>
                          )}
                        </div>

                        <Button
                          variant="warning"
                          className="w-100 text-white fw-bold"
                        >
                          Thêm vào giỏ
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProductPage;
