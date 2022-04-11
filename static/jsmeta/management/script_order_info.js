document.addEventListener("DOMContentLoaded", function(){
  let status = document.getElementsByClassName('status');
  [].forEach.call(status, function(status) {
      //status.innerHTML=showStatus(status.getAttribute('value'));
  })

  let type = document.getElementsByClassName('type');
  [].forEach.call(type, function(type) {
    type.innerText=showType(type.getAttribute('value'));
  })

  let table = $('#dataTableHover-order').DataTable(); 
  
  $('#No').on('keyup', function () {
    table.columns(1).search( this.value ).draw();
  });
  $('#Type').on('change', function () {
    let type = getType(this.value);
    table.columns(2).search( type ).draw();
  });
  $('#Status').on('change', function () {
    table.columns(7).search( this.value ).draw();
  });
  $('#Name').on('keyup', function () {
    table.columns(3).search( this.value ).draw();
  });
});


//show child table
let table = $('#dataTableHover-order').dataTable(); 

table.on('click', 'td.details-control', function () {
  var tr = $(this).closest('tr');
  var row = table.api().row(tr);
  var index = row.index();
  var rowData = row.data();
  var myurl = '/management/show-child/' + rowData[1];

  if (row.child.isShown()) {
      row.child.hide();
      tr.removeClass('shown');
  }else{
      if (table.api().row('.shown').length) {
          $('.details-control', table.api().row('.shown').node()).click();
      }
      row.child( 
          '<table class="child_table" id="order_details'+ index +'" style="width:100%" cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
          '<thead class="thead-light"><tr><th>상품명</th><th>상점</th><th>수량</th><th>주문상태</th></tr></thead><tbody>' +
           '</tbody></table>').show();
      tr.addClass('shown');
      
      var orderChildTable = $('#order_details'+index).dataTable({
        destroy: true,
        ajax:{
          url: myurl,
          type: "GET",
        },
        columns:[
          {data : 'product__name'},
          {data : 'product__shop__shop_name'},
          {data : 'amount'},
          {data : 'status'},
        ]
      });
    }
});

function getType(type){
  let result;
  switch(type){
    case '택배배송':
      result = Delivery;
      break;
    case '근거리배송':
      result = ShortDelivery;
      break;
    case '포장':
      result = PickUp;
      break;
    case '드라이브스루':
      result = DriveThru;
      break;
  }
  return result;
}
function showType(type){
  let result;
  switch(type){
    case Delivery:
      result = '택배배송';
      break;
    case ShortDelivery:
      result = '근거리배송';
      break;
    case PickUp:
      result = '포장';
      break;
    case DriveThru:
      result = '드라이브스루';
      break;
  }
  return result;
}
function showStatus(status){
  let result;
  switch(status){
    case Paid:
      result = '<span class="badge badge-warning align-middle">결제완료</span>';
      break;
    case Completed:
      result = '<span class="badge badge-success align-middle">상품준비완료</span>';
      break;
    case Processing:
      result = '<span class="badge badge-primary align-middle">배송준비중</span>';
      break;
    case Shipping:
      result = '<span class="badge badge-info align-middle">배송중</span>';
      break;
    case Delivered:
      result = '<span class="badge badge-secondary align-middle">배송완료</span>';
      break;
    case RefundRecived:
      result = '<span class="badge badge-warning align-middle">반품접수</span>';
      break;
    case RefundProcesing:
      result = '<span class="badge badge-success align-middle">반품처리중</span>';
      break;
    case Refunded:
      result = '<span class="badge badge-secondary align-middle">반품완료</span>';
      break;
    case CancelRecieved:
      result = '<span class="badge badge-warning align-middle">취소접수</span>';
      break;
    case CancelProcessing:
      result = '<span class="badge badge-success align-middle">취소처리중</span>';
      break;
    case Canceled:
      result = '<span class="badge badge-secondary align-middle">취소완료</span>';
      break;
    case Pending:
      result = '<span class="badge badge-warning align-middle">배송지연</span>';
      break;
  }
  return result;
}