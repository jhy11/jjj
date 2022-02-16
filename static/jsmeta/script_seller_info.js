$(document).ready(function () {
    $('#dataTableHover').DataTable(); // ID From dataTable with Hover
  });
  
  $('#btn-submit').click(function(){
    submitStart();
  });

  $('#ProductPrice').click(function(){
    submitStart();
  });
  
  async function submitStart() {
    const response = await fetch('seller_product', {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
      },
      body: JSON.stringify({
        csrfmiddlewaretoken: window.CSRF_TOKEN,    
        ProductCategoryId: $('#ProductCategoryId').val(),
        ProductName: $('#ProductName').val(),
        ProductPrice: $('#ProductPrice').val(),
        ProductStock: $('#ProductStock').val(),
        ProductDescription: $('#ProductDescription').val(),
      })
    }).catch((error) => {
      alert(error);
    });
  
    const result = await response.json();
    
    if(result.success){
      $( "#sellerRequestedTable" ).load( "seller_product #sellerRequestedTable" );
    }
    else{
      alert(result.message);
    }
  }
/*
  async function updateProduct(){
    const response = await fetch('product',{
      method: "PUT",
      headers: {
        'Accept': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
      },
      body: JSON.stringify({
        csrfmiddlewaretoken: window.CSRF_TOKEN,
        ProductName: 
        ProductPrice:
        ProductStock:
        ProductDescription:

      }),
    }).catch((error) => {
      alert(error);
    });

    const result = await response.json();
    console.log(result);

    if(result.success){
      console.log(result);
    }
  }
  */
  async function deleteShop(shop_name) {
  
    const response = await fetch('shop', {
      method: 'DELETE',
      mode: 'cors',
      cache: 'no-cache', 
      credentials: 'same-origin', 
      headers: new Headers({
        'X-CSRFToken': getCookie('csrftoken'),
        "Content-Type": "application/json",
      }),
      redirect: 'follow',
      body: JSON.stringify({
        ShopName: shop_name,
      }),
    }).catch((error) => {
      alert(error);
    });
  
    const result = await response.json();
    
    //reload only table after deleting
    if(result.success){
      $( "#shopTable" ).load( "shop #shopTable" );
    }
  }
  
  //pass data to modal and set value
  $('#shopModal').on('show.bs.modal', function(event) {          
    cat = $(event.relatedTarget).data('cat');
    shopName = $(event.relatedTarget).data('shop');
    manager = $(event.relatedTarget).data('manager');
    phone = $(event.relatedTarget).data('phone');
    console.log(cat);
    $('#shopModal #ShopCategoryId').val(cat);
    $('#shopModal #ShopName').attr('value', shopName);
    $('#shopModal #Manager').attr('value', manager);
    $('#shopModal #ShopPhone').attr('value', phone);
  });