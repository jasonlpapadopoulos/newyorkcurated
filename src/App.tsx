import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout';
import Home from './pages/Home';
import WhatAreYouLookingFor from './pages/WhatAreYouLookingFor';
import Neighborhoods from './pages/Neighborhoods';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/what-are-you-looking-for" element={<WhatAreYouLookingFor />} />
            <Route path="/neighborhoods" element={<Neighborhoods />} />
            {/* Add these routes to handle the old URLs */}
            <Route path="/neighborhoods.html" element={<Neighborhoods />} />
            <Route path="/what-are-you-looking-for.html" element={<WhatAreYouLookingFor />} />
          </Route>
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;