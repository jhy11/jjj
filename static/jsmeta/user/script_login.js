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

    const result = await response.json();
    if (result.success){
        alert(result.message);
        location.href='/';
    }else{
        alert(result.message);
    }
})

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
  
  