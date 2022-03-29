$(document).ready(function() {
  var table = $('#dataTableHover-products').DataTable(); 
  
  $('#catSearch').on('change', function () {
    table.columns(1).search( this.value ).draw();
  });
  $('#nameSearch').on('keyup', function () {
    table.columns(2).search( this.value ).draw();
  });

  $.fn.dataTable.ext.search.push(
    function( settings, searchData) {
      if (settings.nTable.id !== 'dataTableHover-products'){
        return true;
      }
      var min = parseInt($('#minPrice').val(), 10);
      var max = parseInt($('#maxPrice').val(), 10);
      var price = parseFloat(searchData[3]) || 0;
  
      if ((isNaN(min) && isNaN(max)) || (isNaN(min) && price <= max) ||
      (min <= price && isNaN(max)) ||(min <= price && price <= max)){
        return true;
      }
      return false;
    });

    $('#minPrice, #maxPrice').keyup(function(){
      table.draw();
    });
});
