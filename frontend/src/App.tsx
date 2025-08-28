import { Route } from "react-router";
import { BrowserRouter, Routes } from "react-router";
import Homepage from "./pages/Homepage";
import Signin from "./pages/Singin";
import Signup from "./pages/Signup";
import Trading from "./pages/Trading";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/trading" element={<Trading />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
