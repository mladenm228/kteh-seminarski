import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { PlantDetail } from './pages/PlantDetail';
import { Cart } from './pages/Cart';
import { Favorites } from './pages/Favorites';
import { PlantingPlan } from './pages/PlantingPlan';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { About } from './pages/About';
import { NotFound } from './pages/NotFound';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <CartProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="katalog" element={<Catalog />} />
                  <Route path="biljka/:id" element={<PlantDetail />} />
                  <Route path="korpa" element={<Cart />} />
                  <Route
                    path="omiljene"
                    element={
                      <ProtectedRoute>
                        <Favorites />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="plan-sadnje"
                    element={
                      <ProtectedRoute>
                        <PlantingPlan />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="kontakt" element={<Contact />} />
                  <Route path="prijava" element={<Login />} />
                  <Route path="o-nama" element={<About />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
