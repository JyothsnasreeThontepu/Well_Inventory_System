# Well Inventory System (Offline-Capable)

A **web-based Well Inventory System** built for managing and visualizing **oil & gas well data specific to Andhra Pradesh**.
The system works **fully offline**, making it suitable for use in remote field locations.


## 🚀 Features

* **Offline Capability**

  * Works without internet using **local JSON files**, **MBTiles**, and a **local server**.
  * Supports field deployment in low-connectivity areas.

* **Interactive Map (Leaflet.js)**

  * Local **GeoJSON overlays** for well boundaries.
  * Local **tile layers** for offline map visualization.

* **Responsive Three-Panel UI (Bootstrap)**

  * **Sidebar**: Searchable well list.
  * **Map Viewer**: Interactive visualization with markers.
  * **Detail Pane**: Dynamic well details display.

* **Advanced Search & Filtering (DataTables.js)**

  * Search wells by **UWI** (Unique Well Identifier).
  * Filter wells by **status** (active, inactive, drilled, etc.).

* **PDF Report Generation (jsPDF)**

  * Generate **offline PDF reports** of selected wells.
  * Useful for **field reporting & documentation**.

## 🛠️ Tech Stack

* **Frontend**:

  * [Leaflet.js](https://leafletjs.com/) – Map visualization
  * [Bootstrap](https://getbootstrap.com/) – Responsive layout
  * [DataTables.js](https://datatables.net/) – Search & filtering
  * [jsPDF](https://github.com/parallax/jsPDF) – PDF generation

* **Backend / Data**:

  * **Local JSON files** – Well inventory data
  * **MBTiles** – Offline tile maps
  * **Node.js / Local Server** – Offline hosting

## 📂 Project Structure

```
well-inventory-system/
│── data/               # Local JSON well data
│── tiles/              # MBTiles for offline map
│── public/             
│   ├── index.html      # Main UI
│   ├── styles.css      # Custom styles
│   ├── app.js          # Core logic
│── server.js           # Local server (Node.js / Express)
│── README.md           # Project documentation
```
## ⚡ Installation & Setup

1. **Clone the repo**

   ```bash
   git clone https://github.com/your-username/well-inventory-system.git
   cd well-inventory-system
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start local server**

   ```bash
   node server.js
   ```

4. **Access the app**
   Open [http://localhost:3000](http://localhost:3000) in your browser.


## 📌 Use Cases

* **Field Engineers**: Access well inventory offline in remote locations.
* **Regulatory Compliance**: Maintain digital well records.
* **Operations Planning**: Visualize and filter wells by status.


## 🔮 Future Enhancements

* ✅ Sync with central database when online
* ✅ Add support for mobile/tablet offline PWA
* ✅ Advanced GIS analysis with Leaflet plugins
## Screenshots
<img width="844" height="379" alt="Screenshot 2025-09-04 215318" src="https://github.com/user-attachments/assets/8b8a9b5f-e76a-4c22-8a93-0fe7cb57ba42" />
<img width="840" height="380" alt="image" src="https://github.com/user-attachments/assets/489cc62a-74be-43f4-8a80-9225105ef399" />
<img width="755" height="508" alt="image" src="https://github.com/user-attachments/assets/1630a943-01f1-4f55-abea-b047ba721b2b" />



