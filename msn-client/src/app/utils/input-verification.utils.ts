export function verifyFile(file: File) : string{ 
  if(file.type === 'image/png' 
  || file.type === 'image/jpg' 
  || file.type === 'image/jpeg' 
  || file.type === 'image/gif'){
    if(file.size < 5000000){
      return "bon"
    }else{
      return "Image trop lourde"
    }
  }

  return "Format d'image non supportée"
}

export function verifyPassword(password : string, confirmer : string) : string{
  if(password === confirmer){
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if(regex.test(password)){
      return "bon"
    }
    return "Mot de passe invalide : 8 caractères, une majuscule, un chiffre et un caractère special sont requis"
  }else{
    return "Les mots de passe ne sont pas identiques"
  }
}