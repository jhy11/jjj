document.addEventListener("DOMContentLoaded", function(){
  let status = document.getElementsByClassName('status');
  [].forEach.call(status, function(status) {
      status.innerHTML=showStatus(status.getAttribute('value'));
  })

  let table = $('#dataTableHover-order').DataTable(); 
  
  $('#No').on('keyup', function () {
    table.columns(0).search( this.value ).draw();
  });
  $('#Type').on('change', function () {
    table.columns(1).search( this.value ).draw();
  });
  $('#Status').on('change', function () {
    table.columns(6).search( this.value ).draw();
  });
  $('#Name').on('keyup', function () {
    table.columns(2).search( this.value ).draw();
  });
});

function showStatus(status){

  switch(status){
    case 'Paid':
      result = '<span class="badge badge-secondary">결제완료</span>'
      break;
    case 'Processing':
      result = '<span class="badge badge-info">배송준비중</span>'
      break;
    case 'Pending':
      result = '<span class="badge badge-danger">배송지연</span>'
      break;
    case 'Shipping':
      result = '<span class="badge badge-blue">배송중</span>'
      break;
    case 'Delivered':
      result = '<span class="badge badge-success">배송완료</span>'
      break;
  }
  return result;
}
