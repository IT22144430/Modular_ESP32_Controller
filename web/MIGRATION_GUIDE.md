# Migration Guide: HTML to React + Vite + Tailwind CSS

## ✅ What Was Done

### 1. Project Setup

- ✅ Created Vite + React project configuration
- ✅ Set up Tailwind CSS with custom theme
- ✅ Configured PostCSS and build tools
- ✅ Updated package.json with all dependencies

### 2. Component Structure

```
src/
├── components/
│   ├── Header.jsx          # Reusable header component
│   ├── Sidebar.jsx         # Navigation sidebar
│   └── Card.jsx            # Card container components
├── pages/
│   ├── Dashboard.jsx       # Main dashboard (converted from dashboard.html)
│   └── History.jsx         # History page (converted from history.html)
├── hooks/
│   └── useMQTT.js          # Custom hook for MQTT connection
├── App.jsx                 # Main app with routing
├── main.jsx                # Entry point
└── index.css               # Tailwind imports
```

### 3. Converted Features

#### Dashboard.jsx

- ✅ All inline CSS → Tailwind classes
- ✅ MQTT connection → Custom React hook
- ✅ Chart.js integration → react-chartjs-2
- ✅ State management → React useState/useEffect
- ✅ Real-time data updates
- ✅ Control buttons and toggles
- ✅ Command log with auto-scroll
- ✅ Power cut alerts with notifications
- ✅ All animations → Tailwind animations

#### History.jsx

- ✅ All inline CSS → Tailwind classes
- ✅ MQTT connection for history events
- ✅ Multiple charts (voltage, duration, energy)
- ✅ Data table with sorting
- ✅ CSV export functionality
- ✅ Local storage integration
- ✅ Statistics calculations

### 4. Styling Migration

All CSS has been converted to Tailwind utility classes:

**Before (CSS):**

```css
.card {
  background: var(--card-dark);
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: var(--shadow);
}
```

**After (Tailwind):**

```jsx
<div className="bg-card-dark rounded-2xl p-6 shadow-custom">
```

### 5. Custom Tailwind Configuration

Created custom color palette in `tailwind.config.js`:

- Primary colors (blue, green, yellow, red, purple)
- Background colors (light, dark)
- Card colors
- Text colors
- Custom animations (pulse, blink, slideIn, etc.)

### 6. Routing

- ✅ React Router setup
- ✅ Dashboard at `/`
- ✅ History at `/history`
- ✅ Navigation between pages

## 🚀 How to Run

### Development Mode

```bash
cd web
npm install
npm run dev
```

Opens at `http://localhost:3000`

### Production Build

```bash
npm run build
npm run preview
```

## 📝 Key Improvements

### 1. Performance

- ⚡ Vite for instant HMR (Hot Module Replacement)
- ⚡ Code splitting with React Router
- ⚡ Optimized production builds

### 2. Developer Experience

- 🎨 Tailwind CSS for rapid styling
- 🔄 React hooks for clean state management
- 🧩 Reusable components
- 🛠️ Modern build tools

### 3. Code Quality

- 📦 Modular component structure
- 🔧 Custom hooks for logic separation
- 🎯 Type-safe(ish) with modern JS
- 📚 Better code organization

### 4. Features Preserved

- ✅ All MQTT functionality
- ✅ All Chart.js visualizations
- ✅ All control features
- ✅ Browser notifications
- ✅ Local storage
- ✅ CSV export
- ✅ Responsive design

## 🔄 What Changed

### Old Structure

```
web/
├── dashboard.html      (3000+ lines of HTML/CSS/JS)
├── history.html        (1500+ lines of HTML/CSS/JS)
└── server.js
```

### New Structure

```
web/
├── src/
│   ├── components/     (Reusable UI components)
│   ├── pages/          (Page components)
│   ├── hooks/          (Custom React hooks)
│   └── App.jsx         (Main app)
├── index.html          (Minimal template)
├── vite.config.js
└── tailwind.config.js
```

## 🎯 Benefits

1. **Maintainability**: Separated concerns, reusable components
2. **Scalability**: Easy to add new features and pages
3. **Performance**: Faster builds, optimized bundles
4. **Modern**: Latest React patterns and best practices
5. **DX**: Hot reload, better error messages
6. **Styling**: Consistent with Tailwind utilities
7. **Type Safety**: Ready for TypeScript if needed

## 🔧 Customization

### Change Colors

Edit `tailwind.config.js`:

```js
colors: {
  primary: {
    blue: '#YOUR_COLOR',
  }
}
```

### Add New Page

1. Create `src/pages/NewPage.jsx`
2. Add route in `src/App.jsx`
3. Add link in `src/components/Sidebar.jsx`

### Add New Component

Create in `src/components/` and import where needed

## 📚 Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Chart.js](https://www.chartjs.org)
- [MQTT.js](https://github.com/mqttjs/MQTT.js)

## 🐛 Troubleshooting

### Build Errors

- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf .vite`

### Styles Not Applying

- Check Tailwind config paths
- Restart dev server
- Clear browser cache

### MQTT Not Connecting

- Check broker URL in `src/hooks/useMQTT.js`
- Verify WebSocket support

## ⚠️ Migration Notes

### Old HTML Files

The original `dashboard.html` and `history.html` are still in the web folder but are no longer used. You can:

1. Keep them as backup
2. Move to `web/old/` folder
3. Delete them once everything is verified

### Server.js

The Express server (`server.js`) can still be used if needed for hosting the built files, but Vite's dev server is recommended for development.

## ✨ Next Steps

Consider:

1. Add TypeScript for type safety
2. Implement unit tests (Vitest)
3. Add E2E tests (Playwright)
4. Optimize chart rendering
5. Add more interactive features
6. Implement data caching strategies
