import db from "../db"

export default defineEventHandler(async (event) => {
	const method = getMethod(event)

	if (method === "GET") {
		try {
			// Palauta sarjataulukko
			const results = db.prepare("SELECT * FROM sarjataulukko").all()
			return results
		} catch (error) {
			console.error("Virhe sarjataulukon haussa:", error)
			return { error: "Virhe sarjataulukon haussa" }
		}
	}

	if (method === "POST") {
		const { nimi, tulos, maara } = await readBody(event)

		// Tarkista syötteet
		if (!nimi || !tulos || typeof maara !== "number") {
			console.error("Virheelliset tiedot:", { nimi, tulos, maara })
			return { error: "Invalid data provided" }
		}

		// Päivitä tiedot
		try {
			if (tulos === "voitto") {
				db.prepare(
					`
					UPDATE sarjataulukko
					SET voitot = MAX(0, voitot + ?), pisteet = MAX(0, pisteet + ?)
					WHERE nimi = ?
				`
				).run(maara, maara, nimi)
			} else if (tulos === "tasapeli") {
				db.prepare(
					`
					UPDATE sarjataulukko
					SET tasapelit = MAX(0, tasapelit + ?)
					WHERE nimi = ?
				`
				).run(maara, nimi)
			} else if (tulos === "havio") {
				db.prepare(
					`
					UPDATE sarjataulukko
					SET havio = MAX(0, havio + ?)
					WHERE nimi = ?
				`
				).run(maara, nimi)
			} else {
				console.error("Virheellinen tulos:", tulos)
				return { error: "Invalid tulos value" }
			}

			return { success: true }
		} catch (error) {
			console.error("Päivitys epäonnistui:", error)
			return { error: "Päivitys epäonnistui" }
		}
	}

	return { error: "Method not allowed" }
})
