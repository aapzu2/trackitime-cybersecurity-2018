
var nodemailer = require('nodemailer')

function EmailClient() {
    this.isValidated = this.validate()

    return this
}

EmailClient.prototype.validate = function(email) {
    if(!process.env.EMAIL_PASSWORD) {
        console.log("No EMAIL_PASSWORD set, cannot send any emails!")
        if(email)
            console.log("Tried to send email", email)
        return false
    } else {
        return email || true
    }
}

EmailClient.prototype.connect = function() {
    this.smtpTransport = nodemailer.createTransport("SMTP",{
        service: "Gmail",  // sets automatically host, port and connection security settings
        auth: {
            user: "trackitime@gmail.com",
            pass: process.env.EMAIL_PASSWORD
        }
    })

    return this
}

EmailClient.prototype.sendEmail = function(email) {
    if(this.isValidated) {
        this.connect()
        this.smtpTransport.sendMail({  //email options
            from: "Trackitime App <trackitime@gmail.com>", // sender address.  Must be the same as authenticated user if using Gmail.
            to: email.to.name + '<' + email.to.email + '>', // receiver
            subject: email.subject, // subject
            text: email.body // body
        }, function(error, response) {  //callback
            if (error) {
                console.log(error);
            } else {
                console.log("Message sent: " + response.message);
            }
        })
    }
}

EmailClient.prototype.disconnect = function() {
    this.smtpTransport.close();
}

var emailClient = new EmailClient()

module.exports = emailClient