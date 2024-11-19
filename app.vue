<template>
  <div class="bg-coal text-lg">
    <div class="container flex justify-between">
      <div>
        <h1 class="text-4xl text-white">CS2-turnaus 22.-24.11.2024</h1>
      </div>
      <div v-if="!onKirjautunut" class="text-white">
        <label for="salasana" class="mr-2"></label>
        <input id="salasana" v-model="salasana" placeholder="Anna salasana" type="password" class="px-2 py-1 rounded-md border border-pig bg-smoke" />
        <button class="ml-4 px-4 py-1 border border-pig hover:bg-lightSmoke" @click="kirjauduSisaan">Kirjaudu</button>
        <p v-if="virhe" class="text-red-500 mt-2">{{ virhe }}</p>
      </div>
    </div>

    <div class="container"></div>
    <div class="container py-6">
      <div class="mb-6 bg-smoke">
        <section class="text-white px-8 py-6">
          <h2 class="text-2xl">Sarjataulukko</h2>
          <table class="border border-pig">
            <thead class="border border-pig">
              <tr>
                <th class="border-pig bg-smoke">Joukkue</th>
                <th class="border-pig bg-smoke">Voitot</th>
                <th class="border-pig bg-smoke">Tasapelit</th>
                <th class="border-pig bg-smoke">Häviöt</th>
                <th class="border-pig bg-smoke">Pisteet</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-pig" v-for="joukkue in sarjataulukko" :key="joukkue.nimi">
                <td class="border-pig">{{ joukkue.nimi }}</td>
                <td class="border-pig">{{ joukkue.voitot }}</td>
                <td class="border-pig">{{ joukkue.tasapelit }}</td>
                <td class="border-pig">{{ joukkue.havio }}</td>
                <td class="border-pig">{{ joukkue.pisteet }}</td>
              </tr>
            </tbody>
          </table>
          <div v-if="onKirjautunut">
            <label for="joukkue" class="mr-2">Päivitä joukkueen</label>
            <select v-model="valittuJoukkue" id="joukkue" class="mr-2 w-32 px-2 py-1 border rounded-md border-pig hover:bg-lightSmoke bg-smoke">
              <option class="font-medium" v-for="joukkue in joukkueet" :key="joukkue" :value="joukkue">
                {{ joukkue }}
              </option>
            </select>
            <span>tilastoja</span>
          </div>

          <div class="pt-6" v-if="onKirjautunut">
            <div class="mb-4 flex items-center">
              <p class="pr-6">Lisää joukkueelle:</p>
              <button class="px-4 py-1 mr-4 border border-pig hover:bg-lightSmoke" @click="lisaaTulos('voitto', +1)">Voitto</button>
              <button class="px-4 py-1 border border-pig hover:bg-lightSmoke" @click="lisaaTulos('tasapeli', +1)">Tasapeli</button>
              <button class="px-4 py-1 mx-4 border border-pig hover:bg-lightSmoke" @click="lisaaTulos('havio', +1)">Häviö</button>
            </div>
            <div class="mb-4 flex items-center">
              <p class="pr-4">Poista joukkueelta:</p>
              <button class="px-4 py-1 mr-4 border border-pig hover:bg-lightSmoke" @click="lisaaTulos('voitto', -1)">Voitto</button>
              <button class="px-4 py-1 border border-pig hover:bg-lightSmoke" @click="lisaaTulos('tasapeli', -1)">Tasapeli</button>
              <button class="px-4 py-1 mx-4 border border-pig hover:bg-lightSmoke" @click="lisaaTulos('havio', -1)">Häviö</button>
            </div>
          </div>
        </section>
      </div>

      <section class="bg-smoke text-white px-8 py-6">
        <p class="text-2xl mb-4">Tilastot</p>
        <table class="border-pig">
          <thead class="border-pig">
            <tr>
              <th class="border-pig bg-smoke">Pelaaja</th>
              <th class="border-pig bg-smoke">K</th>
              <th class="border-pig bg-smoke">D</th>
              <th class="border-pig bg-smoke">A</th>
              <th class="border-pig bg-smoke">K/D Ratio</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-pig" v-for="(pelaaja, index) in pelaajat" :key="pelaaja.nimi">
              <td class="border-pig" :class="{ 'flame-effect': index < 5 }">{{ pelaaja.nimi }}</td>
              <td class="border-pig">{{ pelaaja.kill }}</td>
              <td class="border-pig">{{ pelaaja.death }}</td>
              <td class="border-pig">{{ pelaaja.assist }}</td>
              <td class="border-pig" :class="{ 'flame-effect': index < 5 }">{{ pelaaja.ratio.toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
        <div v-if="onKirjautunut">
          <div class="pb-2">
            <label for="pelaaja" class="mr-2">Päivitä pelaajan</label>
            <select v-model="valittuPelaaja" id="pelaaja" class="w-32 px-2 mr-2 py-1 border rounded-md border-pig hover:bg-lightSmoke bg-smoke">
              <option class="" v-for="pelaaja in pelaajat" :key="pelaaja.nimi" :value="pelaaja.nimi">
                {{ pelaaja.nimi }}
              </option>
            </select>
            <span>tilastoja</span>
          </div>
          <div class="flex items-center">
            <p class="pr-4">Lisää pelaajalle tilastoja:</p>
            <div class="py-2 pr-4">
              <label class="mr-2">K</label>
              <input class="w-16 py-1 rounded-md px-2 border border-pig bg-smoke" type="number" v-model.number="muutokset.kill" />
            </div>
            <div class="py-2 pr-4">
              <label class="mr-2">D</label>
              <input class="px-2 py-1 rounded-md w-16 border border-pig bg-smoke" type="number" v-model.number="muutokset.death" />
            </div>
            <div class="py-2">
              <label class="mr-2">A</label>
              <input class="px-2 py-1 rounded-md w-16 border border-pig bg-smoke" type="number" v-model.number="muutokset.assist" />
            </div>
          </div>
          <div class="pt-2">
            <div class="mb-4 flex items-center">
              <p class="pr-4">Poista pelaajalta:</p>
              <button class="px-4 py-1 mr-4 border border-pig hover:bg-lightSmoke" @click="lisaaPelaajaTulos('kill', -1)">K</button>
              <button class="px-4 py-1 border border-pig hover:bg-lightSmoke" @click="lisaaPelaajaTulos('death', -1)">D</button>
              <button class="px-4 py-1 mx-4 border border-pig hover:bg-lightSmoke" @click="lisaaPelaajaTulos('assist', -1)">A</button>
            </div>
          </div>
          <div class="pb-4 pt-2">
            <button class="px-4 py-2 border border-pig text-white hover:bg-lightSmoke" @click="paivitaKDA">Päivitä tilastot</button>
          </div>
        </div>
      </section>
    </div>
    <div class="container">
      <section class="bg-smoke text-white px-8 py-6">
        <h2 class="text-2xl">Otteluohjelma</h2>
        <p class="mt-6">Perjantai</p>
        <table class="border border-pig">
          <thead class="border border-pig">
            <tr class="border border-pig">
              <th class="border-pig bg-smoke">Aika</th>
              <th class="border-pig bg-smoke">Peli 1</th>
              <th class="border-pig bg-smoke">Peli 2</th>
              <th class="border-pig bg-smoke">Peli 3</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-pig bg-smoke" v-for="(ottelu, index) in otteluohjelmaPerjantai" :key="index">
              <td class="border-pig bg-smoke">{{ ottelu.aika }}</td>
              <td class="border-pig bg-smoke">{{ ottelu.kentta1 }}</td>
              <td class="border-pig bg-smoke">{{ ottelu.kentta2 }}</td>
              <td class="border-pig bg-smoke">{{ ottelu.kentta3 }}</td>
            </tr>
          </tbody>
        </table>
        <p class="mt-6">Lauantai</p>
        <table class="border border-pig">
          <thead class="border border-pig">
            <tr class="border border-pig">
              <th class="border-pig bg-smoke">Aika</th>
              <th class="border-pig bg-smoke">Peli 1</th>
              <th class="border-pig bg-smoke">Peli 2</th>
              <th class="border-pig bg-smoke">Peli 3</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-pig bg-smoke" v-for="(ottelu, index) in otteluohjelmaLauantai" :key="index">
              <td class="border-pig bg-smoke">{{ ottelu.aika }}</td>
              <td class="border-pig bg-smoke">{{ ottelu.kentta1 }}</td>
              <td class="border-pig bg-smoke">{{ ottelu.kentta2 }}</td>
              <td class="border-pig bg-smoke">{{ ottelu.kentta3 }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue'
export default {
  data() {
    return {
      // Kirjautuminen
      salasana: '',
      onKirjautunut: false,
      virhe: '',
      // Kirjautuminen
      joukkueet: [],
      valittuJoukkue: 'Are',
      valittuPelaaja: 'Are',
      sarjataulukko: [],
      pelaajat: [],
      muutokset: { kill: 0, death: 0, assist: 0 },
      otteluohjelmaPerjantai: [
        {
          aika: '18:00-18:45',
          kentta1: 'HH vs AAK',
          kentta2: 'AAK vs 100KL',
          kentta3: 'KN vs VFC',
        },
        {
          aika: '18:45-19:30',
          kentta1: 'HH vs AAK',
          kentta2: 'HNJHN vs KN',
          kentta3: '100KL vs VFC',
        },
        {
          aika: '19:30-20:15',
          kentta1: 'HH vs 100KL',
          kentta2: 'HNJHN vs VFC',
          kentta3: 'AAK vs KN',
        },
        {
          aika: '20:15-21:00',
          kentta1: 'HH vs KN',
          kentta2: 'HNJHN vs 100KL',
          kentta3: 'AAK vs VFC',
        },
        {
          aika: '21:00-21:45',
          kentta1: 'HH vs VFC',
          kentta2: 'HNJHN vs AAK',
          kentta3: 'KN vs 100KL',
        },
        {
          aika: '21:45-22:30',
          kentta1: 'HH vs HNJHN',
          kentta2: 'AAK vs KN',
          kentta3: '100KL vs VFC',
        },
        {
          aika: '22:30-23:15',
          kentta1: 'HH vs AAK',
          kentta2: 'HNJHN vs VFC',
          kentta3: 'KN vs 100KL',
        },
        {
          aika: '23:15-00:00',
          kentta1: 'HH vs 100KL',
          kentta2: 'HNJHN vs KN',
          kentta3: 'AAK vs VFC',
        },
        {
          aika: '00:00-00:45',
          kentta1: 'HH vs KN',
          kentta2: 'HNJHN vs 100KL',
          kentta3: 'AAK vs VFC',
        },
        {
          aika: '00:45-01:30',
          kentta1: 'HH vs KN',
          kentta2: 'HNJHN vs 100KL',
          kentta3: 'AAK vs VFC',
        },
      ],
      otteluohjelmaLauantai: [
        {
          aika: '11:00-11:45',
          kentta1: 'HH vs VFC',
          kentta2: 'HNJHN vs AAK',
          kentta3: 'KN vs 100KL',
        },
        {
          aika: '11:45-12:30',
          kentta1: 'HH vs HNJHN',
          kentta2: 'AAK vs 100KL',
          kentta3: 'KN vs VFC',
        },
        {
          aika: '12:30-13:15',
          kentta1: 'HH vs AAK',
          kentta2: 'HNJHN vs KN',
          kentta3: '100KL vs VFC',
        },
        {
          aika: '13:15-14:00',
          kentta1: 'HH vs 100KL',
          kentta2: 'HNJHN vs VFC',
          kentta3: 'AAK vs KN',
        },
        {
          aika: '14:00-14:45',
          kentta1: 'HH vs KN',
          kentta2: 'HNJHN vs 100KL',
          kentta3: 'AAK vs VFC',
        },
        {
          aika: '14:45-15:30',
          kentta1: 'HH vs VFC',
          kentta2: 'HNJHN vs AAK',
          kentta3: 'KN vs 100KL',
        },
        {
          aika: '15:30-16.15',
          kentta1: 'HH vs AAK',
          kentta2: 'HNJHN vs VFC',
          kentta3: 'KN vs 100KL',
        },
        {
          aika: '16:15-18:15',
          kentta1: 'Runkosarjan 3. vs Runkosarjan 6.',
          kentta2: 'Runkosarjan 4. vs Runkosarjan 5.',
        },
        {
          aika: '18:15-20:15',
          kentta1: 'Quarter 1 voittaja vs Runkosarjan 2.',
          kentta2: 'Quarter 2 voittaja vs Runkosarjan 1.',
        },
        {
          aika: '20:15-22:15',
          kentta1: 'FINAALI',
        },
      ],
    }
  },
  methods: {
    kirjauduSisaan() {
      if (this.salasana === 'rantanen') {
        this.onKirjautunut = true
        this.virhe = ''
      } else {
        this.virhe = 'Virheellinen salasana!'
      }
    },

    async lataaDataJSON() {
      try {
        const response = await fetch('/data.json')
        const data = await response.json()

        this.sarjataulukko = data.sarjataulukko
        this.pelaajat = data.pelaajat
        this.joukkueet = this.sarjataulukko.map((joukkue) => joukkue.nimi)

        this.valittuJoukkue = this.sarjataulukko[0]?.nimi || null
        this.valittuPelaaja = this.pelaajat[0]?.nimi || null
      } catch (error) {
        console.error('Tietojen lataaminen epäonnistui:', error)
      }
    },

    async lisaaTulos(tulos, maara) {
      if (!this.valittuJoukkue || !tulos || typeof maara !== 'number') {
        alert('Virhe: Tarkista tiedot!')
        return
      }

      try {
        const response = await fetch('/api/sarjataulukko', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nimi: this.valittuJoukkue, tulos, maara }),
        })
        const data = await response.json()

        if (data.error) {
          alert(`Virhe: ${data.error}`)
        } else {
          await this.paivitaSarjataulukko()
        }
      } catch (error) {
        console.error('Päivitys epäonnistui:', error)
      }
    },

    async paivitaSarjataulukko() {
      try {
        const response = await fetch('/api/sarjataulukko')
        this.sarjataulukko = await response.json()
        this.joukkueet.sort((a, b) => {
          const pisteetA = a.pisteet || 0
          const pisteetB = b.pisteet || 0
          return pisteetB - pisteetA
        })
      } catch (error) {
        console.error('Sarjataulukon haku epäonnistui:', error)
      }
    },
    async paivitaKDA() {
      if (!this.valittuPelaaja) {
        alert('Valitse pelaaja!')
        return
      }

      try {
        const response = await fetch('/api/tilastot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nimi: this.valittuPelaaja,
            kill: this.muutokset.kill,
            death: this.muutokset.death,
            assist: this.muutokset.assist,
          }),
        })

        const data = await response.json()

        if (data.error) {
          console.log('MITÄ KETTINKIÄ')
        } else {
          await this.haePelaajat()
          this.pelaajat.sort((a, b) => {
            const ratioA = a.death > 0 ? a.kill / a.death : a.kill
            const ratioB = b.death > 0 ? b.kill / b.death : b.kill
            return ratioB - ratioA
          })
        }
      } catch (error) {
        console.error('Päivitys epäonnistui:', error)
      } finally {
        this.muutokset = { kill: 0, death: 0, assist: 0 }
      }
    },

    async lisaaPelaajaTulos(tyyppi, maara) {
      if (!this.valittuPelaaja || typeof maara !== 'number') {
        alert('Virhe: Tarkista tiedot!')
        return
      }

      try {
        const response = await fetch('/api/tilastot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nimi: this.valittuPelaaja,
            [tyyppi]: maara,
          }),
        })
        const data = await response.json()

        if (data.error) {
          alert(`Virhe: ${data.error}`)
        } else {
          await this.haePelaajat()
        }
      } catch (error) {
        console.error('Tilastojen päivitys epäonnistui:', error)
      }
    },

    async haePelaajat() {
      try {
        const response = await fetch('/api/tilastot')
        this.pelaajat = await response.json()
      } catch (error) {
        console.error('Pelaajien haku epäonnistui:', error)
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
}
.container {
  width: 80%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding: 20px;
  border-radius: 8px;
}

/* Poistaa nuolikuvakkeet Chrome, Safari, Edge */
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Poistaa nuolikuvakkeet Firefox */
input[type='number'] {
  -moz-appearance: textfield;
}

select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: none;
  border: 2px solid pink; /* Sama kuin alkuperäisessä */
  padding: 5px; /* Lisää hieman tilaa */
  cursor: pointer;
}
.flame-effect {
  animation: glow 2s infinite alternate;
}

@keyframes glow {
  0% {
    color: #ff6347;
    text-shadow: 0 0 2px #ff6347, 0 0 4px #ffa07a, 0 0 6px #ff4500;
  }
  50% {
    color: #ff7f50;
    text-shadow: 0 0 1px #ffa07a, 0 0 3px #ff6347, 0 0 5px #ff4500;
  }
  100% {
    color: #ffa07a;
    text-shadow: 0 0 2px #ffa07a, 0 0 4px #ff4500, 0 0 6px #ff6347;
  }
}
</style>
