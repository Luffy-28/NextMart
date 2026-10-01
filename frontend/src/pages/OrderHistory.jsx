import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { cancelOrder, getOrder, submitRefundRequestAction } from "../features/order/orderAction";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const STATUS_CONFIG = {
  delivered: {
    cls: "nex-status-green",
    icon: "bi-check-circle-fill",
    label: "Delivered",
  },
  shipped: { cls: "nex-status-blue", icon: "bi-truck", label: "Shipped" },
  processing: {
    cls: "nex-status-yellow",
    icon: "bi-hourglass-split",
    label: "Processing",
  },
  confirmed: {
    cls: "nex-status-blue",
    icon: "bi-check-circle",
    label: "Confirmed",
  },
  pending: { cls: "nex-status-yellow", icon: "bi-clock", label: "Pending" },
  returned: {
    cls: "nex-status-gray",
    icon: "bi-arrow-counterclockwise",
    label: "Returned",
  },
  cancelled: {
    cls: "nex-status-red",
    icon: "bi-x-circle-fill",
    label: "Cancelled",
  },
};

const OrderHistory = () => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const { orders, loading } = useSelector((state) => state.orderStore);
  const statuses = [
    "All",
    "delivered",
    "shipped",
    "processing",
    "confirmed",
    "pending",
    "returned",
    "cancelled",
  ];
  useEffect(() => {
    dispatch(getOrder());
  }, [dispatch]);

  if (loading && orders.length === 0) {
    return (
      <div style={{ background: "var(--nex-bg)", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <LoadingSpinner />
      </div>
    );
  }

  const filtered = orders
    .filter((order) => filter === "All" || order.orderStatus === filter)
    .filter(
      (order) =>
        !search ||
        order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        order.items.some((item) =>
          item.name.toLowerCase().includes(search.toLowerCase()),
        ),
    );

  const totalAmount = orders
    .filter((order) => {
      return order.orderStatus === "confirmed" || order.orderStatus === "delivered";
    })
    .reduce((sum, order) => sum + order.totalAmount, 0);
  
    const totalSpent = totalAmount.toFixed(2);

  const formatDate = (datestr) => {
    const date = new Date(datestr);
    return date.toLocaleDateString();
  };

  const [refundModal, setRefundModal] = useState(null); // null | { order, type: 'cancel' | 'return' }
  const [refundReason, setRefundReason] = useState("");
  const [refundImages, setRefundImages] = useState([]);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [submittingRefund, setSubmittingRefund] = useState(false);
  const [refundError, setRefundError] = useState("");
  const [refundSuccessMsg, setRefundSuccessMsg] = useState("");

  const openRefundModal = (order, type) => {
    setRefundModal({ order, type });
    setRefundReason("");
    setRefundImages([]);
    setImageUrlInput("");
    setRefundError("");
    setRefundSuccessMsg("");
  };

  const handleAddImage = () => {
    if (!imageUrlInput.trim()) return;
    setRefundImages((prev) => [...prev, imageUrlInput.trim()]);
    setImageUrlInput("");
  };

  const handleRemoveImage = (index) => {
    setRefundImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitRefund = async () => {
    if (!refundReason || refundReason.trim().length < 5) {
      setRefundError("Please provide a reason of at least 5 characters.");
      return;
    }
    if (refundModal.type === "return" && refundImages.length === 0) {
      setRefundError("Please provide at least one photo URL showing the item condition for a return.");
      return;
    }

    try {
      setSubmittingRefund(true);
      setRefundError("");
      const res = await dispatch(
        submitRefundRequestAction(refundModal.order._id, {
          type: refundModal.type,
          reason: refundReason.trim(),
          images: refundImages,
        })
      );
      if (res && res.status === "success") {
        setRefundSuccessMsg(res.message || "Request submitted successfully!");
        setTimeout(() => {
          setRefundModal(null);
        }, 1200);
      } else {
        setRefundError(res?.message || "Failed to submit request");
      }
    } catch (err) {
      setRefundError(err.message || "Something went wrong");
    } finally {
      setSubmittingRefund(false);
    }
  };

  const deliveredCount = orders.filter(
    (order) => order.orderStatus === "delivered",
  ).length;

  return (
    <div style={{ background: "var(--nex-bg)", minHeight: "100vh" }}>
      {/* Page hero */}
      <div className="nex-page-hero">
        <div
          className="nex-orb"
          style={{
            width: 280,
            height: 280,
            background: "#06B6D4",
            top: "-50%",
            right: "-4%",
            opacity: 0.1,
          }}
        />
        <div className="container-fluid px-4 px-lg-5 position-relative">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div>
              <p className="nex-label mb-2">NexMart</p>
              <h1
                className="nex-text-light fw-bold mb-2"
                style={{ fontSize: "2rem" }}
              >
                Order History
              </h1>
              <p className="nex-breadcrumb mb-0">
                <Link to="/">Home</Link>
                <span className="nex-breadcrumb-sep">›</span>
                <span className="nex-text-light fw-semibold">My Orders</span>
              </p>
            </div>
            <Link
              to="/products"
              className="nex-btn-outline"
              style={{ padding: "10px 24px", fontSize: "0.88rem" }}
            >
              <i className="bi bi-bag me-2" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <div className="container-fluid px-4 px-lg-5 py-5">
        {/* Stats */}
        <div className="row g-4 mb-5">
          {[
            {
              label: "Total Orders",
              value: orders.length,
              icon: "bi-box-seam",
              color: "var(--nex-purple)",
            },
            {
              label: "Total Spent",
              value: `$${totalSpent}`,
              icon: "bi-wallet2",
              color: "var(--nex-cyan)",
            },
            {
              label: "Delivered",
              value: deliveredCount,
              icon: "bi-check-circle",
              color: "#34d399",
            },
            {
              label: "Returned",
              value: orders.filter((order) => order.orderStatus === "returned")
                .length,
              icon: "bi-arrow-counterclockwise",
              color: "var(--nex-text-muted)",
            },
          ].map((stat, i) => (
            <div className="col-6 col-lg-3" key={i}>
              <div className="nex-glass-card p-4 d-flex align-items-center gap-3">
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: 52,
                    height: 52,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid var(--nex-border)",
                    flexShrink: 0,
                  }}
                >
                  <i
                    className={`bi ${stat.icon}`}
                    style={{ color: stat.color, fontSize: "1.3rem" }}
                  />
                </div>
                <div>
                  <p
                    className="nex-gradient-text fw-bold mb-0"
                    style={{ fontSize: "1.5rem", lineHeight: 1 }}
                  >
                    {stat.value}
                  </p>
                  <p
                    className="nex-text-muted mb-0 mt-1"
                    style={{ fontSize: "0.78rem" }}
                  >
                    {stat.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="nex-glass-card p-4 mb-4 d-flex flex-wrap align-items-center gap-4">
          <div
            className="position-relative flex-grow-1"
            style={{ minWidth: 240, maxWidth: 400 }}
          >
            <i
              className="bi bi-search position-absolute"
              style={{
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--nex-text-muted)",
                fontSize: "0.85rem",
              }}
            />
            <input
              type="text"
              className="nex-input"
              placeholder="Search by order ID or product…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 38, borderRadius: 50 }}
            />
          </div>
          <div className="d-flex flex-wrap gap-2">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={filter === s ? "nex-btn-primary" : "nex-btn-outline"}
                style={{ padding: "8px 18px", fontSize: "0.82rem" }}
              >
                {s === "All" ? "All" : (STATUS_CONFIG[s]?.label ?? s)}
              </button>
            ))}
          </div>
        </div>

        {/* Orders list */}
        <div style={{ position: "relative", minHeight: "200px" }}>
          {loading && orders.length > 0 && (
            <div className="position-absolute d-flex align-items-center justify-content-center" style={{ top: 0, left: 0, right: 0, bottom: 0, background: "rgba(7,7,15,0.6)", zIndex: 10, borderRadius: 16, backdropFilter: "blur(4px)" }}>
              <LoadingSpinner />
            </div>
          )}

          {filtered.length === 0 ? (
          <div className="nex-glass-card text-center py-5">
            <i
              className="bi bi-inbox nex-text-muted d-block mb-3"
              style={{ fontSize: "3.5rem", opacity: 0.4 }}
            />
            <h5 className="nex-text-light fw-bold mb-2">No orders found</h5>
            <p className="nex-text-muted mb-4">
              No orders match your current filters.
            </p>
            <button
              onClick={() => {
                setFilter("All");
                setSearch("");
              }}
              className="nex-btn-primary"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="d-flex flex-column gap-4">
            {filtered.map((order) => {
              const cfg = STATUS_CONFIG[order.orderStatus];
              const isOpen = expanded === order.orderNumber;
              return (
                <div
                  key={order.orderNumber}
                  className="nex-glass-card overflow-hidden"
                  style={{ transition: "border-color 0.2s" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = "var(--nex-border)")
                  }
                >
                  {/* Header row */}
                  <div
                    className="d-flex align-items-center justify-content-between flex-wrap gap-3 p-4 p-md-5"
                    style={{
                      cursor: "pointer",
                      borderBottom: isOpen
                        ? "1px solid var(--nex-border)"
                        : "none",
                    }}
                    onClick={() =>
                      setExpanded((prev) =>
                        prev === order.orderNumber ? null : order.orderNumber,
                      )
                    }
                  >
                    <div className="d-flex align-items-center gap-4 flex-wrap">
                      <div>
                        <p className="nex-label mb-1">Order Number</p>
                        <p
                          className="nex-text-light fw-bold mb-0"
                          style={{
                            fontSize: "0.95rem",
                            fontFamily: "monospace",
                          }}
                        >
                          {order.orderNumber}
                        </p>
                      </div>
                      <div
                        style={{
                          width: 1,
                          height: 36,
                          background: "var(--nex-border)",
                        }}
                        className="d-none d-sm-block"
                      />
                      <div>
                        <p className="nex-label mb-1">Date</p>
                        <p
                          className="nex-text-muted mb-0"
                          style={{ fontSize: "0.88rem" }}
                        >
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div
                        style={{
                          width: 1,
                          height: 36,
                          background: "var(--nex-border)",
                        }}
                        className="d-none d-md-block"
                      />
                      <div
                        className="d-none d-md-block"
                        style={{ maxWidth: 260 }}
                      >
                        <p className="nex-label mb-1">Items</p>
                        <p
                          className="nex-text-muted mb-0"
                          style={{
                            fontSize: "0.85rem",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {order.items.map((i) => i.name).join(", ")}
                        </p>
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-4 flex-wrap">
                      <span className={`nex-status ${cfg.cls}`}>
                        <i className={`bi ${cfg.icon}`} />
                        {cfg.label}
                      </span>
                      <div className="text-end">
                        <p className="nex-label mb-1">Total</p>
                        <p
                          className={`fw-bold mb-0 ${order.orderStatus === "returned" ? "nex-text-muted text-decoration-line-through" : "nex-gradient-text"}`}
                          style={{ fontSize: "1.1rem" }}
                        >
                          ${order.totalAmount}
                        </p>
                      </div>
                      <div
                        className="d-flex align-items-center justify-content-center"
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          border: "1px solid var(--nex-border)",
                          background: "var(--nex-bg-card)",
                          transition: "transform 0.3s",
                          transform: isOpen ? "rotate(180deg)" : "rotate(0)",
                        }}
                      >
                        <i
                          className="bi bi-chevron-down nex-text-muted"
                          style={{ fontSize: "0.8rem" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Expanded */}
                  {isOpen && (
                    <div
                      className="p-4 p-md-5"
                      style={{ background: "rgba(0,0,0,0.15)" }}
                    >
                      <div className="row g-5">
                        <div className="col-lg-7">
                          <p className="nex-label mb-3">Items in this Order</p>
                          <div className="d-flex flex-column gap-3">
                            {order.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="nex-glass-card d-flex align-items-center gap-4 p-3"
                              >
                                <div
                                  style={{
                                    width: 68,
                                    height: 68,
                                    borderRadius: 10,
                                    overflow: "hidden",
                                    flexShrink: 0,
                                    border: "1px solid var(--nex-border)",
                                  }}
                                >
                                  <img
                                    src={
                                      item.image ||
                                      (item?.product?.images &&
                                        item.product.images[0])
                                    }
                                    alt={item.name}
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                    }}
                                  />
                                </div>
                                <div className="flex-grow-1">
                                  <p
                                    className="nex-text-light fw-bold mb-0"
                                    style={{ fontSize: "0.9rem" }}
                                  >
                                    {item.name}
                                  </p>
                                  <p
                                    className="nex-text-muted mb-0"
                                    style={{ fontSize: "0.78rem" }}
                                  >
                                    Qty: {item.quantity} × ${item.price}
                                  </p>
                                </div>
                                <span className="nex-gradient-text fw-bold">
                                  ${item.quantity * item.price}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="col-lg-5">
                          <p className="nex-label mb-3">Order Details</p>
                          <div className="d-flex flex-column gap-3">
                            <div className="nex-glass-card p-4 d-flex align-items-start gap-3">
                              <i
                                className="bi bi-geo-alt-fill nex-text-purple mt-1"
                                style={{ flexShrink: 0 }}
                              />
                              <div>
                                <p className="nex-label mb-1">
                                  Delivery Address
                                </p>
                                <p
                                  className="nex-text-muted mb-0"
                                  style={{ fontSize: "0.88rem" }}
                                >
                                  {order.shippingAddress?.street},{" "}
                                  {order.shippingAddress?.city},{" "}
                                  {order.shippingAddress?.state}{" "}
                                  {order.shippingAddress?.postcode}
                                  {","}
                                  {order.shippingAddress?.country}
                                </p>
                              </div>
                            </div>

                            {order.tracking && (
                              <div className="nex-glass-card p-4 d-flex align-items-start gap-3">
                                <i
                                  className="bi bi-truck nex-text-purple mt-1"
                                  style={{ flexShrink: 0 }}
                                />
                                <div>
                                  <p className="nex-label mb-1">
                                    Tracking Number
                                  </p>
                                  <p
                                    className="nex-gradient-text fw-bold mb-0"
                                    style={{
                                      fontSize: "0.88rem",
                                      fontFamily: "monospace",
                                      cursor: "pointer",
                                    }}
                                  >
                                    {order.tracking}
                                  </p>
                                </div>
                              </div>
                            )}

                            <div className="nex-glass-card p-4">
                              <div className="d-flex justify-content-between mb-2">
                                <span
                                  className="nex-text-muted"
                                  style={{ fontSize: "0.85rem" }}
                                >
                                  Subtotal
                                </span>
                                <span
                                  className="nex-text-light fw-bold"
                                  style={{ fontSize: "0.85rem" }}
                                >
                                  ${order.totalAmount}
                                </span>
                              </div>
                              <div className="d-flex justify-content-between mb-3">
                                <span
                                  className="nex-text-muted"
                                  style={{ fontSize: "0.85rem" }}
                                >
                                  Shipping
                                </span>
                                <span
                                  style={{
                                    color: "#34d399",
                                    fontWeight: 700,
                                    fontSize: "0.85rem",
                                  }}
                                >
                                  FREE
                                </span>
                              </div>
                              {order.orderStatus === "returned" && (
                                <div
                                  className="d-flex justify-content-between mb-3 px-3 py-2 rounded"
                                  style={{
                                    background: "rgba(239,68,68,0.08)",
                                    border: "1px solid rgba(239,68,68,0.2)",
                                  }}
                                >
                                  <span
                                    style={{
                                      color: "#f87171",
                                      fontWeight: 700,
                                      fontSize: "0.85rem",
                                    }}
                                  >
                                    Return Applied
                                  </span>
                                  <span
                                    style={{
                                      color: "#f87171",
                                      fontWeight: 700,
                                      fontSize: "0.85rem",
                                    }}
                                  >
                                    −${order.totalAmount}
                                  </span>
                                </div>
                              )}
                              <div
                                className="d-flex justify-content-between pt-3"
                                style={{
                                  borderTop: "1px solid var(--nex-border)",
                                }}
                              >
                                <span className="nex-text-light fw-bold">
                                  Total
                                </span>
                                <span
                                  className={`fw-bold ${order.orderStatus === "returned" ? "nex-text-muted" : "nex-gradient-text"}`}
                                  style={{ fontSize: "1.1rem" }}
                                >
                                  $
                                  {order.orderStatus === "returned"
                                    ? "0"
                                    : order.totalAmount}
                                </span>
                              </div>
                            </div>

                            {/* Refund Request Status Banner if present */}
                            {order.refundRequest && (
                              <div
                                className="mt-4 p-4 rounded-3"
                                style={{
                                  background:
                                    order.refundRequest.status === "approved"
                                      ? "rgba(16,185,129,0.08)"
                                      : order.refundRequest.status === "partial"
                                      ? "rgba(59,130,246,0.08)"
                                      : order.refundRequest.status === "rejected"
                                      ? "rgba(239,68,68,0.08)"
                                      : "rgba(245,158,11,0.08)",
                                  border: `1px solid ${
                                    order.refundRequest.status === "approved"
                                      ? "rgba(16,185,129,0.3)"
                                      : order.refundRequest.status === "partial"
                                      ? "rgba(59,130,246,0.3)"
                                      : order.refundRequest.status === "rejected"
                                      ? "rgba(239,68,68,0.3)"
                                      : "rgba(245,158,11,0.3)"
                                  }`,
                                }}
                              >
                                <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                                  <div className="d-flex align-items-center gap-2">
                                    <i
                                      className={`bi ${
                                        order.refundRequest.status === "approved"
                                          ? "bi-check-circle-fill text-success"
                                          : order.refundRequest.status === "partial"
                                          ? "bi-pie-chart-fill text-primary"
                                          : order.refundRequest.status === "rejected"
                                          ? "bi-x-circle-fill text-danger"
                                          : "bi-hourglass-split text-warning"
                                      }`}
                                      style={{ fontSize: "1.2rem" }}
                                    />
                                    <span className="nex-text-light fw-bold" style={{ fontSize: "0.95rem" }}>
                                      {order.refundRequest.type === "cancel" ? "Cancellation" : "Return"} &amp; Refund:{" "}
                                      <span
                                        style={{
                                          color:
                                            order.refundRequest.status === "approved"
                                              ? "#34d399"
                                              : order.refundRequest.status === "partial"
                                              ? "#60a5fa"
                                              : order.refundRequest.status === "rejected"
                                              ? "#f87171"
                                              : "#fbbf24",
                                          textTransform: "capitalize",
                                        }}
                                      >
                                        {order.refundRequest.status === "approved"
                                          ? `Full Refund Approved ($${(order.refundRequest.refundAmount || 0).toFixed(2)})`
                                          : order.refundRequest.status === "partial"
                                          ? `Partial Refund Approved ($${(order.refundRequest.refundAmount || 0).toFixed(2)})`
                                          : order.refundRequest.status === "rejected"
                                          ? "Request Denied"
                                          : "Awaiting Admin Review"}
                                      </span>
                                    </span>
                                  </div>
                                  <span className="nex-text-muted" style={{ fontSize: "0.8rem" }}>
                                    Submitted: {new Date(order.refundRequest.createdAt).toLocaleDateString()}
                                  </span>
                                </div>

                                <p className="nex-text-muted mb-2" style={{ fontSize: "0.85rem" }}>
                                  <strong className="nex-text-light">Reason:</strong> "{order.refundRequest.reason}"
                                </p>

                                {order.refundRequest.images?.length > 0 && (
                                  <div className="d-flex gap-2 flex-wrap mb-2">
                                    {order.refundRequest.images.map((img, i) => (
                                      <img
                                        key={i}
                                        src={img}
                                        alt={`evidence-${i}`}
                                        style={{
                                          width: 50,
                                          height: 50,
                                          borderRadius: 6,
                                          objectFit: "cover",
                                          border: "1px solid var(--nex-border)",
                                        }}
                                      />
                                    ))}
                                  </div>
                                )}

                                {order.refundRequest.adminNote && (
                                  <div
                                    className="p-3 rounded-2 mt-2"
                                    style={{
                                      background: "rgba(0,0,0,0.25)",
                                      borderLeft: "3px solid var(--nex-purple)",
                                    }}
                                  >
                                    <p className="nex-text-light mb-1 fw-semibold" style={{ fontSize: "0.82rem" }}>
                                      <i className="bi bi-shield-check me-1" /> Admin Assessment:
                                    </p>
                                    <p className="nex-text-muted mb-0 fst-italic" style={{ fontSize: "0.85rem" }}>
                                      "{order.refundRequest.adminNote}"
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div
                        className="d-flex flex-wrap gap-3 mt-5 pt-4"
                        style={{ borderTop: "1px solid var(--nex-border)" }}
                      >
                        {order.orderStatus === "delivered" && (
                          <>
                            <button
                              className="nex-btn-primary"
                              style={{
                                padding: "10px 22px",
                                fontSize: "0.84rem",
                              }}
                            >
                              <i className="bi bi-bag-plus me-2" />
                              Buy Again
                            </button>
                            <button
                              className="nex-btn-outline"
                              style={{
                                padding: "10px 22px",
                                fontSize: "0.84rem",
                              }}
                            >
                              <i className="bi bi-star me-2" />
                              Write Review
                            </button>
                            {!order.refundRequest && (
                              <button
                                className="nex-btn-outline ms-auto"
                                onClick={() => openRefundModal(order, "return")}
                                style={{
                                  padding: "10px 22px",
                                  fontSize: "0.84rem",
                                  borderColor: "rgba(139,92,246,0.5)",
                                  color: "#a78bfa",
                                }}
                              >
                                <i className="bi bi-arrow-return-left me-2" />
                                Return Item
                              </button>
                            )}
                          </>
                        )}
                        {order.orderStatus === "shipped" && (
                          <button
                            className="nex-btn-primary"
                            style={{
                              padding: "10px 22px",
                              fontSize: "0.84rem",
                            }}
                          >
                            <i className="bi bi-geo-alt me-2" />
                            Track Package
                          </button>
                        )}
                        {(order.orderStatus === "processing" ||
                          order.orderStatus === "confirmed" ||
                          order.orderStatus === "pending") && (
                          !order.refundRequest && (
                            <button
                              className="nex-btn-outline"
                              onClick={() => openRefundModal(order, "cancel")}
                              style={{
                                padding: "10px 22px",
                                fontSize: "0.84rem",
                                borderColor: "rgba(239,68,68,0.4)",
                                color: "#f87171",
                              }}
                            >
                              <i className="bi bi-x-circle me-2" />
                              Cancel Order
                            </button>
                          )
                        )}
                        {(order.orderStatus === "cancelled" ||
                          order.orderStatus === "returned") && (
                          <Link
                            to="/products"
                            className="nex-btn-primary"
                            style={{
                              padding: "10px 22px",
                              fontSize: "0.84rem",
                            }}
                          >
                            <i className="bi bi-grid me-2" />
                            Shop Similar
                          </Link>
                        )}
                        <button
                          className={`nex-btn-outline ${order.orderStatus === "delivered" && !order.refundRequest ? "" : "ms-auto"}`}
                          style={{ padding: "10px 22px", fontSize: "0.84rem" }}
                        >
                          <i className="bi bi-file-text me-2" />
                          View Invoice
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        </div>
      </div>

      {/* ── Cancel / Return Request Modal ───────────────────────── */}
      {refundModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !submittingRefund) setRefundModal(null);
          }}
        >
          <div
            className="nex-glass-card"
            style={{
              width: "100%",
              maxWidth: 540,
              borderRadius: 16,
              padding: "28px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.12)",
              animation: "fadeIn 0.2s ease-out",
            }}
          >
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center gap-2">
                <i
                  className={`bi ${refundModal.type === "cancel" ? "bi-x-circle-fill text-danger" : "bi-arrow-return-left text-warning"}`}
                  style={{ fontSize: "1.4rem" }}
                />
                <h5 className="nex-text-light fw-bold mb-0">
                  {refundModal.type === "cancel" ? "Cancel Order" : "Request Return & Refund"}
                </h5>
              </div>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => !submittingRefund && setRefundModal(null)}
              />
            </div>

            <p className="nex-text-muted mb-3" style={{ fontSize: "0.85rem", lineHeight: 1.5 }}>
              {refundModal.type === "cancel"
                ? `Cancelling Order #${refundModal.order?.orderNumber}. A full refund request will be forwarded to our team to initiate payment reversal.`
                : `Return request for Order #${refundModal.order?.orderNumber}. Please provide the reason and clear photos of the item's condition so our team can approve your refund.`}
            </p>

            {/* Error or Success feedback */}
            {refundError && (
              <div
                className="p-3 mb-3 rounded-2"
                style={{
                  background: "rgba(239, 68, 68, 0.15)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  color: "#f87171",
                  fontSize: "0.85rem",
                }}
              >
                <i className="bi bi-exclamation-triangle-fill me-2" />
                {refundError}
              </div>
            )}

            {refundSuccessMsg && (
              <div
                className="p-3 mb-3 rounded-2"
                style={{
                  background: "rgba(16, 185, 129, 0.15)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  color: "#34d399",
                  fontSize: "0.85rem",
                }}
              >
                <i className="bi bi-check-circle-fill me-2" />
                {refundSuccessMsg}
              </div>
            )}

            {/* Form */}
            <div className="mb-3">
              <label className="nex-text-light fw-semibold mb-2" style={{ fontSize: "0.85rem" }}>
                Reason for {refundModal.type === "cancel" ? "Cancellation" : "Return"} <span className="text-danger">*</span>
              </label>
              <textarea
                className="form-control"
                rows={3}
                placeholder={
                  refundModal.type === "cancel"
                    ? "Explain why you want to cancel (e.g., ordered by mistake, found better price)..."
                    : "Describe the condition or reason (e.g., defective item, wrong size, damaged packaging)..."
                }
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid var(--nex-border)",
                  color: "white",
                  fontSize: "0.88rem",
                  borderRadius: 10,
                }}
              />
            </div>

            {/* Images section */}
            <div className="mb-4">
              <label className="nex-text-light fw-semibold mb-2" style={{ fontSize: "0.85rem" }}>
                {refundModal.type === "return" ? (
                  <>
                    Item Photos <span className="text-danger">* (Required for Returns)</span>
                  </>
                ) : (
                  "Photos / Evidence (Optional)"
                )}
              </label>

              <div className="d-flex gap-2 mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Paste image URL (e.g., https://...)"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddImage();
                    }
                  }}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid var(--nex-border)",
                    color: "white",
                    fontSize: "0.85rem",
                    borderRadius: 8,
                  }}
                />
                <button
                  type="button"
                  className="nex-btn-outline"
                  onClick={handleAddImage}
                  style={{ padding: "8px 16px", fontSize: "0.82rem", whiteSpace: "nowrap" }}
                >
                  <i className="bi bi-plus-lg me-1" /> Add
                </button>
              </div>

              {/* Thumbnails list */}
              {refundImages.length > 0 && (
                <div className="d-flex gap-2 flex-wrap mt-2">
                  {refundImages.map((img, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: "relative",
                        width: 60,
                        height: 60,
                        borderRadius: 8,
                        overflow: "hidden",
                        border: "1px solid rgba(255,255,255,0.2)",
                      }}
                    >
                      <img src={img} alt="Evidence" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        style={{
                          position: "absolute",
                          top: 2,
                          right: 2,
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          background: "rgba(239,68,68,0.9)",
                          border: "none",
                          color: "white",
                          fontSize: 10,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          padding: 0,
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="d-flex justify-content-end gap-2 pt-2" style={{ borderTop: "1px solid var(--nex-border)" }}>
              <button
                type="button"
                className="nex-btn-outline"
                onClick={() => setRefundModal(null)}
                disabled={submittingRefund}
                style={{ padding: "9px 20px", fontSize: "0.85rem" }}
              >
                Close
              </button>
              <button
                type="button"
                className="nex-btn-primary"
                onClick={handleSubmitRefund}
                disabled={submittingRefund}
                style={{
                  padding: "9px 24px",
                  fontSize: "0.85rem",
                  background:
                    refundModal.type === "cancel"
                      ? "linear-gradient(135deg, #ef4444, #dc2626)"
                      : "var(--nex-gradient)",
                }}
              >
                {submittingRefund ? (
                  "Submitting..."
                ) : (
                  <>
                    <i
                      className={`bi ${refundModal.type === "cancel" ? "bi-x-circle" : "bi-send"} me-2`}
                    />
                    Submit {refundModal.type === "cancel" ? "Cancellation" : "Return Request"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
