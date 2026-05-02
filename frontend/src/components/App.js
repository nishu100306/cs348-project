import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import TasksPage from '../pages/TasksPage';
import ReportsPage from '../pages/ReportsPage';
import '../styles/App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<TasksPage />} />
                        <Route path="/reports" element={<ReportsPage />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
