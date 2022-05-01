const imageBox = document.getElementById('image-box')
const imageForm = document.getElementById('uploadForm2')
const input = document.getElementById('id_main_img')
const crop_btn = document.getElementById('crop-btn')
const csrf = document.getElementsByName('csrfmiddlewaretoken')

input.addEventListener('change', ()=>{
    const img_data = input.files[0]
    const url = URL.createObjectURL(img_data)
    imageBox.innerHTML = `<img src="${url}" id="image" width="700px">`
    const image = document.getElementById('image')
  
    document.getElementById('image-box').style.display = 'block'
    document.getElementById('crop-btn').style.display = 'block'
    document.getElementById('confirm-btn').style.display = 'none'
    
   
    const cropper = new Cropper(image,{
        aspectRatio: 3 / 4,
    });

    crop_btn.addEventListener('click', ()=>{
        cropper.getCroppedCanvas().toBlob((blob) => {
            let fileInputElement = document.getElementById('id_main_img');
            let file = new File([blob], img_data.name,{type:"image/*", lastModified:new Date().getTime()});
            let container = new DataTransfer();
            container.items.add(file);
            fileInputElement.files = container.files;

            document.getElementById('image-box').style.display = 'none'
            document.getElementById('crop-btn').style.display = 'none'
            document.getElementById('confirm-btn').style.display = 'block'
            
        });
    })
    
});


