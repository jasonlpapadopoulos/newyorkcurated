import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout';
import Home from './pages/Home';
import WhatAreYouLookingFor from './pages/WhatAreYouLookingFor';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/what-are-you-looking-for" element={<WhatAreYouLookingFor />} />
          </Route>
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;