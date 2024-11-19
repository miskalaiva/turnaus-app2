import Database from "better-sqlite3"
const db = new Database("tournament-official.db")

// Luodaan sarjataulukko, jos sitä ei ole olemassa
db.exec(`
  CREATE TABLE IF NOT EXISTS sarjataulukko (
    nimi TEXT PRIMARY KEY,
    voitot INTEGER DEFAULT 0,
    tasapelit INTEGER DEFAULT 0,
    havio INTEGER DEFAULT 0,
    pisteet INTEGER DEFAULT 0
  )
`)

// Alustetaan sarjataulukon data
const stmtSarjataulukko = db.prepare("SELECT COUNT(*) as count FROM sarjataulukko")
if (stmtSarjataulukko.get().count === 0) {
  db.exec(`
    INSERT INTO sarjataulukko (nimi) VALUES 
    ('HH'), ('HNJHN'), ('AAK'), ('100KL'), ('KN'), ('VFC')
  `)
}

// Luodaan pelaajat-taulukko, jos sitä ei ole olemassa
db.exec(`
  CREATE TABLE IF NOT EXISTS pelaajat (
    nimi TEXT PRIMARY KEY,
    kill INTEGER DEFAULT 0,
    death INTEGER DEFAULT 0,
    assist INTEGER DEFAULT 0,
    ratio REAL DEFAULT 0
  )
`)

// Alustetaan pelaajat-taulukon data
const stmtPelaajat = db.prepare("SELECT COUNT(*) as count FROM pelaajat")
if (stmtPelaajat.get().count === 0) {
  db.exec(`
    INSERT INTO pelaajat (nimi) VALUES 
    ('Mussu'), ('Joge'), ('VerdiH'), ('Radu'), ('nico_ilari'), ('tenho'), ('heGe'), 
    ('wiilis'), ('pantsi'), ('ZzeiT'), ('Perä_carry'), ('-Pule'), ('JerDAD'), ('vedivaan'), 
    ('Are'), ('Löyläri'), ('lärvi'), ('s1mple'), ('Candle'), ('HASSE'), ('Jerbanderus'), 
    ('Pedro'), ('elmeri:D'), ('Plasen'), ('venyniilo'), ('Jakender'), ('J0nesy'), ('Peksi'), 
    ('romurauta'), ('Omppu6')
  `)
}

export default db
