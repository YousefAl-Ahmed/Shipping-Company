const saveProfile = document.querySelector('.profile-button');

saveProfile.addEventListener('click', async (e) => {
    e.preventDefault();
    const username = document.querySelector('#username').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    // const firstName = document.querySelector('#firstName').value;
    // const lastName = document.querySelector('#lastName').value;
    // const address = document.querySelector('#address').value;
    // const city = document.querySelector('#city').value;
    // const state = document.querySelector('#state').value;
    // const zip = document.querySelector('#zip').value;
    // const phone = document.querySelector('#phone').value;
    // const country = document.querySelector('#country').value;
    const user = {
        username: username,
        email: email,
        password: password,
        // firstName: firstName,
        // lastName: lastName,
        // address: address,
        // city: city,
        // state: state,
        // zip: zip,
        // phone: phone,
        // country: country
    }
    const response = await fetch('/user-page/' + username + '/profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
    const data = await response.json();
    console.log(data);
    if (data.success) {
        window.location.href = '/user-page/' + username;
    }
});