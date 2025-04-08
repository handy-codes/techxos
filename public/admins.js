// Direct admin check
window.checkIfAdmin = function(userEmail) {
  if (!userEmail) return false;
  
  const adminEmails = [
    "paxymekventures@gmail.com",
    "admin@techxos.com", 
    "emeka@techxos.com"
  ];
  
  return adminEmails.includes(userEmail.toLowerCase());
}

// Set this to true to force all users to be treated as admins (for debugging)
window.forceAdmin = false; 