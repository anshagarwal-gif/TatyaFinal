const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Generate OTP for a phone number
 * @param {string} phoneNumber - 10 digit phone number
 * @returns {Promise<{success: boolean, message: string, data: string|null}>}
 */
export const generateOtp = async (phoneNumber) => {
  try {
    const response = await fetch(`${API_BASE_URL}/otp/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to generate OTP');
    }

    return data;
  } catch (error) {
    console.error('Error generating OTP:', error);
    throw error;
  }
};

/**
 * Verify OTP code
 * @param {string} phoneNumber - 10 digit phone number
 * @param {string} otpCode - 4 digit OTP code
 * @returns {Promise<{success: boolean, message: string, data: string|null}>}
 */
export const verifyOtp = async (phoneNumber, otpCode) => {
  try {
    const response = await fetch(`${API_BASE_URL}/otp/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber, otpCode }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to verify OTP');
    }

    return data;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
};

/**
 * Check API health
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const checkApiHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/otp/health`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API health check failed:', error);
    return { success: false, message: 'API is not available' };
  }
};

/**
 * Get all drone specifications
 * @returns {Promise<{success: boolean, message: string, data: Array}>}
 */
export const getDroneSpecifications = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/drone-specifications`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching drone specifications:', error);
    throw error;
  }
};

/**
 * Get available drone specifications
 * @returns {Promise<{success: boolean, message: string, data: Array}>}
 */
export const getAvailableDroneSpecifications = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/drone-specifications/available`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching available drone specifications:', error);
    throw error;
  }
};

/**
 * Get specifications for a specific drone
 * @param {number} droneId - Drone ID
 * @returns {Promise<{success: boolean, message: string, data: Array}>}
 */
export const getDroneSpecificationsByDroneId = async (droneId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/drone-specifications/drone/${droneId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching drone specifications:', error);
    throw error;
  }
};

/**
 * Get available specifications for a specific drone
 * @param {number} droneId - Drone ID
 * @returns {Promise<{success: boolean, message: string, data: Array}>}
 */
export const getAvailableDroneSpecificationsByDroneId = async (droneId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/drone-specifications/drone/${droneId}/available`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching available drone specifications:', error);
    throw error;
  }
};

/**
 * Get all drones
 * @returns {Promise<{success: boolean, message: string, data: Array}>}
 */
export const getAllDrones = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/drones`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching drones:', error);
    throw error;
  }
};

/**
 * Get available drones
 * @returns {Promise<{success: boolean, message: string, data: Array}>}
 */
export const getAvailableDrones = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/drones/available`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching available drones:', error);
    throw error;
  }
};

/**
 * Get all drones with specifications
 * @returns {Promise<{success: boolean, message: string, data: Array}>}
 */
export const getAllDronesWithSpecifications = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/drones/with-specifications`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching drones with specifications:', error);
    throw error;
  }
};

/**
 * Get available drones with specifications
 * @returns {Promise<{success: boolean, message: string, data: Array}>}
 */
export const getAvailableDronesWithSpecifications = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/drones/available/with-specifications`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching available drones with specifications:', error);
    throw error;
  }
};

/**
 * Get drone by ID
 * @param {number} droneId - Drone ID
 * @returns {Promise<{success: boolean, message: string, data: Object}>}
 */
export const getDroneById = async (droneId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/drones/${droneId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching drone:', error);
    throw error;
  }
};

/**
 * Get drone by ID with specifications
 * @param {number} droneId - Drone ID
 * @returns {Promise<{success: boolean, message: string, data: Object}>}
 */
export const getDroneWithSpecifications = async (droneId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/drones/${droneId}/with-specifications`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching drone with specifications:', error);
    throw error;
  }
};

/**
 * Get available dates for a drone
 * @param {number} droneId - Drone ID
 * @returns {Promise<{success: boolean, message: string, data: Array<string>}>}
 */
export const getAvailableDates = async (droneId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/availability/drone/${droneId}/dates`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching available dates:', error);
    throw error;
  }
};

/**
 * Get available slots for a drone on a specific date
 * @param {number} droneId - Drone ID
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<{success: boolean, message: string, data: Array}>}
 */
export const getAvailableSlotsByDate = async (droneId, date) => {
  try {
    const response = await fetch(`${API_BASE_URL}/availability/drone/${droneId}/date/${date}/slots`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching available slots:', error);
    throw error;
  }
};

/**
 * Create a booking
 * @param {Object} bookingData - Booking data object
 * @returns {Promise<{success: boolean, message: string, data: Object}>}
 */
export const createBooking = async (bookingData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create booking');
    }

    return data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

/**
 * Update a booking
 * @param {number} bookingId - Booking ID
 * @param {Object} bookingData - Updated booking data object
 * @returns {Promise<{success: boolean, message: string, data: Object}>}
 */
export const updateBooking = async (bookingId, bookingData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update booking');
    }

    return data;
  } catch (error) {
    console.error('Error updating booking:', error);
    throw error;
  }
};

