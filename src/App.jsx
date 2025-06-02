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
                <div key={project.id} className="sidebar-item group">
                  <div className="sidebar-item-content">
                    <div className={`sidebar-item-color ${project.color}`} />
                    <span className="sidebar-item-text">{project.name}</span>
                    {!sidebarExpanded && (
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
                <div key={category.id} className="sidebar-item group">
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

      {/* Project Form Modal */}
      <AnimatePresence>
        {showProjectForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && resetForms()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-xl shadow-card p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100">
                  {editingItem ? 'Edit Project' : 'Add New Project'}
                </h2>
                <button
                  onClick={resetForms}
                  className="p-1 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5 text-surface-500" />
                </button>
              </div>

              <form onSubmit={submitProject} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={projectFormData.name}
                    onChange={(e) => setProjectFormData({ ...projectFormData, name: e.target.value })}
                    className="input-field"
                    placeholder="Enter project name..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Color Theme
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {availableColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setProjectFormData({ ...projectFormData, color })}
                        className={`w-full h-12 rounded-lg border-2 transition-all ${
                          projectFormData.color === color
                            ? 'border-surface-900 dark:border-surface-100 scale-105'
                            : 'border-surface-200 dark:border-surface-600 hover:border-surface-400'
                        }`}
                      >
                        <div className={`w-full h-full rounded-md ${color}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    {editingItem ? 'Update Project' : 'Create Project'}
                  </button>
                  <button type="button" onClick={resetForms} className="btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Form Modal */}
      <AnimatePresence>
        {showCategoryForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && resetForms()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-xl shadow-card p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100">
                  {editingItem ? 'Edit Category' : 'Add New Category'}
                </h2>
                <button
                  onClick={resetForms}
                  className="p-1 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5 text-surface-500" />
                </button>
              </div>

              <form onSubmit={submitCategory} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={categoryFormData.name}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                    className="input-field"
                    placeholder="Enter category name..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Color Theme
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {availableColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setCategoryFormData({ ...categoryFormData, color })}
                        className={`w-full h-12 rounded-lg border-2 transition-all ${
                          categoryFormData.color === color
                            ? 'border-surface-900 dark:border-surface-100 scale-105'
                            : 'border-surface-200 dark:border-surface-600 hover:border-surface-400'
                        }`}
                      >
                        <div className={`w-full h-full rounded-md ${color}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    {editingItem ? 'Update Category' : 'Create Category'}
                  </button>
                  <button type="button" onClick={resetForms} className="btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-xl shadow-card p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full">
                <ApperIcon name="AlertTriangle" className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              
              <h2 className="text-xl font-bold text-center text-surface-900 dark:text-surface-100 mb-2">
                Delete {deleteTarget.type === 'project' ? 'Project' : 'Category'}
              </h2>
              
              <p className="text-center text-surface-600 dark:text-surface-400 mb-6">
                Are you sure you want to delete "{deleteTarget.item.name}"? This action cannot be undone.
              </p>

              <div className="flex space-x-4">
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={cancelDelete}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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