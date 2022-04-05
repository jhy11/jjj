document.addEventListener("DOMContentLoaded", function(){

  let status = document.getElementsByClassName('status');
  [].forEach.call(status, function(status) {
    //status.innerHTML=showStatus(status.getAttribute('value'));
  })

  //포장 테이블
  let table_delivery = $('#dataTableHover-delivery').DataTable();
  let table_delivered = $('#dataTableHover-delivered').DataTable();

  //검색 디폴트 옵션
  table_delivery.columns(2).search( '상품준비완료' ).draw();
  table_delivered.columns(2).search( '결제완료' ).draw();
  //체크된 체크박스에 따라 데이터테이블 검색
  $('#status1').on('change', function () {
    let status_info = $("input[name='status1']:checked").val();
    table_delivery.columns(2).search( status_info ).draw();
  });

  $('#status').on('change', function () {
    let status_info = $("input[name='status']:checked").val();
    table_delivered.columns(2).search( status_info ).draw();

    //let status = getStatus(status_info);
    //table.columns(4).search( status ).draw();
  });

});

//포장
//Detect if checkbox is checked or not
$('#dataTableHover-delivery tbody').on('change', 'input[type="checkbox"]', async function(){
  let id = $(this).attr('id');
  let status = document.getElementById('Status-'+id).innerText;
  status = getStatus(status);

  const url = '/management/pickup?id=' + encodeURIComponent(id);
  const response = await fetch(url,{
    method: 'PUT',
    headers:{'X-CSRFToken': getCookie('csrftoken')},
    body: JSON.stringify({
      id: $(this).attr('id'),
      status: status,
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
    case '픽업대기':
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