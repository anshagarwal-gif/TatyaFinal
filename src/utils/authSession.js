/** Customer OTP session (no JWT from backend today). */
export const CUSTOMER_PHONE_KEY = 'customerPhone'

export function isAppUserAuthenticated() {
  if (typeof window === 'undefined') return false
  return Boolean(
    localStorage.getItem(CUSTOMER_PHONE_KEY) || localStorage.getItem('vendorId')
  )
}

export function clearCustomerSession() {
  localStorage.removeItem(CUSTOMER_PHONE_KEY)
}

export function clearVendorSession() {
  localStorage.removeItem('vendor')
  localStorage.removeItem('vendorId')
  localStorage.removeItem('userId')
}
