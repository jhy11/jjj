document.addEventListener("DOMContentLoaded", function(){

  let status = document.getElementsByClassName('status');
  [].forEach.call(status, function(status) {
    //status.innerHTML=showStatus(status.getAttribute('value'));
  })

  let table_delivered = $('#dataTableHover-delivered').DataTable();
  table_delivered.columns(4).search( '배송준비중' ).draw();

  $('#status').on('change', function () {
    let status_info = $("input[name='status']:checked").val();
    table_delivered.columns(4).search( status_info ).draw();

    //let status = getStatus(status_info);
    //table.columns(4).search( status ).draw();
  });
});

//Detect if checkbox is checked or not
$('#dataTableHover-delivery tbody').on('change', 'input[type="checkbox"]', async function(){
  let id = $(this).attr('id');
  let transport_no = document.getElementById('transport_no-'+id).value;

  //운송장 번호를 입력하지 않았다면
  if (transport_no === '') {
    alert('운송장번호를 입력하세요');
    $(this).prop("checked", false);
    return;
  }

  const url = '/management/delivery?id=' + encodeURIComponent(id);
  const response = await fetch(url,{
    method: 'PUT',
    headers:{'X-CSRFToken': getCookie('csrftoken')},
    body: JSON.stringify({
      id: $(this).attr('id'),
      transport_no: transport_no,
    })
  })
  .catch((error)=>{
    alert(error);
  });

  const result = await response.json();
  //reload datatable

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