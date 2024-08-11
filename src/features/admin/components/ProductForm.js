import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
	clearSelectedProduct,
	createProductAsync,
	fetchProductByIdAsync,
	selectBrands,
	selectCategories,
	selectProductById,
	updateProductAsync,
} from "../../product/productSlice";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Modal from "../../common/Modal";

function ProductForm() {
	const [showModal, setShowModal] = useState(null);
	const brands = useSelector(selectBrands);
	const categories = useSelector(selectCategories);
	const dispatch = useDispatch();
	const params = useParams();
	const selectedProduct = useSelector(selectProductById);
	const {
		register,
		handleSubmit,
		reset,
		setValue,
		formState: { errors },
	} = useForm();

	useEffect(() => {
		if (params.id) {
			dispatch(fetchProductByIdAsync(params.id));
		} else {
			dispatch(clearSelectedProduct());
		}
	}, [params.id, dispatch]);

	useEffect(() => {
		if (selectedProduct && params.id) {
			setValue("title", selectedProduct.title);
			setValue("description", selectedProduct.description);
			setValue("price", selectedProduct.price);
			setValue("stock", selectedProduct.stock);
			setValue("brand", selectedProduct.brand);
			setValue("category", selectedProduct.category);
			setValue("images", selectedProduct.images);
			setValue("discountPercentage", selectedProduct.discountPercentage);
			setValue("thumbnail", selectedProduct.thumbnail);
		}
	}, [selectedProduct, params.id, setValue]);

	const handleDelete = () => {
		const product = { ...selectedProduct };
		product.deleted = true;
		dispatch(updateProductAsync(product));
	};

	return (
		<>
			<Modal
				title={`Delete ${selectedProduct && selectedProduct.title}`}
				message="Are you sure you want to delete this item?"
				dangerOption="Delete"
				cancelOption="Cancel"
				dangerAction={handleDelete}
				cancelAction={() => setShowModal(null)}
				showModal={showModal}
			></Modal>
			<form
				onSubmit={handleSubmit((data) => {
					const product = { ...data };
					product.images = [product.images[0]];
					product.rating = selectedProduct?.rating || 0;
					product.price = +product.price;
					product.stock = +product.stock;
					product.discountPercentage = +product.discountPercentage;
					if (params.id) {
						product.id = params.id;
						dispatch(updateProductAsync(product));
					} else {
						dispatch(createProductAsync(product));
					}
					reset();
				})}
			>
				<div className="space-y-12 bg-white p-12">
					<div className="border-b border-gray-900/10 pb-12">
						<h2 className="text-2xl font-semibold leading-7 text-gray-900">
							{params.id ? "Edit" : "Add"} Product
						</h2>

						<div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
							{selectedProduct?.hasOwnProperty("deleted") && selectedProduct.deleted && (
								<div className="sm:col-span-full text-red-500">
									This product has been deleted
								</div>
							)}
							<div className="sm:col-span-full">
								<label
									htmlFor="title"
									className="block text-sm font-medium leading-6 text-gray-900"
								>
									Product Name
								</label>
								<div className="mt-2">
									<div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
										<input
											id="title"
											{...register("title", {
												required: "title is required",
											})}
											type="text"
											className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
										/>
									</div>
								</div>
							</div>

							<div className="col-span-full">
								<label
									htmlFor="description"
									className="block text-sm font-medium leading-6 text-gray-900"
								>
									Description
								</label>
								<div className="mt-2">
									<textarea
										id="description"
										{...register("description", {
											required: "description is required",
										})}
										rows={3}
										className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
										defaultValue={""}
									/>
								</div>
								<p className="mt-3 text-sm leading-6 text-gray-600">
									Write a few sentences about product.
								</p>
							</div>

							<div className="col-span-3">
								<label
									htmlFor="brand"
									className="block text-sm font-medium leading-6 text-gray-900"
								>
									Brand
								</label>
								<div className="mt-2">
									<select
										className="w-full"
										{...register("brand", {
											required: "brand is required",
										})}
									>
										<option value="">--choose brand--</option>
										{brands.map((brand) => (
											<option value={brand.value}>{brand.label}</option>
										))}
									</select>
								</div>
							</div>

							<div className="col-span-3">
								<label
									htmlFor="category"
									className="block text-sm font-medium leading-6 text-gray-900"
								>
									Category
								</label>
								<div className="mt-2">
									<select
										className="w-full"
										{...register("category", {
											required: "category is required",
										})}
									>
										<option value="">--choose category--</option>
										{categories.map((category) => (
											<option value={category.value}>{category.label}</option>
										))}
									</select>
								</div>
							</div>

							<div className="sm:col-span-2">
								<label
									htmlFor="price"
									className="block text-sm font-medium leading-6 text-gray-900"
								>
									Price
								</label>
								<div className="mt-2">
									<div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
										<input
											id="price"
											{...register("price", {
												required: "price is required",
												min: 0,
												max: 10000,
											})}
											type="number"
											step="0.01"
											className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
										/>
									</div>
								</div>
							</div>

							<div className="sm:col-span-2">
								<label
									htmlFor="discountPercentage"
									className="block text-sm font-medium leading-6 text-gray-900"
								>
									Discount
								</label>
								<div className="mt-2">
									<div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
										<input
											id="discountPercentage"
											{...register("discountPercentage", {
												required: "discountPercentage is required",
												min: 0,
												max: 100,
											})}
											type="number"
											step="0.01"
											className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
										/>
									</div>
								</div>
							</div>

							<div className="sm:col-span-2">
								<label
									htmlFor="stock"
									className="block text-sm font-medium leading-6 text-gray-900"
								>
									Stock
								</label>
								<div className="mt-2">
									<div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
										<input
											id="stock"
											{...register("stock", {
												required: "stock is required",
												min: 0,
											})}
											type="number"
											className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
										/>
									</div>
								</div>
							</div>

							<div className="sm:col-span-full">
								{/* NOTE: multer middleware of node js can be used to upload images */}
								<label
									htmlFor="images"
									className="block text-sm font-medium leading-6 text-gray-900"
								>
									Image
								</label>
								<div className="mt-2">
									<div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
										<input
											id="images"
											{...register("images", {
												required: "images is required",
											})}
											type="text"
											className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
										/>
									</div>
								</div>
							</div>

							<div className="sm:col-span-full">
								<label
									htmlFor="thumbnail"
									className="block text-sm font-medium leading-6 text-gray-900"
								>
									Thumbnail
								</label>
								<div className="mt-2">
									<div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
										<input
											id="thumbnail"
											{...register("thumbnail", {
												required: "thumbnail is required",
											})}
											type="text"
											className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* <div className="border-b border-gray-900/10 pb-12">
						<h2 className="text-base font-semibold leading-7 text-gray-900">
							Extras
						</h2>

						<div className="mt-10 space-y-10">
							<fieldset>
								<legend className="text-sm font-semibold leading-6 text-gray-900">
									By Email
								</legend>
								<div className="mt-6 space-y-6">
									<div className="relative flex gap-x-3">
										<div className="flex h-6 items-center">
											<input
												id="comments"
												name="comments"
												type="checkbox"
												className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
											/>
										</div>
										<div className="text-sm leading-6">
											<label
												htmlFor="comments"
												className="font-medium text-gray-900"
											>
												Comments
											</label>
											<p className="text-gray-500">
												Get notified when someones posts a comment on a posting.
											</p>
										</div>
									</div>
									<div className="relative flex gap-x-3">
										<div className="flex h-6 items-center">
											<input
												id="candidates"
												name="candidates"
												type="checkbox"
												className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
											/>
										</div>
										<div className="text-sm leading-6">
											<label
												htmlFor="candidates"
												className="font-medium text-gray-900"
											>
												Candidates
											</label>
											<p className="text-gray-500">
												Get notified when a candidate applies for a job.
											</p>
										</div>
									</div>
									<div className="relative flex gap-x-3">
										<div className="flex h-6 items-center">
											<input
												id="offers"
												name="offers"
												type="checkbox"
												className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
											/>
										</div>
										<div className="text-sm leading-6">
											<label
												htmlFor="offers"
												className="font-medium text-gray-900"
											>
												Offers
											</label>
											<p className="text-gray-500">
												Get notified when a candidate accepts or rejects an
												offer.
											</p>
										</div>
									</div>
								</div>
							</fieldset>
						</div>
					</div> */}
				</div>

				<div className="mt-6 flex items-center justify-end gap-x-6">
					<Link
						to="/admin"
						className="text-sm px-3 py-2 font-semibold leading-6 text-gray-900"
					>
						Cancel
					</Link>
					{selectedProduct && !selectedProduct.deleted && (
						<button
							onClick={(e) => {
								e.preventDefault();
								setShowModal(true);
							}}
							className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
						>
							Delete
						</button>
					)}
					<button
						type="submit"
						className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
					>
						Save
					</button>
				</div>
			</form>
		</>
	);
}

export default ProductForm;
