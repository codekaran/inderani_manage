export const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatAmount = (amount) => {
  return `₹${Number(amount || 0).toFixed(2)}`;
};