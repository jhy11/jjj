let getbyId = function(id){
  return document.getElementById(id);
}

const btn_submit = getbyId("btn-submit");    

document.addEventListener("DOMContentLoaded", function(){
  $('#dataTableHover').DataTable(); 
});

btn_submit.addEventListener("click", function(){
  submitStart();
  $('#dataTableHover').DataTable(); 

})

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
      Manager: getbyId('Manager').value,
      ShopPhone: getbyId('ShopPhone').value,
    })
  }).catch((error) => {
    alert(error);
  });

  const result = await response.json();
  
  if(result.success){

    const array = Object.values(result);
    const index = Object.values(result);
    $('#shopa').find('input').each(function(){
      $(this).val('');
    });
    /*
    //Create table row
    const dataTableHover = $('#bulk-select-body');
    dataTableHover.append('<tr></tr>');

    for(let i = 0; i<array.length-1; i++){
      dataTableHover.append($('<td class="align-middle"'+ array[i] +'id=' + index[i] + 'required>'+ array[i] +'</td>'));
    }
    dataTableHover.append($('<td class="align-middle"><button class="btn btn-outline-primary mb-1" type="button">수정</button></td>'));
    dataTableHover.append($('<td class="align-middle"><button class="btn btn-outline-danger mb-1" type="button">삭제</button></td>'));
    */
    $( "#shopTable" ).load( "shop #shopTable" );
  }
  else{
    alert(result.message);
  }
  /*
  $('#example').dataTable( {
    "paging": true
  } );
  */
  //$('#dataTableHover').dataTable().fnClearTable(); 
  //$('#dataTableHover').DataTable().ajax.reload();
  //$('#dataTableHover').DataTable().draw();
  //clear inputs
  //$("#shopa").trigger('reset')
  //document.getElementById("dataTableHover").reset();
  //getbyId('table-shop').reset();
  //$(':input', '#shopa').val('')

  //console.log($(':input', '#dataTableHover').val());
}

async function updateShop() {
  console.log(getbyId('ShopName').value);
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
      Manager: getbyId('modal-Manager').value,
      ShopPhone: getbyId('modal-ShopPhone').value,
    })
  }).catch((error) => {
    alert(error);
  });

  const result = await response.json();

  if(result.success){
    //$( "#dataTableHover" ).load( "shop #dataTableHover" );
    //$('#dataTableHover').DataTable().ajax.reload();

    //$( "#aaa" ).load(" #aaa > *" );
    $("#dataTableHover").load(window.location.href + " #dataTableHover" );

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
    $( "#dataTableHover" ).load( "shop #dataTableHover" );
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

  $('#modal-Id').attr('value', id);
  $('#modal-ShopName').attr('value', shopName);
  $('#modal-Manager').attr('value', manager);
  $('#modal-ShopPhone').attr('value', phone);
  
});