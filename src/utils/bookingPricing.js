/**
 * Customer booking: hour/day units convert to billable acres using vendor working hours (day)
 * and a fixed acres-per-hour rate. Total = pricePerAcre × farmAreaAcres × numberOfDays (server).
 */

export const ACRES_PER_HOUR = 6

/** When vendor has no time batches saved, assume a full working day (hours). */
export const DEFAULT_VENDOR_HOURS_PER_DAY = 8

/** @param {{ timeBatches?: string | string[]; workingHoursBatches?: string } | null | undefined} drone */
export function getTimeBatchList(drone) {
  const raw = drone?.timeBatches ?? drone?.workingHoursBatches
  if (!raw) return []
  try {
    const t = typeof raw === 'string' ? JSON.parse(raw) : raw
    return Array.isArray(t) ? t.map(String) : []
  } catch {
    return String(raw)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  }
}

/**
 * Sum hours from onboarding time batches (morning / afternoon / evening / night) or "HH:MM-HH:MM" ranges.
 * Matches labels on vendor availability: Morning 6–11, Evening 4–6 PM, Night 6–11 PM; afternoon 11–5.
 */
export function vendorWorkingHoursPerDay(drone) {
  const batches = getTimeBatchList(drone)
  let hours = 0
  for (const raw of batches) {
    const b = String(raw).toLowerCase().trim()
    if (!b) continue
    if (b.includes('morning')) hours += 5
    else if (b.includes('afternoon')) hours += 6
    else if (b.includes('evening')) hours += 2
    else if (b.includes('night')) hours += 5
    else {
      const range = String(raw).match(
        /(\d{1,2}):(\d{2})\s*[-–\s]*(?:to)?\s*(\d{1,2}):(\d{2})/i
      )
      if (range) {
        const start = parseInt(range[1], 10) * 60 + parseInt(range[2], 10)
        const end = parseInt(range[3], 10) * 60 + parseInt(range[4], 10)
        if (end > start) hours += (end - start) / 60
      }
    }
  }
  return hours > 0 ? hours : DEFAULT_VENDOR_HOURS_PER_DAY
}

/**
 * @param {'Acre' | 'Hour' | 'Day'} selectedUnit
 * @param {number} quantity
 * @param {number} workingHoursPerDay from {@link vendorWorkingHoursPerDay}
 */
export function computeBookingAcresAndDays(selectedUnit, quantity, workingHoursPerDay) {
  const q = Math.max(1, Number(quantity) || 1)
  if (selectedUnit === 'Acre') {
    return { farmAreaAcres: q, numberOfDays: 1, equivalentTotalAcres: q }
  }
  if (selectedUnit === 'Hour') {
    const acres = q * ACRES_PER_HOUR
    return { farmAreaAcres: acres, numberOfDays: 1, equivalentTotalAcres: acres }
  }
  if (selectedUnit === 'Day') {
    const perDay = workingHoursPerDay * ACRES_PER_HOUR
    return {
      farmAreaAcres: perDay,
      numberOfDays: q,
      equivalentTotalAcres: perDay * q,
    }
  }
  return { farmAreaAcres: q, numberOfDays: 1, equivalentTotalAcres: q }
}
