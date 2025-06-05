import { useEffect, useState } from "react";
import type { JourneyResponse } from "@/types/journeys";
import { CustomDataTable } from "@/components/journeys/data-table";

export default function App() {
	const [journeys, setJourneys] = useState<JourneyResponse>({
		journeys: [],
		touchpoints: [],
	});

	useEffect(() => {
		const fetchJourneys = async () => {
			const reply = await fetch("http://localhost:3333/journeys").then((res) =>
				res.json(),
			);
			console.log(reply);
			setJourneys(reply);
		};
		fetchJourneys();
	}, []);

	return (
		<div className="p-6 w-full mx-auto">
			<div className="p-6 w-full mx-auto">
				<h2 className="text-2xl font-bold mb-6 text-gray-900">
					Análise de Touchpoints
				</h2>

				<div className="mb-6 p-4 bg-gray-50 rounded-lg border flex items-center justify-center">
					<div className="flex flex-wrap gap-8 text-xs">
						<div className="flex items-center gap-1">
							<span className="px-2 py-1 bg-blue-100 text-blue-800 border border-blue-200 rounded-full">
								★
							</span>
							<span className="text-gray-600">First Touchpoint</span>
						</div>
						<div className="flex items-center gap-1">
							<span className="px-2 py-1 bg-green-100 text-green-800 border border-green-200 rounded-full">
								🎯
							</span>
							<span className="text-gray-600">Last Touchpoint</span>
						</div>
						<div className="flex items-center gap-1">
							<span className="text-gray-400">→</span>
							<span className="text-gray-600">Sequência da jornada</span>
						</div>
					</div>
				</div>

				<CustomDataTable data={journeys} />
			</div>
			);
		</div>
	);
}
