import { Route, Routes } from "react-router-dom";
import withAuth from "./Component/com/RequiredAuth";
import Login from "./Component/Login/Login";
import Home from "./Component/Home/Home";
import Invoice from "./Component/Home/Invoice/Invoice";
import InvoiceCase2 from "./Component/Home/InoviceCase2/InvoiceCase2";

function App() {
  const ProtectedComponent = withAuth(Home);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/home"
        element={<ProtectedComponent element={<Home />} path="/home" />}
      />
      <Route path="home/:id" element={<Invoice />} />
      <Route path="home/invoice" element={<InvoiceCase2 />} />
    </Routes>
  );
}

export default App;