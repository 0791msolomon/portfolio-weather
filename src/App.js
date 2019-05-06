import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Weather from "./components/Weather";
function App() {
  return (
    <div
      style={{
        backgroundColor: "black",
        minHeight: "100vh",
        paddingBottom: "10%"
      }}
    >
      <Weather />
    </div>
  );
}

export default App;
