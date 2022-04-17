const btnSubmit = document.getElementById('btnSubmit');


document.getElementById('mainImg').onchange = function () {
  let file = $('#mainImg')[0].files[0];
  if (file){
    document.getElementById('mainImg-label').innerText=file.name;
  }
};


$('#ProductStock').TouchSpin({
  min: 0,
  max: 100,                
  boostat: 5,
  maxboostedstep: 10,        
  initval: 0
});

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

var quillContent = document.getElementById('Productquill');

var delta_content = {}
quill.on('text-change', function() {
    
  var delta = quill.getContents();
  delta_content['delta'] = delta
  delta_content['html'] = quill.root.innerHTML
});

let input = document.getElementById("mainImg"),
preview = document.getElementById("preview");
    
input.addEventListener("change", function() {
  changeImage(this);
});

function changeImage(input) {
  let reader;

  if (input.files && input.files[0]) {
    reader = new FileReader();

    reader.onload = function(e) {
      preview.setAttribute('src', e.target.result);
    }
    reader.readAsDataURL(input.files[0]);
    
    document.getElementById('mainImg-label').innerText=input.files[0].name;
  }
}

btnSubmit.addEventListener('click', async() => {
    console.log("click");
    const formData = new FormData(document.getElementById('uploadImgForm'));
    console.log(formData);
    formData.append('ProductCategoryId', document.getElementById('ProductCategoryId').value);
    formData.append('ProductName', document.getElementById('ProductName').value);
    formData.append('ProductPrice', document.getElementById('ProductPrice').value);
    formData.append('ProductStock', document.getElementById('ProductStock').value);
    formData.append('ProductDescription', document.getElementById('ProductDescription').value);
    formData.append('Content',  JSON.stringify(delta_content));
    console.log(JSON.stringify(delta_content))
    for (let key of formData.keys()) {
      console.log(key);
    }
    
    // FormData의 value 확인
    for (let value of formData.values()) {
      console.log(value);
    }
    console.log(formData)
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
        console.log(result.Content);
    }
})
