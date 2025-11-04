import React from "react";
import {
  Accordion,
  Form,
  Button,
  Badge,
  CloseButton,
  Stack,
  FormControl,
} from "react-bootstrap";

const ProductSidebar = ({
  filters,
  onFilterChange,
  onClearFilters,
  options,
}) => {
  const ALL_OPTIONS = [
    ...(options.price || []),
    ...(options.brand || []),
    ...(options.status || []),
    ...(options.playerLevel || []),
    ...(options.playingStyle || []),
    ...(options.shaftFlexibility || []),
    ...(options.balancePoint || []),
    ...(options.playType || []),
    ...(options.weight || []),
  ];

  const renderSelectedFilters = () => {
    const selected = [];
    for (const group in filters) {
      if (
        group === "search" ||
        !Array.isArray(filters[group]) ||
        filters[group].length === 0
      )
        continue;
      filters[group].forEach((value) => {
        const option = ALL_OPTIONS.find((opt) => opt.value === value);
        const label = option ? option.label : value;
        selected.push({ group, value, label });
      });
    }

    if (selected.length === 0) return null;

    return (
      <div
        className="mb-3 p-3"
        style={{ border: "1px solid #ddd", borderRadius: "8px" }}
      >
        <div className="d-flex justify-content-between align-items-center mb-2">
          <strong style={{ fontSize: "1.1rem" }}>Bạn chọn:</strong>
          <Button variant="outline-danger" size="sm" onClick={onClearFilters}>
            Bỏ hết
          </Button>
        </div>
        <Stack direction="horizontal" gap={2} className="flex-wrap">
          {selected.map((item) => (
            <Badge
              pill
              bg="secondary"
              key={`${item.group}-${item.value}`}
              className="d-flex align-items-center"
              style={{ paddingLeft: "12px", fontSize: "0.8rem" }}
            >
              {item.label}
              <CloseButton
                variant="white"
                style={{ fontSize: "0.7rem", marginLeft: "6px" }}
                onClick={() => onFilterChange(item.group, item.value, false)}
              />
            </Badge>
          ))}
        </Stack>
      </div>
    );
  };

  const renderCheckboxes = (group, options) => (
    <Form>
      {!options || options.length === 0 ? (
        <p className="text-muted small">Không có lựa chọn</p>
      ) : (
        options.map((option) => (
          <Form.Check
            type="checkbox"
            key={option.value}
            id={`${group}-${option.value}`}
            label={option.label}
            checked={
              Array.isArray(filters[group]) &&
              filters[group].includes(option.value)
            }
            onChange={(e) =>
              onFilterChange(group, option.value, e.target.checked)
            }
            style={{
              accentColor: "#449D44", // đổi màu checkbox
            }}
          />
        ))
      )}
    </Form>
  );

  return (
    <aside>
      {renderSelectedFilters()}

      <div className="mb-3">
        <h5>Tìm kiếm</h5>
        <FormControl
          type="search"
          placeholder="Tên, SKU, mô tả..."
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
        />
      </div>

      <Accordion defaultActiveKey={["0", "1"]} alwaysOpen>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Chọn mức giá</Accordion.Header>
          <Accordion.Body>
            {renderCheckboxes("price", options.price)}
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>Thương hiệu</Accordion.Header>
          <Accordion.Body>
            {renderCheckboxes("brand", options.brand)}
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header>Trạng thái</Accordion.Header>
          <Accordion.Body>
            {renderCheckboxes("status", options.status)}
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="3">
          <Accordion.Header>Trình độ chơi</Accordion.Header>
          <Accordion.Body>
            {renderCheckboxes("playerLevel", options.playerLevel)}
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="4">
          <Accordion.Header>Phong cách chơi</Accordion.Header>
          <Accordion.Body>
            {renderCheckboxes("playingStyle", options.playingStyle)}
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="5">
          <Accordion.Header>Độ cứng đũa</Accordion.Header>
          <Accordion.Body>
            {renderCheckboxes("shaftFlexibility", options.shaftFlexibility)}
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="6">
          <Accordion.Header>Điểm cân bằng</Accordion.Header>
          <Accordion.Body>
            {renderCheckboxes("balancePoint", options.balancePoint)}
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="7">
          <Accordion.Header>Trọng lượng</Accordion.Header>
          <Accordion.Body>
            {renderCheckboxes("weight", options.weight)}
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="8">
          <Accordion.Header>Nội dung chơi</Accordion.Header>
          <Accordion.Body>
            {renderCheckboxes("playType", options.playType)}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </aside>
  );
};

export default ProductSidebar;
