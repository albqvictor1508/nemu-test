import { useEffect, useState } from "react";
import type { JourneySchema } from "../types/journeys";

export const JourneysTable = () => {
	const [journeys, setJourneys] = useState<JourneySchema[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			const data: JourneySchema[] = await fetch(
				"http://localhost:3333/journeys",
				{
					method: "get",
				},
			).then((res) => res.json());
			console.log(data);
			setJourneys(data);
		};
		fetchData().then();
	}, journeys);

	return (
		<>
			<div>{journeys.length}</div>
			<div className="text-2xl font-bold underline">
				{journeys.map((data) => (
					<div key={data.sessionId}>
						<div>
							{data.firstTouchpoint} &gt; {data.lastTouchpoint}
						</div>
					</div>
				))}
			</div>
		</>
	);
};
