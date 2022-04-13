function setAttributes(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}

document.addEventListener("DOMContentLoaded", function(){

  let table_pickup = $('#dataTableHover-pickup').DataTable({
    'destroy': true,
    'autoWidth': false,

    'ajax': {
      'type' : 'GET',
      'url': '/seller/pickup-table',
      'dataSrc': 'delivery'
    },
    columnDefs: [
      {
        "targets": 4,
        "render": function (data) {
          return showStatus(data.status);
        }
      },
      {
        "targets": 5,
        "render": function (data) {
          let td = document.createElement('td');
          let input = document.createElement('input');
          let label = document.createElement('label');

          if(data.status === Completed){
            setAttributes(input, {
              'checked': true,
            });
          }
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
      {data : 'order__order_no'},
      {data : 'order__call'},
      {data : 'product_id__name'},
      {data : 'amount'},
      {data : null},
      {data : null},
    ],
  });

  let table_pickup1 = $('#dataTableHover-pickup1').DataTable({
    'destroy': true,
    'autoWidth': false,

    'ajax': {
      'type' : 'GET',
      'url': '/seller/pickup-table',
      'dataSrc': 'delivered'
    },
    columnDefs: [
      {
        "targets": 4,
        "render": function (data) {
          return showStatus(data.status);
        }
      },
    ],
    columns: [
      {data : 'order__order_no'},
      {data : 'order__call'},
      {data : 'product_id__name'},
      {data : 'amount'},
      {data : null},
    ],
  });
  let table_drivethru = $('#dataTableHover-drivethru').DataTable({
    'destroy': true,
    'autoWidth': false,

    'ajax': {
      'type' : 'GET',
      'url': '/seller/drivethru-table',
      'dataSrc': 'delivery'
    },
    columnDefs: [
      {
        "targets": 4,
        "render": function (data) {
          return showStatus(data.status);
        }
      },
      {
        "targets": 5,
        "render": function (data) {
          let td = document.createElement('td');
          let input = document.createElement('input');
          let label = document.createElement('label');

          if(data.status === Completed){
            setAttributes(input, {
              'checked': true,
            });
          }
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
      {data : 'order__order_no'},
      {data : 'order__call'},
      {data : 'product_id__name'},
      {data : 'amount'},
      {data : null},
      {data : null},
    ],
  });

  let table_drivethru1 = $('#dataTableHover-drivethru1').DataTable({
    'destroy': true,
    'autoWidth': false,

    'ajax': {
      'type' : 'GET',
      'url': '/seller/drivethru-table',
      'dataSrc': 'delivered'
    },
    columnDefs: [
      {
        "targets": 4,
        "render": function (data) {
          return showStatus(data.status);
        }
      },
    ],
    columns: [
      {data : 'order__order_no'},
      {data : 'order__call'},
      {data : 'product_id__name'},
      {data : 'amount'},
      {data : null},
    ],
  });

  //Set an option by default
  table_pickup.columns(4).search( '결제완료' ).draw();
  table_pickup1.columns(4).search( '픽업대기중' ).draw();
  table_drivethru.columns(4).search( '결제완료' ).draw();
  table_drivethru1.columns(4).search( '픽업대기중' ).draw();
  
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
$('#dataTableHover-pickup').on('change', 'input[type="checkbox"]', async function(){
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
$('#dataTableHover-drivethru').on('change', 'input[type="checkbox"]', async function(){
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

function getStatus(status){
  let result;

  switch(status){
    case '결제완료':
      result = Paid;
      break;
    case '상품준비완료':
      result = Completed;
      break;
    case '픽업대기중':
      result = Processing;
      break;
    case '배송중':
      result = Shipping;
      break;
    case '픽업완료':
      result = Delivered;
      break;
  }
  return result;
}