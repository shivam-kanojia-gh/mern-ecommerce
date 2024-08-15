import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	fetchLoggedInUserOrdersAsync,
	selectUserInfoStatus,
	selectUserOrders,
} from "../userSlice";
import { discountedPrice } from "../../../app/constants";
import { Grid } from "react-loader-spinner";

export default function UserOrders() {
	const dispatch = useDispatch();
	const orders = useSelector(selectUserOrders);
	const status = useSelector(selectUserInfoStatus);

	useEffect(() => {
		dispatch(fetchLoggedInUserOrdersAsync());
	}, [dispatch]);

	return (
		<div>
			{status === "loading" && (
				<div className="flex items-center justify-center h-screen">
					<Grid
						visible={true}
						height="80"
						width="80"
						color="rgb(79, 70, 229)"
						ariaLabel="grid-loading"
						radius="12.5"
						wrapperStyle={{}}
						wrapperClass="grid-wrapper"
					/>
				</div>
			)}
			{orders &&
				orders.map((order) => (
					<div key={order.id}>
						<div className="mx-auto mt-12 bg-white max-w-7xl px-4 sm:px-6 lg:px-8">
							<div className="border-t border-gray-200 px-4 py-6 sm:px-6">
								<h1 className="text-3xl mb-10 font-bold tracking-tight text-gray-900">
									Order #{order.id}
								</h1>
								<h3 className="text-xl mb-10 font-semibold tracking-tight text-red-900">
									Order Status: {order.status}
								</h3>
								<div className="flow-root">
									<ul className="-my-6 divide-y divide-gray-200">
										{order.items.map((item) => (
											<li key={item.product.id} className="flex py-6">
												<div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
													<img
														alt={item.product.title}
														src={item.product.thumbnail}
														className="h-full w-full object-cover object-center"
													/>
												</div>

												<div className="ml-4 flex flex-1 flex-col">
													<div>
														<div className="flex justify-between text-base font-medium text-gray-900">
															<h3>
																<a href={item.product.id}>
																	{item.product.title}
																</a>
															</h3>
															<p className="ml-4">
																${discountedPrice(item.product)}
															</p>
														</div>
														<p className="mt-1 text-sm text-gray-500">
															{item.product.brand}
														</p>
													</div>
													<div className="flex flex-1 items-end justify-between text-sm">
														<div>
															<label
																htmlFor="quantity"
																className="mr-5 text-sm font-medium leading-6 text-gray-900"
															>
																Qty : {item.quantity}
															</label>
														</div>
													</div>
												</div>
											</li>
										))}
									</ul>
								</div>
							</div>

							<div className="border-t border-gray-200 px-4 py-6 sm:px-6">
								<div className="flex justify-between my-2 text-base font-medium text-gray-900">
									<p>Subtotal</p>
									<p>${order.totalAmount}</p>
								</div>
								<div className="flex justify-between my-2 text-base font-medium text-gray-900">
									<p>Total Items in cart</p>
									<p>{order.totalItems} items</p>
								</div>
								<p className="mt-0.5 text-sm text-gray-500">
									Shipping Address:
								</p>
								<li className="flex justify-between gap-x-6 px-5 py-5 border-solid border-2 border-gray-200">
									<div className="flex min-w-0 gap-x-4">
										<div className="min-w-0 flex-auto">
											<p className="text-sm font-semibold leading-6 text-gray-900">
												{order.selectedAddress.name}
											</p>
											<p className="mt-1 truncate text-xs leading-5 text-gray-500">
												{order.selectedAddress.street}
											</p>
											<p className="mt-1 truncate text-xs leading-5 text-gray-500">
												{order.selectedAddress.pinCode}
											</p>
										</div>
									</div>
									<div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
										<p className="text-sm leading-6 text-gray-900">
											Phone: {order.selectedAddress.phone}
										</p>
										<p className="text-sm leading-6 text-gray-500">
											{order.selectedAddress.city}
										</p>
									</div>
								</li>
							</div>
						</div>
					</div>
				))}
		</div>
	);
}
