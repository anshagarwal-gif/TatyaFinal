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

// ==================== Vendor Registration & Login APIs ====================

/**
 * Register a new vendor - saves vendor data and sends OTP
 * @param {Object} vendorData - Vendor registration data {fullName, email, phoneNumber, vendorType}
 * @returns {Promise<{success: boolean, message: string, data: Object}>}
 */
export const registerVendor = async (vendorData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/vendors/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vendorData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to register vendor');
    }

    return data;
  } catch (error) {
    console.error('Error registering vendor:', error);
    throw error;
  }
};

/**
 * Verify OTP and login vendor
 * @param {string} phoneNumber - 10 digit phone number
 * @param {string} otpCode - 4 digit OTP code
 * @returns {Promise<{success: boolean, message: string, data: Object}>}
 */
export const verifyVendorAndLogin = async (phoneNumber, otpCode) => {
  try {
    const response = await fetch(`${API_BASE_URL}/vendors/verify-and-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber, otpCode }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to verify OTP and login');
    }

    return data;
  } catch (error) {
    console.error('Error verifying vendor OTP:', error);
    throw error;
  }
};

/**
 * Vendor login with email + password (works only after admin approval)
 * @param {Object} loginData - {email, password}
 * @returns {Promise<{success: boolean, message: string, data: Object}>}
 */
export const vendorLoginWithPassword = async (loginData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/vendors/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to login')
    }

    return data
  } catch (error) {
    console.error('Error logging in vendor:', error)
    throw error
  }
}

/**
 * Get vendor by phone number
 * @param {string} phoneNumber - 10 digit phone number
 * @returns {Promise<{success: boolean, message: string, data: Object}>}
 */
export const getVendorByPhone = async (phoneNumber) => {
  try {
    const response = await fetch(`${API_BASE_URL}/vendors/phone/${phoneNumber}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch vendor');
    }

    return data;
  } catch (error) {
    console.error('Error fetching vendor:', error);
    throw error;
  }
};

/**
 * Get vendor by ID
 * @param {number} vendorId - Vendor ID
 * @returns {Promise<{success: boolean, message: string, data: Object}>}
 */
export const getVendorById = async (vendorId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/vendors/${vendorId}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch vendor');
    }

    return data;
  } catch (error) {
    console.error('Error fetching vendor:', error);
    throw error;
  }
};

// ==================== Vendor Onboarding APIs ====================

/**
 * Save Step 1: Equipment Basics
 * @param {Object} step1Data - Equipment basics data {vendorId, equipmentType, brand, modelName, yearOfMake, serialNo}
 * @returns {Promise<{success: boolean, message: string, data: Object}>}
 */
export const saveOnboardingStep1 = async (step1Data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/vendors/onboarding/step1`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(step1Data),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to save step 1');
    }

    return data;
  } catch (error) {
    console.error('Error saving step 1:', error);
    throw error;
  }
};

/**
 * Save Step 2: Drone-Specific Details
 * @param {Object} step2Data - Drone details data
 * @returns {Promise<{success: boolean, message: string, data: Object}>}
 */
export const saveOnboardingStep2 = async (step2Data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/vendors/onboarding/step2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(step2Data),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to save step 2');
    }

    return data;
  } catch (error) {
    console.error('Error saving step 2:', error);
    throw error;
  }
};

/**
 * Save Step 3: Capacity & Coverage
 * @param {Object} step3Data - Capacity data
 * @returns {Promise<{success: boolean, message: string, data: Object}>}
 */
export const saveOnboardingStep3 = async (step3Data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/vendors/onboarding/step3`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(step3Data),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to save step 3');
    }

    return data;
  } catch (error) {
    console.error('Error saving step 3:', error);
    throw error;
  }
};

/**
 * Save Step 4: Location & Logistics
 * @param {Object} step4Data - Location data
 * @returns {Promise<{success: boolean, message: string, data: Object}>}
 */
