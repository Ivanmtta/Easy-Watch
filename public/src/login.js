function validateForm(event){
  username = document.querySelector('#username').value;
  username = document.querySelector('#room').value;
  if(username === '' || room === ''){
    M.toast({html: 'Please enter a username and a room!'})
    return false;
  }
  else{
    return true;
  }
}