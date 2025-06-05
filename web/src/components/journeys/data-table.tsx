import { useState } from "react";
import { Touchpoint } from "./touchpoint";
import type { JourneyResponse } from "@/types/journeys";

export const CustomDataTable = ({ data }: { data: JourneyResponse }) => {
	const [filter, setFilter] = useState("");
	const [currentPage, setCurrentPage] = useState(0);
	const itemsPerPage = 10;

	const journeys = Array.isArray(data.journeys) ? data.journeys : [];

	const filteredData = journeys.filter(
		(item) =>
			item.sessionId.toLowerCase().includes(filter.toLowerCase()) ||
			item.touchpoints.some((tp) =>
				tp.toLowerCase().includes(filter.toLowerCase()),
			),
	);

	const paginatedData = filteredData.slice(
		currentPage * itemsPerPage,
		(currentPage + 1) * itemsPerPage,
	);

	const totalPages = Math.ceil(filteredData.length / itemsPerPage);

	return (
		<div className="w-full space-y-4 ">
			<input
				type="text"
				placeholder="Buscar..."
				value={filter}
				onChange={(e) => setFilter(e.target.value)}
				className="px-3 py-2 border border-gray-300 rounded-md max-w-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>

			<div className="rounded-md border border-gray-200 overflow-hidden">
				<table className="w-full">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Session ID
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Jornada de Touchpoints
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Quantidade de Touchpoints
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Data de Criação
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{paginatedData.length > 0 ? (
							paginatedData.map((row) => (
								<tr key={row.sessionId} className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{row.sessionId}
									</td>
									<td className="px-6 py-4 text-sm text-gray-900">
										<Touchpoint
											touchpoints={row.touchpoints}
											firstTouchpoint={row.firstTouchpoint}
											lastTouchpoint={row.lastTouchpoint}
										/>
									</td>
									<td className="flex justify-center items-center py-4 whitespace-nowrap text-sm text-gray-900">
										{row.touchpointQuantity}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{row.createdAt}
									</td>
								</tr>
							))
						) : (
							<tr>
								<td
									colSpan={3}
									className="px-6 py-12 text-center text-gray-500"
								>
									Nenhum resultado encontrado.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			<div className="flex items-center justify-end space-x-2">
				<button
					type="button"
					onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
					disabled={currentPage === 0}
					className="px-4 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Anterior
				</button>
				<span className="text-sm text-gray-700">
					Página {currentPage + 1} de {totalPages}
				</span>
				<button
					type="button"
					onClick={() =>
						setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
					}
					disabled={currentPage >= totalPages - 1}
					className="px-4 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Próxima
				</button>
			</div>
		</div>
	);
};
