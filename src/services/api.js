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

/**
 * Get booking by ID
 * @param {number} bookingId - Booking ID
 * @returns {Promise<{success: boolean, message: string, data: Object}>}
 */
export const getBookingById = async (bookingId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch booking');
    }

    return data;
  } catch (error) {
    console.error('Error fetching booking:', error);
    throw error;
  }
};

/**
 * Get bookings by customer ID
 * @param {number} customerId - Customer ID
 * @returns {Promise<{success: boolean, message: string, data: Array}>}
 */
export const getBookingsByCustomer = async (customerId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/customer/${customerId}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch bookings');
    }

    return data;
  } catch (error) {
    console.error('Error fetching customer bookings:', error);
    throw error;
  }
};

/**
 * Get bookings by vendor ID
 * @param {number} vendorId - Vendor ID
 * @returns {Promise<{success: boolean, message: string, data: Array}>}
 */
export const getBookingsByVendor = async (vendorId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/vendor/${vendorId}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch bookings');
    }

    return data;
  } catch (error) {
    console.error('Error fetching vendor bookings:', error);
    throw error;
  }
};

/**
 * Get drones by vendor ID
 * @param {number} vendorId - Vendor ID
 * @returns {Promise<{success: boolean, message: string, data: Array}>}
 */
export const getDronesByVendor = async (vendorId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/drones/vendor/${vendorId}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch drones');
    }

    return data;
  } catch (error) {
    console.error('Error fetching vendor drones:', error);
    throw error;
  }
};

/**
 * Get available slots for a drone
 * @param {number} droneId - Drone ID
 * @returns {Promise<{success: boolean, message: string, data: Array}>}
 */
export const getAvailableSlots = async (droneId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/availability/drone/${droneId}/slots`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch available slots');
    }

    return data;
  } catch (error) {
    console.error('Error fetching available slots:', error);
    throw error;
  }
};

/**
 * Get specification by drone ID and option set
 * @param {number} droneId - Drone ID
 * @param {number} optionSet - Option set number
 * @returns {Promise<{success: boolean, message: string, data: Object}>}
 */
export const getSpecificationByDroneAndOptionSet = async (droneId, optionSet) => {
  try {
    const response = await fetch(`${API_BASE_URL}/drone-specifications/drone/${droneId}/option-set/${optionSet}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch specification');
    }

    return data;
  } catch (error) {
    console.error('Error fetching specification:', error);
    throw error;
  }
};

// ==================== Cluster APIs ====================

/**
 * Generate clusters
 * @returns {Promise<Array>}
 */
export const generateClusters = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/clusters/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error('Failed to generate clusters');
    }

    return data;
  } catch (error) {
    console.error('Error generating clusters:', error);
    throw error;
  }
};

/**
 * Get active clusters
 * @returns {Promise<Array>}
 */
export const getActiveClusters = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/clusters/active`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching active clusters:', error);
    throw error;
  }
};

/**
 * Get all clusters
 * @returns {Promise<Array>}
 */
export const getAllClusters = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/clusters`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching clusters:', error);
    throw error;
  }
};

// ==================== Farm APIs ====================

/**
 * Add a farm
 * @param {number} userId - User ID
 * @param {Object} farmData - Farm data object
 * @returns {Promise<Object>}
 */
export const addFarm = async (userId, farmData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/farms?userId=${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(farmData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to add farm');
    }

    return data;
  } catch (error) {
    console.error('Error adding farm:', error);
    throw error;
  }
};

/**
 * Get farms by user ID
 * @param {number} userId - User ID
 * @returns {Promise<Array>}
 */
export const getUserFarms = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/farms/user/${userId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user farms:', error);
    throw error;
  }
};

/**
 * Get all farms
 * @returns {Promise<Array>}
 */
export const getAllFarms = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/farms`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching farms:', error);
    throw error;
  }
};

// ==================== Payment APIs ====================

/**
 * Create payment order
 * @param {Object} paymentData - Payment data object with bookingId and amount
 * @returns {Promise<{orderId: string, amount: number}>}
 */
export const createPaymentOrder = async (paymentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/payment/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create payment order');
    }

    return data;
  } catch (error) {
    console.error('Error creating payment order:', error);
    throw error;
  }
};

/**
 * Verify payment
 * @param {Object} paymentData - Payment verification data with razorpay_order_id, razorpay_payment_id, razorpay_signature
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const verifyPayment = async (paymentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/payment/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to verify payment');
    }

    return data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};

/**
 * Get Razorpay public key ID
 * @returns {Promise<{keyId: string}>}
 */
export const getRazorpayKey = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/payment/key`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to get Razorpay key');
    }

    return data;
  } catch (error) {
    console.error('Error fetching Razorpay key:', error);
    throw error;
  }
};

// ==================== Cluster APIs ====================

/**
 * Generate clusters from unassigned farms
 * @returns {Promise<Array>} List of generated clusters
 */
export const generateClusters = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/clusters/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to generate clusters');
    }

    return { success: true, data: data };
  } catch (error) {
    console.error('Error generating clusters:', error);
    throw error;
  }
};

/**
 * Get all active clusters
 * @returns {Promise<Array>} List of active clusters
 */
export const getActiveClusters = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/clusters/active`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch active clusters');
    }

    return { success: true, data: data };
  } catch (error) {
    console.error('Error fetching active clusters:', error);
    throw error;
  }
};

/**
 * Get all clusters
 * @returns {Promise<Array>} List of all clusters
 */
export const getAllClusters = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/clusters`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch clusters');
    }

    return { success: true, data: data };
  } catch (error) {
    console.error('Error fetching clusters:', error);
    throw error;
  }
};

/**
 * Get cluster by ID
 * @param {number} clusterId - Cluster ID
 * @returns {Promise<Object>} Cluster details
 */
export const getClusterById = async (clusterId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/clusters/${clusterId}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch cluster');
    }

    return { success: true, data: data };
  } catch (error) {
    console.error('Error fetching cluster:', error);
    throw error;
  }
};

