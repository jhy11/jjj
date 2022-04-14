const btnEdit = document.getElementById("edit");
const btnCheckEmail = document.getElementById("checkSameEmail");

//이메일 중복확인
btnCheckEmail.addEventListener('click',async() => {
    const email = document.getElementById('new-email').value;

    if(email == ''){
        document.getElementById('new-email').focus();
        return false;
    }

    const response = await fetch('/check-same-email', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
            email: email
        })
    })
    .catch((error) => {
        alert(error);
    })

    const result = await response.json()
    if (result.success){
        document.getElementById('new-email').setAttribute('class', 'form-control is-valid');
        document.getElementById('emailRight').innerText = '사용 가능한 이메일입니다';
    }else{
        document.getElementById('new-email').setAttribute('class', 'form-control is-invalid');
        document.getElementById('emailError').innerText = '이미 사용 중인 이메일입니다';
    }
})

//회원 정보 변경
btnEdit.addEventListener('click', async() => {
    const password = document.getElementById('password').value;
    const new_password = document.getElementById('new-password').value;
    const confirm_password = document.getElementById('confirm-password').value;
    const name = document.getElementById('new-name').value;
    const email = document.getElementById('new-email').value;
    const phone = document.getElementById('new-phone').value

    if(password == ''){
        document.getElementById('password').focus();
        return false;
    }
    
    if(new_password != ''){
        if(!CheckPassword(password)){
            document.getElementById('password').focus();
            return false;
        }
    }
    
    if(confirm_password != ''){
        if(!SamePassword()){
            document.getElementById('confirm-password').focus();
            return false;
        }
    }
    
    if(name == ''){
        document.getElementById('new-name').focus();
        return false;
    }

    if(email == ''){
        document.getElementById('new-email').focus();
        return false;
    }
    else{
        if(!CheckEmail(email)){
            document.getElementById('new-email').focus();
            return false;
        }
    }

    if(phone == ''){
        document.getElementById('new-phone').focus();
        return false;
    }
    else{
        if(!CheckPhone(phone)){
            document.getElementById('new-phone').focus();
            return false;
        }
    }

  
    const formData = new FormData(document.getElementById('EditMemForm'));
    
    const response = await fetch('', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: formData,
    })
    .catch((error) => {
        alert(error);
    })

    const result = await response.json();
    if (result.success){
        alert(result.message);
        location.href='/';
    }else{
        alert(result.message);
    }
})



//이메일 정규식
function CheckEmail(str){                                        
    var reg_email = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;

    if(!reg_email.test(str)){
       document.getElementById('new-email').setAttribute('class', 'form-control is-invalid');
       document.getElementById('emailError').innerText = '잘못된 이메일 형식입니다';
       return false;
   }         
    else{
       document.getElementById('new-email').setAttribute('class', 'form-control');
       document.getElementById('emailError').innerText = '';
       return true;
   }             
}


//휴대폰 번호 정규식
function CheckPhone(str){                                 
   var reg_phone = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;

   if(!reg_phone.test(str)){
     document.getElementById('new-phone').setAttribute('class', 'form-control is-invalid');
     document.getElementById('phoneError').innerText = '잘못된 휴대폰 번호입니다';
     return false;
  }         
   else{
     document.getElementById('new-phone').setAttribute('class', 'form-control');
     document.getElementById('phoneError').innerText = '';
     return true;
  }             
}


//비밀번호 정규식
function CheckPassword(str){
   if(!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d~!@#$%^&*()+|=]{8,16}$/.test(str)){
       document.getElementById('new-password').setAttribute('class', 'form-control is-invalid');
       document.getElementById('passwordError').innerText = '숫자와 영문자 조합으로 8~16자리를 사용해야 합니다';
       return false;
   }
   else{
       document.getElementById('new-password').setAttribute('class', 'form-control');
       document.getElementById('passwordError').innerText = '';
       return true;
   }
}


function SamePassword(){
   var password = document.getElementById('new-password').value;
   var confirm_password = document.getElementById('confirm-password').value;
   if(password== '' || confirm_password =='')
       return;
   if(password != confirm_password){
       document.getElementById('confirm-password').setAttribute('class', 'form-control is-invalid');
       document.getElementById('confirmPasswordError').innerText="비밀번호가 일치하지 않습니다";
       return false;
   }
   else{
       document.getElementById('confirm-password').setAttribute('class', 'form-control is-valid');
       document.getElementById('passwordRight').innerText="비밀번호가 일치합니다";
       return true;
   }
}


function getCookie(name) {
   let cookieValue = null;
   if (document.cookie && document.cookie !== '') {
       const cookies = document.cookie.split(';');
       for (let i = 0; i < cookies.length; i++) {
           const cookie = cookies[i].trim();
           // Does this cookie string begin with the name we want?
           if (cookie.substring(0, name.length + 1) === (name + '=')) {
               cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
               break;
           }
       }
   }
   return cookieValue;
 }
 
 