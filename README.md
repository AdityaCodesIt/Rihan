# CivicRoute - AI Civic Complaint Routing Platform (Phase 1 & Phase 2 Complete)

**CivicRoute** is a production-grade, high-fidelity frontend prototype of an autonomous AI civic complaint routing platform built for Indian Municipal Corporations (Urban Local Bodies / ULBs). It completely replaces slow bureaucratic complaint portals with sub-second multi-lingual routing, automated SLA dispatch, human-in-the-loop triage, an officer command console, and a public transparency portal.

---

## 🚀 Quick Run Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Verify Build & Type Safety:**
   ```bash
   npm run lint
   npm run build
   ```

---

## 🗺️ Application Routes

| Route | Role / Scope | Primary Features |
|---|---|---|
| `/` | **Citizen Landing** | Command-center hero, live flying routing stream, animated KPI counters, 4-step timeline, quick ticket lookup, resolved showcase. |
| `/report` | **Zero-Dropdown Report** | Conversational textarea, Web Speech voice input (`en-IN`, `hi-IN`, `mr-IN`), Leaflet map with Nominatim geocoding & ward boundary polygons, 5 scenario chips, 5-step animated AI routing sequence, digital QR receipt. |
| `/track/:id` | **Live Grievance Tracker** | Circular SVG SLA countdown ring, escalation alert banner, before/after photo comparison slider, citizen 5-star verification with confetti, dispute reopening modal, citizen WhatsApp feed preview. |
| `/officer` | **Officer Console** | Collapsible sidebar, Table / Kanban view toggle, sortable columns, SLA progress bars, bulk assignment bar, right-side slide-over drawer (photos, mini-map, audit trail, start work, proof photo upload, reassign), **Triage Queue** with AI top-3 predictions and feedback learning, **Map View** with urgency pins & duplicate cluster bubbles, **Escalations** with live red overdue countdowns, and **Analytics** with Recharts charts and AI insights. |
| `/public` | **Public Transparency Portal** | Citywide KPI cards, sortable municipal department leaderboard, interactive ward choropleth heatmap, trending issues tracker, before/after slider showcase, CSV open data export, and live resolution ticker. |

---

## 🌐 Real Free Keyless APIs vs Mocked Architecture

Every external API is keyless, includes a **4-second abort timeout**, and degrades gracefully to robust offline municipal fallbacks:

| Feature | Provider / Source | Real or Mocked? | Implementation Details |
|---|---|---|---|
| **Location Search & Reverse Geocode** | **Nominatim (OpenStreetMap)** | **REAL Free Keyless API** | Reverse geocodes pin drops, street search with 600ms debounce, 4s timeout with AbortController, and nearest ward fallback. |
| **Live Weather & Monsoon Urgency** | **Open-Meteo** | **REAL Free Keyless API** | Live temperature and precipitation for lat 19.30, lng 72.85. Heavy rain automatically raises urgency for drainage & waterlogging complaints in the classifier. Fallback to static "31°C Fair". |
| **Voice Input Grievance** | **Web Speech API** | **REAL Browser API** | Uses native `webkitSpeechRecognition` with locale matching (`en-IN`, `hi-IN`, `mr-IN`). Fallback to simulated audio waveform with realistic sample text. |
| **Geolocation** | **navigator.geolocation** | **REAL Browser API** | "Use My Location" queries device coordinates and maps them directly to municipal ward polygons. |
| **Officer Avatars** | **DiceBear (Notionists)** | **REAL Free CDN** | Generates consistent vector avatars seeded by fictional officer names. |
| **Photographic Evidence** | **Picsum Photos** | **REAL Free CDN** | Seeded images with `onError` fallback to gradient containers. |
| **AI Routing Engine & Classifier** | **CivicRoute NLP Core** | **FRONTEND ALGORITHMIC MOCK** | Weighted keyword scoring across 10 municipal departments in English, Hindi, and Marathi, with multi-department splitting, duplicate clustering, and out-of-jurisdiction detection. |
| **Wards & Departments** | **Synthetic Municipal Datasets** | **LOCAL DATASET** | 10 departments, 8 geographic wards with coordinate bounds, 70 realistic complaints, and 3 pre-configured demo tickets. |

---

## ⏱️ 3-Minute End-to-End Walkthrough Script

Follow this journey to demonstrate the complete cross-system integration:

