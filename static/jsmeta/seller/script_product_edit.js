const btnEdit = document.getElementById('btnEdit');

let toolbarOptions = [
    [{ 'font': [] }],
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['image', 'code-block'],
    //[{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'align': '' }, { 'align': 'center' }, { 'align': 'right' }, { 'align': 'justify' }],
    ['blockquote', 'code-block'],
   
  
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction
  
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    ['clean']                                         // remove formatting button
  ];
  

let quill = new Quill('#editor-container', {
modules: {
toolbar: toolbarOptions,
},
//placeholder: '상품 상세 설명을 작성해주세요.',
theme: 'snow'
});

var preciousContent = document.getElementById('myPrecious');
var justTextContent = document.getElementById('justText');
var justHtmlContent = document.getElementById('justHtml');
var quillContent = document.getElementById('Productquill');

var delta_content = {}

quill.setContents(JSON.parse(quillContent.value.replaceAll('True','true').replaceAll('False','false').replaceAll('\'','\"')));
quill.on('text-change', function() {
preciousContent.innerHTML = JSON.stringify(delta);
delta_content['delta'] = delta
delta_content['html'] = quill.root.innerHTML

});


btnEdit.addEventListener('click', async() => {

    const formData = new FormData(document.getElementById('uploadImgForm'));
    formData.append('ProductId', document.getElementById('ProductId').value);
    formData.append('ProductCategoryId', document.getElementById('ProductCategoryId').value);
    formData.append('ProductName', document.getElementById('ProductName').value);
    formData.append('ProductPrice', document.getElementById('ProductPrice').value);
    formData.append('ProductStock', document.getElementById('ProductStock').value);
    formData.append('ProductDescription', document.getElementById('ProductDescription').value);
    formData.append('Content',  JSON.stringify(delta_content));
  
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