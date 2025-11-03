import "./styles/App.css";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <>
          <AppRoutes />
        </>
      </AuthProvider>
    </div>
  );
}

export default App;
