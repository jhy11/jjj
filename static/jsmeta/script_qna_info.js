let table = $('#dataTableHover-qna').DataTable();
table.columns(5).search( '미답변' ).draw();

  
$('#state').on('change', function () {
  let state = $("input[name='state']:checked").val();
  table.columns(5).search( state ).draw();
});