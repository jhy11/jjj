const btnEdit = document.getElementById('btnDelete');

btnDelete.addEventListener('click', async() => {

  console.log(btnDelete.getAttribute('data-id'));
  const response = await fetch('/seller/product-approval', {
    method: 'DELETE',
    mode: 'cors',
    cache: 'no-cache', 
    credentials: 'same-origin', 
    headers: new Headers({
      'X-CSRFToken': getCookie('csrftoken'),
      "Content-Type": "application/json",
    }),
    redirect: 'follow',
    body: JSON.stringify({
      Id: btnDelete.getAttribute('data-id'),
    }),
  }).catch((error) => {
    alert(error);
  });

  const result = await response.json();
  
  //reload only table after deleting
  if(result.success){
    alert("삭제되었습니다")
    location.replace('/seller/product-approval');
   
  }
})