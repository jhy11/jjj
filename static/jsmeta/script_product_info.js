//pro-RequestedTable
$(document).ready(function() {
  var table = $('#dataTableHover1').DataTable(); 
  
  $('#catSearch').on('change', function () {
    table.columns(1).search( this.value ).draw();
  });
  $('#shopSearch').on('keyup', function () {
    table.columns(2).search( this.value ).draw();
  });
  $('#nameSearch').on('keyup', function () {
    table.columns(3).search( this.value ).draw();
  });

  $.fn.dataTable.ext.search.push(
    function( settings, searchData) {
      if (settings.nTable.id !== 'dataTableHover1'){
        return true;
      }
      var min = parseInt($('#minPrice').val(), 10);
      var max = parseInt($('#maxPrice').val(), 10);
      var price = parseFloat(searchData[4]) || 0;
  
      if ((isNaN(min) && isNaN(max)) || (isNaN(min) && price <= max) ||
      (min <= price && isNaN(max)) ||(min <= price && price <= max)){
        return true;
      }
      return false;
    });

    $('#minPrice, #maxPrice').keyup(function(){
      table.draw();
    });
});

//pro-OnSaleTable search
$(document).ready(function () {
  var table = $('#dataTableHover2').DataTable(); 

  $('#catSearch2').on('change', function () {
    table.columns(1).search( this.value ).draw();
  });
  $('#shopSearch2').on('keyup', function () {
    table.columns(2).search( this.value ).draw();
  });
  $('#nameSearch2').on('keyup', function () {
    table.columns(3).search( this.value ).draw();
  });
  $('#priceSearch2').on('keyup', function () {
    table.columns(4).search( this.value ).draw();
  });

  $.fn.dataTable.ext.search.push(
    function( settings, searchData) {
      if (settings.nTable.id !== 'dataTableHover2'){
        return true;
      }
      var min = parseInt($('#minPrice2').val(), 10);
      var max = parseInt($('#maxPrice2').val(), 10);
      var price = parseFloat(searchData[4]) || 0;
  
      if ((isNaN(min) && isNaN(max)) || (isNaN(min) && price <= max) ||
      (min <= price && isNaN(max)) ||(min <= price && price <= max)){
        return true;
      }
      return false;
    });

    $('#minPrice2, #maxPrice2').keyup(function(){
      table.draw();
    });
});


//Approve the sale of products (product.status: 1)
async function approvePro(id, category, shop, name, price, stock, description) {
    const response = await fetch('product', {
      method: "PUT",
      headers: {
        'Accept': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
      },
      body: JSON.stringify({
        csrfmiddlewaretoken: window.CSRF_TOKEN,
        ProductId:id,
        Category:category,
        Shop:shop,
        Status:'1',
        Name:name,
        Price:price,
        Stock:stock,
        Description:description,
      })
    }).catch((error) => {
      alert(error);
    });
    const result = await response.json();
    console.log(result);
    if(result.success){
        if(result.success){
          $( "#pro-RequestedTable" ).load( "product #pro-RequestedTable" );
          $( "#pro-OnSaleTable" ).load( "product #pro-OnSaleTable" );
        }
    }
  }

//Reject the registration of sales product (product.status: 2)
async function rejectPro(id, category, shop, name, price, stock, description) {
    const response = await fetch('product', {
      method: "PUT",
      headers: {
        'Accept': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
      },
      body: JSON.stringify({
        csrfmiddlewaretoken: window.CSRF_TOKEN,
        ProductId:id,
        Category:category,
        Shop:shop,
        Status:'2',
        Name:name,
        Price:price,
        Stock:stock,
        Description:description,
      })
    }).catch((error) => {
      alert(error);
    });
    const result = await response.json();
    console.log(result);
    if(result.success){
        if(result.success){
          $( "#pro-RequestedTable" ).load( "product #pro-RequestedTable" );
        }
    }
  }


//Stop selling the product (product.status: 3)
//신고 접수 등과 같은 사유로 강제 중지
//product.status 4: 판매자가 판매 종료
async function suspendPro(id, category, shop, name, price, stock, description) {
  const response = await fetch('product', {
    method: "PUT",
    headers: {
      'Accept': 'application/json',
      'X-CSRFToken': getCookie('csrftoken')
    },
    body: JSON.stringify({
      csrfmiddlewaretoken: window.CSRF_TOKEN,
      ProductId:id,
      Category:category,
      Shop:shop,
      Status:'3',
      Name:name,
      Price:price,
      Stock:stock,
      Description:description,
    })
  }).catch((error) => {
    alert(error);
  });
  const result = await response.json();
  console.log(result);
  if(result.success){
      if(result.success){
        $( "#pro-OnSaleTable" ).load( "product #pro-OnSaleTable" );
      }
  }
}

//Delete the product
  async function deletePro(productId) {
    
    const response = await fetch('product', {
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
        productId: productId,
      }),
    }).catch((error) => {
      alert(error);
    });
  
    const result = await response.json();
    
    //reload only table after deleting
    if(result.success){
      $( "#pro-OnSaleTable" ).load( "product #pro-OnSaleTable" );
    }
  }