// Registro único y global de todos los componentes de Chart.js
// Evita fallos por tree-shaking en producción (Vercel / Rollup / Vite)
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Title,
  Tooltip,
  Legend,
  BarController,
  LineController,
  RadarController,
  PieController,
  DoughnutController
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Title,
  Tooltip,
  Legend,
  BarController,
  LineController,
  RadarController,
  PieController,
  DoughnutController
);

export default ChartJS;
