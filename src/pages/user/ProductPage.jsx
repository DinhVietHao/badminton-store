import {
  Container,
  Row,
  Col,
  Spinner,
  Alert,
  Card,
  Nav,
  Button,
  Form,
  InputGroup,
} from "react-bootstrap";
import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import ProductSidebar from "../../components/layouts-user/ProductSidebar";
import { useAddToCart } from "../../hooks/useAddToCart";
import { useFetchProducts } from "../../hooks/useFetchProducts";
import { FaSearch, FaTimes } from "react-icons/fa";

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
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const { products: allProducts, loading, error } = useFetchProducts();
  const { addToCart } = useAddToCart();

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState(INITIAL_FILTERS);
  const [isFiltering, setIsFiltering] = useState(false);
  const [localSearch, setLocalSearch] = useState("");

  useEffect(() => {
    if (searchQuery) {
      setSelectedFilters((prev) => ({
        ...prev,
        search: searchQuery,
      }));
      setLocalSearch(searchQuery);
    }
  }, [searchQuery]);

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

    const term = selectedFilters.search.toLowerCase();
    if (term) {
      products = products.filter(
        (p) =>
          p.title?.toLowerCase().includes(term) ||
          p.sku?.toLowerCase().includes(term) ||
          p.description?.toLowerCase().includes(term) ||
          p.brand?.toLowerCase().includes(term)
      );
    }

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
    setLocalSearch("");
    setSearchParams({});
  };

  const handleLocalSearch = (e) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchParams({ search: localSearch.trim() });
    }
  };

  const handleClearSearch = () => {
    setLocalSearch("");
    setSelectedFilters((prev) => ({ ...prev, search: "" }));
    setSearchParams({});
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>Đang tải danh sách sản phẩm...</p>
      </Container>
    );
  }

  if (error) {
    return <Alert variant="danger">Lỗi tải dữ liệu: {error}</Alert>;
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
          <div className="mb-4">
            <Form onSubmit={handleLocalSearch}>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Tìm kiếm sản phẩm theo tên, SKU, thương hiệu..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  style={{
                    borderRadius: "25px 0 0 25px",
                    border: "1px solid #449D44",
                  }}
                />
                {localSearch && (
                  <Button
                    variant="outline-secondary"
                    onClick={handleClearSearch}
                    style={{ borderColor: "#449D44" }}
                  >
                    <FaTimes />
                  </Button>
                )}
                <Button
                  type="submit"
                  style={{
                    backgroundColor: "#449D44",
                    borderRadius: localSearch ? "0" : "0 25px 25px 0",
                    border: "1px solid #449D44",
                  }}
                  disabled={!localSearch.trim()}
                >
                  <FaSearch />
                </Button>
              </InputGroup>
            </Form>

            {selectedFilters.search && (
              <div className="mt-2">
                <Alert
                  variant="info"
                  className="d-flex justify-content-between align-items-center"
                >
                  <span>
                    🔍 Kết quả tìm kiếm cho:{" "}
                    <strong>"{selectedFilters.search}"</strong> (
                    {filteredProducts.length} sản phẩm)
                  </span>
                  <Button
                    variant="outline-info"
                    size="sm"
                    onClick={handleClearSearch}
                  >
                    Xóa tìm kiếm
                  </Button>
                </Alert>
              </div>
            )}
          </div>

          <h2>Danh sách sản phẩm</h2>

          {isFiltering ? (
            <div className="text-center">
              <Spinner animation="border" size="sm" />
              <p>Đang lọc...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <Alert variant="warning" className="text-center">
              <h5>😔 Không tìm thấy sản phẩm nào</h5>
              <p>Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc</p>
              <Button variant="warning" onClick={clearAllFilters}>
                Xóa tất cả bộ lọc
              </Button>
            </Alert>
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
                      <Nav.Link to={`/products/${product.id}`} as={Link}>
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
                          onClick={() => addToCart(product.id)}
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
