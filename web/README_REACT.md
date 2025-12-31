# ESP32 Dashboard - React + Vite + Tailwind CSS

Modern React-based web dashboard for controlling and monitoring ESP32 devices via MQTT.

## 🚀 Features

- **Real-time MQTT Communication** - Live data streaming from ESP32
- **Interactive Charts** - Voltage, current, and power monitoring with Chart.js
- **Responsive Design** - Built with Tailwind CSS for mobile-first experience
- **Dark Theme** - Modern dark UI with smooth animations
- **Power Cut Detection** - Alert system with browser notifications
- **History Analytics** - Track and analyze power cut events
- **React Router** - Seamless navigation between pages

## 📦 Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Chart.js** - Data visualization
- **MQTT.js** - MQTT client for WebSocket
- **React Router** - Client-side routing

## 🛠️ Installation

1. Navigate to the web directory:

   ```bash
   cd web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## 🎯 Development

Start the development server:

```bash
npm run dev
```

The app will open at `http://localhost:3000`

## 🏗️ Build

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## 📁 Project Structure

```
web/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   └── Card.jsx
│   ├── pages/               # Page components
│   │   ├── Dashboard.jsx
│   │   └── History.jsx
│   ├── hooks/               # Custom React hooks
│   │   └── useMQTT.js
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Tailwind imports
├── public/                  # Static assets
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # PostCSS configuration
└── package.json             # Dependencies
```

## 🎨 Key Components

### Dashboard

- Real-time sensor data display
- LED and system control
- Interactive voltage charts
- Command log
- Emergency light control

### History

- Power cut event tracking
- Statistical analysis
- Data visualization with charts
- CSV export functionality

## 🔌 MQTT Topics

The dashboard subscribes to:

- `esp32/led/status` - LED status
- `esp32/sensor/voltage` - 5V system voltage
- `esp32/sensor2/voltage` - Main power voltage
- `esp32/powercut/status` - Power cut detection
- And more... (see useMQTT.js for full list)

## 🎨 Customization

### Colors

Edit `tailwind.config.js` to customize the color scheme:

```js
colors: {
  primary: {
    blue: '#4A90E2',
    green: '#50C878',
    // ... more colors
  }
}
```

### MQTT Broker

Edit `src/hooks/useMQTT.js` to change the broker:

```js
const MQTT_BROKER = "wss://your-broker.com:8884/mqtt";
```

## 📱 Responsive Design

The dashboard is fully responsive and works on:

- Desktop (1920x1080 and above)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

## 🔔 Notifications

The app supports browser notifications for power cut alerts. Grant notification permissions when prompted.

## 🐛 Troubleshooting

**Charts not displaying:**

- Ensure Chart.js is properly installed
- Check browser console for errors

**MQTT not connecting:**

- Verify broker URL and port
- Check WebSocket support in browser
- Ensure firewall allows WebSocket connections

**Tailwind styles not working:**

- Run `npm run dev` to start development server
- Clear browser cache
- Check PostCSS configuration

## 📄 License

MIT

## 👨‍💻 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
