document.addEventListener("DOMContentLoaded", function(){

  let status = document.getElementsByClassName('status');
  [].forEach.call(status, function(status) {
    //status.innerHTML=showStatus(status.getAttribute('value'));
  })

  //Datatable of pickup and drivethru
  let table_pickup = $('#dataTableHover-pickup').DataTable();
  let table_pickup1 = $('#dataTableHover-pickup1').DataTable();
  let table_drivethru = $('#dataTableHover-drivethru').DataTable();
  let table_drivethru1 = $('#dataTableHover-drivethru1').DataTable();

  //Set an option by default
  table_pickup.columns(4).search( '결제완료' ).draw();
  table_pickup1.columns(4).search( '배송준비중' ).draw();
  table_drivethru.columns(4).search( '결제완료' ).draw();
  table_drivethru1.columns(4).search( '배송준비중' ).draw();

  //Filter data with checked radio button
  $('#status1').on('change', function () {
    let status_info = $("input[name='status1']:checked").val();
    table_pickup.columns(4).search( status_info ).draw();
  });
  $('#status').on('change', function () {
    let status_info = $("input[name='status']:checked").val();
    table_pickup1.columns(4).search( status_info ).draw();
  });
  $('#status2').on('change', function () {
    let status_info = $("input[name='status2']:checked").val();
    table_drivethru.columns(4).search( status_info ).draw();
  });
  $('#status3').on('change', function () {
    let status_info = $("input[name='status3']:checked").val();
    table_drivethru1.columns(4).search( status_info ).draw();
  });
});

//pickup
//Detect if checkbox is checked or not
$('#dataTableHover-pickup tbody').on('change', 'input[type="checkbox"]', async function(){
  let id = $(this).attr('id');

  const url = '/seller/pickup?id=' + encodeURIComponent(id);
  const response = await fetch(url,{
    method: 'PUT',
    headers:{'X-CSRFToken': getCookie('csrftoken')},
    body: JSON.stringify({
      id: $(this).attr('id'),
    })
  })
  .catch((error)=>{
    alert(error);
  });

  const result = await response.json();
  //$('#dataTableHover-pickup').DataTable().ajax.reload(null, false);

});

//drivethru
//Detect if checkbox is checked or not
$('#dataTableHover-pickup tbody').on('change', 'input[type="checkbox"]', async function(){
  let id = $(this).attr('id');

  const url = '/seller/drivethru?id=' + encodeURIComponent(id);
  const response = await fetch(url,{
    method: 'PUT',
    headers:{'X-CSRFToken': getCookie('csrftoken')},
    body: JSON.stringify({
      id: $(this).attr('id'),
    })
  })
  .catch((error)=>{
    alert(error);
  });

  const result = await response.json();
});

function showStatus(status){
  let result;
  switch(status){
    case Paid:
      result = '<span class="badge badge-warning align-middle">결제완료</span>'
      break;
    case Completed:
      result = '<span class="badge badge-success align-middle">상품준비완료</span>'
      break;
    case Processing:
      result = '<span class="badge badge-primary align-middle">배송준비중</span>'
      break;
    case Shipping:
      result = '<span class="badge badge-info align-middle">배송중</span>'
      break;
    case Delivered:
      result = '<span class="badge badge-secondary align-middle">배송완료</span>'
      break;
  }
  return result;
}

function getStatus(status){
  let result;

  switch(status){
    case '결제완료':
      result = Paid;
      break;
    case '상품준비완료':
      result = Completed;
      break;
    case '배송준비중':
      result = Processing;
      break;
    case '배송중':
      result = Shipping;
      break;
    case '배송완료':
      result = Delivered;
      break;
  }
  return result;
}