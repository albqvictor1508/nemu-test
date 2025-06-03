import { fastify } from "fastify";
import multipart from "@fastify/multipart";
import { resolve } from "node:path";
import xlsx from "xlsx";

export const app = fastify();
app.register(multipart);

try {
	const filePath = resolve(__dirname, "file", "Nemu-Base-de-dados.xlsx");
	const file = xlsx.readFile(filePath);
	const sheet = file.Sheets[file.SheetNames[0]];
	const json = xlsx.utils.sheet_to_json(sheet);
	console.log(json);
} catch (error) {
	console.error(error);
	throw error;
}

app.get("/journeys", async (request, reply) => {});

app.listen({ port: 3333 }, () => {
	console.log("HTTP Server running!");
	console.log("POST /upload");
});
