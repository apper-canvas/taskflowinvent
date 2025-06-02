import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import TaskService from '../services/TaskService'
import ProjectService from '../services/ProjectService'
import CategoryService from '../services/CategoryService'

const MainFeature = () => {
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    setLoading(true)
    try {
      const [tasksData, projectsData, categoriesData] = await Promise.all([
        TaskService.fetchTasks(),
        ProjectService.fetchProjects(),
        CategoryService.fetchCategories()
      ])
      
      setTasks(tasksData || [])
      setProjects(projectsData || [])
      setCategories(categoriesData || [])
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = (task?.title || task?.Name || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = activeFilter === 'all' || task?.status === activeFilter
    return matchesSearch && matchesFilter
  })

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'CheckCircle'
      case 'in-progress': return 'PlayCircle'
      default: return 'Clock'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20'
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/20'
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
      default: return 'text-green-600 bg-green-100 dark:bg-green-900/20'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl lg:text-4xl font-bold text-surface-900 dark:text-surface-100 mb-4">
          Welcome to TaskFlow
        </h1>
        <p className="text-lg text-surface-600 dark:text-surface-400">
          Organize your tasks, track your progress, and boost your productivity.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8"
      >
        <div className="metric-card info">
          <div className="flex items-center justify-between">
            <div>
              <div className="metric-value">{taskStats.total}</div>
              <div className="metric-label">Total Tasks</div>
            </div>
            <ApperIcon name="FileText" className="metric-icon" />
          </div>
        </div>

        <div className="metric-card success">
          <div className="flex items-center justify-between">
            <div>
              <div className="metric-value">{taskStats.completed}</div>
              <div className="metric-label">Completed</div>
            </div>
            <ApperIcon name="CheckCircle" className="metric-icon" />
          </div>
        </div>

        <div className="metric-card primary">
          <div className="flex items-center justify-between">
            <div>
              <div className="metric-value">{taskStats.inProgress}</div>
              <div className="metric-label">In Progress</div>
            </div>
            <ApperIcon name="PlayCircle" className="metric-icon" />
          </div>
        </div>

        <div className="metric-card warning">
          <div className="flex items-center justify-between">
            <div>
              <div className="metric-value">{taskStats.pending}</div>
              <div className="metric-label">Pending</div>
            </div>
            <ApperIcon name="Clock" className="metric-icon" />
          </div>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-surface-800 rounded-xl shadow-card p-6 mb-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'in-progress', 'completed'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`filter-chip ${activeFilter === filter ? 'filter-chip-active' : ''}`}
              >
                {filter === 'all' ? 'All Tasks' : filter.charAt(0).toUpperCase() + filter.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 w-full lg:w-80"
            />
            <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
          </div>
        </div>
      </motion.div>

      {/* Tasks List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-surface-800 rounded-xl shadow-card"
      >
        <div className="p-6 border-b border-surface-200 dark:border-surface-700">
          <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100">Recent Tasks</h2>
          <p className="text-surface-600 dark:text-surface-400 mt-1">
            Showing {filteredTasks.length} of {tasks.length} tasks
          </p>
        </div>

        <div className="divide-y divide-surface-200 dark:divide-surface-700">
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center">
              <ApperIcon name="Inbox" className="w-12 h-12 text-surface-400 mx-auto mb-4" />
              <p className="text-surface-600 dark:text-surface-400">
                {searchTerm ? 'No tasks found matching your search.' : 'No tasks found.'}
              </p>
            </div>
          ) : (
            filteredTasks.slice(0, 10).map((task) => (
              <div key={task?.Id || task?.id} className="p-6 hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <ApperIcon 
                        name={getStatusIcon(task?.status)} 
                        className={`w-5 h-5 ${
                          task?.status === 'completed' ? 'text-green-500' :
                          task?.status === 'in-progress' ? 'text-blue-500' : 'text-yellow-500'
                        }`}
                      />
                      <h3 className="text-lg font-medium text-surface-900 dark:text-surface-100 truncate">
                        {task?.title || task?.Name}
                      </h3>
                      {task?.priority && (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      )}
                    </div>
                    
                    {task?.description && (
                      <p className="text-surface-600 dark:text-surface-400 mb-3 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-4 text-sm text-surface-500 dark:text-surface-400">
                      {task?.due_date && (
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="Calendar" className="w-4 h-4" />
                          <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                        </div>
                      )}
                      {task?.created_at && (
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="Clock" className="w-4 h-4" />
                          <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {filteredTasks.length > 10 && (
          <div className="p-6 border-t border-surface-200 dark:border-surface-700 text-center">
            <p className="text-surface-600 dark:text-surface-400">
              Showing 10 of {filteredTasks.length} tasks. Visit the Calendar page to see all tasks.
            </p>
          </div>
        )}
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8"
      >
        <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card p-6">
          <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
            Projects ({projects.length})
          </h3>
          <div className="space-y-3">
            {projects.slice(0, 5).map((project) => (
              <div key={project?.Id || project?.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${project?.color || 'bg-primary'}`} />
                  <span className="text-surface-700 dark:text-surface-300">
                    {project?.Name || project?.name}
                  </span>
                </div>
                <span className="text-sm text-surface-500 dark:text-surface-400">
                  {project?.task_count || project?.taskCount || 0} tasks
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card p-6">
          <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
            Categories ({categories.length})
          </h3>
          <div className="space-y-3">
            {categories.slice(0, 5).map((category) => (
              <div key={category?.Id || category?.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${category?.color || 'bg-secondary'}`} />
                  <span className="text-surface-700 dark:text-surface-300">
                    {category?.Name || category?.name}
                  </span>
                </div>
                <span className="text-sm text-surface-500 dark:text-surface-400">
                  {category?.task_count || category?.taskCount || 0} tasks
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default MainFeature