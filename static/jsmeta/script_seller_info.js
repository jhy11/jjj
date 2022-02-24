let getbyId = function(id){
  return document.getElementById(id);
}

const btn_submit = getbyId("btn-submit");    

btn_submit.addEventListener("click", function(){
  submitStart();
});

async function submitStart() {
  const response = await fetch('seller_product', {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'X-CSRFToken': getCookie('csrftoken')
    },
    body: JSON.stringify({
      csrfmiddlewaretoken: window.CSRF_TOKEN,    
      ProductCategoryId: $('#ProductCategoryId').val(),
      ProductName: $('#ProductName').val(),
      ProductPrice: $('#ProductPrice').val(),
      ProductStock: $('#ProductStock').val(),
      ProductDescription: $('#ProductDescription').val(),
    })
  }).catch((error) => {
    alert(error);
  });

  const result = await response.json();
  
  if(result.success){
    loadNewData(result);
  }
  else{
    alert(result.message);
  }
}

async function updateProduct(){
  const response = await fetch('seller_product',{
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
      console.log("2");
      loadNewData2(result);
    }
   
}
}

async function deleteProduct(id) {

  const response = await fetch('seller_product', {
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
    //$("#sellerRequestedTable").load( "seller_product #sellerRequestedTable" );
  }
}

//pass data to modal and set value
$('#shopModal').on('show.bs.modal', function(event) {  
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
  $('#dataTableHover1').dataTable({
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
          'class': "btn btn-outline-primary mb-1",
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
            'class': "btn btn-outline-danger mb-1",
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

