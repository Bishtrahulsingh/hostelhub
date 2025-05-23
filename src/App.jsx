import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Screens
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import PropertyListScreen from './screens/PropertyListScreen';
import PropertyDetailScreen from './screens/PropertyDetailScreen';
import RoommateListScreen from './screens/RoommateListScreen';
import RoommateDetailScreen from './screens/RoommateDetailScreen';
import ProfileScreen from './screens/ProfileScreen';
import AddPropertyScreen from './screens/AddPropertyScreen';
import AddRoommateScreen from './screens/AddRoommateScreen';
import MyPropertiesScreen from './screens/MyPropertiesScreen';
import EditPropertyScreen from './screens/EditPropertyScreen';
import NotFoundScreen from './screens/NotFoundScreen';

// Context Providers
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/register" element={<RegisterScreen />} />
              <Route path="/properties" element={<PropertyListScreen />} />
              <Route path="/properties/:id" element={<PropertyDetailScreen />} />
              <Route path="/roommates" element={<RoommateListScreen />} />
              <Route path="/roommates/:id" element={<RoommateDetailScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/add-property" element={<AddPropertyScreen />} />
              <Route path="/add-roommate" element={<AddRoommateScreen />} />
              <Route path="/my-properties" element={<MyPropertiesScreen />} />
              <Route path="/edit-property/:id" element={<EditPropertyScreen />} />
              <Route path="*" element={<NotFoundScreen />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
      <Toaster position="top-center" />
    </AuthProvider>
  );
}

export default App;