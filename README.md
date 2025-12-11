# Tatya - Agricultural Drone Services App

A React-based mobile application for booking agricultural drone services, built with Vite and React Router.

## Features

- **Login Page**: Phone number authentication with OTP
- **Location Selection**: Real-time map integration with geolocation support
  - Automatically detects user's current location
  - Interactive map with click-to-select location
  - Manual location selection via map clicks
  - Photo-based and coordinate marking options
- **Drone Booking**: Browse available drones, view service details, and book services
- **Checkout**: Order summary, pilot instructions, and payment processing

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── pages/
│   ├── LoginPage.jsx       # Landing/Login page
│   ├── LocationPage.jsx     # Location selection page
│   ├── BookingPage.jsx      # Drone booking page
│   └── CheckoutPage.jsx     # Checkout/Order summary page
├── styles/
│   ├── LoginPage.css
│   ├── LocationPage.css
│   ├── BookingPage.css
│   └── CheckoutPage.css
├── App.jsx                  # Main app component with routing
├── main.jsx                 # Entry point
└── index.css                # Global styles
```

## Technologies Used

- React 18
- React Router DOM
- Vite
- Leaflet & React-Leaflet (for map integration)
- Browser Geolocation API
- CSS3 (Mobile-first responsive design)

## Map Integration

The location page uses **Leaflet** with **OpenStreetMap** tiles for real-time map display. The app:

- Automatically requests location permission on page load
- Displays the user's current location with a blue marker
- Allows users to click anywhere on the map to select a location (red marker)
- Shows coordinates in popups when markers are clicked
- Includes a location button in the search bar to re-center on current location

**Note**: For production use, you may want to:
- Add location search/geocoding (e.g., using Nominatim API)
- Store selected locations in state management or backend
- Add polygon drawing for farm boundary marking

## Mobile-First Design

The application is designed with a mobile-first approach, optimized for mobile devices with responsive breakpoints for larger screens.

