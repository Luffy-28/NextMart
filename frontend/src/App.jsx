import { useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { autoLogin } from "./features/user/userAction.js";
import Layout from "./components/Layout/Layout.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import EmailVerify from "./pages/Emailverify.jsx";
import Products from "./pages/Products.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import OrderHistory from "./pages/OrderHistory.jsx";
import Categories from "./pages/Categories.jsx";
import Deals from "./pages/Deals.jsx";
import Profile from "./pages/Profile.jsx";
import "./styles/styles.css";
import Auth from "./components/Auth/Auth.jsx";

function App() {
  const dispatch = useDispatch();
  const { isDark } = useSelector((state) => state.themeStore);

  useEffect(() => {
    dispatch(autoLogin());
  }, [dispatch]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-bs-theme', isDark ? 'dark' : 'light');
    root.style.setProperty('--nex-bg',          isDark ? '#07070f'                    : '#f0f4ff');
    root.style.setProperty('--nex-bg-card',      isDark ? 'rgba(255,255,255,0.04)'    : 'rgba(255,255,255,0.9)');
    root.style.setProperty('--nex-bg-card-hov',  isDark ? 'rgba(255,255,255,0.07)'    : 'rgba(255,255,255,1)');
    root.style.setProperty('--nex-border',       isDark ? 'rgba(255,255,255,0.08)'    : 'rgba(0,0,0,0.1)');
    root.style.setProperty('--nex-border-glow',  isDark ? 'rgba(139,92,246,0.45)'     : 'rgba(139,92,246,0.5)');
    root.style.setProperty('--nex-text',         isDark ? '#f0f4ff'                   : '#0f0f1a');
    root.style.setProperty('--nex-text-muted',   isDark ? 'rgba(240,244,255,0.48)'    : 'rgba(15,15,26,0.55)');
    root.style.setProperty('--nm-header-bg',     isDark ? 'rgba(7,7,15,0.95)'         : 'rgba(255,255,255,0.95)');
  }, [isDark]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<EmailVerify />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/profile" element={<Auth><Profile /></Auth>} />
          <Route path="/cart" element={<Auth><Cart /></Auth>} />
          <Route path="/checkout" element={<Auth><Checkout /></Auth>} />
          <Route path="/orders" element={<Auth><OrderHistory /></Auth>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
