const btnLogin = document.getElementById("login");

btnLogin.addEventListener('click', async() => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if(username== ''){
        document.getElementById('username').focus();
        return false;
    }
    if(password == ''){
        document.getElementById('password').focus();
        return false;
    }

    const formData = new FormData(document.getElementById('LoginForm'));
    
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