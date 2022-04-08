document.addEventListener("DOMContentLoaded", function(){

  //Create status badges
  let status = document.getElementsByClassName('status');
  [].forEach.call(status, function(status) {
    status.innerHTML=showStatus(status.getAttribute('value'));
  })

  //포장 테이블
  let table_delivery = $('#dataTableHover-delivery').DataTable();
  let table_delivered = $('#dataTableHover-delivered').DataTable();
  //드라이브스루 테이블
  let table_drivethru = $('#dataTableHover-drivethru').DataTable();
  let table_drivethru1 = $('#dataTableHover-drivethru1').DataTable();

  //검색 디폴트 옵션
  table_delivery.columns(3).search( '상품준비완료' ).draw();
  table_delivered.columns(3).search( '결제완료' ).draw();
  table_drivethru.columns(3).search( '상품준비완료' ).draw();
  table_drivethru1.columns(3).search( '결제완료' ).draw();

  //체크된 체크박스에 따라 데이터테이블 검색
  $('#status1').on('change', function () {
    let status_info = $("input[name='status1']:checked").val();
    table_delivery.columns(3).search( status_info ).draw();
  });

  $('#status').on('change', function () {
    let status_info = $("input[name='status']:checked").val();
    table_delivered.columns(3).search( status_info ).draw();
  });
  $('#status3').on('change', function () {
    let status_info = $("input[name='status3']:checked").val();
    table_drivethru.columns(3).search( status_info ).draw();
  });

  $('#status4').on('change', function () {
    let status_info = $("input[name='status4']:checked").val();
    table_drivethru1.columns(3).search( status_info ).draw();
  });

});

//포장
//Detect if checkbox is checked or not
$('#dataTableHover-delivery tbody').on('change', 'input[type="checkbox"]', async function(){
  let id = $(this).attr('id');
  let status = document.getElementById('Status-'+id).getAttribute('value');

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


//드라이브스루
//Detect if checkbox is checked or not
$('#dataTableHover-drivethru tbody').on('change', 'input[type="checkbox"]', async function(){
  let id = $(this).attr('id');
  let status = document.getElementById('Status-'+id).getAttribute('value');

  const url = '/management/drivethru?id=' + encodeURIComponent(id);
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



//show child table of 포장 delivery table
let table1 = $('#dataTableHover-delivery').dataTable(); 

table1.on('click', 'td.details-control', function () {
  var tr = $(this).closest('tr');
  var row = table1.api().row(tr);
  var index = row.index();
  var rowData = row.data();
  var myurl = '/management/show-child/' + rowData[1];

  if (row.child.isShown()) {
      row.child.hide();
      tr.removeClass('shown');
  }else{
      if (table1.api().row('.shown').length) {
          $('.details-control', table1.api().row('.shown').node()).click();
      }
      row.child( 
          '<table class="child_table" id="pickup_delivery_details'+ index +'" style="width:100%" cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
          '<thead class="thead-light"><tr><th>상품명</th><th>상점</th><th>수량</th><th>주문상태</th></tr></thead><tbody>' +
           '</tbody></table>').show();
      tr.addClass('shown');
      
      $('#pickup_delivery_details'+index).dataTable({
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


//show child table of 포장 delivered table
let table2 = $('#dataTableHover-delivered').dataTable(); 

table2.on('click', 'td.details-control', function () {
  var tr = $(this).closest('tr');
  var row = table2.api().row(tr);
  var index = row.index();
  var rowData = row.data();
  var myurl = '/management/show-child/' + rowData[1];

  if (row.child.isShown()) {
      row.child.hide();
      tr.removeClass('shown');
  }else{
      if (table2.api().row('.shown').length) {
          $('.details-control', table2.api().row('.shown').node()).click();
      }
      row.child( 
          '<table class="child_table" id="pickup_delivered_details'+ index +'" style="width:100%" cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
          '<thead class="thead-light"><tr><th>상품명</th><th>상점</th><th>수량</th><th>주문상태</th></tr></thead><tbody>' +
           '</tbody></table>').show();
      tr.addClass('shown');
      
      $('#pickup_delivered_details'+index).dataTable({
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


//show child table of 드라이브스루 delivery table
let table3 = $('#dataTableHover-drivethru').dataTable(); 

table3.on('click', 'td.details-control', function () {
  var tr = $(this).closest('tr');
  var row = table3.api().row(tr);
  var index = row.index();
  var rowData = row.data();
  var myurl = '/management/show-child/' + rowData[1];

  if (row.child.isShown()) {
      row.child.hide();
      tr.removeClass('shown');
  }else{
      if (table3.api().row('.shown').length) {
          $('.details-control', table3.api().row('.shown').node()).click();
      }
      row.child( 
          '<table class="child_table" id="drivethru_details'+ index +'" style="width:100%" cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
          '<thead class="thead-light"><tr><th>상품명</th><th>상점</th><th>수량</th><th>주문상태</th></tr></thead><tbody>' +
           '</tbody></table>').show();
      tr.addClass('shown');
      
      $('#drivethru_details'+index).dataTable({
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


//show child table of 드라이브스루 delivered table
let table4 = $('#dataTableHover-drivethru1').dataTable(); 

table4.on('click', 'td.details-control', function () {
  var tr = $(this).closest('tr');
  var row = table4.api().row(tr);
  var index = row.index();
  var rowData = row.data();
  var myurl = '/management/show-child/' + rowData[1];

  if (row.child.isShown()) {
      row.child.hide();
      tr.removeClass('shown');
  }else{
      if (table4.api().row('.shown').length) {
          $('.details-control', table4.api().row('.shown').node()).click();
      }
      row.child( 
          '<table class="child_table" id="drivethru1_details'+ index +'" style="width:100%" cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
          '<thead class="thead-light"><tr><th>상품명</th><th>상점</th><th>수량</th><th>주문상태</th></tr></thead><tbody>' +
           '</tbody></table>').show();
      tr.addClass('shown');
      
      $('#drivethru1_details'+index).dataTable({
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
    case Paid:
      result = '<span class="badge badge-warning align-middle">결제완료</span>'
      break;
    case Completed:
      result = '<span class="badge badge-success align-middle">상품준비완료</span>'
      break;
    case Processing:
      result = '<span class="badge badge-primary align-middle">픽업대기중</span>'
      break;
    case Shipping:
      result = '<span class="badge badge-info align-middle">배송중</span>'
      break;
    case Delivered:
      result = '<span class="badge badge-secondary align-middle">픽업완료</span>'
      break;
  }
  return result;
}