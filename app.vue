<template>
	<h1>Turnauksen Sarjataulukko ja KDA-taulukko</h1>

	<div style="width: 49%; float: left">
		<h2>Sarjataulukko</h2>
		<table>
			<thead>
				<tr>
					<th>Joukkue</th>
					<th>Voitot</th>
					<th>Tasapelit</th>
					<th>Häviöt</th>
					<th>Pisteet</th>
					<th>W rundit</th>
					<th>L rundit</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="joukkue in sarjataulukko" :key="joukkue.nimi">
					<td>{{ joukkue.nimi }}</td>
					<td>{{ joukkue.voitot }}</td>
					<td>{{ joukkue.tasapelit }}</td>
					<td>{{ joukkue.havio }}</td>
					<td>{{ joukkue.pisteet }}</td>
					<td>{{ joukkue.lround }} Pitääkö nämä lisätä?</td>
					<td>{{ joukkue.wround }} Pitääkö nämä lisätä?</td>
				</tr>
			</tbody>
		</table>

		<h2>Otteluohjelma</h2>
		<table>
			<thead>
				<tr>
					<th>Aika</th>
					<th>Kenttä 1</th>
					<th>Kenttä 2</th>
					<th>Kenttä 3</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(ottelu, index) in otteluohjelma" :key="index">
					<td>{{ ottelu.aika }}</td>
					<td>{{ ottelu.kentta1 }}</td>
					<td>{{ ottelu.kentta2 }}</td>
					<td>{{ ottelu.kentta3 }}</td>
				</tr>
			</tbody>
		</table>

		<h2>Lisää Tulos</h2>
		<div>
			<label for="joukkue">Valitse joukkue:</label>
			<select v-model="valittuJoukkue" id="joukkue">
				<option v-for="joukkue in joukkueet" :key="joukkue" :value="joukkue">
					{{ joukkue }}
				</option>
			</select>

			<button @click="lisaaTulos('voitto', +1)">Voitto</button>
			<button @click="lisaaTulos('tasapeli', +1)">Tasapeli</button>
			<button @click="lisaaTulos('havio', +1)">Häviö</button>
		</div>
		<div>
			<label for="joukkue">Valitse joukkue:</label>
			<select v-model="valittuJoukkue" id="joukkue">
				<option v-for="joukkue in joukkueet" :key="joukkue" :value="joukkue">
					{{ joukkue }}
				</option>
			</select>

			<button @click="lisaaTulos('voitto', -1)">Voitto -</button>
			<button @click="lisaaTulos('tasapeli', -1)">Tasapeli -</button>
			<button @click="lisaaTulos('havio', -1)">Häviö -</button>
		</div>
	</div>
	<div style="width: 49%; float: right">
		<h2>KDA Taulukko</h2>
		<h3>Muokkaa Pelaajan Tilastoja</h3>
		<div>
			<label for="pelaaja">Valitse pelaaja:</label>
			<select v-model="valittuPelaaja" id="pelaaja">
				<option v-for="pelaaja in pelaajat" :key="pelaaja.nimi" :value="pelaaja.nimi">
					{{ pelaaja.nimi }}
				</option>
			</select>

			<div>
				<h3>Syötä muutos:</h3>
				<label>Kill:</label>
				<input type="number" v-model.number="muutokset.kill" />
				<label>Death:</label>
				<input type="number" v-model.number="muutokset.death" />
				<label>Assist:</label>
				<input type="number" v-model.number="muutokset.assist" />
			</div>

			<button @click="paivitaKDA">Päivitä</button>
		</div>
		<table>
			<thead>
				<tr>
					<th>Pelaaja</th>
					<th>Kill</th>
					<th>Death</th>
					<th>Assist</th>
					<th>KD/Ratio</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="pelaaja in pelaajat" :key="pelaaja.nimi">
					<td>{{ pelaaja.nimi }}</td>
					<td>{{ pelaaja.kill }}</td>
					<td>{{ pelaaja.death }}</td>
					<td>{{ pelaaja.assist }}</td>
					<td>{{ pelaaja.ratio.toFixed(2) }}</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
