import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  getAddress,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../features/address/addressAction.js";
import ConfirmDialog from "../components/ui/ConfirmDialog.jsx";
import { changePassword, updateProfile } from "../features/user/userAction.js";
import { useForm } from "../hooks/useForm.js";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const TABS = [
  { key: "personal", label: "Personal Info", icon: "bi-person-fill" },
  { key: "security", label: "Security", icon: "bi-shield-lock-fill" },
  { key: "addresses", label: "Addresses", icon: "bi-geo-alt-fill" },
];

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading: userLoading } = useSelector((state) => state.userStore);
  const { addresses = [], loading: addressLoading } = useSelector((state) => state.addressStore);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");
  const [saved, setSaved] = useState(false);

  // Address modal & form state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    street: "",
    suburb: "",
    city: "",
    state: "",
    postcode: "",
    country: "Australia",
    isDefault: false,
  });
  const prodileInitialState ={
    name: "",
    email: "",
    phoneNumber: "",
    dob: "",
    gender: "prefer not to say",
    country: "",
  };
  const passwordInitialState ={
    currentPassword:"",
    newPassword:"",
    confirmPassword:"",
  }
  const [formErrors, setFormErrors] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const { formData, setFormData, handleChange } = useForm(prodileInitialState);
  const { formData: passwordFormData, setFormData: setPasswordFormData, handleChange: passwordhandleChange } = useForm(passwordInitialState);
 
  const handleOpenAddModal = () => {
    setEditingAddress(null);
    setAddressForm({
      street: "",
      suburb: "",
      city: "",
      state: "",
      postcode: "",
      country: "Australia",
      isDefault: false,
    });
    setFormErrors({});
    setShowAddressModal(true);
  };

  const handleOpenEditModal = (addr) => {
    setEditingAddress(addr);
    setAddressForm({
      street: addr.street || "",
      suburb: addr.suburb || "",
      city: addr.city || "",
      state: addr.state || "",
      postcode: addr.postcode || "",
      country: addr.country || "Australia",
      isDefault: addr.isDefault || false,
    });
    setFormErrors({});
    setShowAddressModal(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!addressForm.street.trim()) errors.street = "Street address is required";
    if (!addressForm.city.trim()) errors.city = "City is required";
    if (!addressForm.state.trim()) errors.state = "State / Territory is required";
    if (!addressForm.postcode.trim()) errors.postcode = "Postcode is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const updateFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(updateProfile(formData));
      if (response && response.status === "success") {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        alert(response?.message || "Failed to update profile");
      }
    } catch (error) {
      console.log("failed to updateUserdetials", error);
    }
  };
  const handlePasswordUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(changePassword(passwordFormData));
      if (response && response.status === "success") {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        setPasswordFormData(passwordInitialState);
      } else {
        alert(response?.message || "failed to update password");
      }
    } catch (err) {
      console.log("failed to update password", err);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setActionLoading(true);
    try {
      if (editingAddress) {
        await dispatch(updateAddress(editingAddress._id, { address: addressForm }));
      } else {
        await dispatch(addAddress({ address: addressForm }));
      }
      setShowAddressModal(false);
    } catch (err) {
      console.error("Failed to save address:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteClick = (addr) => {
    setAddressToDelete(addr);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!addressToDelete) return;
    setActionLoading(true);
    try {
      await dispatch(deleteAddress(addressToDelete._id));
      setShowDeleteConfirm(false);
      setAddressToDelete(null);
    } catch (err) {
      console.error("Failed to delete address:", err);
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !user.email) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      const defaultAddress = addresses.find((addr) => addr.isDefault) || addresses[0];
      const userCountry = defaultAddress ? defaultAddress.country : "";
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        dob: user.dob ? user.dob.split("T")[0] : "",
        gender: user.gender || "prefer not to say",
        country: userCountry,
      });
    }
  }, [user, addresses, setFormData]);

  useEffect(() => {
    dispatch(getAddress());
  }, [dispatch]);

  if (userLoading && !user) {
    return <LoadingSpinner fullPage={true} />;
  }

  if (!user || !user.email) return null;

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";
  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ background: "var(--nex-bg)", minHeight: "100vh" }}>
      {userLoading && <LoadingSpinner fullPage={true} />}
      {/* Page hero */}
      <div className="nex-page-hero">
        <div
          className="nex-orb"
          style={{
            width: 280,
            height: 280,
            background: "#F472B6",
            top: "-50%",
            right: "-4%",
            opacity: 0.08,
          }}
        />
        <div className="container-fluid px-4 px-lg-5 position-relative">
          <p className="nex-label mb-2">NexMart</p>
          <h1
            className="nex-text-light fw-bold mb-2"
            style={{ fontSize: "2rem" }}
          >
            My Profile
          </h1>
          <p className="nex-breadcrumb mb-0">
            <Link to="/">Home</Link>
            <span className="nex-breadcrumb-sep">›</span>
            <span className="nex-text-light fw-semibold">Profile</span>
          </p>
        </div>
      </div>

      <div className="container-fluid px-4 px-lg-5 py-5">
        <div className="row g-4">
          {/* Left: avatar card */}
          <div className="col-lg-4 col-xl-3">
            <div className="nex-glass-card p-4 text-center">
              <div
                className="mx-auto rounded-circle d-flex align-items-center justify-content-center mb-3 nex-icon-grad"
                style={{
                  width: 88,
                  height: 88,
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: "white",
                }}
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  initials
                )}
              </div>
              <h4
                className="nex-text-light fw-bold mb-1"
                style={{ fontSize: "1.1rem" }}
              >
                {user.name}
              </h4>
              <p
                className="nex-text-muted mb-3"
                style={{ fontSize: "0.85rem" }}
              >
                {user.email}
              </p>
              <div className="d-flex justify-content-center gap-2 mb-4">
                <span
                  className={`nex-status ${user.isVerified ? "nex-status-green" : "nex-status-yellow"}`}
                  style={{ fontSize: "0.72rem" }}
                >
                  <i
                    className={`bi ${user.isVerified ? "bi-check-circle-fill" : "bi-exclamation-circle-fill"}`}
                  />
                  {user.isVerified ? "Verified" : "Unverified"}
                </span>
                <span
                  className="nex-status nex-status-blue"
                  style={{ fontSize: "0.72rem", textTransform: "capitalize" }}
                >
                  <i className="bi bi-person-fill" />
                  {user.role || "Customer"}
                </span>
              </div>

              <div
                style={{
                  height: 1,
                  background: "var(--nex-border)",
                  marginBottom: 20,
                }}
              />

              <div className="d-flex flex-column gap-1 text-start">
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className="d-flex align-items-center gap-3 px-3 py-2 rounded w-100"
                    style={{
                      border: "none",
                      textAlign: "left",
                      fontSize: "0.88rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      background:
                        activeTab === tab.key
                          ? "rgba(139,92,246,0.12)"
                          : "transparent",
                      color:
                        activeTab === tab.key
                          ? "var(--nex-purple)"
                          : "var(--nex-text-muted)",
                      transition: "all 0.2s",
                    }}
                  >
                    <i
                      className={`bi ${tab.icon}`}
                      style={{ fontSize: "1rem", width: 18 }}
                    />
                    {tab.label}
                    {activeTab === tab.key && (
                      <i
                        className="bi bi-chevron-right ms-auto"
                        style={{ fontSize: "0.7rem" }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick stats */}
            <div className="nex-glass-card p-4 mt-4">
              <p className="nex-label mb-3">Account Stats</p>
              {[
                { icon: "bi-box-seam", label: "Total Orders", value: "5" },
                { icon: "bi-heart-fill", label: "Wishlist Items", value: "12" },
                { icon: "bi-star-fill", label: "Reviews Posted", value: "3" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="d-flex align-items-center justify-content-between py-2"
                  style={{ borderBottom: "1px solid var(--nex-border)" }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <i
                      className={`bi ${s.icon} nex-text-purple`}
                      style={{ fontSize: "0.9rem" }}
                    />
                    <span
                      className="nex-text-muted"
                      style={{ fontSize: "0.82rem" }}
                    >
                      {s.label}
                    </span>
                  </div>
                  <span
                    className="nex-text-light fw-bold"
                    style={{ fontSize: "0.88rem" }}
                  >
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: tab content */}
          <div className="col-lg-8 col-xl-9">
            {activeTab === "personal" && (
              <div className="nex-glass-card p-4 p-xl-5">
                <h5
                  className="nex-text-light fw-bold mb-4"
                  style={{ fontSize: "1.1rem" }}
                >
                  Personal Information
                </h5>
                <form onSubmit={updateFormSubmit} encType="multipart/form-data">
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="nex-form-label">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value = {formData.name}
                        onChange={(e)=>handleChange(e)}
                        className="nex-input"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="nex-form-label">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => handleChange(e)}
                        className="nex-input"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="nex-form-label">Phone Number</label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={(e) => handleChange(e)}
                        className="nex-input"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="nex-form-label">Date of Birth</label>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={(e) => handleChange(e)}
                        className="nex-input"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="nex-form-label">Gender</label>
                      <select
                        className="nex-input"
                        style={{ cursor: "pointer" }}
                        value={formData.gender}
                        onChange={(e)=>handleChange(e)}
                        name="gender"
                      >
                        <option value="prefer not to say">Prefer not to say</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="nex-form-label">Country (from default address)</label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={(e) => handleChange(e)}
                        className="nex-input"
                        disabled
                        style={{ cursor: "not-allowed", opacity: 0.7 }}
                      />
                    </div>
                    <div className="col-12">
                      <button
                        type="submit"
                        className="nex-btn-primary"
                        style={{
                          padding: "12px 32px",
                          background: saved
                            ? "linear-gradient(135deg,#10b981,#059669)"
                            : undefined,
                          transition: "all 0.3s",
                        }}
                      >
                        {saved ? (
                          <>
                            <i className="bi bi-check-lg me-2" />
                            Saved!
                          </>
                        ) : (
                          <>
                            Save Changes{" "}
                            <i className="bi bi-arrow-right ms-1" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "security" && (
              <div className="nex-glass-card p-4 p-xl-5">
                <h5
                  className="nex-text-light fw-bold mb-4"
                  style={{ fontSize: "1.1rem" }}
                >
                  Security Settings
                </h5>
                <div className="d-flex flex-column gap-4">
                  {/* Change password */}
                  <form onSubmit={handlePasswordUpdateSubmit}
                    className="p-4 rounded"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid var(--nex-border)",
                      borderRadius: 12,
                    }}
                  >
                    <p className="nex-text-light fw-bold mb-1">
                      Change Password
                    </p>
                    <p
                      className="nex-text-muted mb-4"
                      style={{ fontSize: "0.85rem" }}
                    >
                      Choose a strong password and don't reuse it for other
                      accounts.
                    </p>
                    <div
                      className="d-flex flex-column gap-3"
                      style={{ maxWidth: 440 }}
                    >
                      <div>
                        <label className="nex-form-label">
                          Current Password
                        </label>
                        <input
                          type="text"
                          name="currentPassword"
                          value={passwordFormData.currentPassword}
                          onChange={(e) => passwordhandleChange(e)}
                          placeholder="••••••••••••"
                          className="nex-input"
                        />
                      </div>
                      <div>
                        <label className="nex-form-label">New Password</label>
                        <input
                          type="text"
                          name="newPassword"
                          value={passwordFormData.newPassword}
                          onChange={(e) => passwordhandleChange(e)}
                          placeholder="Min 8 characters"
                          className="nex-input"
                        />
                      </div>
                      <div>
                        <label className="nex-form-label">
                          Confirm New Password
                        </label>
                        <input
                          type="text"
                          name="confirmPassword"
                          value={passwordFormData.confirmPassword}
                          onChange={(e) => passwordhandleChange(e)}
                          placeholder="••••••••••••"
                          className="nex-input"
                        />
                      </div>
                      <button
                        type="submit"
                        className="nex-btn-primary"
                        style={{
                          padding: "11px 28px",
                          alignSelf: "flex-start",
                        }}
                      >
                        Update Password
                      </button>
                    </div>
                  </form>

                  {/* 2FA */}
                  <div
                    className="p-4 d-flex align-items-center justify-content-between gap-4 rounded"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid var(--nex-border)",
                      borderRadius: 12,
                    }}
                  >
                    <div>
                      <p className="nex-text-light fw-bold mb-1">
                        Two-Factor Authentication
                      </p>
                      <p
                        className="nex-text-muted mb-0"
                        style={{ fontSize: "0.85rem" }}
                      >
                        Add an extra layer of security to your account.
                      </p>
                    </div>
                    <button
                      className="nex-btn-outline"
                      style={{
                        padding: "9px 20px",
                        fontSize: "0.84rem",
                        flexShrink: 0,
                      }}
                    >
                      Enable 2FA
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "addresses" && (
              <div className="nex-glass-card p-4 p-xl-5">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <h5
                    className="nex-text-light fw-bold mb-0"
                    style={{ fontSize: "1.1rem" }}
                  >
                    Saved Addresses
                  </h5>
                  <button
                    onClick={handleOpenAddModal}
                    className="nex-btn-primary"
                    style={{ padding: "9px 20px", fontSize: "0.84rem" }}
                  >
                    <i className="bi bi-plus-lg me-1" />
                    Add Address
                  </button>
                </div>
                <div className="d-flex flex-column gap-3" style={{ position: "relative", minHeight: "200px" }}>
                  {addressLoading && (
                    <div className="position-absolute d-flex align-items-center justify-content-center" style={{ top: 0, left: 0, right: 0, bottom: 0, background: "rgba(7,7,15,0.6)", zIndex: 10, borderRadius: 12, backdropFilter: "blur(4px)" }}>
                      <LoadingSpinner />
                    </div>
                  )}
                  {addresses.length === 0 ? (
                    <div
                      className="text-center p-5 rounded"
                      style={{
                        background: "rgba(255,255,255,0.01)",
                        border: "1px dashed var(--nex-border)",
                        borderRadius: 14,
                      }}
                    >
                      <div
                        className="mx-auto rounded-circle d-flex align-items-center justify-content-center mb-3"
                        style={{
                          width: 60,
                          height: 60,
                          background: "rgba(139,92,246,0.06)",
                          border: "1px solid rgba(139,92,246,0.15)",
                          color: "var(--nex-purple)",
                        }}
                      >
                        <i className="bi bi-geo-alt" style={{ fontSize: "1.5rem" }} />
                      </div>
                      <h6 className="nex-text-light fw-bold mb-1">No Addresses Saved</h6>
                      <p className="nex-text-muted mb-4" style={{ fontSize: "0.85rem" }}>
                        Please add an address to speed up checkout.
                      </p>
                      <button
                        onClick={handleOpenAddModal}
                        className="nex-btn-primary"
                        style={{ padding: "8px 18px", fontSize: "0.8rem" }}
                      >
                        <i className="bi bi-plus-lg me-1" /> Add Address
                      </button>
                    </div>
                  ) : (
                    addresses.map((addr) => {
                      const fullAddress = `${addr.street}${addr.suburb ? ", " + addr.suburb : ""}, ${addr.city}, ${addr.state} ${addr.postcode}, ${addr.country}`;
                      return (
                        <div
                          key={addr._id}
                          className="p-4 rounded d-flex align-items-start justify-content-between gap-3 position-relative nex-address-card"
                          style={{
                            background: "rgba(255,255,255,0.02)",
                            border: `1px solid ${addr.isDefault ? "rgba(139,92,246,0.4)" : "var(--nex-border)"}`,
                            borderRadius: 12,
                            transition: "all 0.25s ease",
                          }}
                        >
                          <div className="d-flex gap-3">
                            <i
                              className={`bi ${addr.isDefault ? "bi-house-fill" : "bi-geo-alt-fill"} nex-text-purple mt-1`}
                              style={{ flexShrink: 0, fontSize: "1.1rem" }}
                            />
                            <div>
                              <div className="d-flex align-items-center gap-2 mb-1">
                                <span
                                  className="nex-text-light fw-bold"
                                  style={{ fontSize: "0.9rem" }}
                                >
                                  {addr.isDefault ? "Home / Default" : "Delivery Address"}
                                </span>
                                {addr.isDefault && (
                                  <span
                                    className="nex-status nex-status-blue"
                                    style={{ fontSize: "0.65rem" }}
                                  >
                                    Default
                                  </span>
                                )}
                              </div>
                              <p
                                className="nex-text-muted mb-0"
                                style={{ fontSize: "0.85rem", lineHeight: 1.5 }}
                              >
                                {fullAddress}
                              </p>
                            </div>
                          </div>
                          <div className="d-flex gap-2 flex-shrink-0">
                            <button
                              onClick={() => handleOpenEditModal(addr)}
                              className="nex-btn-outline"
                              style={{ padding: "6px 14px", fontSize: "0.78rem" }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteClick(addr)}
                              style={{
                                background: "transparent",
                                border: "1px solid rgba(239,68,68,0.3)",
                                borderRadius: 8,
                                padding: "6px 14px",
                                fontSize: "0.78rem",
                                color: "#f87171",
                                cursor: "pointer",
                                transition: "all 0.2s",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = "rgba(239,68,68,0.1)";
                                e.currentTarget.style.borderColor = "#ef4444";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = "transparent";
                                e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)";
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Address Form Modal */}
      {showAddressModal && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => !actionLoading && setShowAddressModal(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1050,
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(6px)",
              animation: "nex-dialog-fade-in 0.15s ease",
            }}
          />

          {/* Dialog Container */}
          <div
            role="dialog"
            aria-modal="true"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1051,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: 560,
                background: "var(--nex-bg-card)",
                border: "1px solid var(--nex-border)",
                borderRadius: 18,
                padding: "32px 28px 24px",
                boxShadow: "0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px var(--nex-border)",
                animation: "nex-dialog-slide-in 0.2s cubic-bezier(0.34,1.56,0.64,1)",
                pointerEvents: "all",
              }}
            >
              {/* Modal Header */}
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h4
                  style={{
                    color: "var(--nex-text-light, #f0f4ff)",
                    fontWeight: 700,
                    fontSize: "1.2rem",
                    margin: 0,
                  }}
                >
                  {editingAddress ? "Edit Address" : "Add New Address"}
                </h4>
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  disabled={actionLoading}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--nex-text-muted)",
                    fontSize: "1.2rem",
                    cursor: "pointer",
                  }}
                >
                  <i className="bi bi-x-lg" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleAddressSubmit}>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="nex-form-label">Street Address *</label>
                    <input
                      type="text"
                      className={`nex-input ${formErrors.street ? "is-invalid" : ""}`}
                      value={addressForm.street}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, street: e.target.value })
                      }
                      placeholder="e.g. 123 Main Street"
                    />
                    {formErrors.street && (
                      <div className="text-danger mt-1" style={{ fontSize: "0.75rem" }}>
                        {formErrors.street}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="nex-form-label">Suburb</label>
                    <input
                      type="text"
                      className="nex-input"
                      value={addressForm.suburb}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, suburb: e.target.value })
                      }
                      placeholder="e.g. Surry Hills"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="nex-form-label">City *</label>
                    <input
                      type="text"
                      className={`nex-input ${formErrors.city ? "is-invalid" : ""}`}
                      value={addressForm.city}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, city: e.target.value })
                      }
                      placeholder="e.g. Sydney"
                    />
                    {formErrors.city && (
                      <div className="text-danger mt-1" style={{ fontSize: "0.75rem" }}>
                        {formErrors.city}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="nex-form-label">State / Territory *</label>
                    <input
                      type="text"
                      className={`nex-input ${formErrors.state ? "is-invalid" : ""}`}
                      value={addressForm.state}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, state: e.target.value })
                      }
                      placeholder="e.g. NSW"
                    />
                    {formErrors.state && (
                      <div className="text-danger mt-1" style={{ fontSize: "0.75rem" }}>
                        {formErrors.state}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="nex-form-label">Postcode *</label>
                    <input
                      type="text"
                      className={`nex-input ${formErrors.postcode ? "is-invalid" : ""}`}
                      value={addressForm.postcode}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, postcode: e.target.value })
                      }
                      placeholder="e.g. 2000"
                    />
                    {formErrors.postcode && (
                      <div className="text-danger mt-1" style={{ fontSize: "0.75rem" }}>
                        {formErrors.postcode}
                      </div>
                    )}
                  </div>

                  <div className="col-12">
                    <label className="nex-form-label">Country</label>
                    <input
                      type="text"
                      className="nex-input"
                      value={addressForm.country}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, country: e.target.value })
                      }
                      placeholder="Australia"
                    />
                  </div>

                  <div className="col-12 mt-3">
                    <label
                      className="d-flex align-items-center gap-2"
                      style={{ cursor: "pointer", color: "var(--nex-text-light)" }}
                    >
                      <input
                        type="checkbox"
                        checked={addressForm.isDefault}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            isDefault: e.target.checked,
                          })
                        }
                        style={{
                          accentColor: "var(--nex-purple)",
                          width: 16,
                          height: 16,
                          cursor: "pointer",
                        }}
                      />
                      <span style={{ fontSize: "0.88rem" }}>Set as default address</span>
                    </label>
                  </div>
                </div>

                <div className="d-flex gap-3 justify-content-end mt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(false)}
                    disabled={actionLoading}
                    className="nex-btn-outline"
                    style={{ padding: "10px 20px", fontSize: "0.88rem" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="nex-btn-primary"
                    style={{
                      padding: "10px 22px",
                      fontSize: "0.88rem",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    {actionLoading && (
                      <span
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: "50%",
                          border: "2px solid rgba(255,255,255,0.3)",
                          borderTopColor: "white",
                          animation: "nex-spin 0.6s linear infinite",
                          display: "inline-block",
                        }}
                      />
                    )}
                    {editingAddress ? "Save Changes" : "Add Address"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => !actionLoading && setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Remove Address"
        message="Are you sure you want to remove this address? This action cannot be undone."
        confirmText="Remove"
        cancelText="Cancel"
        confirmVariant="danger"
        icon="bi-trash3"
        loading={actionLoading}
      />

      <style>{`
        .nex-address-card:hover {
          background: rgba(255,255,255,0.04) !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.12);
        }
      `}</style>
    </div>
  );
};

export default Profile;
