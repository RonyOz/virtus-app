import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { WellnessProvider } from './contexts/WellnessContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Chatbot from './pages/Chatbot'
import Dashboard from './pages/Dashboard'
import Calendar from './pages/Calendar'
import Community from './pages/Community'
import './App.css'

function App() {
  return (
    <WellnessProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/community" element={<Community />} />
          </Routes>
        </Layout>
      </Router>
    </WellnessProvider>
  )
}

export default App