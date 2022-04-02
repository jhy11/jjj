document.addEventListener("DOMContentLoaded", function(){

  let status = document.getElementsByClassName('status');
  [].forEach.call(status, function(status) {
    //status.innerHTML=showStatus(status.getAttribute('value'));
  })

  let table_canceled = $('#dataTableHover-canceled').DataTable();
  let table_cancel = $('#dataTableHover-cancel').DataTable();

  table_canceled.columns(4).search( '취소처리중' ).draw();
  table_cancel.columns(4).search( '취소요청' ).draw();

  $('#status').on('change', function () {
    let status_info = $("input[name='status']:checked").val();
    table_canceled.columns(4).search( status_info ).draw();

    //let status = getStatus(status_info);
    //table.columns(4).search( status ).draw();
  });
  $('#status1').on('change', function () {
    let status_info = $("input[name='status1']:checked").val();
    table_cancel.columns(4).search( status_info ).draw();
  });
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