export const saveOnboardingStep4 = async (step4Data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/vendors/onboarding/step4`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(step4Data),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to save step 4');
    }

    return data;
  } catch (error) {
    console.error('Error saving step 4:', error);
    throw error;
  }
};

/**
 * Save Step 5: Availability & SLA
 * @param {Object} step5Data - Availability data
 * @returns {Promise<{success: boolean, message: string, data: Object}>}
 */
export const saveOnboardingStep5 = async (step5Data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/vendors/onboarding/step5`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(step5Data),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to save step 5');
    }

    return data;
  } catch (error) {
    console.error('Error saving step 5:', error);
    throw error;
  }
};

/**
 * Get saved onboarding data for a vendor
 * @param {number} vendorId - Vendor ID
 * @returns {Promise<{success: boolean, message: string, data: Object}>}
 */
export const getOnboardingData = async (vendorId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/vendors/onboarding/${vendorId}/data`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch onboarding data');
    }

    return data;
  } catch (error) {
    console.error('Error fetching onboarding data:', error);
    throw error;
  }
};

/**
 * Save Step 6: Payouts
 * @param {Object} step6Data - Bank account data
 * @returns {Promise<{success: boolean, message: string, data: Object}>}
 */
export const saveOnboardingStep6 = async (step6Data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/vendors/onboarding/step6`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(step6Data),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to save step 6');
    }

    return data;
  } catch (error) {
    console.error('Error saving step 6:', error);
    throw error;
  }
};

/**
 * Upload equipment images
 * @param {number} vendorId - Vendor ID
 * @param {number} droneId - Drone ID (optional)
 * @param {FileList} files - Image files
 * @returns {Promise<{success: boolean, message: string, data: Array}>}
 */
export const uploadEquipmentImages = async (vendorId, droneId, files) => {
  try {
    const formData = new FormData();
    formData.append('vendorId', vendorId);
    if (droneId) {
      formData.append('droneId', droneId);
    }
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    const response = await fetch(`${API_BASE_URL}/vendors/onboarding/upload-images`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to upload images');
    }

    return data;
  } catch (error) {
    console.error('Error uploading images:', error);
    throw error;
  }
};

/**
 * Upload documents
 * @param {number} vendorId - Vendor ID
 * @param {number} droneId - Drone ID (optional)
 * @param {FileList} files - Document files
 * @returns {Promise<{success: boolean, message: string, data: Array}>}
 */
export const uploadDocuments = async (vendorId, droneId, files) => {
  try {
    const formData = new FormData();
    formData.append('vendorId', vendorId);
    if (droneId) {
      formData.append('droneId', droneId);
    }
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    const response = await fetch(`${API_BASE_URL}/vendors/onboarding/upload-documents`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to upload documents');
    }

    return data;
  } catch (error) {
    console.error('Error uploading documents:', error);
    throw error;
  }
};

// ==================== Vendor Profile APIs ====================

/**
 * Get complete vendor profile with drone and bank account
 * @param {number} vendorId - Vendor ID
 * @returns {Promise<{success: boolean, message: string, data: Object}>}
 */
export const getVendorProfile = async (vendorId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/vendors/${vendorId}/profile`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch vendor profile');
    }

    return data;
  } catch (error) {
    console.error('Error fetching vendor profile:', error);
    throw error;
  }
};

/**
 * Update vendor profile
 * @param {number} vendorId - Vendor ID
 * @param {Object} profileData - Profile data to update
 * @returns {Promise<{success: boolean, message: string, data: Object}>}
 */
export const updateVendorProfile = async (vendorId, profileData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/vendors/${vendorId}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update vendor profile');
    }

    return data;
  } catch (error) {
    console.error('Error updating vendor profile:', error);
    throw error;
  }
};

// ==================== Admin APIs ====================

/**
 * Admin login
 * @param {Object} loginData - Login data {email, password}
 * @returns {Promise<{success: boolean, message: string, data: Object}>}
 */
export const adminLogin = async (loginData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      // Extract error message from response
      const errorMessage = data.message || 'Invalid email or password. Please try again.';
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error('Error logging in admin:', error);
    // Re-throw with a user-friendly message if it's a network error
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check your internet connection.');
    }
    throw error;
  }
};

/**
 * Get admin dashboard statistics
 * @returns {Promise<{success: boolean, message: string, data: Object}>}
 */
export const getAdminDashboardStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch dashboard stats');
    }

    return data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

/**
 * Get all vendors for admin
 * @returns {Promise<{success: boolean, message: string, data: Array}>}
 */
export const getAdminVendors = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/vendors`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch vendors');
    }

    return data;
  } catch (error) {
    console.error('Error fetching vendors:', error);
    throw error;
  }
};

