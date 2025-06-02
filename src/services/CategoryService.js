// CategoryService.js - Service for category3 table operations
class CategoryService {
  constructor() {
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'category3'
    
    // Define fields for category3 table based on schema
    this.allFields = [
      'Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 
      'ModifiedOn', 'ModifiedBy', 'color', 'task_count'
    ]
    
    // Only updateable fields for create/update operations
    this.updateableFields = ['Name', 'Tags', 'Owner', 'color', 'task_count']
  }

  async fetchCategories(params = {}) {
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
      console.error('Error fetching categories:', error)
      throw new Error('Failed to fetch categories. Please try again.')
    }
  }

  async getCategoryById(categoryId) {
    try {
      const params = {
        fields: this.allFields
      }
      
      const response = await this.apperClient.getRecordById(this.tableName, categoryId, params)
      
      if (!response || !response.data) {
        return null
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching category with ID ${categoryId}:`, error)
      throw new Error('Failed to fetch category. Please try again.')
    }
  }

  async createCategory(categoryData) {
    try {
      // Filter to only include updateable fields
      const filteredData = {}
      this.updateableFields.forEach(field => {
        if (categoryData[field] !== undefined) {
          filteredData[field] = categoryData[field]
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
      
      throw new Error('Failed to create category')
    } catch (error) {
      console.error('Error creating category:', error)
      throw new Error('Failed to create category. Please try again.')
    }
  }

  async updateCategory(categoryId, categoryData) {
    try {
      // Filter to only include updateable fields plus Id
      const filteredData = { Id: categoryId }
      this.updateableFields.forEach(field => {
        if (categoryData[field] !== undefined) {
          filteredData[field] = categoryData[field]
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
      
      throw new Error('Failed to update category')
    } catch (error) {
      console.error('Error updating category:', error)
      throw new Error('Failed to update category. Please try again.')
    }
  }

  async deleteCategory(categoryId) {
    try {
      const params = {
        RecordIds: [categoryId]
      }
      
      const response = await this.apperClient.deleteRecord(this.tableName, params)
      
      if (response && response.success) {
        return true
      }
      
      throw new Error('Failed to delete category')
    } catch (error) {
      console.error('Error deleting category:', error)
      throw new Error('Failed to delete category. Please try again.')
    }
  }

  async searchCategories(searchTerm) {
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
      
      return await this.fetchCategories(params)
    } catch (error) {
      console.error('Error searching categories:', error)
      throw new Error('Failed to search categories. Please try again.')
    }
  }
}

export default new CategoryService()