import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext";

export default function App({ children }) {
  return (
    <ThemeProvider>
      <Toaster position="top-right" />

      {/* Children will be the Router Layout (RootLayout) */}
      {children}
    </ThemeProvider>
  );
}


