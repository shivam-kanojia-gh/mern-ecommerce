import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import {
	deleteItemFromCartAsync,
	selectCartLoaded,
	selectItems,
	updateCartAsync,
} from "./cartSlice";
import { discountedPrice } from "../../app/constants";
import Modal from "../common/Modal";

export default function Cart() {
	const dispatch = useDispatch();
	const items = useSelector(selectItems);
	const cartLoaded = useSelector(selectCartLoaded);
	const [showModal, setShowModal] = useState(null);
	const totalAmount =
		Math.round(
			items.reduce(
				(amount, item) => discountedPrice(item.product) * item.quantity + amount,
				0
			) * 100
		) / 100;
	const totalItems = items.reduce((total, item) => item.quantity + total, 0);

	const handleQuantity = (e, item) => {
		dispatch(updateCartAsync({ id:item.id, quantity: +e.target.value }));
	};

	const handleRemove = (id) => {
		dispatch(deleteItemFromCartAsync(id));
	};

	return (
		<>
			{cartLoaded &&!items.length && <Navigate to="/" replace={true}></Navigate>}
			<div className="mx-auto mt-12 bg-white max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="border-t border-gray-200 px-4 py-6 sm:px-6">
					<h1 className="text-4xl mb-10 font-bold tracking-tight text-gray-900">
						Shopping Cart
					</h1>
					<div className="flow-root">
						<ul className="-my-6 divide-y divide-gray-200">
							{items.map((item) => (
								<li key={item.id} className="flex py-6">
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
													<a href={item.product.id}>{item.product.title}</a>
												</h3>
												<p className="ml-4">${discountedPrice(item.product)}</p>
											</div>
											<p className="mt-1 text-sm text-gray-500">{item.product.brand}</p>
										</div>
										<div className="flex flex-1 items-end justify-between text-sm">
											<div>
												<label
													htmlFor="quantity"
													className="mr-5 text-sm font-medium leading-6 text-gray-900"
												>
													Qty
												</label>
												<select
													onChange={(e) => handleQuantity(e, item)}
													value={item.quantity}
												>
													<option value="1">1</option>
													<option value="2">2</option>
													<option value="3">3</option>
													<option value="4">4</option>
													<option value="5">5</option>
												</select>
											</div>

											<div className="flex">
												<Modal
													title={`Delete ${item.product.title}`}
													message="Are you sure you want to delete this item?"
													dangerOption="Delete"
													cancelOption="Cancel"
													dangerAction={() => handleRemove(item.id)}
													cancelAction={() => setShowModal(null)}
													showModal={showModal === item.id}
												></Modal>
												<button
													type="button"
													onClick={()=>setShowModal(item.id)}
													className="font-medium text-indigo-600 hover:text-indigo-500"
												>
													Remove
												</button>
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
						<p>${totalAmount}</p>
					</div>
					<div className="flex justify-between my-2 text-base font-medium text-gray-900">
						<p>Total Items in cart</p>
						<p>{totalItems} items</p>
					</div>
					<p className="mt-0.5 text-sm text-gray-500">
						Shipping and taxes calculated at checkout.
					</p>
					<div className="mt-6">
						<Link
							to="/checkout"
							className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
						>
							Checkout
						</Link>
					</div>
					<div className="mt-6 flex justify-center text-center text-sm text-gray-500">
						<p>
							or{"  "}
							<Link to="/">
								<button
									type="button"
									className="font-medium text-indigo-600 hover:text-indigo-500"
								>
									Continue Shopping
									<span aria-hidden="true"> &rarr;</span>
								</button>
							</Link>
						</p>
					</div>
				</div>
			</div>
		</>
	);
}
