import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Home from './pages/Home'
import Calendar from './pages/Calendar'
import Statistics from './pages/Statistics'
import NotFound from './pages/NotFound'
import ApperIcon from './components/ApperIcon'
function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const toggleSidebar = () => {
    if (window.innerWidth <= 768) {
      setSidebarMobileOpen(!sidebarMobileOpen)
    } else {
      setSidebarExpanded(!sidebarExpanded)
    }
  }

  // Sample projects and categories data
  const projects = [
    { id: 1, name: 'Website Redesign', color: 'project-blue', taskCount: 8 },
    { id: 2, name: 'Mobile App', color: 'project-green', taskCount: 12 },
    { id: 3, name: 'Marketing Campaign', color: 'project-purple', taskCount: 5 }
  ]

  const categories = [
    { id: 1, name: 'Development', color: 'project-indigo', taskCount: 15 },
    { id: 2, name: 'Design', color: 'project-pink', taskCount: 7 },
    { id: 3, name: 'Research', color: 'project-teal', taskCount: 4 }
  ]

  return (
    <div className={`min-h-screen bg-gradient-to-br from-surface-50 via-primary/5 to-secondary/5 dark:from-surface-900 dark:via-surface-800 dark:to-surface-900 transition-colors duration-300`}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl border-b border-surface-200 dark:border-surface-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckSquare" className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                TaskFlow
</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors md:hidden"
              >
                <ApperIcon
                  name="Menu" 
                  className="w-5 h-5 text-surface-600 dark:text-surface-300" 
                />
              </button>
              
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
              >
                <ApperIcon 
                  name={darkMode ? "Sun" : "Moon"} 
                  className="w-5 h-5 text-surface-600 dark:text-surface-300" 
                />
              </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Backdrop */}
      {sidebarMobileOpen && (
        <div 
          className="sidebar-backdrop md:hidden"
          onClick={() => setSidebarMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarExpanded ? 'expanded' : 'collapsed'} ${sidebarMobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">
            {sidebarExpanded ? 'Organization' : ''}
          </h2>
          <button
            onClick={toggleSidebar}
            className="sidebar-toggle hidden md:block"
          >
            <ApperIcon 
              name={sidebarExpanded ? "ChevronLeft" : "ChevronRight"}
              className="w-4 h-4 text-surface-600 dark:text-surface-400"
            />
          </button>
        </div>

        <div className="sidebar-content">
          {/* Projects Section */}
          <div className="sidebar-section">
            <div className="sidebar-section-header">
              <h3 className="sidebar-section-title">Projects</h3>
              {sidebarExpanded && (
                <button className="sidebar-add-btn">
                  <ApperIcon name="Plus" className="w-4 h-4 text-surface-500 dark:text-surface-400" />
                </button>
              )}
            </div>
            
            <div className="sidebar-list">
              {projects.map((project) => (
                <div key={project.id} className="sidebar-item">
                  <div className="sidebar-item-content">
                    <div className={`sidebar-item-color ${project.color}`} />
                    <span className="sidebar-item-text">{project.name}</span>
                    {sidebarExpanded && (
                      <div className="sidebar-tooltip">{project.name}</div>
                    )}
                  </div>
                  {sidebarExpanded && (
                    <>
                      <span className="sidebar-item-count">{project.taskCount}</span>
                      <div className="sidebar-item-actions">
                        <button className="sidebar-item-action">
                          <ApperIcon name="Edit2" className="w-3 h-3 text-surface-400" />
                        </button>
                        <button className="sidebar-item-action">
                          <ApperIcon name="Trash2" className="w-3 h-3 text-surface-400" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Categories Section */}
          <div className="sidebar-section">
            <div className="sidebar-section-header">
              <h3 className="sidebar-section-title">Categories</h3>
              {sidebarExpanded && (
                <button className="sidebar-add-btn">
                  <ApperIcon name="Plus" className="w-4 h-4 text-surface-500 dark:text-surface-400" />
                </button>
              )}
            </div>
            
            <div className="sidebar-list">
              {categories.map((category) => (
                <div key={category.id} className="sidebar-item">
                  <div className="sidebar-item-content">
                    <div className={`sidebar-item-color ${category.color}`} />
                    <span className="sidebar-item-text">{category.name}</span>
                    {!sidebarExpanded && (
                      <div className="sidebar-tooltip">{category.name}</div>
                    )}
                  </div>
                  {sidebarExpanded && (
                    <>
                      <span className="sidebar-item-count">{category.taskCount}</span>
                      <div className="sidebar-item-actions">
                        <button className="sidebar-item-action">
                          <ApperIcon name="Edit2" className="w-3 h-3 text-surface-400" />
                        </button>
                        <button className="sidebar-item-action">
                          <ApperIcon name="Trash2" className="w-3 h-3 text-surface-400" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`main-content ${sidebarExpanded ? 'with-sidebar' : 'with-sidebar-collapsed'}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
        className="mt-16"
        toastClassName="bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100"
      />
    </div>
  )
}

export default App