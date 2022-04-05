$(document).ready(function() {
  let table = $('#dataTableHover-member').DataTable(); 
  
  $('#Authority').on('change', function () {
    table.columns(1).search( this.value ).draw();
  });
  $('#Username').on('keyup', function () {
    table.columns(2).search( this.value ).draw();
  });
  $('#Name').on('keyup', function () {
    table.columns(3).search( this.value ).draw();
  });
});