/**
 * Get pending vendors
 * @returns {Promise<{success: boolean, message: string, data: Array}>}
 */
export const getPendingVendors = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/vendors/pending`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch pending vendors');
    }

    return data;
  } catch (error) {
    console.error('Error fetching pending vendors:', error);
    throw error;
  }
};

/**
 * Get vendor details by ID
 * @param {number} vendorId - Vendor ID
 * @returns {Promise<{success: boolean, message: string, data: Object}>}
 */
export const getAdminVendorDetails = async (vendorId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/vendors/${vendorId}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch vendor details');
    }

    return data;
  } catch (error) {
    console.error('Error fetching vendor details:', error);
    throw error;
  }
};

/**
 * Approve or reject a vendor
 * @param {Object} approvalData - Approval data {vendorId, action: 'VERIFIED' | 'REJECTED'}
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const approveOrRejectVendor = async (approvalData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/vendors/approve-reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(approvalData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to process vendor approval');
    }

    return data;
  } catch (error) {
    console.error('Error processing vendor approval:', error);
    throw error;
  }
};

/**
 * Deactivate a vendor
 * @param {number} vendorId - Vendor ID
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const deactivateVendor = async (vendorId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/vendors/${vendorId}/deactivate`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to deactivate vendor');
    }

    return data;
  } catch (error) {
    console.error('Error deactivating vendor:', error);
    throw error;
  }
};

/**
 * Reactivate a vendor
 * @param {number} vendorId - Vendor ID
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const reactivateVendor = async (vendorId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/vendors/${vendorId}/reactivate`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to reactivate vendor');
    }

    return data;
  } catch (error) {
    console.error('Error reactivating vendor:', error);
    throw error;
  }
};

/**
 * Get all users for admin
 * @returns {Promise<{success: boolean, message: string, data: Array}>}
 */
export const getAdminUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch users');
    }

    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Get only customer users for admin
 * @returns {Promise<{success: boolean, message: string, data: Array}>}
 */
export const getAdminCustomers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/customers`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch customers')
    }

    return data
  } catch (error) {
    console.error('Error fetching customers:', error)
    throw error
  }
}

/**
 * Get user details by ID
 * @param {number} userId - User ID
 * @returns {Promise<{success: boolean, message: string, data: Object}>}
 */
export const getAdminUserDetails = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch user details');
    }

    return data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};

/**
 * Delete a user
 * @param {number} userId - User ID
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const deleteUser = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete user');
    }

    return data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

/**
 * Get finance statistics
 * @returns {Promise<{success: boolean, message: string, data: Object}>}
 */
export const getFinanceStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/finance/stats`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch finance stats');
    }

    return data;
  } catch (error) {
    console.error('Error fetching finance stats:', error);
    throw error;
  }
};

/**
 * Export vendors and drones to Excel
 * @returns {Promise<Blob>}
 */
export const exportVendorsAndDrones = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/vendors/export/excel`);
    
    if (!response.ok) {
      throw new Error('Failed to export vendors and drones');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vendors_and_drones.xlsx';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    return blob;
  } catch (error) {
    console.error('Error exporting vendors and drones:', error);
    throw error;
  }
};

/**
 * Export users to Excel
 * @returns {Promise<Blob>}
 */
export const exportUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/export/excel`);
    
    if (!response.ok) {
      throw new Error('Failed to export users');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.xlsx';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    return blob;
  } catch (error) {
    console.error('Error exporting users:', error);
    throw error;
  }
};
