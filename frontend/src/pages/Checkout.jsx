import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { clearItem } from "../features/cart/cartSlice";
import { setSelectedAddressId } from "../features/payment/paymentSlice";
import {
  fetchAddresses,
  saveAddress,
  createPaymentIntent,
  markPaymentSucceeded,
  markPaymentFailed,
  clearPaymentState,
} from "../features/payment/paymentAction";
import {  createOrder} from "../features/order/orderAction.js"
// ─── Stripe setup ─────────────────────────────────────────────────────────────
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const STEPS = ["Shipping", "Payment", "Review"];

// ─── Inner form (needs Stripe hooks) ─────────────────────────────────────────
const CheckoutForm = ({ shippingMethod, setShippingMethod }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();

  // ── Redux state ──────────────────────────────────────────────────────────
  const { items, totalAmount } = useSelector((s) => s.cartStore);
  const {
    addresses,
    selectedAddressId,
    loading: paymentLoading,
  } = useSelector((s) => s.paymentStore);
  const { pendingOrderId} = useSelector((s)=> s.orderStore);

  // ── Local UI state
  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [paymentStepVisited, setPaymentStepVisited] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: "",
    suburb: "",
    city: "",
    state: "",
    postcode: "",
    country: "Australia",
    isDefault: false,
  });

  const [cardError, setCardError] = useState(null);

  // Set visited flag once payment step is reached to keep elements mounted cleanly
  useEffect(() => {
    if (step === 1) {
      setPaymentStepVisited(true);
    }
  }, [step]);

  // ── Derived totals (match backend logic) ─────────────────────────────────
  const subtotal = totalAmount || 0;
  const tax = Math.round(subtotal * 0.1);
  const shippingFee =
    shippingMethod === "express" ? 14.99 : subtotal > 100 ? 0 : 15.99;
  const total = subtotal + tax + shippingFee;
  const selectedAddress = addresses.find((a) => a._id === selectedAddressId);

  // ── Load addresses on mount ─────────────────────────────────────────────
  const loadAddresses = useCallback(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  // ── Add new address ──────────────────────────────────────────────────────
  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (
      !newAddress.street ||
      !newAddress.city ||
      !newAddress.state ||
      !newAddress.postcode
    ) {
      toast.error("Please fill in all required address fields.");
      return;
    }
    const res = await dispatch(saveAddress(newAddress));
    if (res?.status === "success") {
      toast.success("Address saved successfully!");
      setShowAddressForm(false);
      setNewAddress({
        street: "",
        suburb: "",
        city: "",
        state: "",
        postcode: "",
        country: "Australia",
        isDefault: false,
      });
    } else {
      toast.error(res?.message || "Failed to save address.");
    }
  };

  // ── Validate payment inputs before moving to step 2 ──────────────────────
  const handleContinueToReview = async () => {
    if (!stripe || !elements) {
      toast.error("Payment processor is loading. Please try again.");
      return;
    }

    // Trigger validation inside Stripe's PaymentElement
    const { error } = await elements.submit();
    if (error) {
      setCardError(error.message);
      toast.error(
        error.message || "Please complete entering your card details.",
      );
      return;
    }

    setCardError(null);
    setStep(2);
  };

  // ── Place order ──────────────────────────────────────────────────────────
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a shipping address.");
      return;
    }
    if (!pendingOrderId && items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setPlacing(true);

    try {
      let orderId = pendingOrderId;

      // 1. Create the order on backend if not already created in this session
      if (!orderId) {
        const orderRes = await dispatch(
          createOrder({
            shippingAddressId: selectedAddressId,
            paymentMethod: "card",
          }),
        );

        if (orderRes?.status !== "success") {
          toast.error(orderRes?.message || "Failed to create order.");
          setPlacing(false);
          return;
        }

        orderId = orderRes.data?._id;
      }

      // 2. Request the payment intent client secret
      const piRes = await dispatch(createPaymentIntent(orderId));
      if (piRes?.status !== "success") {
        toast.error(piRes?.message || "Failed to initiate payment.");
        setPlacing(false);
        return;
      }

      const clientSecret = piRes.data.clientSecret;

      // 3. Finalize payment with Stripe confirmPayment (Deferred Intent workflow)
      const { error: stripeError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/orders`,
        },
        redirect: "if_required",
      });

      if (stripeError) {
        dispatch(markPaymentFailed(stripeError.message));
        toast.error(
          `Payment failed: ${stripeError.message || "Payment processing failed"}. Please check your card details and try again.`,
        );
        setPlacing(false);
        return;
      }

      // 4. If confirmed inline, sync backend database payment status
      const confirmRes = await dispatch(
        markPaymentSucceeded(piRes.data.paymentIntent),
      );
      if (confirmRes?.status === "success") {
        toast.success(" Payment successful! Your order has been placed.");
      } else {
        toast.error(
          confirmRes?.message || "Payment succeeded, but database sync failed.",
        );
      }
      // 5. Clear cart on frontend ONLY now that payment succeeded
      dispatch(clearItem());

      // 6. Reset payment state & navigate to order history
      dispatch(clearPaymentState());
      navigate("/orders");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
      setPlacing(false);
    }
  };

  return (
    <div
      style={{
        background: "var(--nex-bg)",
        minHeight: "100vh",
        transition: "background 0.3s",
      }}
    >
      {/* Page hero */}
      <div className="nex-page-hero position-relative overflow-hidden">
        <div
          className="nex-orb"
          style={{
            width: 260,
            height: 260,
            background: "var(--nex-cyan)",
            top: "-50%",
            right: "-3%",
            opacity: 0.08,
          }}
        />
        <div
          className="nex-orb"
          style={{
            width: 320,
            height: 320,
            background: "var(--nex-purple)",
            bottom: "-60%",
            left: "-5%",
            opacity: 0.08,
          }}
        />
        <div
          className="container-fluid px-4 px-lg-5 position-relative"
          style={{ zIndex: 2 }}
        >
          <p
            className="nex-label mb-2"
            style={{ color: "var(--nex-purple)", fontWeight: 800 }}
          >
            NexMart Experience
          </p>
          <h1
            className="nex-text-light fw-bold mb-2"
            style={{ fontSize: "2.5rem", letterSpacing: "-0.5px" }}
          >
            Secure Checkout
          </h1>
          <p className="nex-breadcrumb mb-0">
            <Link to="/">Home</Link>
            <span className="nex-breadcrumb-sep">›</span>
            <Link to="/cart">Cart</Link>
            <span className="nex-breadcrumb-sep">›</span>
            <span className="nex-text-light fw-semibold">Checkout</span>
          </p>
        </div>
      </div>

      {/* Step indicator */}
      <div
        style={{
          background: "rgba(255,255,255,0.01)",
          borderBottom: "1px solid var(--nex-border)",
          padding: "24px 0",
        }}
      >
        <div className="container-fluid px-4 px-lg-5">
          <div className="nex-steps d-flex align-items-center justify-content-center">
            {STEPS.map((s, i) => (
              <div key={s} className="d-flex align-items-center">
                <div
                  className="d-flex align-items-center gap-3"
                  onClick={() => i < step && setStep(i)}
                  style={{
                    cursor: i < step ? "pointer" : "default",
                    transition: "opacity 0.3s",
                    opacity: i > step ? 0.45 : 1,
                  }}
                >
                  <div
                    className={`nex-step-circle ${i < step ? "done" : i === step ? "active" : "inactive"}`}
                    style={{
                      width: 36,
                      height: 36,
                      fontSize: "0.9rem",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    {i < step ? (
                      <i
                        className="bi bi-check-lg"
                        style={{ fontSize: "1rem", fontWeight: 900 }}
                      />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span
                    className="d-none d-sm-block fw-bold"
                    style={{
                      fontSize: "0.9rem",
                      letterSpacing: "0.5px",
                      color:
                        i === step
                          ? "var(--nex-text)"
                          : i < step
                            ? "#34d399"
                            : "var(--nex-text-muted)",
                      transition: "color 0.3s",
                    }}
                  >
                    {s}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`nex-step-line ${i < step ? "done" : ""}`}
                    style={{
                      width: "60px",
                      height: "2px",
                      margin: "0 16px",
                      transition: "background 0.4s ease",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-fluid px-4 px-lg-5 py-5">
        <div className="row g-5">
          {/* ── Form Area ── */}
          <div className="col-lg-7 col-xl-8">
            {/* Step 0: Shipping Address */}
            {step === 0 && (
              <div className="nex-glass-card p-4 p-md-5 animate__animated animate__fadeIn">
                <div
                  className="d-flex align-items-center gap-3 mb-4 pb-3"
                  style={{ borderBottom: "1px solid var(--nex-border)" }}
                >
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle"
                    style={{
                      width: 44,
                      height: 44,
                      background:
                        "linear-gradient(135deg, var(--nex-purple) 0%, var(--nex-cyan) 100%)",
                      boxShadow: "0 4px 15px rgba(139,92,246,0.3)",
                    }}
                  >
                    <i className="bi bi-geo-alt-fill text-white" />
                  </div>
                  <div>
                    <h5
                      className="nex-text-light fw-bold mb-0"
                      style={{ fontSize: "1.25rem", letterSpacing: "-0.3px" }}
                    >
                      Shipping Address
                    </h5>
                    <p
                      className="nex-text-muted mb-0"
                      style={{ fontSize: "0.8rem" }}
                    >
                      Choose where we should deliver your luxury package
                    </p>
                  </div>
                </div>

                {/* Saved addresses */}
                {paymentLoading ? (
                  <div className="text-center py-5">
                    <span
                      className="spinner-border spinner-border-sm nex-text-purple"
                      style={{ width: "2rem", height: "2rem" }}
                    />
                    <p
                      className="nex-text-muted mt-3 mb-0"
                      style={{ fontSize: "0.9rem" }}
                    >
                      Retrieving your address book…
                    </p>
                  </div>
                ) : addresses.length > 0 ? (
                  <div className="d-flex flex-column gap-3 mb-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr._id}
                        onClick={() => dispatch(setSelectedAddressId(addr._id))}
                        className="d-flex align-items-start gap-3 p-4 position-relative"
                        style={{
                          borderRadius: 16,
                          cursor: "pointer",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          border:
                            selectedAddressId === addr._id
                              ? "1px solid rgba(139,92,246,0.6)"
                              : "1px solid var(--nex-border)",
                          background:
                            selectedAddressId === addr._id
                              ? "rgba(139,92,246,0.06)"
                              : "rgba(255,255,255,0.02)",
                          boxShadow:
                            selectedAddressId === addr._id
                              ? "0 8px 30px rgba(139,92,246,0.12)"
                              : "none",
                          transform:
                            selectedAddressId === addr._id
                              ? "translateY(-2px)"
                              : "translateY(0)",
                        }}
                        onMouseEnter={(e) => {
                          if (selectedAddressId !== addr._id) {
                            e.currentTarget.style.border =
                              "1px solid rgba(255,255,255,0.2)";
                            e.currentTarget.style.background =
                              "rgba(255,255,255,0.04)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedAddressId !== addr._id) {
                            e.currentTarget.style.border =
                              "1px solid var(--nex-border)";
                            e.currentTarget.style.background =
                              "rgba(255,255,255,0.02)";
                          }
                        }}
                      >
                        <div
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: "50%",
                            flexShrink: 0,
                            marginTop: 2,
                            border: `2px solid ${selectedAddressId === addr._id ? "var(--nex-purple)" : "var(--nex-border)"}`,
                            background:
                              selectedAddressId === addr._id
                                ? "var(--nex-purple)"
                                : "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.25s",
                          }}
                        >
                          {selectedAddressId === addr._id && (
                            <div
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: "#fff",
                              }}
                            />
                          )}
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <p
                              className="nex-text-light fw-bold mb-0"
                              style={{ fontSize: "0.95rem" }}
                            >
                              {addr.street}
                            </p>
                            {addr.isDefault && (
                              <span
                                className="badge"
                                style={{
                                  background: "rgba(139,92,246,0.15)",
                                  color: "var(--nex-purple)",
                                  fontSize: "0.7rem",
                                  padding: "4px 8px",
                                  borderRadius: 6,
                                }}
                              >
                                Default
                              </span>
                            )}
                          </div>
                          <p
                            className="nex-text-muted mb-0"
                            style={{ fontSize: "0.85rem", lineHeight: 1.6 }}
                          >
                            {addr.suburb && <>{addr.suburb}, </>}
                            {addr.city}, {addr.state} {addr.postcode}
                            <br />
                            {addr.country}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className="p-4 rounded text-center mb-4"
                    style={{
                      background: "rgba(255,255,255,0.01)",
                      border: "1px dashed var(--nex-border)",
                    }}
                  >
                    <i
                      className="bi bi-geo-alt mb-2 d-block text-muted"
                      style={{ fontSize: "1.5rem" }}
                    />
                    <p
                      className="nex-text-muted mb-0"
                      style={{ fontSize: "0.88rem" }}
                    >
                      No saved addresses found. Please add a shipping
                      destination to continue.
                    </p>
                  </div>
                )}

                {/* Add Address button */}
                <button
                  onClick={() => setShowAddressForm((v) => !v)}
                  className="nex-btn-outline mb-4 d-flex align-items-center gap-2"
                  style={{
                    padding: "10px 22px",
                    fontSize: "0.88rem",
                    borderRadius: 10,
                  }}
                >
                  <i
                    className={`bi ${showAddressForm ? "bi-dash-circle" : "bi-plus-circle"}`}
                  />
                  {showAddressForm ? "Cancel" : "Add New Address"}
                </button>

                {/* Add Address Form */}
                {showAddressForm && (
                  <form
                    onSubmit={handleAddAddress}
                    className="p-4 mb-4 animate__animated animate__fadeIn"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid var(--nex-border)",
                      borderRadius: 16,
                    }}
                  >
                    <h6
                      className="nex-text-light fw-bold mb-3"
                      style={{ fontSize: "1rem", letterSpacing: "-0.1px" }}
                    >
                      New Shipping Address
                    </h6>
                    <div className="row g-3">
                      {[
                        {
                          name: "street",
                          label: "Street Address *",
                          placeholder: "e.g. 123 Luxury Avenue",
                          col: 12,
                        },
                        {
                          name: "suburb",
                          label: "Suburb / Neighborhood",
                          placeholder: "e.g. Surry Hills",
                          col: 12,
                        },
                        {
                          name: "city",
                          label: "City *",
                          placeholder: "e.g. Sydney",
                          col: 5,
                        },
                        {
                          name: "state",
                          label: "State / Region *",
                          placeholder: "e.g. NSW",
                          col: 3,
                        },
                        {
                          name: "postcode",
                          label: "Postcode *",
                          placeholder: "e.g. 2000",
                          col: 4,
                        },
                      ].map((f) => (
                        <div className={`col-${f.col}`} key={f.name}>
                          <label
                            className="nex-form-label mb-2"
                            style={{ fontSize: "0.8rem", fontWeight: 600 }}
                          >
                            {f.label}
                          </label>
                          <input
                            type="text"
                            className="nex-input"
                            placeholder={f.placeholder}
                            value={newAddress[f.name]}
                            style={{
                              background: "rgba(7,7,15,0.3)",
                              border: "1px solid var(--nex-border)",
                            }}
                            onChange={(e) =>
                              setNewAddress((a) => ({
                                ...a,
                                [f.name]: e.target.value,
                              }))
                            }
                          />
                        </div>
                      ))}
                      <div className="col-12">
                        <label
                          className="d-flex align-items-center gap-2 mt-2"
                          style={{ cursor: "pointer" }}
                        >
                          <input
                            type="checkbox"
                            checked={newAddress.isDefault}
                            style={{ accentColor: "var(--nex-purple)" }}
                            onChange={(e) =>
                              setNewAddress((a) => ({
                                ...a,
                                isDefault: e.target.checked,
                              }))
                            }
                          />
                          <span
                            className="nex-text-muted"
                            style={{ fontSize: "0.85rem" }}
                          >
                            Set as default delivery address
                          </span>
                        </label>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="nex-btn-primary mt-4"
                      style={{
                        padding: "12px 28px",
                        fontSize: "0.9rem",
                        borderRadius: 10,
                      }}
                    >
                      Save to Address Book
                    </button>
                  </form>
                )}

                {/* Shipping Method */}
                <h6
                  className="nex-text-light fw-bold mb-3 mt-2"
                  style={{ fontSize: "1.05rem" }}
                >
                  Shipping Method
                </h6>
                <div className="d-flex flex-column gap-3 mb-5">
                  {[
                    {
                      key: "standard",
                      label: "Standard Delivery",
                      sub: "Receive in 5–7 business days",
                      price: subtotal > 100 ? "FREE" : "$15.99",
                      icon: "bi-truck",
                      accent: "#34d399",
                    },
                    {
                      key: "express",
                      label: "Express Priority Delivery",
                      sub: "Fast tracking, 1–2 business days",
                      price: "$14.99",
                      icon: "bi-lightning-charge-fill",
                      accent: "var(--nex-cyan)",
                    },
                  ].map((opt) => (
                    <div
                      key={opt.key}
                      onClick={() => setShippingMethod(opt.key)}
                      className="d-flex align-items-center justify-content-between p-4"
                      style={{
                        borderRadius: 16,
                        cursor: "pointer",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        border:
                          shippingMethod === opt.key
                            ? "1px solid rgba(139,92,246,0.6)"
                            : "1px solid var(--nex-border)",
                        background:
                          shippingMethod === opt.key
                            ? "rgba(139,92,246,0.06)"
                            : "rgba(255,255,255,0.02)",
                        boxShadow:
                          shippingMethod === opt.key
                            ? "0 8px 30px rgba(139,92,246,0.12)"
                            : "none",
                        transform:
                          shippingMethod === opt.key
                            ? "translateY(-2px)"
                            : "translateY(0)",
                      }}
                      onMouseEnter={(e) => {
                        if (shippingMethod !== opt.key) {
                          e.currentTarget.style.border =
                            "1px solid rgba(255,255,255,0.2)";
                          e.currentTarget.style.background =
                            "rgba(255,255,255,0.04)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (shippingMethod !== opt.key) {
                          e.currentTarget.style.border =
                            "1px solid var(--nex-border)";
                          e.currentTarget.style.background =
                            "rgba(255,255,255,0.02)";
                        }
                      }}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <div
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: "50%",
                            border: `2px solid ${shippingMethod === opt.key ? "var(--nex-purple)" : "var(--nex-border)"}`,
                            background:
                              shippingMethod === opt.key
                                ? "var(--nex-purple)"
                                : "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.25s",
                            flexShrink: 0,
                          }}
                        >
                          {shippingMethod === opt.key && (
                            <div
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: "#fff",
                              }}
                            />
                          )}
                        </div>
                        <div
                          className="d-flex align-items-center justify-content-center rounded-circle"
                          style={{
                            width: 40,
                            height: 40,
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid var(--nex-border)",
                          }}
                        >
                          <i
                            className={`bi ${opt.icon}`}
                            style={{ color: opt.accent, fontSize: "1.15rem" }}
                          />
                        </div>
                        <div>
                          <p
                            className="nex-text-light fw-bold mb-0"
                            style={{ fontSize: "0.95rem" }}
                          >
                            {opt.label}
                          </p>
                          <p
                            className="nex-text-muted mb-0"
                            style={{ fontSize: "0.8rem" }}
                          >
                            {opt.sub}
                          </p>
                        </div>
                      </div>
                      <span
                        className="fw-bold"
                        style={{ color: opt.accent, fontSize: "1rem" }}
                      >
                        {opt.price}
                      </span>
                    </div>
                  ))}
                </div>

                <div
                  className="text-end pt-4"
                  style={{ borderTop: "1px solid var(--nex-border)" }}
                >
                  <button
                    onClick={() => {
                      if (!selectedAddressId) {
                        toast.error("Please select or add a shipping address.");
                        return;
                      }
                      setStep(1);
                    }}
                    className="nex-btn-primary d-inline-flex align-items-center gap-2"
                    style={{ padding: "14px 38px", borderRadius: 12 }}
                  >
                    Continue to Payment <i className="bi bi-arrow-right" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 1: Payment Details (keeps Stripe mounted when transitioning to Step 2) */}
            {(step === 1 || paymentStepVisited) && (
              <div
                className="nex-glass-card p-4 p-md-5 animate__animated animate__fadeIn"
                style={{ display: step === 1 ? "block" : "none" }}
              >
                <div
                  className="d-flex align-items-center gap-3 mb-4 pb-3"
                  style={{ borderBottom: "1px solid var(--nex-border)" }}
                >
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle"
                    style={{
                      width: 44,
                      height: 44,
                      background:
                        "linear-gradient(135deg, var(--nex-purple) 0%, var(--nex-cyan) 100%)",
                      boxShadow: "0 4px 15px rgba(139,92,246,0.3)",
                    }}
                  >
                    <i className="bi bi-credit-card-2-front-fill text-white" />
                  </div>
                  <div>
                    <h5
                      className="nex-text-light fw-bold mb-0"
                      style={{ fontSize: "1.25rem", letterSpacing: "-0.3px" }}
                    >
                      Payment Details
                    </h5>
                    <p
                      className="nex-text-muted mb-0"
                      style={{ fontSize: "0.8rem" }}
                    >
                      Enter your payment credentials using the secure Stripe
                      form
                    </p>
                  </div>
                </div>

                {/* Secure Stripe Payment Element Input */}
                <div
                  className="p-4 rounded-4 mb-4"
                  style={{
                    background: "rgba(255,255,255,0.015)",
                    border: "1px solid var(--nex-border)",
                  }}
                >
                  <PaymentElement />

                  {cardError && (
                    <div
                      className="d-flex align-items-center gap-2 p-2 px-3 rounded text-danger bg-danger bg-opacity-10 mt-3"
                      style={{ fontSize: "0.8rem" }}
                    >
                      <i className="bi bi-exclamation-triangle-fill" />
                      <span>{cardError}</span>
                    </div>
                  )}

                  <p
                    className="nex-text-muted mt-3 mb-0"
                    style={{ fontSize: "0.78rem" }}
                  >
                    <i className="bi bi-info-circle me-1" /> Use testing card:{" "}
                    <code
                      style={{
                        background: "rgba(139,92,246,0.15)",
                        padding: "2px 6px",
                        borderRadius: 4,
                        color: "var(--nex-purple)",
                        fontWeight: "bold",
                      }}
                    >
                      4242 4242 4242 4242
                    </code>
                    , any CVC, and future date.
                  </p>
                </div>

                {/* Secure transaction lock banner */}
                <div
                  className="d-flex align-items-center gap-3 p-3 rounded-3 mb-4"
                  style={{
                    background: "rgba(139,92,246,0.05)",
                    border: "1px solid rgba(139,92,246,0.15)",
                  }}
                >
                  <i
                    className="bi bi-shield-lock-fill"
                    style={{ fontSize: "1.25rem", color: "var(--nex-purple)" }}
                  />
                  <span
                    className="nex-text-muted"
                    style={{ fontSize: "0.82rem", lineHeight: 1.5 }}
                  >
                    Your connection is encrypted with 256-bit SSL security.
                    Stripe handles this transaction directly; no card data is
                    stored on our servers.
                  </span>
                </div>

                {/* Navigation Buttons */}
                <div
                  className="d-flex gap-3 pt-4"
                  style={{ borderTop: "1px solid var(--nex-border)" }}
                >
                  <button
                    onClick={() => setStep(0)}
                    className="nex-btn-outline"
                    style={{ padding: "13px 24px", borderRadius: 12 }}
                  >
                    ← Back to Shipping
                  </button>
                  <button
                    onClick={handleContinueToReview}
                    className="nex-btn-primary flex-grow-1 justify-content-center"
                    style={{ padding: "13px", borderRadius: 12 }}
                  >
                    Review Order Summary{" "}
                    <i className="bi bi-arrow-right ms-1" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Review Order */}
            {step === 2 && (
              <div className="nex-glass-card p-4 p-md-5 animate__animated animate__fadeIn">
                <div
                  className="d-flex align-items-center gap-3 mb-4 pb-3"
                  style={{ borderBottom: "1px solid var(--nex-border)" }}
                >
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle"
                    style={{
                      width: 44,
                      height: 44,
                      background:
                        "linear-gradient(135deg, var(--nex-purple) 0%, var(--nex-cyan) 100%)",
                      boxShadow: "0 4px 15px rgba(139,92,246,0.3)",
                    }}
                  >
                    <i className="bi bi-clipboard2-check-fill text-white" />
                  </div>
                  <div>
                    <h5
                      className="nex-text-light fw-bold mb-0"
                      style={{ fontSize: "1.25rem", letterSpacing: "-0.3px" }}
                    >
                      Review Order
                    </h5>
                    <p
                      className="nex-text-muted mb-0"
                      style={{ fontSize: "0.8rem" }}
                    >
                      Check everything one last time before confirmation
                    </p>
                  </div>
                </div>

                <div className="row g-4 mb-5">
                  {/* Delivery Location Summary */}
                  <div className="col-md-6">
                    <div
                      className="nex-glass-card p-4 h-100"
                      style={{
                        background: "rgba(255,255,255,0.01)",
                        border: "1px solid var(--nex-border)",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <p
                          className="nex-label mb-0"
                          style={{
                            color: "var(--nex-purple)",
                            fontSize: "0.72rem",
                          }}
                        >
                          Shipping Destination
                        </p>
                        <button
                          onClick={() => setStep(0)}
                          className="nex-gradient-text fw-bold"
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "0.82rem",
                          }}
                        >
                          Edit Address
                        </button>
                      </div>
                      {selectedAddress ? (
                        <>
                          <p
                            className="nex-text-light fw-bold mb-1"
                            style={{ fontSize: "0.92rem" }}
                          >
                            {selectedAddress.street}
                          </p>
                          <p
                            className="nex-text-muted mb-0"
                            style={{ fontSize: "0.85rem", lineHeight: 1.6 }}
                          >
                            {selectedAddress.suburb && (
                              <>
                                {selectedAddress.suburb}
                                <br />
                              </>
                            )}
                            {selectedAddress.city}, {selectedAddress.state}{" "}
                            {selectedAddress.postcode}
                            <br />
                            {selectedAddress.country}
                          </p>
                        </>
                      ) : (
                        <p
                          className="nex-text-muted mb-0"
                          style={{ fontSize: "0.85rem" }}
                        >
                          No destination selected
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Payment Method Summary */}
                  <div className="col-md-6">
                    <div
                      className="nex-glass-card p-4 h-100"
                      style={{
                        background: "rgba(255,255,255,0.01)",
                        border: "1px solid var(--nex-border)",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <p
                          className="nex-label mb-0"
                          style={{
                            color: "var(--nex-cyan)",
                            fontSize: "0.72rem",
                          }}
                        >
                          Payment Method
                        </p>
                        <button
                          onClick={() => setStep(1)}
                          className="nex-gradient-text fw-bold"
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "0.82rem",
                          }}
                        >
                          Change Card
                        </button>
                      </div>
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="d-flex align-items-center justify-content-center rounded-circle"
                          style={{
                            width: 40,
                            height: 40,
                            background: "rgba(255,255,255,0.02)",
                            border: "1px solid var(--nex-border)",
                          }}
                        >
                          <i
                            className="bi bi-credit-card-fill nex-gradient-text"
                            style={{ fontSize: "1.2rem" }}
                          />
                        </div>
                        <div>
                          <p
                            className="nex-text-light fw-bold mb-0"
                            style={{ fontSize: "0.92rem" }}
                          >
                            Stripe Checkout Form
                          </p>
                          <p
                            className="nex-text-muted mb-0"
                            style={{ fontSize: "0.78rem" }}
                          >
                            Secure Credit / Debit Card
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items in Checkout */}
                <h6
                  className="nex-text-light fw-bold mb-4"
                  style={{ fontSize: "1.02rem", letterSpacing: "-0.2px" }}
                >
                  Items in Order ({items.length})
                </h6>
                <div className="d-flex flex-column gap-3 mb-5">
                  {items.length === 0 ? (
                    <div
                      className="text-center py-4 rounded"
                      style={{
                        background: "rgba(255,255,255,0.01)",
                        border: "1px dashed var(--nex-border)",
                      }}
                    >
                      <p
                        className="nex-text-muted mb-0"
                        style={{ fontSize: "0.88rem" }}
                      >
                        Your cart is empty.
                      </p>
                    </div>
                  ) : (
                    items.map((item) => (
                      <div
                        key={item._id || item.product?._id}
                        className="nex-glass-card d-flex align-items-center gap-4 p-3"
                        style={{
                          background: "rgba(255,255,255,0.01)",
                          transition: "background 0.2s",
                        }}
                      >
                        <div
                          style={{
                            width: 68,
                            height: 68,
                            borderRadius: 12,
                            overflow: "hidden",
                            flexShrink: 0,
                            border: "1px solid var(--nex-border)",
                          }}
                        >
                          <img
                            src={item.image || item.product?.images?.[0]}
                            alt={item.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                        <div className="flex-grow-1 overflow-hidden">
                          <p
                            className="nex-text-light fw-bold mb-1 text-truncate"
                            style={{ fontSize: "0.92rem" }}
                          >
                            {item.name}
                          </p>
                          <div className="d-flex align-items-center gap-3">
                            <span
                              className="nex-text-muted"
                              style={{ fontSize: "0.78rem" }}
                            >
                              Quantity: {item.quantity}
                            </span>
                            <span
                              className="nex-text-muted"
                              style={{ fontSize: "0.78rem" }}
                            >
                              •
                            </span>
                            <span
                              className="nex-text-muted"
                              style={{ fontSize: "0.78rem" }}
                            >
                              Price: ${item.price}
                            </span>
                          </div>
                        </div>
                        <span
                          className="nex-text-light fw-bold"
                          style={{ fontSize: "0.98rem" }}
                        >
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Confirm order navigation controls */}
                <div
                  className="d-flex gap-3 pt-4"
                  style={{ borderTop: "1px solid var(--nex-border)" }}
                >
                  <button
                    onClick={() => setStep(1)}
                    className="nex-btn-outline"
                    style={{ padding: "13px 26px", borderRadius: 12 }}
                  >
                    ← Back to Payment
                  </button>
                  <button
                    id="place-order-btn"
                    className="nex-btn-primary flex-grow-1 justify-content-center d-inline-flex align-items-center gap-2"
                    style={{
                      padding: "13px",
                      borderRadius: 12,
                      background: placing
                        ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                        : undefined,
                      boxShadow: placing
                        ? "0 0 25px rgba(16,185,129,0.3)"
                        : undefined,
                      transition: "all 0.3s",
                    }}
                    onClick={handlePlaceOrder}
                    disabled={placing || paymentLoading}
                  >
                    {placing || paymentLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        />
                        <span>Processing Order…</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Checkout · ${total.toFixed(2)}</span>
                        <i
                          className="bi bi-shield-check"
                          style={{ fontSize: "1.05rem" }}
                        />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Order Summary Sidebar ── */}
          <div className="col-lg-5 col-xl-4">
            <div
              className="nex-summary-card p-4 position-sticky"
              style={{ top: "80px", borderRadius: 20 }}
            >
              <h6
                className="nex-text-light fw-bold mb-4 pb-3"
                style={{
                  borderBottom: "1px solid var(--nex-border)",
                  fontSize: "1.1rem",
                  letterSpacing: "-0.2px",
                }}
              >
                Order Summary
              </h6>

              {/* Items List inside sidebar */}
              <div
                className="d-flex flex-column gap-3 pb-4 mb-4"
                style={{
                  borderBottom: "1px solid var(--nex-border)",
                  maxHeight: 220,
                  overflowY: "auto",
                }}
              >
                {items.length === 0 ? (
                  <p
                    className="nex-text-muted mb-0"
                    style={{ fontSize: "0.85rem" }}
                  >
                    No items in cart.
                  </p>
                ) : (
                  items.map((item) => (
                    <div
                      key={item._id || item.product?._id}
                      className="d-flex gap-3 align-items-center"
                    >
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 8,
                          overflow: "hidden",
                          flexShrink: 0,
                          border: "1px solid var(--nex-border)",
                        }}
                      >
                        <img
                          src={item.image || item.product?.images?.[0]}
                          alt={item.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div className="flex-grow-1 overflow-hidden">
                        <p
                          className="nex-text-light fw-bold mb-0 text-truncate"
                          style={{ fontSize: "0.82rem" }}
                        >
                          {item.name}
                        </p>
                        <p
                          className="nex-text-muted mb-0"
                          style={{ fontSize: "0.75rem" }}
                        >
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <span
                        className="nex-text-light fw-bold"
                        style={{ fontSize: "0.88rem", flexShrink: 0 }}
                      >
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Pricing breakdown */}
              <div
                className="nex-summary-row d-flex justify-content-between mb-3"
                style={{ fontSize: "0.9rem" }}
              >
                <span className="nex-text-muted">Subtotal</span>
                <span className="nex-text-light fw-semibold">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div
                className="nex-summary-row d-flex justify-content-between mb-3"
                style={{ fontSize: "0.9rem" }}
              >
                <span className="nex-text-muted">GST Tax (10%)</span>
                <span className="nex-text-light fw-semibold">
                  ${tax.toFixed(2)}
                </span>
              </div>
              <div
                className="nex-summary-row d-flex justify-content-between mb-3"
                style={{ fontSize: "0.9rem" }}
              >
                <span className="nex-text-muted">Shipping Package</span>
                <span
                  style={
                    shippingFee === 0
                      ? { color: "#34d399", fontWeight: 700 }
                      : { color: "var(--nex-text)", fontWeight: 600 }
                  }
                >
                  {shippingFee === 0 ? "FREE" : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>

              {/* Total Row */}
              <div
                className="d-flex justify-content-between align-items-end mt-4 pt-4"
                style={{ borderTop: "1px solid var(--nex-border)" }}
              >
                <span
                  className="nex-text-light fw-bold"
                  style={{ fontSize: "1rem" }}
                >
                  Total Amount
                </span>
                <div className="text-end">
                  <div
                    className="nex-summary-total"
                    style={{
                      fontSize: "1.6rem",
                      fontWeight: 800,
                      color: "var(--nex-text)",
                      lineHeight: 1.1,
                    }}
                  >
                    ${total.toFixed(2)}
                  </div>
                  <span
                    className="nex-text-muted"
                    style={{ fontSize: "0.7rem" }}
                  >
                    Includes GST &amp; fees
                  </span>
                </div>
              </div>

              {/* Security Badge Footer */}
              <div
                className="text-center mt-4 pt-4"
                style={{ borderTop: "1px solid var(--nex-border)" }}
              >
                <div className="d-flex justify-content-center gap-4 mb-3">
                  <i
                    className="bi bi-shield-fill-check"
                    style={{
                      fontSize: "1.4rem",
                      color: "var(--nex-cyan)",
                      opacity: 0.85,
                    }}
                  />
                  <i
                    className="bi bi-lock-fill"
                    style={{
                      fontSize: "1.4rem",
                      color: "var(--nex-purple)",
                      opacity: 0.85,
                    }}
                  />
                  <i
                    className="bi bi-box-seam-fill"
                    style={{
                      fontSize: "1.4rem",
                      color: "var(--nex-cyan)",
                      opacity: 0.85,
                    }}
                  />
                </div>
                <p
                  className="nex-text-light mb-1"
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  100% Encrypted Payments
                </p>
                <p
                  className="nex-text-muted mb-0"
                  style={{ fontSize: "0.72rem", lineHeight: 1.4 }}
                >
                  Secured by Stripe SSL. Your credentials are never stored.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Outer wrapper – provides Stripe context ───────────────────────────────────
const Checkout = () => {
  const { totalAmount } = useSelector((s) => s.cartStore);
  const [shippingMethod, setShippingMethod] = useState("standard");

  const subtotal = totalAmount || 0;
  const tax = Math.round(subtotal * 0.1);
  const shippingFee =
    shippingMethod === "express" ? 14.99 : subtotal > 100 ? 0 : 15.99;
  const totalInCents = Math.max(
    1,
    Math.round((subtotal + tax + shippingFee) * 100),
  ); // Stripe requires amount > 0

  const options = {
    mode: "payment",
    amount: totalInCents,
    currency: "aud",
    appearance: {
      theme: "night",
      variables: {
        colorPrimary: "#8B5CF6",
        colorBackground: "#0b0c14",
        colorText: "#f0f4ff",
        colorDanger: "#f87171",
        fontFamily: "'Inter', sans-serif",
        spacingUnit: "5px",
        borderRadius: "12px",
      },
      rules: {
        ".Input": {
          border: "1px solid rgba(255, 255, 255, 0.08)",
          backgroundColor: "rgba(255, 255, 255, 0.02)",
          boxShadow: "none",
          transition: "all 0.2s",
        },
        ".Input:focus": {
          border: "1px solid #8B5CF6",
          backgroundColor: "rgba(139, 92, 246, 0.05)",
          boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.15)",
        },
        ".Label": {
          color: "rgba(240, 244, 255, 0.5)",
          fontSize: "13px",
          fontWeight: "600",
          letterSpacing: "0.5px",
        },
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm
        shippingMethod={shippingMethod}
        setShippingMethod={setShippingMethod}
      />
    </Elements>
  );
};

export default Checkout;
