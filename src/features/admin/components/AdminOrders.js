import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	fetchAllOrdersAsync,
	selectOrders,
	selectTotalOrders,
	updateOrderAsync,
} from "../../order/orderSlice";
import { discountedPrice, ITEMS_PER_PAGE } from "../../../app/constants";
import { EyeIcon, PencilIcon } from "@heroicons/react/24/outline";
import Pagination from "../../common/Pagination";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/20/solid";

function AdminOrders() {
	const dispatch = useDispatch();
	const [page, setPage] = useState(1);
	const [sort, setSort] = useState({});
	const [editableOrderId, setEditableOrderId] = useState(-1);
	const orders = useSelector(selectOrders);
	const totalOrders = useSelector(selectTotalOrders);

	const handleShow = () => {
		console.log("show");
	};

	const handleEdit = (order) => {
		setEditableOrderId(order.id);
	};

	const handleUpdate = (e, order) => {
		const updatedOrder = {
			...order,
			status: e.target.value,
		};
		dispatch(updateOrderAsync(updatedOrder));
		setEditableOrderId(-1);
	};

	const handlePage = (page) => {
		setPage(page);
	};

	const handleSort = (sortOption) => {
		const sort = { _sort: sortOption.sort, _order: sortOption.order };
		setSort(sort);
	};

	const color = (status) => {
		switch (status) {
			case "pending":
				return "bg-purple-200 text-purple-600";
			case "dispatched":
				return "bg-yellow-200 text-yellow-600";
			case "delivered":
				return "bg-green-200 text-green-600";
			case "cancelled":
				return "bg-red-200 text-red-600";
			default:
				return "bg-purple-200 text-purple-600";
		}
	};

	useEffect(() => {
		const pagination = { _page: page, _per_page: ITEMS_PER_PAGE };
		dispatch(fetchAllOrdersAsync({ sort, pagination })); // NOTE: only one object should be passed here
	}, [dispatch, page, sort]);

	return (
		<>
			<div className="overflow-x-auto">
				<div className="bg-gray-100 flex items-center justify-center font-sans overflow-hidden">
					<div className="w-full">
						<div className="bg-white shadow-md rounded my-6">
							<table className="min-w-max w-full table-auto">
								<thead>
									<tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
										<th
											className="py-3 px-6 text-left"
											onClick={(e) =>
												handleSort({
													sort: "id",
													order: sort?._order === "asc" ? "desc" : "asc",
												})
											}
										>
											Order #{"  "}
											{sort._sort === "id" &&
												(sort._order === "asc" ? (
													<ArrowUpIcon className="w-5 h-5 inline pb-1"></ArrowUpIcon>
												) : (
													<ArrowDownIcon className="w-5 h-5 inline pb-1"></ArrowDownIcon>
												))}
										</th>
										<th className="py-3 px-6 text-left">Items</th>
										<th
											className="py-3 px-6 text-center"
											onClick={(e) =>
												handleSort({
													sort: "totalAmount",
													order: sort?._order === "asc" ? "desc" : "asc",
												})
											}
										>
											Total Amount #{"  "}
											{sort._sort === "totalAmount" &&
												(sort._order === "asc" ? (
													<ArrowUpIcon className="w-5 h-5 inline pb-1"></ArrowUpIcon>
												) : (
													<ArrowDownIcon className="w-5 h-5 inline pb-1"></ArrowDownIcon>
												))}
										</th>
										<th className="py-3 px-6 text-center">Shipping Address</th>
										<th className="py-3 px-6 text-center">Status</th>
										<th className="py-3 px-6 text-center">Actions</th>
									</tr>
								</thead>
								<tbody className="text-gray-600 text-sm font-light">
									{orders.map((order) => (
										<tr
											key={order.id}
											className="border-b border-gray-200 hover:bg-gray-100"
										>
											<td className="py-3 px-6 text-left whitespace-nowrap">
												<div className="flex items-center">
													<span className="font-medium">{order.id}</span>
												</div>
											</td>
											<td className="py-3 px-6 text-left">
												{order.items.map((item, index) => (
													<div key={index} className="flex items-center">
														<div className="mr-2">
															<img
																className="w-6 h-6 rounded-full"
																src={item.product.thumbnail}
																alt={item.product.title}
															/>
														</div>
														<span>
															{item.product.title} - #{item.quantity} - $
															{discountedPrice(item.product)}
														</span>
													</div>
												))}
											</td>
											<td className="py-3 px-6 text-center">
												<div className="flex items-center justify-center">
													${order.totalAmount}
												</div>
											</td>
											<td className="py-3 px-6 text-center">
												<div>
													<div>
														<strong>{order.selectedAddress.name}</strong>,
													</div>
													<div>{order.selectedAddress.email},</div>
													<div>
														{order.selectedAddress.street},{" "}
														{order.selectedAddress.city},
													</div>
													<div>
														{order.selectedAddress.state},{" "}
														{order.selectedAddress.pinCode},
													</div>
													<div>{order.selectedAddress.phone}</div>
												</div>
											</td>
											<td className="py-3 px-6 text-center">
												{editableOrderId === order.id ? (
													<select onChange={(e) => handleUpdate(e, order)}>
														<option value="pending">Pending</option>
														<option value="dispatched">Dispatched</option>
														<option value="delivered">Delivered</option>
														<option value="cancelled">Cancelled</option>
													</select>
												) : (
													<span
														className={`${color(
															order.status
														)} py-1 px-3 rounded-full text-xs`}
													>
														{order.status}
													</span>
												)}
											</td>
											<td className="py-3 px-6 text-center">
												<div className="flex item-center justify-center">
													<div className="w-5 mr-3 transform hover:text-purple-500 hover:scale-110">
														<EyeIcon
															onClick={(e) => handleShow(order)}
														></EyeIcon>
													</div>
													<div className="w-5 transform hover:text-purple-500 hover:scale-110">
														<PencilIcon
															onClick={(e) => handleEdit(order)}
														></PencilIcon>
													</div>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
				<Pagination
					page={page}
					setPage={setPage}
					handlePage={handlePage}
					totalItems={totalOrders}
				></Pagination>
			</div>
		</>
	);
}

export default AdminOrders;
