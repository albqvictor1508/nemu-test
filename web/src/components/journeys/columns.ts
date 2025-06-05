import type { ColumnDef } from "@tanstack/react-table";
import type { JourneyResponse } from "@/types/journeys";

export const columns: ColumnDef<JourneyResponse>[] = [
	{
		accessorKey: "sessionId",
		header: "Session ID",
	},
	{
		accessorKey: "touchpoints",
		header: "Touchpoints",
	},
	{
		accessorKey: "restTouchpoints",
		header: "Total de Eventos",
	},
	{
		accessorKey: "createdAt",
		header: "Criado em",
		cell: ({ row }) =>
			row.original.createdAt
				? new Date(row.original.createdAt).toLocaleString("pt-BR")
				: "-",
	},
];
