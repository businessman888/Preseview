import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";

createRoot(document.getElementById("root")!).render(<App />);