1. **Minute 1: The Citizen Experience**
   - Open `/` (Landing page) — observe the dark command-center aesthetic, animated flying cards into department nodes, live counters, and language toggle (switch between English, हिन्दी, and मराठी).
   - Click **"Report an Issue Now"** (`/report`).
   - Click one of the scenario chips (e.g. *⚡ Broken asphalt with burst drinking pipeline (Multi-Dept)* or *⚡ Potholes near Station Exit*).
   - Notice the map updates to Ward A / G with boundary polygon highlighting and street reverse geocoding.
   - Click **"Submit & Trigger AI Routing"** — observe the 5-step animation:
     1. Natural Language Understanding & Confidence
     2. Ward boundary match
     3. Deduplication cluster check
     4. Urgency gauge with weather risk boost
     5. Assignment & SLA clock
   - Copy the generated Ticket ID (e.g. `CR-2026-xxxxxx`).

2. **Minute 2: Real-time Tracker & Citizen Verification**
   - Click **"Track Status & Live SLA"** (`/track/:id`) to open the live tracker.
   - Inspect the circular SVG SLA countdown ring, the official municipal audit trail, and the simulated citizen WhatsApp notifications.
   - Click the demo ticket shortcut **CR-2026-001045 (Fixed)**.
   - Drag the **Before / After photo slider** to compare the dirty sidewalk vs the cleared sidewalk.
   - Click **"Confirm Resolved & Close"** — select 5 stars and submit to trigger celebratory confetti and close the case.

3. **Minute 3: Officer Command Console & Public Transparency**
   - Click **"Officer Console"** (`/officer`) in the navbar.
   - In the **Inbox**, switch between **Table** and **Kanban** views. Filter by ward or department. Click any complaint row to open the slide-over **Officer Drawer**.
   - Inside the drawer: click **"Start Work"**, **"Upload Proof Photo"** (or "+ Generate Proof"), and click **"Mark Resolved"**.
   - Switch to the **Triage Queue** tab: observe low-confidence submissions with the AI's top-3 department predictions and confidence bars. Click **"Confirm Top"** or **"Reassign"** with a reason to see the card animate out with the *"Thanks! AI will learn from this correction"* toast.
   - Switch to the **Map View** tab: view urgency-coded markers, duplicate cluster hotspot bubbles, and hoverable ward polygons.
   - Switch to the **Escalations** tab: observe breached tickets with live overdue timers (`Overdue by 3h 12m`) and multi-tier promotion buttons (**Nudge Officer**, **Escalate Higher**).
   - Switch to **Analytics**: review Recharts graphs (department volume, resolution trend, AI accuracy donut, peak filing hours).
   - Navigate to `/public` (**Public Transparency Dashboard**): notice how citywide counters and department rankings reflect live data. Click **"Download Municipal Report (CSV)"** to export the open data file.
   - Use **Ctrl+K / Cmd+K** anytime to open the **Command Palette** or click the **Demo Controls** floating button (bottom-left) to simulate live incoming grievances or SLA breaches on the fly!

---

## 🔮 Phase 3 Roadmap (Real Backend & Enterprise Scale)

When transitioning CivicRoute from prototype to full production for a Municipal Corporation:

1. **Authentication & Role-Based Access Control (RBAC):**
   - Citizen Aadhaar / DigiLocker OAuth or OTP login.
   - Officer Single Sign-On (SSO) integrated with municipal email and employee IDs.
   - Hierarchy roles: Field Junior Engineer, Assistant Engineer, Executive Engineer, Municipal Commissioner.

2. **Cloud Database & Spatial GIS (PostgreSQL + PostGIS):**
   - Relational persistence with PostGIS geometry types for sub-meter polygon containment checks (`ST_Contains`).
   - Spatial indexing (`GIST`) for microsecond duplicate clustering within a 200m radius.

3. **Real Machine Learning & LLM Pipeline:**
   - Production fine-tuned multilingual model (Hindi, Marathi, regional dialects, and code-mixed Hinglish).
   - Computer vision model to classify photo severity (e.g. pothole depth estimation, road cracks, garbage volume).

4. **Enterprise Communication Gateways:**
   - Official WhatsApp Business API webhooks with 2-way bot replies for photo receipts.
   - Automated voice IVR calls to municipal engineers for critical SLA-breached emergencies.
