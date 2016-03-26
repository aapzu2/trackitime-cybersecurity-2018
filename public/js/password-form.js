
function PasswordForm(opt) {
    var _this = this

    this.opt = $.extend({
        passwordName: 'password',
        password2Name: 'password2',
        progressBarEl: '.progress-bar'
    }, opt)

    if(!this.opt.el) {
        throw "PasswordForm needs a element!"
    }
    this.$el = $(this.opt.el)

    this.passwordInput = this.$el.find("input[name='" + this.opt.passwordName +"']")
    this.password2Input = this.$el.find("input[name='" + this.opt.password2Name +"']")
    this.progressBar = new ProgressBar(this.$el.find(this.opt.progressBarEl), 0, 4)

    var timeout
    this.passwordInput.keyup(function() {
        var pwd = zxcvbn($(this).val())
        if(timeout)
            clearTimeout(timeout)
        timeout = setTimeout(function() {
            _this.progressBar.setValue(pwd.score)
        }, 100)
    })

    var timeout2
    this.password2Input.keyup(function() {
        if(timeout2)
            clearTimeout(timeout2)
        timeout2 = setTimeout(function() {
            if(_this.passwordInput.val() != _this.password2Input.val())
                console.log("Passwords do not match!")
        }, 500)
    })

    function ProgressBar(el, min, max) {
        var _this = this

        this.min = min
        this.max = max

        this.$el = $(el)
        this.progressBar = this.$el

        this.setValue = function(value) {
            var addClass = function(color) {
                _this.progressBar.removeClass("progress-bar-yellow")
                _this.progressBar.removeClass("progress-bar-green")
                _this.progressBar.removeClass("progress-bar-blue")
                _this.progressBar.removeClass("progress-bar-red")

                _this.progressBar.addClass("progress-bar-" + color)
            }

            var a = Math.max(min, (value/(max - min)))
            var ratio = Math.min(a, max)
            if (ratio < 0.25) {
                addClass("red")
            } else if (ratio < 0.5) {
                addClass("yellow")
            } else if (ratio < 0.75) {
                addClass("blue")
            } else {
                addClass("green")
            }
            var width = this.progressBar.parent().width()

            width = width*0.1 + (width * 0.9) * ratio
            this.progressBar.width(width)
        }
    }
}