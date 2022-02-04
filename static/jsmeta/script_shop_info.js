$(document).ready(function () {
  $('#dataTableHover').DataTable(); // ID From dataTable with Hover
});

$('#btn-submit').click(function(){
  submitStart();
});

function submitStart(){
  fetch('shop',{
      method: "POST",
      headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json; charset=UTF-8',
          'X-CSRFToken': getCookie('csrftoken')
      },
      body: JSON.stringify({
          csrfmiddlewaretoken: window.CSRF_TOKEN,
          ShopName:$('#ShopName').val(),
          ShopCategoryId: $('#ShopCategoryId').val(),
          Manager: $('#Manager').val(),
          ShopPhone: $('#ShopPhone').val(),
      })
  }).then((response)=>response.json())
  .then((json)=>console.log(json))
  .catch(err=>console.error(err));
}

