import { useState } from "react";
import { MainApp } from "./components/main-app";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return null; // Could show login/auth screen here
  }

  return <MainApp onLogout={handleLogout} />;
}