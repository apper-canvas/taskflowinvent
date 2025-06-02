// ProjectService.js - Service for project11 table operations
class ProjectService {
  constructor() {
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'project11'
    
    // Define fields for project11 table based on schema
    this.allFields = [
      'Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 
      'ModifiedOn', 'ModifiedBy', 'color', 'task_count'
    ]
    
    // Only updateable fields for create/update operations
    this.updateableFields = ['Name', 'Tags', 'Owner', 'color', 'task_count']
  }

  async fetchProjects(params = {}) {
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
      console.error('Error fetching projects:', error)
      throw new Error('Failed to fetch projects. Please try again.')
    }
  }

  async getProjectById(projectId) {
    try {
      const params = {
        fields: this.allFields
      }
      
      const response = await this.apperClient.getRecordById(this.tableName, projectId, params)
      
      if (!response || !response.data) {
        return null
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching project with ID ${projectId}:`, error)
      throw new Error('Failed to fetch project. Please try again.')
    }
  }

  async createProject(projectData) {
    try {
      // Filter to only include updateable fields
      const filteredData = {}
      this.updateableFields.forEach(field => {
        if (projectData[field] !== undefined) {
          filteredData[field] = projectData[field]
        }
      })

      // Ensure required fields have default values
      if (!filteredData.task_count) {
        filteredData.task_count = 0
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
      
      throw new Error('Failed to create project')
    } catch (error) {
      console.error('Error creating project:', error)
      throw new Error('Failed to create project. Please try again.')
    }
  }

  async updateProject(projectId, projectData) {
    try {
      // Filter to only include updateable fields plus Id
      const filteredData = { Id: projectId }
      this.updateableFields.forEach(field => {
        if (projectData[field] !== undefined) {
          filteredData[field] = projectData[field]
        }
      })

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
      
      throw new Error('Failed to update project')
    } catch (error) {
      console.error('Error updating project:', error)
      throw new Error('Failed to update project. Please try again.')
    }
  }

  async deleteProject(projectId) {
    try {
      const params = {
        RecordIds: [projectId]
      }
      
      const response = await this.apperClient.deleteRecord(this.tableName, params)
      
      if (response && response.success) {
        return true
      }
      
      throw new Error('Failed to delete project')
    } catch (error) {
      console.error('Error deleting project:', error)
      throw new Error('Failed to delete project. Please try again.')
    }
  }

  async searchProjects(searchTerm) {
    try {
      const params = {
        fields: this.allFields,
        where: [
          {
            fieldName: 'Name',
            operator: 'Contains',
            values: [searchTerm]
          }
        ]
      }
      
      return await this.fetchProjects(params)
    } catch (error) {
      console.error('Error searching projects:', error)
      throw new Error('Failed to search projects. Please try again.')
    }
  }
}

export default new ProjectService()