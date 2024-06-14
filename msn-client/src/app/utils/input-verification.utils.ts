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