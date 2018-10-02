

module.exports.candidate = function candidate() {
    return {
        first_name: "Tayyab",
        last_name: "Hussain",
        email: "tayyab@mail.com",
        password: "Password1",
        type: "candidate"
    };
};

module.exports.company = function company() {
    return {
        first_name: "Salman",
        last_name: "Safdar",
        email: "salman@email.com",
        job_title: "Designer",
        company_name: "My Company",
        company_website: "my-web.com",
        phone_number: "926546456",
        conuntry: "Pakistan",
        postal_code: "25000",
        city: "RWP",
        password: "myPassword1",
        type: "company"
    };
};

module.exports.initialJobOffer = function initialJobOffer() {
    return {
        msg_tag: "job_offer"
    };
};