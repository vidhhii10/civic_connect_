# 🏙️ Civic Connect

> **Report Issues. Build better cities.**  
> A community-driven civic issue reporting and real-time tracking platform.

[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Leaflet](https://img.shields.io/badge/Map-Leaflet-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🌟 Overview

Civic Connect empowers citizens to report, map, and track urban civic issues (such as broken street lights, hazardous potholes, overflowing garbage bins, water pipeline bursts, and exposed live wires). 

Originally prototyped in Glide, this project has been re-architected and coded as a production-ready, mobile-first **React + Vite** single-page application.

---

## 📱 User-Side Screens & Features

1. **Home Screen (`/home`)**
   - Panoramic dusk skyline hero banner.
   - Quick action buttons: *View Issue Map*, *View All Issues*, *Report Your Issue*.
   - Live City Issue Pulse metric counters.

2. **City Issue Map (`/map`)**
   - Dark theme city map (Leaflet + CartoDB Dark Matter).
   - Filterable search bar to locate markers by address or keyword.
   - Interactive custom blue teardrop map markers.
   - Marker popup and bottom preview sheet with issue photo, category, and direct link to details.

3. **Issue Reporting (`/report`)**
   - Full reporting form matching the original prototype layout.
   - **Name & Contact**: Prefilled with active citizen identity.
   - **Photo Upload**: Image selector with camera support and instant thumbnail preview.
   - **Category Select**: Street Lights, Exposed Wires, Water Leakage, Drainage, Public Toilet, Garbage, Pothole, Other.
   - **Description**: Multiline text area supporting multiple languages (English/Hindi/Marathi).
   - **Real Voice Recording**: Web Audio API (`MediaRecorder`) recording with live timer, pulse indicator, and inline audio playback preview.
   - **GPS Geolocation**: "Use current location" toggle with reverse geocoding to lock coordinates.
   - **Celebration Feedback**: Confetti animation upon submission and redirect to tracking dashboard.

4. **Issue Center / Issue List (`/issues`)**
   - Real-time search by keyword, category, address, or reporter.
   - Horizontal category filter pills (*Street Lights, Potholes, Garbage, etc.*).
   - Status tabs (*All, Pending, In Progress, Completed*).
   - Card grid with photos, categories, relative timestamps, and resolution progress bars.

5. **My Issues (`/my-issues`)**
   - Citizen tracking dashboard displaying complaints filed by the active citizen.
   - Linear progress tracking bar (`0%` Pending, `50%` In Progress, `100%` Resolved).
   - Official municipal resolution notes (*AdminNotes*).
   - Embedded audio player for voice notes.

6. **Users & Citizen Switcher (`/users`)**
   - Profile view of the active citizen (defaults to `Krish Patel`).
   - Fast demo citizen switcher (`Krish Patel`, `Priya Sharma`, `Rahul Verma`) to test localized filtering and personalized tracking during hackathon presentations.
   - Option to add custom test citizens and reset demo seed data.

---

## 🎨 Design System

- **Theme**: Dark Mode
- **App Background**: `#131315`
- **Cards & Surfaces**: `#1f2125`
- **Form Inputs**: `#2b2e35`
- **Primary Buttons**: `#2f6783` (Teal-Cyan)
- **Active Navigation Indicator**: `#38bdf8` (Cyan)
- **Typography**: Google Fonts Inter
- **Geometry**: Rounded cards (`16px`), rounded buttons (`10px`), pill badges.

---

## 🛠️ Getting Started Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/civic-connect.git
cd civic-connect

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

---

## 🚀 Building for Production

```bash
# Generate optimized static bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📦 Deployment

### Deploy to Vercel
1. Push this repository to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. Framework Preset: **Vite**.
4. Click **Deploy**.

### Deploy to Netlify
1. Drag and drop the `dist/` folder onto [Netlify Drop](https://app.netlify.com/drop), or connect your GitHub repository.
2. Build command: `npm run build`
3. Publish directory: `dist`

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
