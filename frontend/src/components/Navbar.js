import React from 'react';
import { NavLink } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-brand">Task Manager</div>
            <div className="navbar-links">
                <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    Tasks
                </NavLink>
                <NavLink to="/reports" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    Reports
                </NavLink>
            </div>
        </nav>
    );
}

export default Navbar;
