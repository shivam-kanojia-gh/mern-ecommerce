export const ITEMS_PER_PAGE = 10;
export function discountedPrice(item) {
	return (
		Math.round(
			(item.price - (item.price * item.discountPercentage) / 100) * 100
		) / 100
	);
}
