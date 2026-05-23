import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));

// React starts here and renders the main App component into public/index.html.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
