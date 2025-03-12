// Format amount with thousand separators and 2 decimal places
export const formatAmount = (amount: string): string => {
  if (!amount) return ""

  // Remove non-numeric characters except decimal point
  let numericValue = amount.replace(/[^0-9.]/g, "")

  // Ensure only one decimal point
  const parts = numericValue.split(".")
  if (parts.length > 2) {
    numericValue = parts[0] + "." + parts.slice(1).join("")
  }

  // Parse to number and format
  const num = Number.parseFloat(numericValue)
  if (isNaN(num)) return ""

  // If it's just a decimal point, return it as is
  if (numericValue === ".") return "."

  // If it ends with a decimal point, preserve it
  const endsWithDecimal = numericValue.endsWith(".")

  // Format with thousand separators
  const formatted = num.toLocaleString("en-NG", {
    minimumFractionDigits: numericValue.includes(".") ? 2 : 0,
    maximumFractionDigits: 2,
  })

  return endsWithDecimal ? formatted + "." : formatted
}

export const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-NG", options);
};



// Format time in 12-hour format
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

// Parse formatted amount back to number string
export const parseFormattedAmount = (formatted: string): string => {
  if (!formatted) return ""
  return formatted.replace(/,/g, "")
}