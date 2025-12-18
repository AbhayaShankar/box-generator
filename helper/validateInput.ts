export const validateInput = (value: string, setError: (error: string) => void): boolean => {
  if (!value.trim()) {
    setError('Please enter a number');
    return false;
  }
  
  const num = Number(value);
  if (isNaN(num)) {
    setError('Please enter a valid number');
    return false;
  }
  
  if (!Number.isInteger(num)) {
    setError('Please enter a whole number');
    return false;
  }
  
  if (num < 5 || num > 25) {
    setError('Number must be between 5 and 25');
    return false;
  }
  
  setError('');
  return true;
};