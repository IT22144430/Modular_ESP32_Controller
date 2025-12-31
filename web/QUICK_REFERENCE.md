# 🚀 Quick Reference Guide

## Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Install dependencies
npm install
```

## URLs

- **Development:** http://localhost:3000/
- **Dashboard:** http://localhost:3000/
- **History:** http://localhost:3000/history

## File Locations

### Pages

- Dashboard: `src/pages/Dashboard.jsx`
- History: `src/pages/History.jsx`

### Components

- Header: `src/components/Header.jsx`
- Sidebar: `src/components/Sidebar.jsx`
- Card: `src/components/Card.jsx`

### Configuration

- MQTT: `src/hooks/useMQTT.js`
- Tailwind: `tailwind.config.js`
- Vite: `vite.config.js`

## Common Tasks

### Change Colors

Edit `tailwind.config.js`:

```js
colors: {
  primary: {
    blue: '#YOUR_COLOR',
  }
}
```

### Add New Component

1. Create file in `src/components/`
2. Import where needed

### Add New Page

1. Create in `src/pages/`
2. Add route in `src/App.jsx`
3. Add link in `src/components/Sidebar.jsx`

### Change MQTT Broker

Edit `src/hooks/useMQTT.js`:

```js
const MQTT_BROKER = "wss://your-broker.com:8884/mqtt";
```

## Tailwind Classes Quick Ref

```jsx
// Layout
className = "flex items-center gap-4";
className = "grid grid-cols-2 gap-4";

// Spacing
className = "p-4"; // padding
className = "m-4"; // margin
className = "gap-4"; // gap

// Colors
className = "bg-primary-blue text-white";
className = "bg-card-dark";

// Sizing
className = "w-full h-[300px]";
className = "text-2xl font-bold";

// Effects
className = "rounded-xl shadow-custom";
className = "hover:scale-105 transition-all";
```

## Component Patterns

### Card with Header

```jsx
<Card>
  <CardHeader>
    <CardTitle icon="fas fa-icon">Title</CardTitle>
  </CardHeader>
  <div>Content</div>
</Card>
```

### Button

```jsx
<button
  onClick={handleClick}
  className="py-2 px-4 bg-primary-blue text-white rounded-lg hover:scale-105 transition-all"
>
  Click Me
</button>
```

### State

```jsx
const [value, setValue] = useState(0);
```

### Effect

```jsx
useEffect(() => {
  // Run on mount
}, []);
```

## MQTT Topics

```js
TOPICS.CONTROL; // 'esp32/led/control'
TOPICS.STATUS; // 'esp32/led/status'
TOPICS.VOLTAGE; // 'esp32/sensor/voltage'
TOPICS.POWERCUT; // 'esp32/powercut/status'
```

## Troubleshooting

### Server Won't Start

```bash
cd web
rm -rf node_modules
npm install
npm run dev
```

### Styles Not Applying

1. Restart dev server
2. Clear browser cache
3. Check Tailwind config

### Build Errors

```bash
npm run build
# Check error messages
```

## Resources

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Tailwind Docs](https://tailwindcss.com)
- [Chart.js](https://www.chartjs.org)

## Project Status

✅ Development server running  
✅ Dashboard converted  
✅ History converted  
✅ All features working  
✅ Production build tested  
✅ Documentation complete

**You're all set! Happy coding! 🎉**
