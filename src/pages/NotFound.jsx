import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 text-center"
      >
        <div className="space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center"
          >
            <ApperIcon name="AlertCircle" className="w-12 h-12 text-white" />
          </motion.div>
          
          <h1 className="text-4xl font-bold text-surface-900 dark:text-surface-100">
            404
          </h1>
          
          <h2 className="text-xl font-semibold text-surface-600 dark:text-surface-400">
            Page Not Found
          </h2>
          
          <p className="text-surface-500 dark:text-surface-400 max-w-sm mx-auto">
            Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
          </p>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link
            to="/"
            className="inline-flex items-center space-x-2 btn-primary"
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4" />
            <span>Back to Tasks</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NotFound