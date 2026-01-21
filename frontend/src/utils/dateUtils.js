// Format date for display
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Format datetime for display
export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

// Check if date is within the next N days
export const isWithinDays = (dateString, days) => {
  const date = new Date(dateString);
  const now = new Date();
  const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  return date >= now && date <= futureDate;
};

// Check if date is within the next 3 months
export const isWithinThreeMonths = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const threeMonthsFromNow = new Date(now);
  threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

  return date >= now && date <= threeMonthsFromNow;
};

// Generate recurring appointments up to 3 months
export const generateRecurringAppointments = (appointment, months = 3) => {
  const appointments = [];
  const startDate = new Date(appointment.datetime);
  const endDate = appointment.end_date ? new Date(appointment.end_date) : null;
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + months);

  let currentDate = new Date(startDate);

  while (currentDate <= maxDate) {
    if (endDate && currentDate > endDate) {
      break;
    }

    appointments.push({
      ...appointment,
      datetime: currentDate.toISOString(),
    });

    // Calculate next occurrence based on repeat schedule
    if (appointment.repeat === 'weekly') {
      currentDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    } else if (appointment.repeat === 'monthly') {
      currentDate = new Date(currentDate);
      currentDate.setMonth(currentDate.getMonth() + 1);
    } else {
      // No repeat, just return the single appointment
      break;
    }
  }

  return appointments;
};

// Generate recurring prescription refills up to 3 months
export const generateRecurringRefills = (prescription, months = 3) => {
  const refills = [];
  const startDate = new Date(prescription.refill_on);
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + months);

  let currentDate = new Date(startDate);

  while (currentDate <= maxDate) {
    refills.push({
      ...prescription,
      refill_on: currentDate.toISOString().split('T')[0],
    });

    // Calculate next refill based on schedule
    if (prescription.refill_schedule === 'weekly') {
      currentDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    } else if (prescription.refill_schedule === 'monthly') {
      currentDate = new Date(currentDate);
      currentDate.setMonth(currentDate.getMonth() + 1);
    } else {
      break;
    }
  }

  return refills;
};

// Convert date to input format (YYYY-MM-DD)
export const toInputDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

// Convert datetime to input format (YYYY-MM-DDTHH:MM)
export const toInputDateTime = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};
