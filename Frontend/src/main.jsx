import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/UserContext.jsx";
import { StickyNoteProvider } from "./context/StickyNoteContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <StickyNoteProvider>
          <App />
        </StickyNoteProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
);
