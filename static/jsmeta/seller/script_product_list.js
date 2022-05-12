function setAttributes(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}

document.addEventListener("DOMContentLoaded", function(){

  let table_onsale = $('#dataTableHover-products').DataTable({
    'destroy': true,
    'autoWidth': false,

    'ajax': {
      'type' : 'GET',
      'url': '/seller/product-table',
      'dataSrc': 'productsOnSale'
    },
    createdRow: function( row, data, dataIndex ) {
      $( row )
      .attr('onclick', "window.open('/seller/product-detail/"+data.id +"','_self')");
    },
    columns: [
      {data : 'id'},
      {data : 'pro_subcategory__name'},
      {data : 'name'},
      {data : 'price'},
      {data : 'stock'},
    ],
  });

  let table_stopped = $('#dataTableHover-productsStopped').DataTable({
    'destroy': true,
    'autoWidth': false,

    'ajax': {
      'type' : 'GET',
      'url': '/seller/product-table',
      'dataSrc': 'productsStopped'
    },
    createdRow: function( row, data, dataIndex ) {
      $( row )
      .attr('onclick', "window.open('/seller/product-detail/"+data.id +"','_self')");
    },
    columns: [
      {data : 'id'},
      {data : 'pro_subcategory__name'},
      {data : 'name'},
      {data : 'price'},
      {data : 'stock'},
    ],
  });

  $('#catSearch').on('change', function () {
    table_onsale.columns(1).search( this.value ).draw();
  });
  $('#nameSearch').on('keyup', function () {
    table_onsale.columns(2).search( this.value ).draw();
  });
  
  $('#catSearch').on('change', function () {
    table_stopped.columns(1).search( this.value ).draw();
  });
  $('#nameSearch').on('keyup', function () {
    table_stopped.columns(2).search( this.value ).draw();
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
      table_onsale.draw();
    });

    $.fn.dataTable.ext.search.push(
      function( settings, searchData) {
        if (settings.nTable.id !== 'dataTableHover-productsStopped'){
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
        table_stopped.draw();
      });
  
});
