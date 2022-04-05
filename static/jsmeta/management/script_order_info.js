document.addEventListener("DOMContentLoaded", function(){
  let status = document.getElementsByClassName('status');
  [].forEach.call(status, function(status) {
      status.innerHTML=showStatus(status.getAttribute('value'));
  })

  let table = $('#dataTableHover-order').DataTable(); 
  
  $('#No').on('keyup', function () {
    table.columns(0).search( this.value ).draw();
  });
  $('#Type').on('change', function () {
    table.columns(1).search( this.value ).draw();
  });
  $('#Status').on('change', function () {
    table.columns(6).search( this.value ).draw();
  });
  $('#Name').on('keyup', function () {
    table.columns(2).search( this.value ).draw();
  });
});


//show child table
let table = $('#dataTableHover-order').dataTable(); 

table.on('click', 'td.details-control', function () {
  var tr = $(this).closest('tr');
  var row = table.api().row(tr);
  var index = row.index();
  var rowData = row.data();
  var myurl = 'order-child/' + rowData[1];

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

function showStatus(status){
  let result;
  switch(status){
    case 'Paid':
      result = '<span class="badge badge-secondary">결제완료</span>'
      break;
    case 'Processing':
      result = '<span class="badge badge-info">배송준비중</span>'
      break;
    case 'Pending':
      result = '<span class="badge badge-danger">배송지연</span>'
      break;
    case 'Shipping':
      result = '<span class="badge badge-blue">배송중</span>'
      break;
    case 'Delivered':
      result = '<span class="badge badge-success">배송완료</span>'
      break;
  }
  return result;
}
