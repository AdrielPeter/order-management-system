export const validateStatus = (status: string, newStatus: string) => {
  const validStatus = ["Pending","In Progress","Completed"]

  if (validStatus.includes(status) && validStatus.includes(newStatus) && status === 'Completed') {
    return false
  }

  if (validStatus.includes(status) && validStatus.includes(newStatus) && status === 'In Progress' && newStatus === 'Completed') {
    return true 
  }
  
  if (validStatus.includes(status) && validStatus.includes(newStatus) && status === 'Pending' && newStatus === 'In Progress') {
    return true
  }

  return false
}