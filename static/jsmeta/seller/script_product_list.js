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
    columnDefs: [
      {
        "targets": 5,
        "render": function(data){
          let td =document.createElement('td');
          td.setAttribute('class', 'align-middle');

          let btn_update = document.createElement('button');
          setAttributes(btn_update,{
            'type': 'button',
            'class': "btn btn-outline-primary pb-1",
            'data-toggle': 'modal',
            'data-target': '#shopModal',
            'id': '#modalCenter',
            'data-id': data.id,
            'data-cat': data.pro_category__name,
            'data-proname': data.name,
            'data-price': data.price,
            'data-stock': data.stock,
          });

          btn_update.innerText = '수정';
          td.appendChild(btn_update);

          return td.innerHTML;
          },
      },
      {
        "targets": 6,
        "render": function (data) {
            let td = document.createElement('td');
            td.setAttribute('class', 'align-middle');

            let btn_delete = document.createElement('button');
            setAttributes(btn_delete, {
              'type': 'button',
              'class': "btn btn-outline-danger pb-1",
              'onClick': "deleteProduct(" + data.id + ")"
            });

            btn_delete.innerText = '삭제';
            td.appendChild(btn_delete);
            return td.innerHTML;
        }
      },
    ],
    columns: [
      {data : 'id'},
      {data : 'pro_category__name'},
      {data : 'name'},
      {data : 'price'},
      {data : 'stock'},
      {data : null},
      {data : null},
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
    columns: [
      {data : 'id'},
      {data : 'pro_category__name'},
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
