/** Customer OTP session (no JWT from backend today). */
export const CUSTOMER_PHONE_KEY = 'customerPhone'
/** DB user id for customer (set after OTP verify). */
export const CUSTOMER_ID_KEY = 'customerId'

export function isAppUserAuthenticated() {
  if (typeof window === 'undefined') return false
  const customerOk =
    localStorage.getItem(CUSTOMER_PHONE_KEY) && localStorage.getItem(CUSTOMER_ID_KEY)
  return Boolean(customerOk || localStorage.getItem('vendorId'))
}

export function clearCustomerSession() {
  localStorage.removeItem(CUSTOMER_PHONE_KEY)
  localStorage.removeItem(CUSTOMER_ID_KEY)
}

export function clearVendorSession() {
  localStorage.removeItem('vendor')
  localStorage.removeItem('vendorId')
  localStorage.removeItem('userId')
}
