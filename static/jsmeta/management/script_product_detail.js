//판매자 판매 승인 신청
const Requested = '0'
//판매 승인된 상품 (판매중)
const OnSale = '1'
//판매 승인 신청 반려된 상품
const Rejected = '2'
//판매 중지된 상품
const Stopped = '3'

//Approve the sale of products (product.status: 1)
async function approvePro(id) {
    const response = await fetch('change-status', {
      method: 'PUT',
      headers: new Headers({
        'X-CSRFToken': getCookie('csrftoken'),
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        Id: id,
        Status: OnSale
      }),
    }).catch((error) => {
      alert(error);
    });
  
    const result = await response.json();
    
    if(result.success){
        alert("상품의 판매가 승인되었습니다");
        location.href='/management/product';
    }else{
      alert("error");
    }
}



//Reject the registration of sales product (product.status: 2)
async function rejectPro(id) {
    const response = await fetch('change-status', {
      method: 'PUT',
      headers: new Headers({
        'X-CSRFToken': getCookie('csrftoken'),
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        Id: id,
        Status: Rejected
      }),
    }).catch((error) => {
      alert(error);
    });
  
    const result = await response.json();
  
    if(result.success){
        alert("반려 처리되었습니다");
        location.href='/management/product';
    }else{
        alert("error");
    }
}


//Stop selling the product (product.status: 3)
//신고 접수 등과 같은 사유로 강제 중지
//product.status 4: 판매자가 판매 종료
async function stopPro(id) {
    const response = await fetch('change-status', {
      method: 'PUT', 
      headers: new Headers({
        'X-CSRFToken': getCookie('csrftoken'),
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        Id: id,
        Status: Stopped
      }),
    }).catch((error) => {
      alert(error);
    });
  
    const result = await response.json();
   
    if(result.success){
        alert("상품이 판매중지되었습니다");
        location.href='/management/product';
    }else{
        alert("error");
    }
}


//delete product
async function deletePro(id) {
    const response = await fetch('change-status', {
      method: 'DELETE',
      headers: new Headers({
        'X-CSRFToken': getCookie('csrftoken'),
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        Id: id,
      }),
    }).catch((error) => {
      alert(error);
    });
  
    const result = await response.json();
  
    if(result.success){
        alert("상품이 삭제되었습니다");
        location.href='/management/product';
    }else{
        alert("error");
    }
}