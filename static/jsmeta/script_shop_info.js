$(document).ready(function () {
  $('#dataTableHover').DataTable(); // ID From dataTable with Hover
});

$('#btn-submit').click(function(){
  submitStart();
});

async function submitStart() {
  const response = await fetch('shop', {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'X-CSRFToken': getCookie('csrftoken')
    },
    body: JSON.stringify({
      csrfmiddlewaretoken: window.CSRF_TOKEN,
      ShopName:$('#ShopName').val(),
      ShopCategoryId: $('#ShopCategoryId').val(),
      Manager: $('#Manager').val(),
      ShopPhone: $('#ShopPhone').val(),
  })
  }).catch((error) => {
    alert(error);
  })

  const result = await response.json()
  if(result.success){
    const ShopTable = document.getElementById('bulk-select-body');
    const row = ShopTable.insertRow(ShopTable.rows.length);
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    const cell4 = row.insertCell(3);
    const cell5 = row.insertCell(4);
    const cell6 = row.insertCell(5);
    const cell7 = row.insertCell(6);

    cell1.innerHTML = result.ShopId;
    cell2.innerHTML = result.ShopCategory;
    cell3.innerHTML = result.ShopName;
    cell4.innerHTML = result.Manager;
    cell5.innerHTML = '<td type="tel" class="align-middle Phone" pattern="[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}" maxlength="13">'+result.ShopPhone+'</td>';
    cell6.innerHTML = '<td class="align-middle"><button class="btn btn-outline-success mb-1" type="button">수정</button></td>';
    cell7.innerHTML = '<td class="align-middle"><button class="btn btn-outline-danger mb-1" type="button">삭제</button></td>';
    }
}

