$(document).ready(function () {
  $('#dataTableHover').DataTable(); // ID From dataTable with Hover
});

$('#btn-submit').click(function(){
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
      ShopName:$('#ShopName').val(),
      ShopCategoryId: $('#ShopCategoryId').val(),
      Manager: $('#Manager').val(),
      ShopPhone: $('#ShopPhone').val(),
    })
  }).catch((error) => {
    alert(error);
  });

  const result = await response.json();
  
  if(result.success){
    const array = Object.values(result);
    const index = Object.values(result);
    
    const shopTable = $('#bulk-select-body');
    shopTable.append('<tr></tr>');

    for(let i = 0; i<array.length-1; i++){
      shopTable.append($('<td class="align-middle"'+ array[i] +'id=' + index[i] + 'required>'+ array[i] +'</td>'));
    }
    shopTable.append($('<td class="align-middle"><button class="btn btn-outline-success mb-1" type="button">수정</button></td>'));
    shopTable.append($('<td class="align-middle"><button class="btn btn-outline-danger mb-1" type="button">삭제</button></td>'));
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
      ShopName:$('#shopModal #ShopName').val(),
      ShopCategoryId: $('#shopModal #ShopCategoryId').val(),
      Manager: $('#shopModal#Manager').val(),
      ShopPhone: $('#shopModal #ShopPhone').val(),
    })
  }).catch((error) => {
    alert(error);
  });

  const result = await response.json();
  console.log(result);
  if(result.success){
    console.log(result);

  }
}

async function deleteShop(shop_name) {

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
      ShopName: shop_name,
    }),
  }).catch((error) => {
    alert(error);
  });

  const result = await response.json();
  
  //reload only table after deleting
  if(result.success){
    $( "#shopTable" ).load( "shop #shopTable" );
  }
}

//pass data to modal and set value
$('#shopModal').on('show.bs.modal', function(event) {          
  cat = $(event.relatedTarget).data('cat');
  shopName = $(event.relatedTarget).data('shop');
  manager = $(event.relatedTarget).data('manager');
  phone = $(event.relatedTarget).data('phone');
  console.log(cat);
  $('#shopModal #ShopCategoryId').val(cat);
  $('#shopModal #ShopName').attr('value', shopName);
  $('#shopModal #Manager').attr('value', manager);
  $('#shopModal #ShopPhone').attr('value', phone);
});