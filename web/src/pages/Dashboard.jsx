import { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Card, CardHeader, CardTitle } from "../components/Card";
import { useMQTT, TOPICS } from "../hooks/useMQTT";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ledStatus, setLedStatus] = useState("OFF");
  const [systemStatus, setSystemStatus] = useState(false);
  const [intensityStatus, setIntensityStatus] = useState(false);
  const [emergencyStatus, setEmergencyStatus] = useState("AUTO");
  const [lightIntensity, setLightIntensity] = useState(0);
  const [batteryPct, setBatteryPct] = useState(100);
  const [signalQuality, setSignalQuality] = useState(0);
  const [rssi, setRssi] = useState(-100);
  const [voltage1, setVoltage1] = useState(0);
  const [voltage2, setVoltage2] = useState(0);
  const [current1, setCurrent1] = useState(0);
  const [current2, setCurrent2] = useState(0);
  const [power1, setPower1] = useState(0);
  const [power2, setPower2] = useState(0);
  const [powerCutStatus, setPowerCutStatus] = useState("NORMAL");
  const [commandLogs, setCommandLogs] = useState([]);

  const [chartData1, setChartData1] = useState({
    labels: Array(60).fill(""),
    datasets: [
      {
        label: "Voltage (V)",
        data: Array(60).fill(null),
        borderColor: "rgb(74, 144, 226)",
        backgroundColor: "rgba(74, 144, 226, 0.2)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
        spanGaps: false,
      },
    ],
  });

  const [chartData2, setChartData2] = useState({
    labels: Array(60).fill(""),
    datasets: [
      {
        label: "Voltage (V)",
        data: Array(60).fill(null),
        borderColor: "rgb(157, 78, 221)",
        backgroundColor: "rgba(157, 78, 221, 0.2)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
        spanGaps: false,
      },
    ],
  });

  const [avgVoltage1, setAvgVoltage1] = useState(0);
  const [avgVoltage2, setAvgVoltage2] = useState(0);
  const dataPointIndex = useRef(0);

  const handleMessage = (topic, message) => {
    switch (topic) {
      case TOPICS.STATUS:
        setLedStatus(message);
        addLog(`LED Status: ${message}`, "info");
        break;
      case TOPICS.LED2_STATUS:
        setSystemStatus(message === "ON");
        addLog(`System Status: ${message}`, "info");
        break;
      case TOPICS.LED4_STATUS:
        setIntensityStatus(message === "ON");
        addLog(`Intensity Status: ${message}`, "info");
        break;
      case TOPICS.EMERGENCY_STATUS:
        setEmergencyStatus(message);
        addLog(`Emergency Status: ${message}`, "info");
        break;
      case TOPICS.LIGHT_INTENSITY:
        setLightIntensity(parseFloat(message));
        break;
      case TOPICS.BATTERY_PCT:
        setBatteryPct(parseFloat(message));
        break;
      case TOPICS.SIGNAL:
        const rssiValue = parseInt(message);
        setRssi(rssiValue);
        const quality = Math.max(0, Math.min(100, (rssiValue + 100) * 2));
        setSignalQuality(quality);
        break;
      case TOPICS.VOLTAGE:
        const v1 = parseFloat(message);
        setVoltage1(v1);
        updateChart(v1, voltage2);
        break;
      case TOPICS.VOLTAGE2:
        const v2 = parseFloat(message);
        setVoltage2(v2);
        updateChart(voltage1, v2);
        break;
      case TOPICS.CURRENT:
        setCurrent1(parseFloat(message));
        break;
      case TOPICS.CURRENT2:
        setCurrent2(parseFloat(message));
        break;
      case TOPICS.POWER:
        setPower1(parseFloat(message));
        break;
      case TOPICS.POWER2:
        setPower2(parseFloat(message));
        break;
      case TOPICS.POWERCUT:
        setPowerCutStatus(message);
        updatePowerAlert(message);
        if (message === "POWER_CUT") {
          addLog("⚠️ POWER CUT DETECTED! Running on battery backup", "error");
        } else {
          addLog("✓ Main power restored", "success");
        }
        break;
      case TOPICS.COMMAND:
        addLog(message, "info");
        break;
      case TOPICS.HISTORY:
        try {
          const data = JSON.parse(message);
          saveHistoryEvent(data);
        } catch (e) {
          console.error("Error parsing history:", e);
        }
        break;
    }
  };

  const { connectionStatus, publish } = useMQTT(handleMessage);

  const updateChart = (v1, v2) => {
    const now = new Date().toLocaleTimeString();

    setChartData1((prev) => {
      const newData = [...prev.datasets[0].data];
      const newLabels = [...prev.labels];

      if (dataPointIndex.current < 60) {
        newLabels[dataPointIndex.current] = now;
        newData[dataPointIndex.current] = v1;
      } else {
        newLabels.shift();
        newLabels.push(now);
        newData.shift();
        newData.push(v1);
      }

      const validData = newData.filter((val) => val !== null);
      if (validData.length > 0) {
        setAvgVoltage1(
          (validData.reduce((a, b) => a + b, 0) / validData.length).toFixed(2)
        );
      }

      return {
        ...prev,
        labels: newLabels,
        datasets: [{ ...prev.datasets[0], data: newData }],
      };
    });

    setChartData2((prev) => {
      const newData = [...prev.datasets[0].data];
      const newLabels = [...prev.labels];

      if (dataPointIndex.current < 60) {
        newLabels[dataPointIndex.current] = now;
        newData[dataPointIndex.current] = v2;
        dataPointIndex.current++;
      } else {
        newLabels.shift();
        newLabels.push(now);
        newData.shift();
        newData.push(v2);
      }

      const validData = newData.filter((val) => val !== null);
      if (validData.length > 0) {
        setAvgVoltage2(
          (validData.reduce((a, b) => a + b, 0) / validData.length).toFixed(2)
        );
      }

      return {
        ...prev,
        labels: newLabels,
        datasets: [{ ...prev.datasets[0], data: newData }],
      };
    });
  };

  const updatePowerAlert = (status) => {
    if (status === "POWER_CUT") {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("⚠️ POWER CUT ALERT", {
          body: "Main power failure detected! System running on battery backup.",
          icon: "/favicon.ico",
          requireInteraction: true,
        });
      }
      playAlertSound();
    }
  };

  const playAlertSound = () => {
    try {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";
      gainNode.gain.value = 0.3;

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
      console.error("Audio error:", e);
    }
  };

  const saveHistoryEvent = (data) => {
    try {
      const history = JSON.parse(
        localStorage.getItem("powerCutHistory") || "[]"
      );
      const event = {
        timestamp: new Date().toLocaleString(),
        duration: data.duration,
        startV: data.startV,
        endV: data.endV,
        drop: data.drop,
        energy: data.energy,
      };
      history.push(event);
      localStorage.setItem("powerCutHistory", JSON.stringify(history));
    } catch (e) {
      console.error("Error saving history:", e);
    }
  };

  const addLog = (message, type = "info") => {
    setCommandLogs((prev) => {
      const newLogs = [
        ...prev,
        { message, type, timestamp: new Date().toLocaleTimeString() },
      ];
      return newLogs.slice(-50); // Keep only last 50
    });
  };

  const testAlert = () => {
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("🔔 Test Alert", {
          body: "This is a test notification. Alerts are working!",
          icon: "/favicon.ico",
        });
        playAlertSound();
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification("🔔 Test Alert", {
              body: "Notifications enabled successfully!",
              icon: "/favicon.ico",
            });
          }
        });
      }
    }
  };

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Custom Chart.js plugin to show latest value on chart
  const latestValuePlugin = {
    id: "latestValueLabel",
    afterDatasetsDraw(chart) {
      const ctx = chart.ctx;
      const dataset = chart.data.datasets[0];
      const meta = chart.getDatasetMeta(0);

      // Find the last non-null data point
      let lastIndex = -1;
      for (let i = dataset.data.length - 1; i >= 0; i--) {
        if (dataset.data[i] !== null) {
          lastIndex = i;
          break;
        }
      }

      if (lastIndex >= 0) {
        const point = meta.data[lastIndex];
        const value = dataset.data[lastIndex];

        if (point) {
          const x = point.x;
          const y = point.y;

          // Draw text only
          ctx.save();
          ctx.fillStyle = dataset.borderColor;
          ctx.font = "bold 11px Segoe UI";
          ctx.textAlign = "center";
          ctx.textBaseline = "bottom";
          const text = value.toFixed(2) + "V";
          ctx.fillText(text, x, y - 5);
          ctx.restore();
        }
      }
    },
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Voltage (V)",
          color: "#ECF0F1",
          font: { size: 14, weight: "bold" },
        },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
        ticks: { color: "#ECF0F1" },
      },
      x: {
        type: "category",
        min: 0,
        max: 59,
        title: {
          display: true,
          text: "Time",
          color: "#ECF0F1",
          font: { size: 14, weight: "bold" },
        },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
        ticks: {
          color: "#ECF0F1",
          autoSkip: true,
          maxTicksLimit: 10,
        },
      },
    },
  };

  return (
    <>
      <Header
        title="Light Intensity & Power Backup"
        subtitle="Real-time Monitoring & Control"
        onTestAlert={testAlert}
        connectionStatus={connectionStatus}
        onToggleMenu={() => setSidebarOpen(!sidebarOpen)}
        isMenuOpen={sidebarOpen}
      />

      <div className="min-h-[calc(100vh-60px)] sm:min-h-[calc(100vh-80px)]">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="p-3 sm:p-4 md:p-6 lg:p-8 lg:ml-[250px] overflow-y-auto">
          {/* Power Alert */}
          <div
            className={`p-4 rounded-xl my-4 flex items-center gap-4 animate-pulse-alert ${
              powerCutStatus === "POWER_CUT"
                ? "bg-primary-red/10 border-l-4 border-primary-red"
                : "bg-primary-green/10 border-l-4 border-primary-green"
            }`}
          >
            <i
              className={`fas ${
                powerCutStatus === "POWER_CUT"
                  ? "fa-exclamation-triangle"
                  : "fa-check-circle"
              } text-4xl ${
                powerCutStatus === "POWER_CUT"
                  ? "text-primary-red"
                  : "text-primary-green"
              }`}
            ></i>
            <div>
              <h3 className="text-xl font-bold m-0">
                {powerCutStatus === "POWER_CUT"
                  ? "⚠️ POWER CUT DETECTED!"
                  : "✓ System Normal"}
              </h3>
              <p className="m-0 opacity-80">
                {powerCutStatus === "POWER_CUT"
                  ? "Main power failure! Running on battery backup."
                  : "All systems operational on main power."}
              </p>
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {/* LED Status Card */}
            <Card>
              <CardHeader>
                <CardTitle
                  icon="fas fa-lightbulb"
                  iconColor="text-primary-yellow"
                >
                  LED Status
                </CardTitle>
              </CardHeader>
              <div className="text-center">
                <div
                  className={`inline-block w-3 h-3 rounded-full mr-2 ${
                    ledStatus === "ON"
                      ? "bg-primary-green shadow-[0_0_10px] shadow-primary-green"
                      : "bg-primary-red shadow-[0_0_10px] shadow-primary-red"
                  }`}
                ></div>
                <div className="text-4xl font-bold my-4">{ledStatus}</div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <button
                  onClick={() => publish(TOPICS.CONTROL, "ON")}
                  className="py-4 px-4 border-none rounded-xl text-base font-semibold cursor-pointer transition-all flex items-center justify-center gap-2 bg-gradient-to-br from-primary-green to-[#45B849] text-white hover:scale-105 hover:shadow-[0_5px_15px_rgba(0,0,0,0.2)] active:scale-95"
                >
                  <i className="fas fa-power-off"></i> Turn ON
                </button>
                <button
                  onClick={() => publish(TOPICS.CONTROL, "OFF")}
                  className="py-4 px-4 border-none rounded-xl text-base font-semibold cursor-pointer transition-all flex items-center justify-center gap-2 bg-gradient-to-br from-primary-red to-[#E85D75] text-white hover:scale-105 hover:shadow-[0_5px_15px_rgba(0,0,0,0.2)] active:scale-95"
                >
                  <i className="fas fa-power-off"></i> Turn OFF
                </button>
              </div>
            </Card>

            {/* System Status Card */}
            <Card>
              <CardHeader>
                <CardTitle icon="fas fa-cog" iconColor="text-primary-blue">
                  System Control
                </CardTitle>
              </CardHeader>
              <div className="text-center">
                <div
                  className={`inline-block w-3 h-3 rounded-full mr-2 ${
                    systemStatus
                      ? "bg-primary-green shadow-[0_0_10px] shadow-primary-green"
                      : "bg-primary-red shadow-[0_0_10px] shadow-primary-red"
                  }`}
                ></div>
                <div className="text-4xl font-bold my-4">
                  {systemStatus ? "ON" : "OFF"}
                </div>
              </div>
              <div className="flex items-center justify-center gap-4 mt-4">
                <span>System</span>
                <label className="relative inline-block w-[60px] h-[30px]">
                  <input
                    type="checkbox"
                    checked={systemStatus}
                    onChange={(e) => {
                      setSystemStatus(e.target.checked);
                      publish(TOPICS.LED2, e.target.checked ? "ON" : "OFF");
                    }}
                    className="opacity-0 w-0 h-0"
                  />
                  <span
                    className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-all ${
                      systemStatus
                        ? "bg-gradient-to-br from-primary-green to-[#45B849]"
                        : "bg-gray-400"
                    } before:absolute before:content-[''] before:h-[22px] before:w-[22px] before:left-1 before:bottom-1 before:bg-white before:transition-all before:rounded-full ${
                      systemStatus ? "before:translate-x-[30px]" : ""
                    }`}
                  ></span>
                </label>
              </div>
            </Card>

            {/* Intensity Status Card */}
            <Card>
              <CardHeader>
                <CardTitle icon="fas fa-sun" iconColor="text-primary-yellow">
                  Intensity Monitor
                </CardTitle>
              </CardHeader>
              <div className="text-center">
                <div
                  className={`inline-block w-3 h-3 rounded-full mr-2 ${
                    intensityStatus
                      ? "bg-primary-green shadow-[0_0_10px] shadow-primary-green"
                      : "bg-primary-red shadow-[0_0_10px] shadow-primary-red"
                  }`}
                ></div>
                <div className="text-4xl font-bold my-4">
                  {intensityStatus ? "ON" : "OFF"}
                </div>
              </div>
              <div className="flex items-center justify-center gap-4 mt-4">
                <span>Monitor</span>
                <label className="relative inline-block w-[60px] h-[30px]">
                  <input
                    type="checkbox"
                    checked={intensityStatus}
                    onChange={(e) => {
                      setIntensityStatus(e.target.checked);
                      publish(TOPICS.LED4, e.target.checked ? "ON" : "OFF");
                    }}
                    className="opacity-0 w-0 h-0"
                  />
                  <span
                    className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-all ${
                      intensityStatus
                        ? "bg-gradient-to-br from-primary-green to-[#45B849]"
                        : "bg-gray-400"
                    } before:absolute before:content-[''] before:h-[22px] before:w-[22px] before:left-1 before:bottom-1 before:bg-white before:transition-all before:rounded-full ${
                      intensityStatus ? "before:translate-x-[30px]" : ""
                    }`}
                  ></span>
                </label>
              </div>
            </Card>

            {/* Light Intensity */}
            <Card>
              <CardHeader>
                <CardTitle icon="fas fa-adjust" iconColor="text-primary-yellow">
                  Light Level
                </CardTitle>
              </CardHeader>
              <div className="text-center">
                <div className="text-5xl font-bold my-4">
                  {lightIntensity.toFixed(0)}%
                </div>
                <div className="text-sm opacity-70">Current Intensity</div>
              </div>
            </Card>

            {/* Battery Percentage */}
            <Card>
              <CardHeader>
                <CardTitle
                  icon="fas fa-battery-three-quarters"
                  iconColor="text-primary-green"
                >
                  Battery Level
                </CardTitle>
              </CardHeader>
              <div className="text-center">
                <div className="text-5xl font-bold my-4">
                  {batteryPct.toFixed(0)}%
                </div>
                <div className="w-full bg-gray-600 rounded-full h-4 mt-4">
                  <div
                    className={`h-full rounded-full transition-all ${
                      batteryPct > 50
                        ? "bg-primary-green"
                        : batteryPct > 20
                        ? "bg-primary-yellow"
                        : "bg-primary-red"
                    }`}
                    style={{ width: `${batteryPct}%` }}
                  ></div>
                </div>
              </div>
            </Card>

            {/* WiFi Signal */}
            <Card>
              <CardHeader>
                <CardTitle icon="fas fa-wifi" iconColor="text-primary-blue">
                  WiFi Signal
                </CardTitle>
              </CardHeader>
              <div className="text-center">
                <div className="text-5xl font-bold my-4">
                  {signalQuality.toFixed(0)}%
                </div>
                <div className="text-sm opacity-70 mb-2">RSSI: {rssi} dBm</div>
                <div className="w-full bg-gray-600 rounded-full h-4">
                  <div
                    className={`h-full rounded-full transition-all ${
                      rssi > -60
                        ? "bg-primary-green"
                        : rssi > -75
                        ? "bg-primary-yellow"
                        : "bg-primary-red"
                    }`}
                    style={{ width: `${signalQuality}%` }}
                  ></div>
                </div>
              </div>
            </Card>

            {/* Emergency Light */}
            <Card>
              <CardHeader>
                <CardTitle
                  icon="fas fa-exclamation-triangle"
                  iconColor="text-primary-red"
                >
                  Emergency Light
                </CardTitle>
              </CardHeader>
              <div className="text-center">
                <div
                  className={`inline-block w-3 h-3 rounded-full mr-2 ${
                    emergencyStatus === "ON"
                      ? "bg-primary-green shadow-[0_0_10px] shadow-primary-green"
                      : emergencyStatus === "OFF"
                      ? "bg-primary-red shadow-[0_0_10px] shadow-primary-red"
                      : "bg-primary-yellow shadow-[0_0_10px] shadow-primary-yellow"
                  }`}
                ></div>
                <div className="text-4xl font-bold my-4">{emergencyStatus}</div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4">
                <button
                  onClick={() => publish(TOPICS.EMERGENCY, "ON")}
                  className="py-2 px-2 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all bg-gradient-to-br from-primary-green to-[#45B849] text-white hover:scale-105"
                >
                  ON
                </button>
                <button
                  onClick={() => publish(TOPICS.EMERGENCY, "OFF")}
                  className="py-2 px-2 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all bg-gradient-to-br from-primary-red to-[#E85D75] text-white hover:scale-105"
                >
                  OFF
                </button>
                <button
                  onClick={() => publish(TOPICS.EMERGENCY, "AUTO")}
                  className="py-2 px-2 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all bg-gradient-to-br from-primary-blue to-[#667eea] text-white hover:scale-105"
                >
                  AUTO
                </button>
              </div>
            </Card>

            {/* Voltage & Current Cards */}
            <Card>
              <CardHeader>
                <CardTitle icon="fas fa-bolt" iconColor="text-primary-green">
                  Main Power
                </CardTitle>
              </CardHeader>
              <div className="text-center py-4">
                <div className="text-4xl font-bold text-primary-green mb-4">
                  {voltage2.toFixed(2)} V
                </div>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center justify-center gap-2">
                    <i className="fas fa-plug-circle-bolt"></i>
                    <span>{current2.toFixed(2)} mA</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <i className="fas fa-fire"></i>
                    <span>{power2.toFixed(2)} mW</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle
                  icon="fas fa-battery-three-quarters"
                  iconColor="text-primary-blue"
                >
                  5V System
                </CardTitle>
              </CardHeader>
              <div className="text-center py-4">
                <div className="text-4xl font-bold text-primary-blue mb-4">
                  {voltage1.toFixed(2)} V
                </div>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center justify-center gap-2">
                    <i className="fas fa-bolt-lightning"></i>
                    <span>{current1.toFixed(2)} mA</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <i className="fas fa-fire"></i>
                    <span>{power1.toFixed(2)} mW</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-8">
            <Card>
              <CardHeader>
                <CardTitle
                  icon="fas fa-battery-three-quarters"
                  iconColor="text-primary-blue"
                >
                  5V System - Real-time
                </CardTitle>
              </CardHeader>
              <div className="h-[300px] relative">
                <Line
                  data={chartData1}
                  options={chartOptions}
                  plugins={[latestValuePlugin]}
                />
                <div className="absolute bottom-[-20px] right-2 bg-black/70 rounded-md px-2 py-1 text-xs font-semibold text-text-dark backdrop-blur-sm shadow-lg z-10">
                  <div className="text-[8px] opacity-80 mb-0.5">1-Min Avg</div>
                  <div className="text-[11px] font-bold">{avgVoltage1}</div>
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle icon="fas fa-plug" iconColor="text-primary-green">
                  Main Power - Real-time
                </CardTitle>
              </CardHeader>
              <div className="h-[300px] relative">
                <Line
                  data={chartData2}
                  options={chartOptions}
                  plugins={[latestValuePlugin]}
                />
                <div className="absolute bottom-[-20px] right-2 bg-black/70 rounded-md px-2 py-1 text-xs font-semibold text-text-dark backdrop-blur-sm shadow-lg z-10">
                  <div className="text-[8px] opacity-80 mb-0.5">1-Min Avg</div>
                  <div className="text-[11px] font-bold">{avgVoltage2}</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Command Log */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle icon="fas fa-terminal" iconColor="text-primary-green">
                Command Log
              </CardTitle>
              <button
                onClick={() => setCommandLogs([])}
                className="py-1.5 px-3 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all bg-gradient-to-br from-primary-red to-[#E85D75] text-white hover:scale-105"
              >
                Clear Log
              </button>
            </CardHeader>
            <div className="bg-[#1A1D2E] rounded-xl p-4 max-h-[300px] overflow-y-auto font-mono">
              {commandLogs.length === 0 ? (
                <div className="text-center opacity-50 py-8">
                  No commands yet
                </div>
              ) : (
                commandLogs.map((log, index) => (
                  <div
                    key={index}
                    className={`py-2 px-0 my-1.5 border-l-[3px] pl-3 rounded-md text-sm animate-slideIn ${
                      log.type === "error"
                        ? "border-primary-red bg-primary-red/10"
                        : log.type === "success"
                        ? "border-primary-green bg-primary-green/10"
                        : log.type === "warning"
                        ? "border-primary-yellow bg-primary-yellow/10"
                        : "border-primary-blue bg-primary-blue/10"
                    }`}
                  >
                    <span className="text-gray-500 mr-2">{log.timestamp}</span>
                    <span className="text-text-dark">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
