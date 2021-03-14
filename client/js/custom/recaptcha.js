var contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (ev) => responseEnquiry(ev));
}

function responseEnquiry(ev) {
    ev.preventDefault();

    const action = document.querySelector('[name="action"]').value;
    const nameFull = document.querySelector('[name="name.full"]').value;
    const email = document.querySelector('[name="email"]').value;
    const company = document.querySelector('[name="company"]').value;
    const message = document.querySelector('[name="message"]').value;
    const captcha = document.getElementById("g-recaptcha-response").value;

    const enquiryIndicator =  document.getElementById("enquiry-indicator").style;
    enquiryIndicator.display = "inline-block";

    fetch('/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
            action: action,
            'name.full': nameFull,
            email: email,
            company: company,
            message: message,
            captcha: captcha
        })
    })
        .then(res => res.json())
        .then(res => {

            if (res.success) {
                document.getElementById("success-enquiry").style.display = "block";
                document.getElementById("contact-form").remove();
            }
            else {
                document.getElementById("enquiry-errors").style.display = "block";
                grecaptcha.reset();
            }

            enquiryIndicator.display = "none";
        })
        .catch(error => console.error(error));
}
