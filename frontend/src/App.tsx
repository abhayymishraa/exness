import { Route } from "react-router";
import { BrowserRouter, Routes } from "react-router";
import Signin from "./pages/Singin";
import Signup from "./pages/Signup";
import Trading from "./pages/Trading";
import Navbar from "./components/Navbar";
import "aos/dist/aos.css";
import Landing from "./pages/Homepage";

function App() {
  return (
    <div className="min-h-screen bg-[#0c1418] text-white">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/trading"
            element={
              <>
                <Navbar />
                <Trading />
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
