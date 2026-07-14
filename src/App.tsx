import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import LoginPage from './pages/LoginPage';

const App = () => {
  return (
    <Router>
      <Routes>
        
        <Route 
          element={
            <div className="flex flex-col min-h-screen bg-[#f5f5f5]">

              <Navbar />
              
              <main className="flex-grow flex flex-col gap-6 w-[90%] mx-auto my-8">
                <Outlet /> 
              </main>
              
              <Footer />
            </div>
          }
        >

          <Route
            path="/"
            element={
              <div className="flex flex-col gap-8 w-full">

              </div>
            }
          />

          <Route path="/login" element={<LoginPage />} />
        </Route>

      </Routes>
    </Router>
  );
};

export default App;