import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="text-2xl"><img src="/logo.png" alt="" className="h-10 w-10" /></div>
              <span className="text-xl font-bold text-primary-500">E-caca</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                isActive('/') 
                  ? ' border-b-4 border-b-primary-500 text-primary-700' 
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-100'
              }`}
            >
              Accueil
            </Link>
            
            <Link
              to="/add"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                isActive('/add') 
                  ? 'border-b-4 border-b-primary-500 text-primary-700' 
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-100'
              }`}
            >
              Ajouter
            </Link>
            
            <Link
              to="/history"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                isActive('/history') 
                  ? 'border-b-4 border-b-primary-500 text-primary-700' 
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-100'
              }`}
            >
              Historique
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar