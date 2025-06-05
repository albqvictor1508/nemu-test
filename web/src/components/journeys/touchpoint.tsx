import type { TouchpointSchema } from "@/types/journeys";

export const Touchpoint = ({
	touchpoints,
	firstTouchpoint,
	lastTouchpoint,
}: TouchpointSchema) => {
	const MAX_VISIBLE_TOUCHPOINTS = 5;
	const getRandomNumber = (): number => Math.floor(Math.random() * 4);

	const getVariantClass = () => {
		const colorMap: { [key: number]: string } = {
			1: "bg-blue-50 text-blue-700 border-blue-200",
			2: "bg-purple-50 text-purple-700 border-purple-200",
			3: "bg-orange-50 text-orange-700 border-orange-200",
			4: "bg-green-50 text-green-700 border-green-200",
		};

		return colorMap[getRandomNumber()];
	};

	const shouldTruncate = touchpoints.length > MAX_VISIBLE_TOUCHPOINTS;

	let displayTouchpoints = touchpoints;
	let showEllipsis = false;

	if (shouldTruncate) {
		const visibleCount = MAX_VISIBLE_TOUCHPOINTS - 1;
		//google -> instagram -> telegram -> gmail -> nemu -> discord -> google
		displayTouchpoints = [
			...touchpoints.slice(0, visibleCount - 1),
			touchpoints[touchpoints.length - 1],
		];
		showEllipsis = true;
	}

	return (
		<div className="flex items-center gap-2 flex-wrap">
			{displayTouchpoints.map((touchpoint, index) => {
				const isLastWithEllipsis =
					showEllipsis && index === displayTouchpoints.length - 1;
				const originalIndex = isLastWithEllipsis
					? touchpoints.length - 1
					: index;

				return (
					<div
						key={`${touchpoint}-${originalIndex}`}
						className="flex items-center"
					>
						{isLastWithEllipsis && (
							<>
								<span className="px-2 py-1 text-xs text-gray-400">...</span>
								<span className="mx-1 text-gray-300">→</span>
							</>
						)}

						<span
							className={`px-3 py-1 rounded-full text-xs font-medium border ${getVariantClass()}`}
						>
							{touchpoint}
							{touchpoint === firstTouchpoint && (
								<span className="ml-1 text-xs">★</span>
							)}
							{touchpoint === lastTouchpoint && (
								<span className="ml-1 text-xs">🎯</span>
							)}
						</span>

						{!isLastWithEllipsis && index < displayTouchpoints.length - 1 && (
							<span className="mx-1 text-gray-300">→</span>
						)}
					</div>
				);
			})}
		</div>
	);
};
