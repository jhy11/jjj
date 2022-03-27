let getbyId = function(id){
  return document.getElementById(id);
}
const btn_submit = getbyId("btn-submit");    

document.addEventListener("DOMContentLoaded", function(){
  let status = document.getElementsByClassName('status');
  [].forEach.call(status, function(status) {
      status.innerHTML=showStatus(status.getAttribute('value'));
  })

  let table = $('#dataTableHover-products').DataTable(); 
  
  $('#catSearch').on('change', function () {
    table.columns(1).search( this.value ).draw();
  });
  $('#nameSearch').on('keyup', function () {
    table.columns(2).search( this.value ).draw();
  })
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

async function updateProduct(){
  const response = await fetch('seller-product',{
    method: "PUT",
    headers: {
      'Accept': 'application/json',
      'X-CSRFToken': getCookie('csrftoken')
    },
    body: JSON.stringify({
      csrfmiddlewaretoken: window.CSRF_TOKEN,
      Id: getbyId('modal-Id').getAttribute('value'),
      ProductCategoryId:getbyId('modal-ProductCategoryId').value,
      ProductName:getbyId('modal-ProductName').value,
      ProductPrice: getbyId('modal-ProductPrice').value,
      ProductStock: getbyId('modal-ProductStock').value,
      ProductDescription: getbyId('modal-ProductDescription').value,
    })
  }).catch((error) => {
    alert(error);
  });

  const result = await response.json();

  if(result.success){
    if(result.statusValue == 0){
      loadNewData(result);
    }
    else{
      loadNewData2(result);
    } 
  }
}

async function deleteProduct(id) {

  const response = await fetch('seller-product', {
    method: 'DELETE',
    mode: 'cors',
    cache: 'no-cache', 
    credentials: 'same-origin', 
    headers: new Headers({
      'X-CSRFToken': getCookie('csrftoken'),
      "Content-Type": "application/json",
    }),
    redirect: 'follow',
    body: JSON.stringify({
      Id: id,
    }),
  }).catch((error) => {
    alert(error);
  });

  const result = await response.json();
  
  //reload only table after deleting
  if(result.success){
    loadNewData(result);
  }
}

//pass data to modal and set value
$('#productsModal').on('show.bs.modal', function(event) {  
  //html 값을 data-value 형태로 가져와서 
  id = $(event.relatedTarget).data('id');
  cat = $(event.relatedTarget).data('cat');
  proname = $(event.relatedTarget).data('proname');
  price = $(event.relatedTarget).data('price');
  stock = $(event.relatedTarget).data('stock');
  description = $(event.relatedTarget).data('descrip');
  //모달에 집어넣는 것 -> html의 modal에 입력해줌 ->완료 누르면 updateProduct호출
  $("#modal-ProductCategoryId option").filter(function() {
    return $(this).text() == cat;
  }).prop('selected', true);
  $('#modal-Id').attr('value', id);
  $('#modal-ProductName').val(proname);
  $('#modal-ProductPrice').val(price);  
  $('#modal-ProductStock').val(stock);
  $('#modal-ProductDescription').val(description);
});

function setAttributes(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}

function loadNewData(result){
  $('#dataTableHover-products').dataTable({
    destroy: true,
    data: result.products,
    searching: false,

    columnDefs: [{
      "targets": 6,
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
          'data-descrip': data.description,
        });

        btn_update.innerText = '수정';
        td.appendChild(btn_update);

        return td.innerHTML;
      },
    },
    {
      "targets": 7,
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
  }],
    "columns": [
      {data: "id"},
      {data: "pro_category__name"},
      {data: "name"},
      {data: "price"},
      {data: "stock"},
      {data: "description"},
      {data: null},
      {data: null},
    ],
  });
}

