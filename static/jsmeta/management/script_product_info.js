//pro-RequestedTable search
$(document).ready(function() {
  var table = $('#dataTableHover1').DataTable(); 
  
  $('#catSearch').on('change', function () {
    table.columns(1).search( this.value ).draw();
  });
  $('#shopSearch').on('keyup', function () {
    table.columns(2).search( this.value ).draw();
  });
  $('#nameSearch').on('keyup', function () {
    table.columns(3).search( this.value ).draw();
  });

  $.fn.dataTable.ext.search.push(
    function( settings, searchData) {
      if (settings.nTable.id !== 'dataTableHover1'){
        return true;
      }
      var min = parseInt($('#minPrice').val(), 10);
      var max = parseInt($('#maxPrice').val(), 10);
      var price = parseFloat(searchData[4]) || 0;
  
      if ((isNaN(min) && isNaN(max)) || (isNaN(min) && price <= max) ||
      (min <= price && isNaN(max)) ||(min <= price && price <= max)){
        return true;
      }
      return false;
    });

    $('#minPrice, #maxPrice').keyup(function(){
      table.draw();
    });

  
  //pro-OnSaleTable search
  var table2 = $('#dataTableHover2').DataTable(); 

  $('#catSearch2').on('change', function () {
    table2.columns(1).search( this.value ).draw();
  });
  $('#shopSearch2').on('keyup', function () {
    table2.columns(2).search( this.value ).draw();
  });
  $('#nameSearch2').on('keyup', function () {
    table2.columns(3).search( this.value ).draw();
  });

  $.fn.dataTable.ext.search.push(
    function( settings, searchData) {
      if (settings.nTable.id !== 'dataTableHover2'){
        return true;
      }
      var min = parseInt($('#minPrice2').val(), 10);
      var max = parseInt($('#maxPrice2').val(), 10);
      var price = parseFloat(searchData[4]) || 0;
  
      if ((isNaN(min) && isNaN(max)) || (isNaN(min) && price <= max) ||
      (min <= price && isNaN(max)) ||(min <= price && price <= max)){
        return true;
      }
      return false;
    });

    $('#minPrice2, #maxPrice2').keyup(function(){
      table2.draw();
    });

});