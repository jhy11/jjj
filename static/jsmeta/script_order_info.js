document.addEventListener("DOMContentLoaded", function(){
  let status = document.getElementById('Status-td');
  
  status.innerHTML=showStatus(status.getAttribute('value'));
});

function showStatus(status){

  switch(status){
    case 'Processing':
      result = '<span class="badge badge-info">배송준비중</span>'
      break;
    case 'Pending':
      result = '<span class="badge badge-danger">배송지연</span>'
      break;
    case 'Shipping':
      result = '<span class="badge badge-warning">배송중</span>'
      break;
    case 'Delivered':
      result = '<span class="badge badge-success">배송완료</span>'
      break;
  }
  return result;
}

