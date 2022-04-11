function setAttributes(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}

document.addEventListener("DOMContentLoaded", function(){

  let table_delivery = $('#dataTableHover-delivery').DataTable({
    'destroy': true,
    'autoWidth': false,

    'ajax': {
      'type' : 'GET',
      'url': '/management/shortdelivery-table',
      'dataSrc': 'delivery'
    },
    columnDefs: [
      {
        "targets": 0,
        "render": function (data) {
          let td = document.createElement('td');
          setAttributes(td,{
            'class': 'details-control',
          });
          return td.outerHTML;
        }
      },
      {
        "targets": 4,
        "render": function(data) {
          let td = document.createElement('td');
          let input = document.createElement('input');

          setAttributes(td,{
            'class': 'align-middle',
            'id': 'TransportNo'
          });
          setAttributes(input, {
            'type': 'text',
            'id': 'transport_no-'+data.id,
            'name': 'transport_no',
            'style': 'border: 1px solid #e3e6f0; border-radius: 4px; color:#757575;'
          });
          td.appendChild(input);

          return td.outerHTML;
        }
      },
      {
        "targets": 5,
        "render": function (data) {
          return showStatus(data.status);
        }
      },
      {
        "targets": 6,
        "render": function (data) {
          let td = document.createElement('td');
          let input = document.createElement('input');
          let label = document.createElement('label');

          setAttributes(td,{
            'class': 'align-middle custom-control custom-switch ml-5',
          });
          setAttributes(input, {
            'type': 'checkbox',
            'class': "custom-control-input",
            'id': data.id,
          });
          setAttributes(label, {
            'class': "custom-control-label",
            'for': data.id,
          });
          td.append(input, label);

          return td.outerHTML;
        }
      }
    ],
    columns: [
      {data : null},
      {data : 'order_no'},
      {data : 'call'},
      {data : 'code'},
      {data : null},
      {data : null},
      {data : null},
    ],
  });

  let table_delivered = $('#dataTableHover-delivered').DataTable({
    'destroy': true,
    'autoWidth': false,

    'ajax': {
      'type' : 'GET',
      'url': '/management/shortdelivery-table',
      'dataSrc': 'delivered'
    },
    columnDefs: [
      {
        "targets": 0,
        "render": function (data) {
          let td = document.createElement('td');
          setAttributes(td,{
            'class': 'details-control',
          });

          return td.outerHTML;
        }
      },
      {
        "targets": 5,
        "render": function (data) {
          return showStatus(data.status);
        }
      },
    ],
    columns: [
      {data : null},
      {data : 'order_no'},
      {data : 'call'},
      {data : 'code'},
      {data : 'transport_no'},
      {data : null},
    ],
  });

  table_delivered.columns(5).search( '결제완료' ).draw();

  //Filter data with checked radio button
  $('#status').on('change', function () {
    let status_info = $("input[name='status']:checked").val();
    table_delivered.columns(5).search( status_info ).draw();
  });
});

//Detect if checkbox is checked or not
$('#dataTableHover-delivery').on('change', 'input[type="checkbox"]', async function(){
  let id = $(this).attr('id');
  let transport_no = document.getElementById('transport_no-'+id).value;

  //운송장 번호를 입력하지 않았다면
  if (transport_no === '') {
    alert('운송장번호를 입력하세요');
    $(this).prop("checked", false);
    return;
  }

  const url = '/management/shortdelivery?id=' + encodeURIComponent(id);
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



//show child table of delivery table
let table = $('#dataTableHover-delivery').dataTable(); 

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
          '<table class="child_table" id="delivery_details'+ index +'" style="width:100%" cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
          '<thead class="thead-light"><tr><th>상품명</th><th>상점</th><th>수량</th><th>주문상태</th></tr></thead><tbody>' +
           '</tbody></table>').show();
      tr.addClass('shown');
      
      $('#delivery_details'+index).dataTable({
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


//show child table of delivered table
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
          '<table class="child_table" id="delivered_details'+ index +'" style="width:100%" cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
          '<thead class="thead-light"><tr><th>상품명</th><th>상점</th><th>수량</th><th>주문상태</th></tr></thead><tbody>' +
           '</tbody></table>').show();
      tr.addClass('shown');
      
      $('#delivered_details'+index).dataTable({
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