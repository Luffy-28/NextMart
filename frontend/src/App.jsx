import { useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
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
import "./styles/styles.css"
import "./styles/animations.css"

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(autoLogin());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Home/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/verify-email" element={<EmailVerify/>}/>
          <Route path="/products" element={<Products/>}/>
          <Route path="/products/:id" element={<ProductDetails/>}/>
          <Route path="/categories" element={<Categories/>}/>
          <Route path="/deals" element={<Deals/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/cart" element={<Cart/>}/>
          <Route path="/checkout" element={<Checkout/>}/>
          <Route path="/orders" element={<OrderHistory/>}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
