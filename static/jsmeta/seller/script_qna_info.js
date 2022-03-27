let table = $('#dataTableHover-qna').DataTable();
table.columns(5).search( '미답변' ).draw();

  
$('#state').on('change', function () {
  let state = $("input[name='state']:checked").val();
  table.columns(5).search( state ).draw();
});

document.addEventListener("DOMContentLoaded", function(){

  let status = document.getElementsByClassName('status');
  [].forEach.call(status, function(status) {
      status.innerHTML=showStatus(status.getAttribute('value'));
  })

  let table = $('#dataTableHover-answered').DataTable();
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