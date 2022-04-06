document.addEventListener("DOMContentLoaded", function(){

  let status = document.getElementsByClassName('status');
  [].forEach.call(status, function(status) {
      status.innerHTML=showStatus(status.getAttribute('value'));
  })

  let table = $('#dataTableHover-qna').DataTable();
  
  $('#Category').on('change', function () {
    table.columns(0).search( this.value ).draw();
  });
  $('#Product').on('keyup', function () {
    table.columns(1).search( this.value ).draw();
  });
  $('#Title').on('keyup', function () {
    table.columns(3).search( this.value ).draw();
  });
});

function showStatus(status){
  switch(status){
    case '1':
      result = '<span class="badge badge-success align-middle">답변 완료</span>'
      break;
    case '0':
      result = '<span class="badge badge-danger align-middle">미답변</span>'
      break;
  }
  return result;
}