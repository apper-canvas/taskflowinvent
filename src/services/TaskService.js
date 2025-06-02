// TaskService.js - Service for task37 table operations
class TaskService {
  constructor() {
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'task37'
    
    // Define fields for task37 table based on schema
    this.allFields = [
      'Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 
      'ModifiedOn', 'ModifiedBy', 'title', 'description', 'priority', 
      'due_date', 'status', 'created_at', 'updated_at'
    ]
    
    // Only updateable fields for create/update operations
    this.updateableFields = [
      'Name', 'Tags', 'Owner', 'title', 'description', 'priority', 
      'due_date', 'status', 'created_at', 'updated_at'
    ]
  }

  async fetchTasks(params = {}) {
    try {
      const queryParams = {
        fields: this.allFields,
        ...params
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, queryParams)
      
      if (!response || !response.data || response.data.length === 0) {
        return []
      }
      
      return response.data
    } catch (error) {
      console.error('Error fetching tasks:', error)
      throw new Error('Failed to fetch tasks. Please try again.')
    }
  }

  async getTaskById(taskId) {
    try {
      const params = {
        fields: this.allFields
      }
      
      const response = await this.apperClient.getRecordById(this.tableName, taskId, params)
      
      if (!response || !response.data) {
        return null
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching task with ID ${taskId}:`, error)
      throw new Error('Failed to fetch task. Please try again.')
    }
  }

  async createTask(taskData) {
    try {
      // Filter to only include updateable fields
      const filteredData = {}
      this.updateableFields.forEach(field => {
        if (taskData[field] !== undefined) {
          filteredData[field] = taskData[field]
        }
      })

      // Format dates properly
      if (filteredData.due_date) {
        // Ensure due_date is in YYYY-MM-DD format for Date field
        filteredData.due_date = filteredData.due_date
      }
      
      if (filteredData.created_at) {
        // Ensure created_at is in ISO format for DateTime field
        filteredData.created_at = new Date(filteredData.created_at).toISOString()
      } else {
        filteredData.created_at = new Date().toISOString()
      }
      
      if (filteredData.updated_at) {
        filteredData.updated_at = new Date(filteredData.updated_at).toISOString()
      } else {
        filteredData.updated_at = new Date().toISOString()
      }

      const params = {
        records: [filteredData]
      }
      
      const response = await this.apperClient.createRecord(this.tableName, params)
      
      if (response && response.success && response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        if (successfulRecords.length > 0) {
          return successfulRecords[0].data
        }
      }
      
      throw new Error('Failed to create task')
    } catch (error) {
      console.error('Error creating task:', error)
      throw new Error('Failed to create task. Please try again.')
    }
  }

  async updateTask(taskId, taskData) {
    try {
      // Filter to only include updateable fields plus Id
      const filteredData = { Id: taskId }
      this.updateableFields.forEach(field => {
        if (taskData[field] !== undefined) {
          filteredData[field] = taskData[field]
        }
      })

      // Format dates properly
      if (filteredData.due_date) {
        // Ensure due_date is in YYYY-MM-DD format for Date field
        filteredData.due_date = filteredData.due_date
      }
      
      if (filteredData.created_at) {
        filteredData.created_at = new Date(filteredData.created_at).toISOString()
      }
      
      if (filteredData.updated_at) {
        filteredData.updated_at = new Date(filteredData.updated_at).toISOString()
      } else {
        filteredData.updated_at = new Date().toISOString()
      }

      const params = {
        records: [filteredData]
      }
      
      const response = await this.apperClient.updateRecord(this.tableName, params)
      
      if (response && response.success && response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        if (successfulUpdates.length > 0) {
          return successfulUpdates[0].data
        }
      }
      
      throw new Error('Failed to update task')
    } catch (error) {
      console.error('Error updating task:', error)
      throw new Error('Failed to update task. Please try again.')
    }
  }

  async deleteTask(taskId) {
    try {
      const params = {
        RecordIds: [taskId]
      }
      
      const response = await this.apperClient.deleteRecord(this.tableName, params)
      
      if (response && response.success) {
        return true
      }
      
      throw new Error('Failed to delete task')
    } catch (error) {
      console.error('Error deleting task:', error)
      throw new Error('Failed to delete task. Please try again.')
    }
  }

  async searchTasks(searchTerm) {
    try {
      const params = {
        fields: this.allFields,
        where: [
          {
            fieldName: 'title',
            operator: 'Contains',
            values: [searchTerm]
          }
        ]
      }
      
      return await this.fetchTasks(params)
    } catch (error) {
      console.error('Error searching tasks:', error)
      throw new Error('Failed to search tasks. Please try again.')
    }
  }

  async getTasksByStatus(status) {
    try {
      const params = {
        fields: this.allFields,
        where: [
          {
            fieldName: 'status',
            operator: 'ExactMatch',
            values: [status]
          }
        ]
      }
      
      return await this.fetchTasks(params)
    } catch (error) {
      console.error('Error fetching tasks by status:', error)
      throw new Error('Failed to fetch tasks by status. Please try again.')
    }
  }

  async getTasksByPriority(priority) {
    try {
      const params = {
        fields: this.allFields,
        where: [
          {
            fieldName: 'priority',
            operator: 'ExactMatch',
            values: [priority]
          }
        ]
      }
      
      return await this.fetchTasks(params)
    } catch (error) {
      console.error('Error fetching tasks by priority:', error)
      throw new Error('Failed to fetch tasks by priority. Please try again.')
    }
  }
}

export default new TaskService()