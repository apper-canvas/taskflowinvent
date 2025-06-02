import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ToastContainer, toast } from 'react-toastify'
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
  
  // State for projects and categories
  const [projects, setProjects] = useState([])
  const [categories, setCategories] = useState([])
  
  // Form state management
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  
  // Form data
  const [projectFormData, setProjectFormData] = useState({ name: '', color: 'project-blue' })
  const [categoryFormData, setCategoryFormData] = useState({ name: '', color: 'project-indigo' })
  
  // Available colors for projects and categories
  const availableColors = [
    'project-blue', 'project-green', 'project-purple', 'project-indigo',
    'project-pink', 'project-teal', 'project-orange', 'project-red'
  ]

  // Load data from localStorage on mount
  useEffect(() => {
    const savedProjects = localStorage.getItem('taskflow-projects')
    const savedCategories = localStorage.getItem('taskflow-categories')
    
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects))
    } else {
      // Default data if nothing in localStorage
      const defaultProjects = [
        { id: 1, name: 'Website Redesign', color: 'project-blue', taskCount: 8 },
        { id: 2, name: 'Mobile App', color: 'project-green', taskCount: 12 },
        { id: 3, name: 'Marketing Campaign', color: 'project-purple', taskCount: 5 }
      ]
      setProjects(defaultProjects)
      localStorage.setItem('taskflow-projects', JSON.stringify(defaultProjects))
    }
    
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories))
    } else {
      // Default data if nothing in localStorage
      const defaultCategories = [
        { id: 1, name: 'Development', color: 'project-indigo', taskCount: 15 },
        { id: 2, name: 'Design', color: 'project-pink', taskCount: 7 },
        { id: 3, name: 'Research', color: 'project-teal', taskCount: 4 }
      ]
      setCategories(defaultCategories)
      localStorage.setItem('taskflow-categories', JSON.stringify(defaultCategories))
    }
  }, [])

  // Save projects to localStorage
  const saveProjects = (newProjects) => {
    setProjects(newProjects)
    localStorage.setItem('taskflow-projects', JSON.stringify(newProjects))
  }

  // Save categories to localStorage
  const saveCategories = (newCategories) => {
    setCategories(newCategories)
    localStorage.setItem('taskflow-categories', JSON.stringify(newCategories))
  }

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

  // Form handling functions
  const openProjectForm = (project = null) => {
    setEditingItem(project)
    setProjectFormData(project ? { name: project.name, color: project.color } : { name: '', color: 'project-blue' })
    setShowProjectForm(true)
  }

  const openCategoryForm = (category = null) => {
    setEditingItem(category)
    setCategoryFormData(category ? { name: category.name, color: category.color } : { name: '', color: 'project-indigo' })
    setShowCategoryForm(true)
  }

  const resetForms = () => {
    setShowProjectForm(false)
    setShowCategoryForm(false)
    setShowDeleteConfirm(false)
    setEditingItem(null)
    setDeleteTarget(null)
    setProjectFormData({ name: '', color: 'project-blue' })
    setCategoryFormData({ name: '', color: 'project-indigo' })
  }

  const submitProject = (e) => {
    e.preventDefault()
    if (!projectFormData.name.trim()) {
      toast.error('Project name is required')
      return
    }

    try {
      if (editingItem) {
        // Update existing project
        const updatedProjects = projects.map(p => 
          p.id === editingItem.id 
            ? { ...p, name: projectFormData.name.trim(), color: projectFormData.color }
            : p
        )
        saveProjects(updatedProjects)
        toast.success('Project updated successfully!')
      } else {
        // Create new project
        const newProject = {
          id: Date.now(),
          name: projectFormData.name.trim(),
          color: projectFormData.color,
          taskCount: 0
        }
        saveProjects([...projects, newProject])
        toast.success('Project created successfully!')
      }
      resetForms()
    } catch (error) {
      toast.error('Failed to save project. Please try again.')
    }
  }

  const submitCategory = (e) => {
    e.preventDefault()
    if (!categoryFormData.name.trim()) {
      toast.error('Category name is required')
      return
    }

    try {
      if (editingItem) {
        // Update existing category
        const updatedCategories = categories.map(c => 
          c.id === editingItem.id 
            ? { ...c, name: categoryFormData.name.trim(), color: categoryFormData.color }
            : c
        )
        saveCategories(updatedCategories)
        toast.success('Category updated successfully!')
      } else {
        // Create new category
        const newCategory = {
          id: Date.now(),
          name: categoryFormData.name.trim(),
          color: categoryFormData.color,
          taskCount: 0
        }
        saveCategories([...categories, newCategory])
        toast.success('Category created successfully!')
      }
      resetForms()
    } catch (error) {
      toast.error('Failed to save category. Please try again.')
    }
  }

  const handleDelete = (item, type) => {
    setDeleteTarget({ item, type })
    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    if (!deleteTarget) return

    try {
      if (deleteTarget.type === 'project') {
        const updatedProjects = projects.filter(p => p.id !== deleteTarget.item.id)
        saveProjects(updatedProjects)
        toast.success('Project deleted successfully!')
      } else {
        const updatedCategories = categories.filter(c => c.id !== deleteTarget.item.id)
        saveCategories(updatedCategories)
        toast.success('Category deleted successfully!')
      }
      resetForms()
    } catch (error) {
      toast.error('Failed to delete item. Please try again.')
    }
  }

  const cancelDelete = () => {
    setShowDeleteConfirm(false)
    setDeleteTarget(null)
  }

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
<button className="sidebar-add-btn" onClick={() => openProjectForm()}>
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
<button 
                          className="sidebar-item-action"
                          onClick={() => openProjectForm(project)}
                        >
                          <ApperIcon name="Edit2" className="w-3 h-3 text-surface-400" />
                        </button>
                        <button 
                          className="sidebar-item-action"
                          onClick={() => handleDelete(project, 'project')}
                        >
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
<button className="sidebar-add-btn" onClick={() => openCategoryForm()}>
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
<button 
                          className="sidebar-item-action"
                          onClick={() => openCategoryForm(category)}
                        >
                          <ApperIcon name="Edit2" className="w-3 h-3 text-surface-400" />
                        </button>
                        <button 
                          className="sidebar-item-action"
                          onClick={() => handleDelete(category, 'category')}
                        >
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