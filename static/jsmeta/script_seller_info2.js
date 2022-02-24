async function updateProduct2(){
    const response = await fetch('seller_product',{
        method: "PUT",
        headers: {
            'Accept': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
        csrfmiddlewaretoken: window.CSRF_TOKEN,
        Id: getbyId('modal-Id').getAttribute('value'),
        ProductCategoryId:getbyId('modal-ProductCategoryId').value,
        ProductName:getbyId('modal-ProductName').value,
        ProductPrice: getbyId('modal-ProductPrice').value,
        ProductStock: getbyId('modal-ProductStock').value,
        ProductDescription: getbyId('modal-ProductDescription').value,
        })
    }).catch((error) => {
        alert(error);
    });

    const result = await response.json();

    if(result.success){
        loadNewData2(result);
    }
}
  
async function deleteProduct2(id) {
    const response = await fetch('seller_product', {
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
            Id: id,
        }),
    }).catch((error) => {
        alert(error);
    });

    const result = await response.json();

    //reload only table after deleting
    if(result.success){
        console.log("before");
        loadNewData2(result);
        console.log("after");
    }
}

async function reapplyProduct(id) {

    const response = await fetch('reapply', {
        method: 'PUT',
        mode: 'cors',
        cache: 'no-cache', 
        credentials: 'same-origin', 
        headers: new Headers({
        'X-CSRFToken': getCookie('csrftoken'),
        "Content-Type": "application/json",
        }),
        redirect: 'follow',
        body: JSON.stringify({
            Id: id,
        }),
    }).catch((error) => {
        alert(error);
    });

    const result = await response.json();

    //reload only table after deleting
    if(result.success){
        loadNewData2(result);
        loadNewData(result);
    
    }
}

//pass data to modal and set value
$('#shopModal').on('show.bs.modal', function(event) {  
    //html 값을 data-value 형태로 가져와서 
    id = $(event.relatedTarget).data('id');
    cat = $(event.relatedTarget).data('cat');
    proname = $(event.relatedTarget).data('proname');
    price = $(event.relatedTarget).data('price');
    stock = $(event.relatedTarget).data('stock');
    description = $(event.relatedTarget).data('descrip');
    //모달에 집어넣는 것 -> html의 modal에 입력해줌 ->완료 누르면 updateProduct호출
    $("#modal-ProductCategoryId option").filter(function() {
      return $(this).text() == cat;
    }).prop('selected', true);
    $('#modal-Id').attr('value', id);
    $('#modal-ProductName').attr('value', proname);
    $('#modal-ProductPrice').attr('value', price);
    $('#modal-ProductStock').attr('value', stock);
    $('#modal-ProductDescription').attr('value', description);

  });

function loadNewData2(result){
    console.log(typeof(result.products2));
    $('#dataTableHover2').dataTable({

        destroy: true,
        data: result.products2,
        searching: false,
    
        columnDefs: [{
            "targets": 6,
            "render": function(data){
                let td =document.createElement('td');
                td.setAttribute('class', 'align-middle');
        
                let btn_update = document.createElement('button');
                setAttributes(btn_update,{
                    'type': 'button',
                    'class': "btn btn-outline-primary mb-1",
                    'data-toggle': 'modal',
                    'data-target': '#shopModal',
                    'id': '#modalCenter',
                    'data-id': data.id,
                    'data-cat': data.pro_category__name,
                    'data-proname': data.name,
                    'data-price': data.price,
                    'data-stock': data.stock,
                    'data-descrip': data.description,
                });
    
            btn_update.innerText = '수정';
            td.appendChild(btn_update);
    
            return td.innerHTML;
            },
        },
        {
            "targets": 7,
            "render": function (data) {
                let td = document.createElement('td');
                td.setAttribute('class', 'align-middle');
    
                let btn_delete = document.createElement('button');
                setAttributes(btn_delete, {
                'type': 'button',
                'class': "btn btn-outline-danger mb-1",
                'onClick': "deleteProduct2(" + data.id + ")"
                });
    
                btn_delete.innerText = '삭제';
                td.appendChild(btn_delete);
                return td.innerHTML;
            }
        },
        
        {
            "targets": 8,
            "render": function (data) {
            
                let td = document.createElement('td');
                td.setAttribute('class', 'align-middle');
                
                let btn_reapply = document.createElement('button');
                setAttributes(btn_reapply, {
                'type': 'button',
                'class': "btn btn-outline-danger mb-1",
                'onClick': "reapplyProduct(" + data.id + ")"
                });
    
                btn_reapply.innerText = '재신청';
                td.appendChild(btn_reapply);
                return td.innerHTML;
            }
        }],
        "columns": [
            {data: "id"},
            {data: "pro_category__name"},
            {data: "name"},
            {data: "price"},
            {data: "stock"},
            {data: "description"},
            {data: null},
            {data: null},
            {data: null},
        ],
        });
  }