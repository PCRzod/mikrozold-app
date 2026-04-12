import React, { useEffect, useState } from "react";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwg1Puemq79NPkimkXk0f1iHIFrA4cTYz_J7voJgKBZbPwbli6sELotXWr18lTF4PYAhQ/exec";

const PLANTS = [
  { id: "lila_retek", name: "Lila Retek", icon: "🟣" },
  { id: "pink_retek", name: "Pink Retek", icon: "🌸" },
  { id: "borso", name: "Borsó", icon: "🫛" },
  { id: "karalabe", name: "Karalábé", icon: "🥬" },
  { id: "brokkoli", name: "Brokkoli", icon: "🥦" },
  { id: "porehagyma", name: "Póréhagyma", icon: "🧅" },
  { id: "cekla", name: "Cékla", icon: "🍠" },
  { id: "salata", name: "Saláta", icon: "🥗" },
  { id: "fekete_mustar", name: "Fekete Mustár", icon: "⚫" },
  { id: "barna_mustar", name: "Barna Mustár", icon: "🟤" },
  { id: "napraforgo", name: "Napraforgó", icon: "🌻" },
  { id: "edeskomeny", name: "Édeskömény", icon: "🌿" }
];

const RESTAURANTS = [
  "Crystal",
  "Gerendás",
  "Paprika",
  "Káli",
  "Sylvania",
  "Kicsi Gomba",
  "Pacsirta",
  "Csámborgó",
  "Zöldséges üzlete - Csilla"
];

const PRICES = {
  kicsi: 7,
  nagy: 20
};

export default function App() {
  const [restaurant, setRestaurant] = useState(RESTAURANTS[0]);
  const [plant, setPlant] = useState(null);
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [data, setData] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("mikrozold");
    if (saved) setData(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("mikrozold", JSON.stringify(data));
  }, [data]);

  function save() {
    if (!plant || !size) return;

    const id = Date.now().toString();

    const record = {
      id,
      date: new Date().toISOString().slice(0, 10),
      restaurant,
      plant: plant.name,
      size,
      qty: Number(qty),
      price: PRICES[size],
      sum: PRICES[size] * Number(qty),
      note: ""
    };

    setData((prev) => [record, ...prev]);

const params = new URLSearchParams({
  action: "add",
  id: record.id,
  date: record.date,
  restaurant: record.restaurant,
  plant: record.plant,
  size: record.size,
  qty: String(record.qty),
  price: String(record.price),
  sum: String(record.sum),
  note: record.note
});

fetch(`${SCRIPT_URL}?${params.toString()}`, {
  method: "GET",
  mode: "no-cors"
}).catch(() => {});

    setPlant(null);
    setSize(null);
    setQty(1);
  }

  function removeRecord(item) {
    setData((prev) => prev.filter((d) => d.id !== item.id));

    fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify({
        action: "delete",
        id: item.id
      })
    }).catch(() => {});
  }

  function total() {
    return data.reduce((a, b) => a + b.sum, 0);
  }

  return (
    <div style={{ fontFamily: "system-ui", padding: 20, maxWidth: 560, margin: "auto" }}>
      <h2>Mikrozöld napló</h2>

      <h3>Vendéglő</h3>
      <div style={{ marginBottom: 18 }}>
        {RESTAURANTS.map((r) => (
          <button
            key={r}
            onClick={() => setRestaurant(r)}
            style={{
              margin: 4,
              padding: 10,
              borderRadius: 12,
              border: r === restaurant ? "2px solid black" : "1px solid #ccc",
              background: r === restaurant ? "black" : "white",
              color: r === restaurant ? "white" : "black"
            }}
          >
            {r}
          </button>
        ))}
      </div>

      <h3>Növény</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 18 }}>
        {PLANTS.map((p) => (
          <button
            key={p.id}
            onClick={() => setPlant(p)}
            style={{
              padding: 10,
              borderRadius: 12,
              border: plant?.id === p.id ? "2px solid green" : "1px solid #ccc",
              background: "white"
            }}
          >
            <div style={{ fontSize: 28 }}>{p.icon}</div>
            <div>{p.name}</div>
          </button>
        ))}
      </div>

      {plant && (
        <>
          <h3>Méret</h3>
          <div style={{ marginBottom: 18 }}>
            <button
              onClick={() => setSize("kicsi")}
              style={{
                marginRight: 8,
                padding: 10,
                borderRadius: 12,
                border: size === "kicsi" ? "2px solid green" : "1px solid #ccc",
                background: "white"
              }}
            >
              Kicsi (7 lej)
            </button>

            <button
              onClick={() => setSize("nagy")}
              style={{
                padding: 10,
                borderRadius: 12,
                border: size === "nagy" ? "2px solid green" : "1px solid #ccc",
                background: "white"
              }}
            >
              Nagy (20 lej)
            </button>
          </div>
        </>
      )}

      <h3>Darab</h3>
      <input
        type="number"
        min="1"
        value={qty}
        onChange={(e) => setQty(e.target.value)}
        style={{ width: 90, fontSize: 18, marginBottom: 18 }}
      />

      <div>
        <button
          onClick={save}
          style={{
            padding: 15,
            fontSize: 18,
            borderRadius: 12,
            background: "green",
            color: "white",
            border: "none"
          }}
        >
          MENTÉS
        </button>
      </div>

      <hr style={{ margin: "24px 0" }} />

      <h3>Összes bevétel</h3>
      <h2>{total()} lej</h2>

      <hr style={{ margin: "24px 0" }} />

      <h3>Lista</h3>

      {data.map((d, i) => (
        <div key={d.id || i} style={{ borderBottom: "1px solid #ddd", padding: "8px 0" }}>
          <div>
            {d.date} – {d.restaurant} – {d.plant} – {d.size} – {d.qty} db – {d.sum} lej
          </div>

          <button
            onClick={() => removeRecord(d)}
            style={{
              marginTop: 6,
              padding: "6px 10px",
              borderRadius: 8,
              border: "none",
              background: "#b91c1c",
              color: "white"
            }}
          >
            Törlés
          </button>
        </div>
      ))}
    </div>
  );
}
