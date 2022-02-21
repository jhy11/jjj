const btnRegister = document.getElementById("register");
const btnCheckId = document.getElementById("checkSameId");
const btnCheckEmail = document.getElementById("checkSameEmail");

//아이디 중복확인
btnCheckId.addEventListener('click',async() => {
    const username = document.getElementById('username').value;

    if(username == ''){
        document.getElementById('username').focus();
        return false;
    }

    const response = await fetch('/check-same-id', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
            username: username
        })
    })
    .catch((error) => {
        alert(error);
    })

    const result = await response.json()
    if (result.success){
        document.getElementById('username').setAttribute('class', 'form-control is-valid');
        document.getElementById('idValid').innerText = '사용 가능한 아이디입니다';
    }else{
      document.getElementById('username').setAttribute('class', 'form-control is-invalid');
        document.getElementById('idError').innerText = '이미 사용 중인 아이디입니다';
    }
})

//이메일 중복확인
btnCheckEmail.addEventListener('click',async() => {
    const email = document.getElementById('register-email').value;

    if(email == ''){
        document.getElementById('register-email').focus();
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
        document.getElementById('register-email').setAttribute('class', 'form-control is-valid');
        document.getElementById('emailRight').innerText = '사용 가능한 이메일입니다';
    }else{
        document.getElementById('register-email').setAttribute('class', 'form-control is-invalid');
        document.getElementById('emailError').innerText = '이미 사용 중인 이메일입니다';
    }
})



//회원가입
btnRegister.addEventListener('click', async() => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirm_password = document.getElementById('confirm-password').value;
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const phone = document.getElementById('register-phone').value

    if(username == ''){
        document.getElementById('username').focus();
        return false;
    }
    else{
        if(!CheckID(username)){
            document.getElementById('username').focus();
            return false;
        }
    }

    if(password == ''){
        document.getElementById('password').focus();
        return false;
    }
    else{
        if(!CheckPassword(password)){
            document.getElementById('password').focus();
            return false;
        }
    }

    if(confirm_password == ''){
        document.getElementById('confirm-password').focus();
        return false;
    }
    else{
        if(!SamePassword()){
            document.getElementById('confirm-password').focus();
            return false;
        }
    }

    if(name == ''){
        document.getElementById('register-name').focus();
        return false;
    }

    if(email == ''){
        document.getElementById('register-email').focus();
        return false;
    }
    else{
        if(!CheckEmail(email)){
            document.getElementById('register-email').focus();
            return false;
        }
    }

    if(phone == ''){
        document.getElementById('register-phone').focus();
        return false;
    }
    else{
        if(!CheckPhone(phone)){
            document.getElementById('register-phone').focus();
            return false;
        }
    }

  
    const formData = new FormData(document.getElementById('RegisterForm'));
    
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

    const result = await response.json()
    if (result.success){
        alert(result.message);
    }else{
        alert(result.message);
    }
})


//아이디 정규식
function CheckID(str){
    if(str == '')
        return;
    var reg_id = /^[a-z]+[a-z0-9]{5,19}$/g;

    if( !reg_id.test(str)) {
        document.getElementById('username').setAttribute('class', 'form-control is-invalid');
        document.getElementById('idError').innerText = '아이디는 영문자로 시작하는 6~20자 영문자 또는 숫자이어야 합니다';
        return false;
    }
    else{
        document.getElementById('username').setAttribute('class', 'form-control');
        return true;
    }
}


//이메일 정규식
function CheckEmail(str){                                        
     var reg_email = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;

     if(!reg_email.test(str)){
        document.getElementById('register-email').setAttribute('class', 'form-control is-invalid');
        document.getElementById('emailError').innerText = '잘못된 이메일 형식입니다';
        return false;
    }         
     else{
        document.getElementById('register-email').setAttribute('class', 'form-control');
        return true;
    }             
}


//휴대폰 번호 정규식
function CheckPhone(str){                                 
    var reg_phone = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;

    if(!reg_phone.test(str)){
      document.getElementById('register-phone').setAttribute('class', 'form-control is-invalid');
      document.getElementById('phoneError').innerText = '잘못된 휴대폰 번호입니다';
      return false;
   }         
    else{
      document.getElementById('register-phone').setAttribute('class', 'form-control');
      return true;
   }             
}


//비밀번호 정규식
function CheckPassword(str){
    if(!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d~!@#$%^&*()+|=]{8,16}$/.test(str)){
        document.getElementById('password').setAttribute('class', 'form-control is-invalid');
        document.getElementById('passwordError').innerText = '숫자와 영문자 조합으로 8~16자리를 사용해야 합니다';
        return false;
    }
    else{
        document.getElementById('password').setAttribute('class', 'form-control');
        return true;
    }
}


function SamePassword(){
    var password = document.getElementById('password').value;
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