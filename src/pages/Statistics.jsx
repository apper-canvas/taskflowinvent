import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js'
import { Pie, Bar, Line } from 'react-chartjs-2'
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isWithinInterval } from 'date-fns'
import ApperIcon from '../components/ApperIcon'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
)

const Statistics = () => {
  const [tasks, setTasks] = useState([])
  const [timeRange, setTimeRange] = useState('week') // week, month, all

  useEffect(() => {
    const savedTasks = localStorage.getItem('taskflow-tasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#6366f1',
        borderWidth: 1,
      },
    },
  }

  const pieChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: {
        position: 'right',
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
    },
  }

  // Calculate statistics
  const statistics = useMemo(() => {
    const now = new Date()
    let filteredTasks = tasks

    if (timeRange === 'week') {
      const weekStart = startOfWeek(now)
      const weekEnd = endOfWeek(now)
      filteredTasks = tasks.filter(task => {
        const taskDate = new Date(task.createdAt)
        return isWithinInterval(taskDate, { start: weekStart, end: weekEnd })
      })
    } else if (timeRange === 'month') {
      const monthStart = subDays(now, 30)
      filteredTasks = tasks.filter(task => {
        const taskDate = new Date(task.createdAt)
        return taskDate >= monthStart
      })
    }

    const totalTasks = filteredTasks.length
    const completedTasks = filteredTasks.filter(task => task.status === 'completed').length
    const pendingTasks = filteredTasks.filter(task => task.status === 'pending').length
    const inProgressTasks = filteredTasks.filter(task => task.status === 'in-progress').length
    const overdueTasks = filteredTasks.filter(task => 
      task.dueDate && 
      new Date(task.dueDate) < now && 
      task.status !== 'completed'
    ).length

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    // Priority distribution
    const priorities = {
      low: filteredTasks.filter(task => task.priority === 'low').length,
      medium: filteredTasks.filter(task => task.priority === 'medium').length,
      high: filteredTasks.filter(task => task.priority === 'high').length,
      urgent: filteredTasks.filter(task => task.priority === 'urgent').length,
    }

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      overdueTasks,
      completionRate,
      priorities,
    }
  }, [tasks, timeRange])

  // Priority distribution chart data
  const priorityChartData = {
    labels: ['Low', 'Medium', 'High', 'Urgent'],
    datasets: [
      {
        data: [
          statistics.priorities.low,
          statistics.priorities.medium,
          statistics.priorities.high,
          statistics.priorities.urgent,
        ],
        backgroundColor: [
          '#10b981', // green
          '#f59e0b', // yellow
          '#ef4444', // red
          '#8b5cf6', // purple
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  }

  // Status distribution chart data
  const statusChartData = {
    labels: ['Completed', 'In Progress', 'Pending'],
    datasets: [
      {
        data: [statistics.completedTasks, statistics.inProgressTasks, statistics.pendingTasks],
        backgroundColor: ['#10b981', '#3b82f6', '#f59e0b'],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  }

  // Weekly completion trend
  const weeklyTrendData = useMemo(() => {
    const days = eachDayOfInterval({
      start: startOfWeek(new Date()),
      end: endOfWeek(new Date()),
    })

    const dailyCompletions = days.map(day => {
      return tasks.filter(task => {
        if (!task.updatedAt || task.status !== 'completed') return false
        const taskDate = new Date(task.updatedAt)
        return format(taskDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
      }).length
    })

    return {
      labels: days.map(day => format(day, 'EEE')),
      datasets: [
        {
          label: 'Tasks Completed',
          data: dailyCompletions,
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    }
  }, [tasks])

  // Priority completion rates
  const priorityCompletionData = useMemo(() => {
    const priorities = ['low', 'medium', 'high', 'urgent']
    const completionRates = priorities.map(priority => {
      const priorityTasks = tasks.filter(task => task.priority === priority)
      const completed = priorityTasks.filter(task => task.status === 'completed').length
      return priorityTasks.length > 0 ? Math.round((completed / priorityTasks.length) * 100) : 0
    })

    return {
      labels: ['Low', 'Medium', 'High', 'Urgent'],
      datasets: [
        {
          label: 'Completion Rate (%)',
          data: completionRates,
          backgroundColor: [
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(139, 92, 246, 0.8)',
          ],
          borderColor: [
            '#10b981',
            '#f59e0b',
            '#ef4444',
            '#8b5cf6',
          ],
          borderWidth: 2,
        },
      ],
    }
  }, [tasks])

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-primary/5 to-secondary/5 dark:from-surface-900 dark:via-surface-800 dark:to-surface-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-surface-900 dark:text-surface-100 mb-2">
            Task Statistics
          </h1>
          <p className="text-surface-600 dark:text-surface-400">
            Analyze your productivity and task management patterns
          </p>
        </motion.div>

        {/* Time Range Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="time-range-selector max-w-md">
            <button
              onClick={() => setTimeRange('week')}
              className={`time-range-btn ${timeRange === 'week' ? 'active' : 'inactive'}`}
            >
              This Week
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`time-range-btn ${timeRange === 'month' ? 'active' : 'inactive'}`}
            >
              Last 30 Days
            </button>
            <button
              onClick={() => setTimeRange('all')}
              className={`time-range-btn ${timeRange === 'all' ? 'active' : 'inactive'}`}
            >
              All Time
            </button>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 mb-8"
        >
          <div className="metric-card info">
            <div className="flex items-center justify-between">
              <div>
                <div className="metric-value">{statistics.totalTasks}</div>
                <div className="metric-label">Total Tasks</div>
              </div>
              <ApperIcon name="FileText" className="metric-icon" />
            </div>
          </div>

          <div className="metric-card success">
            <div className="flex items-center justify-between">
              <div>
                <div className="metric-value">{statistics.completedTasks}</div>
                <div className="metric-label">Completed</div>
              </div>
              <ApperIcon name="CheckCircle" className="metric-icon" />
            </div>
          </div>

          <div className="metric-card warning">
            <div className="flex items-center justify-between">
              <div>
                <div className="metric-value">{statistics.pendingTasks}</div>
                <div className="metric-label">Pending</div>
              </div>
              <ApperIcon name="Clock" className="metric-icon" />
            </div>
          </div>

          <div className="metric-card danger">
            <div className="flex items-center justify-between">
              <div>
                <div className="metric-value">{statistics.overdueTasks}</div>
                <div className="metric-label">Overdue</div>
              </div>
              <ApperIcon name="AlertTriangle" className="metric-icon" />
            </div>
          </div>

          <div className="metric-card primary">
            <div className="flex items-center justify-between">
              <div>
                <div className="metric-value">{statistics.completionRate}%</div>
                <div className="metric-label">Completion Rate</div>
              </div>
              <ApperIcon name="TrendingUp" className="metric-icon" />
            </div>
          </div>
        </motion.div>

        {/* Charts Grid */}
        <div className="stats-grid">
          {/* Priority Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="chart-wrapper"
          >
            <div className="chart-header">
              <div>
                <h3 className="chart-title">Priority Distribution</h3>
                <p className="chart-subtitle">Tasks by priority level</p>
              </div>
              <ApperIcon name="PieChart" className="stats-card-icon" />
            </div>
            <div className="chart-container h-64">
              <Pie data={priorityChartData} options={pieChartOptions} />
            </div>
          </motion.div>

          {/* Status Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="chart-wrapper"
          >
            <div className="chart-header">
              <div>
                <h3 className="chart-title">Status Overview</h3>
                <p className="chart-subtitle">Current task status</p>
              </div>
              <ApperIcon name="BarChart3" className="stats-card-icon" />
            </div>
            <div className="chart-container h-64">
              <Pie data={statusChartData} options={pieChartOptions} />
            </div>
          </motion.div>

          {/* Weekly Completion Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="chart-wrapper lg:col-span-2 xl:col-span-1"
          >
            <div className="chart-header">
              <div>
                <h3 className="chart-title">Weekly Completion Trend</h3>
                <p className="chart-subtitle">Tasks completed per day</p>
              </div>
              <ApperIcon name="TrendingUp" className="stats-card-icon" />
            </div>
            <div className="chart-container h-64">
              <Line data={weeklyTrendData} options={chartOptions} />
            </div>
          </motion.div>
        </div>

        {/* Priority Completion Rates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="chart-wrapper mt-6"
        >
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Priority Completion Rates</h3>
              <p className="chart-subtitle">Completion percentage by priority</p>
            </div>
            <ApperIcon name="BarChart" className="stats-card-icon" />
          </div>
          <div className="chart-container h-80">
            <Bar data={priorityCompletionData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Analytics Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="analytics-summary mt-8"
        >
          <h3 className="analytics-summary-title">Performance Insights</h3>
          <div className="analytics-stats-grid">
            <div className="analytics-stat">
              <div className="analytics-stat-value">
                {statistics.totalTasks > 0 ? Math.round((statistics.completedTasks / statistics.totalTasks) * 100) : 0}%
              </div>
              <div className="analytics-stat-label">Overall Progress</div>
            </div>
            <div className="analytics-stat">
              <div className="analytics-stat-value">
                {Math.max(...Object.values(statistics.priorities)) > 0 
                  ? Object.keys(statistics.priorities).find(key => 
                      statistics.priorities[key] === Math.max(...Object.values(statistics.priorities))
                    ).charAt(0).toUpperCase() + Object.keys(statistics.priorities).find(key => 
                      statistics.priorities[key] === Math.max(...Object.values(statistics.priorities))
                    ).slice(1)
                  : 'N/A'
                }
              </div>
              <div className="analytics-stat-label">Most Common Priority</div>
            </div>
            <div className="analytics-stat">
              <div className="analytics-stat-value">
                {statistics.overdueTasks === 0 ? '✓' : statistics.overdueTasks}
              </div>
              <div className="analytics-stat-label">
                {statistics.overdueTasks === 0 ? 'No Overdue Tasks' : 'Overdue Tasks'}
              </div>
            </div>
            <div className="analytics-stat">
              <div className="analytics-stat-value">
                {statistics.inProgressTasks}
              </div>
              <div className="analytics-stat-label">Active Tasks</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Statistics