const btnSubmit = document.getElementById('btnSubmit');

btnSubmit.addEventListener('click', async() => {

    const formData = new FormData(document.getElementById('uploadImgForm'));
    formData.append('ProductCategoryId', document.getElementById('ProductCategoryId').value);
    formData.append('ProductName', document.getElementById('ProductName').value);
    formData.append('ProductPrice', document.getElementById('ProductPrice').value);
    formData.append('ProductStock', document.getElementById('ProductStock').value);
    formData.append('ProductDescription', document.getElementById('ProductDescription').value);
    
    const response = await fetch('product-post', {
        method: 'POST',
        headers: {'X-CSRFToken': getCookie('csrftoken')},
        body: formData,
    })
    .catch((error) => {
        alert(error);
    })

    const result = await response.json()
    if (result.success){
        alert("상품이 등록되었습니다.");
        location.href='/seller/seller-product'
    }
})