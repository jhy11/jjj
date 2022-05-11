function setAttributes(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}

document.addEventListener("DOMContentLoaded", function(){

  //승인 요청 테이블
  let table_requested = $('#dataTableHover1').DataTable({
    'destroy': true,
    'autoWidth': false,

    'ajax': {
      'type' : 'GET',
      'url': '/management/product-table',
      'dataSrc': 'productsRequested'
    },
    createdRow: function( row, data, dataIndex ) {
      $( row )
      .attr('onclick', "window.open('/management/manage-product-detail/"+data.id +"','_self')");
    },
    columns: [
      {data : 'id'},
      {data : 'pro_subcategory__name'},
      {data : 'shop__shop_name'},
      {data : 'name'},
      {data : 'price'},
      {data : 'stock'},
    ],
  });
  $('#catSearch').on('change', function () {
    table_requested.columns(1).search( this.value ).draw();
  });
  $('#shopSearch').on('keyup', function () {
    table_requested.columns(2).search( this.value ).draw();
  });
  $('#nameSearch').on('keyup', function () {
    table_requested.columns(3).search( this.value ).draw();
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
      table_requested.draw();
    });

  
  //판매 중 테이블
  let table_onsale = $('#dataTableHover2').DataTable({
    'destroy': true,
    'autoWidth': false,

    'ajax': {
      'type' : 'GET',
      'url': '/management/product-table',
      'dataSrc': 'productsOnSale'
    },
    createdRow: function( row, data, dataIndex ) {
      $( row )
          .attr('onclick', "window.open('/management/manage-product-detail/"+data.id +"','_self')");
    },
    columns: [
      {data : 'id'},
      {data : 'pro_subcategory__name'},
      {data : 'shop__shop_name'},
      {data : 'name'},
      {data : 'price'},
      {data : 'stock'},
    ],
  });

  $('#catSearch2').on('change', function () {
    table_onsale.columns(1).search( this.value ).draw();
  });
  $('#shopSearch2').on('keyup', function () {
    table_onsale.columns(2).search( this.value ).draw();
  });
  $('#nameSearch2').on('keyup', function () {
    table_onsale.columns(3).search( this.value ).draw();
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
      table_onsale.draw();
    });

});

