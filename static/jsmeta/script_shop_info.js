let getbyId = function(id){
  return document.getElementById(id);
}

const btn_submit = getbyId("btn-submit");    

document.addEventListener("DOMContentLoaded", function(){
  $('#dataTableHover').dataTable({
    "bPaginate": true,
  }); 
});

btn_submit.addEventListener("click", function(){
  submitStart();
});

async function submitStart() {
  const response = await fetch('shop', {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'X-CSRFToken': getCookie('csrftoken')
    },
    body: JSON.stringify({
      csrfmiddlewaretoken: window.CSRF_TOKEN,
      ShopName:getbyId('ShopName').value,
      ShopCategoryId: getbyId('ShopCategoryId').value,
      ManagerId: getbyId('ManagerId').value,
      ShopPhone: getbyId('ShopPhone').value,
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

async function updateShop() {

  const response = await fetch('shop', {
    method: "PUT",
    headers: {
      'Accept': 'application/json',
      'X-CSRFToken': getCookie('csrftoken')
    },
    body: JSON.stringify({
      csrfmiddlewaretoken: window.CSRF_TOKEN,
      Id: getbyId('modal-Id').getAttribute('value'),
      ShopName:getbyId('modal-ShopName').value,
      ShopCategoryId: getbyId('modal-ShopCategoryId').value,
      ManagerId: getbyId('modal-ManagerId').value,
      ShopPhone: getbyId('modal-ShopPhone').value,
    })
  }).catch((error) => {
    alert(error);
  });

  const result = await response.json();

  if(result.success){
    loadNewData(result);
  }
}
function setAttributes(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}

async function deleteShop(id) {

  const response = await fetch('shop', {
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
$('#shopModal').on('show.bs.modal', function(event) {  
  id = $(event.relatedTarget).data('id');
  cat = $(event.relatedTarget).data('cat');
  shopName = $(event.relatedTarget).data('shop');
  manager = $(event.relatedTarget).data('manager');
  phone = $(event.relatedTarget).data('phone');

  $("#modal-ShopCategoryId option").filter(function() {
    return $(this).text() == cat;
  }).prop('selected', true);

  $("#modal-ManagerId option").filter(function() {
    return $(this).text() == manager;
  }).prop('selected', true);

  $('#modal-Id').attr('value', id);
  $('#modal-ShopName').attr('value', shopName);
  $('#modal-ShopPhone').attr('value', phone);
  
});

function loadNewData(result){
  $('#dataTableHover-shop').dataTable({
    destroy: true,
    data: result.shops,
    searching: false,

    columnDefs: [{
      "targets": 5,
      "render": function (data) {
          let td = document.createElement('td');
          td.setAttribute('class', 'align-middle');

          let btn_update = document.createElement('button');
          setAttributes(btn_update, {
            'type': 'button',
            'class': "btn btn-outline-primary mb-1",
            'data-toggle': 'modal',
            'data-target': '#shopModal',
            'id': '#modalCenter',
            'data-id': data.id,
            'data-cat': data.shop_category__name,
            'data-shop': data.shop_name,
            'data-manager': data.manager,
            'data-phone': data.shop_phone
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
            'class': "btn btn-outline-danger mb-1",
            'onClick': "deleteShop(" + data.id + ")"
          });

          btn_delete.innerText = '삭제';
          td.appendChild(btn_delete);

          return td.innerHTML;
      }
  }],
    "columns": [
      {data: "id"},
      {data: "shop_category__name"},
      {data: "shop_name"},
      {data: "manager__user_id__username"},
      {data: "shop_phone"},
      {data: null},
      {data: null},
    ],
  });
}