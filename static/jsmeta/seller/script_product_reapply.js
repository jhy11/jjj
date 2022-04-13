const btnReapply = document.getElementById('btnReapply');

btnReapply.addEventListener('click', async() => {

  const response = await fetch('/seller/product-reapply', {
    method: 'PUT',
    mode: 'cors',
    cache: 'no-cache', 
    credentials: 'same-origin', 
    headers: new Headers({
      'X-CSRFToken': getCookie('csrftoken'),
      "Content-Type": "application/json",
    }),
    redirect: 'follow',
    body: JSON.stringify({
      Id: btnReapply.getAttribute('data-id'),
    }),
  }).catch((error) => {
    alert(error);
  });

  const result = await response.json();
  
  if(result.success){
    alert("재신청되었습니다")
    location.replace('/seller/product-approval');
  }
})