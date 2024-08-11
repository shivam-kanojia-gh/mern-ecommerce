import CartPage from "./pages/CartPage";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Checkout from "./pages/Checkout";
import ProductDetailPage from "./pages/ProductDetailPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Protected from "./features/auth/components/Protected";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchItemsByUserIdAsync } from "./features/cart/cartSlice";
import { selectLoggedInUser } from "./features/auth/authSlice";
import PageNotFound from "./pages/404";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import UserOrdersPage from "./pages/UserOrdersPage";
import UserProfilePage from "./pages/UserProfilePage";
import { fetchLoggedInUserAsync } from "./features/user/userSlice";
import Logout from "./features/auth/components/Logout";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ProtectedAdmin from "./features/auth/components/ProtectedAdmin";
import AdminHome from "./pages/AdminHome";
import AdminProductDetailPage from "./pages/AdminProductDetailPage";
import ProductFormPage from "./pages/ProductFormPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import { positions, Provider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<Protected>
				<Home></Home>
			</Protected>
		),
	},
	{
		path: "/admin",
		element: (
			<ProtectedAdmin>
				<AdminHome></AdminHome>
			</ProtectedAdmin>
		),
	},
	{
		path: "/login",
		element: <LoginPage></LoginPage>,
	},
	{
		path: "/signup",
		element: <SignupPage></SignupPage>,
	},
	{
		path: "/cart",
		element: (
			<Protected>
				<CartPage></CartPage>
			</Protected>
		),
	},
	{
		path: "/checkout",
		element: (
			<Protected>
				<Checkout></Checkout>
			</Protected>
		),
	},
	{
		path: "/product-detail/:id",
		element: (
			<Protected>
				<ProductDetailPage></ProductDetailPage>
			</Protected>
		),
	},
	{
		path: "/admin/product-detail/:id",
		element: (
			<ProtectedAdmin>
				<AdminProductDetailPage></AdminProductDetailPage>
			</ProtectedAdmin>
		),
	},
	{
		path: "/admin/product-form",
		element: (
			<ProtectedAdmin>
				<ProductFormPage></ProductFormPage>
			</ProtectedAdmin>
		),
	},
	{
		path: "/admin/product-form/edit/:id",
		element: (
			<ProtectedAdmin>
				<ProductFormPage></ProductFormPage>
			</ProtectedAdmin>
		),
	},
	{
		path: "/order-success/:id",
		element: <OrderSuccessPage></OrderSuccessPage>,
	},
	{
		path: "/orders",
		element: <UserOrdersPage></UserOrdersPage>,
	},
	{
		path: "/admin/orders",
		element: (
			<ProtectedAdmin>
				<AdminOrdersPage></AdminOrdersPage>
			</ProtectedAdmin>
		),
	},
	{
		path: "/profile",
		element: <UserProfilePage></UserProfilePage>,
	},
	{
		path: "/logout",
		element: <Logout></Logout>,
	},
	{
		path: "/forgot-password",
		element: <ForgotPasswordPage></ForgotPasswordPage>,
	},
	{
		path: "*", // last me rkhna h isse, agr koi bhi match nhi hua toh ye chl jaega
		element: <PageNotFound></PageNotFound>,
	},
]);

const options = {
	timeout: 5000,
	position: positions.BOTTOM_LEFT,
};

function App() {
	const dispatch = useDispatch();
	const user = useSelector(selectLoggedInUser);

	useEffect(() => {
		if (user) {
			dispatch(fetchItemsByUserIdAsync(user.id));
			dispatch(fetchLoggedInUserAsync(user.id));
		}
	}, [dispatch, user]);

	return (
		<div className="App">
			<Provider template={AlertTemplate} {...options}>
				<RouterProvider router={router} />
				{/* NOTE: Link must be used inside RouterProvider */}
			</Provider>
		</div>
	);
}

export default App;
