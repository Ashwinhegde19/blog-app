/**
 * Utility functions for handling API errors consistently
 */

/**
 * Extract error message from an API error response
 * @param error The error object from the API call
 * @param defaultMessage Default message to return if no specific error message is found
 * @returns Formatted error message
 */
export const getErrorMessage = (error: any, defaultMessage: string = 'An error occurred'): string => {
  if (error.response?.data) {
    const { data } = error.response;
    
    // Check common error patterns in DRF responses
    if (data.detail) {
      return data.detail;
    }
    
    // Check for field-specific errors
    const fieldErrors = ['username', 'email', 'password', 'title', 'content'];
    for (const field of fieldErrors) {
      if (data[field]) {
        return Array.isArray(data[field]) ? data[field][0] : data[field];
      }
    }
    
    // Check for non-field errors
    if (data.error) {
      return data.error;
    }
    
    // If data is a string itself
    if (typeof data === 'string') {
      return data;
    }
  }
  
  return defaultMessage;
};