import { onMounted } from "vue"
export default {
	data() {
		return {
			joukkueet: [],
			valittuJoukkue: "Are",
			valittuPelaaja: "Are",
			sarjataulukko: [],
			pelaajat: [],
			muutokset: { kill: 0, death: 0, assist: 0 },
			otteluohjelma: [
				{
					aika: "Lisätäänkö ",
					kentta1: "tähän",
					kentta2: "kumpi",
					kentta3: "voittaa?",
				},
				{
					aika: "18:00-19:00",
					kentta1: "Are vs Hege",
					kentta2: "Pedro vs Löyläri",
					kentta3: "Joge vs Venyniilo",
				},
				{
					aika: "19:00-20:00",
					kentta1: "Are vs Pedro",
					kentta2: "Hege vs Joge",
					kentta3: "Löyläri vs Venyniilo",
				},
				{
					aika: "20:00-21:00",
					kentta1: "RUOKATAUKO",
					kentta2: "RUOKATAUKO",
					kentta3: "RUOKATAUKO",
				},
				{
					aika: "21:00-22:00",
					kentta1: "Are vs Löyläri",
					kentta2: "Hege vs Venyniilo",
					kentta3: "Pedro vs Joge",
				},
				{
					aika: "22:00-23:00",
					kentta1: "Are vs Joge",
					kentta2: "Hege vs Löyläri",
					kentta3: "Pedro vs Venyniilo",
				},
			],
		}
	},
	methods: {
		async lataaDataJSON() {
			try {
				const response = await fetch("/data.json")
				const data = await response.json()

				this.sarjataulukko = data.sarjataulukko
				this.pelaajat = data.pelaajat
				this.joukkueet = this.sarjataulukko.map((joukkue) => joukkue.nimi)

				this.valittuJoukkue = this.sarjataulukko[0]?.nimi || null
				this.valittuPelaaja = this.pelaajat[0]?.nimi || null
			} catch (error) {
				console.error("Tietojen lataaminen epäonnistui:", error)
			}
		},
		async lisaaTulos(tulos, maara) {
			if (!this.valittuJoukkue || !tulos || typeof maara !== "number") {
				alert("Virhe: Tarkista tiedot!")
				return
			}

			try {
				const response = await fetch("/api/sarjataulukko", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ nimi: this.valittuJoukkue, tulos, maara }),
				})
				const data = await response.json()

				if (data.error) {
					alert(`Virhe: ${data.error}`)
				} else {
					await this.paivitaSarjataulukko()
				}
			} catch (error) {
				console.error("Päivitys epäonnistui:", error)
			}
		},

		async paivitaSarjataulukko() {
			try {
				const response = await fetch("/api/sarjataulukko")
				this.sarjataulukko = await response.json()
				this.joukkueet.sort((a, b) => {
					const pisteetA = a.pisteet || 0
					const pisteetB = b.pisteet || 0
					return pisteetB - pisteetA
				})
			} catch (error) {
				console.error("Sarjataulukon haku epäonnistui:", error)
			}
		},
		async paivitaKDA() {
			if (!this.valittuPelaaja) {
				alert("Valitse pelaaja!")
				return
			}

			try {
				const response = await fetch("/api/tilastot", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						nimi: this.valittuPelaaja,
						kill: this.muutokset.kill,
						death: this.muutokset.death,
						assist: this.muutokset.assist,
					}),
				})

				const data = await response.json()

				if (data.error) {
					console.log("MITÄ KETTINKIÄ")
				} else {
					await this.haePelaajat()
					this.pelaajat.sort((a, b) => {
						const ratioA = a.death > 0 ? a.kill / a.death : a.kill
						const ratioB = b.death > 0 ? b.kill / b.death : b.kill
						return ratioB - ratioA
					})
				}
			} catch (error) {
				console.error("Päivitys epäonnistui:", error)
			} finally {
				this.muutokset = { kill: 0, death: 0, assist: 0 }
			}
		},

		async haePelaajat() {
			try {
				const response = await fetch("/api/tilastot")
				this.pelaajat = await response.json()
			} catch (error) {
				console.error("Pelaajien haku epäonnistui:", error)
			}
		},
	},

	async mounted() {
		await this.lataaDataJSON()
		await this.paivitaSarjataulukko()
		await this.haePelaajat()
		this.pelaajat.sort((a, b) => {
			const ratioA = a.death > 0 ? a.kill / a.death : a.kill
			const ratioB = b.death > 0 ? b.kill / b.death : b.kill
			return ratioB - ratioA
		})
		this.sarjataulukko.sort((a, b) => {
			const pisteetA = a.pisteet || 0
			const pisteetB = b.pisteet || 0
			return pisteetB - pisteetA
		})
	},
}
</script>

<style>
table {
	width: 80%;
	border-collapse: collapse;
	margin: 20px 0;
}
th,
td {
	border: 1px solid #ddd;
	padding: 8px;
	text-align: center;
}
th {
	background-color: #f2f2f2;
}
</style>
