
var nodemailer = require('nodemailer')

function EmailClient() {
    this.isValidated = this.validate()

    return this
}

EmailClient.prototype.validate = function() {
    if(!process.env.SMTP_URL) {
        console.log("No SMTP_URL set, cannot send any emails!")
        return false
    } else {
        return true
    }
}

EmailClient.prototype.connect = function() {
    this.smtpTransport = nodemailer.createTransport(process.env.SMTP_URL)
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