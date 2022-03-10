const btnEdit = document.getElementById('btnEdit');

btnEdit.addEventListener('click', async() => {

    const formData = new FormData(document.getElementById('uploadImgForm'));
    formData.append('ProductId', document.getElementById('ProductId').value);
    formData.append('ProductCategoryId', document.getElementById('ProductCategoryId').value);
    formData.append('ProductName', document.getElementById('ProductName').value);
    formData.append('ProductPrice', document.getElementById('ProductPrice').value);
    formData.append('ProductStock', document.getElementById('ProductStock').value);
    formData.append('ProductDescription', document.getElementById('ProductDescription').value);
  
    const response = await fetch('product-edit-submit', {
        method: 'POST',
        headers: {'X-CSRFToken': getCookie('csrftoken')},
        body: formData,
    })
    .catch((error) => {
        alert(error);
    })

    const result = await response.json()
    if (result.success){
        alert("수정되었습니다.");
        location.href='/seller/product-detail/' + result.productId;
    }
})