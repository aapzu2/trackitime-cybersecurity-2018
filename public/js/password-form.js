
function PasswordForm(opt) {
    var _this = this

    this.opt = $.extend({
        nameInput: "input[name='name']",
        usernameInput: "input[name='username']",
        passwordInput: "input[name='password']",
        password2Input: "input[name='password2']",
        progressBarEl: 'input[name="password"]',
        infoEl: ".pwd-info"
    }, opt)

    if(!this.opt.el) {
        throw "PasswordForm needs a element!"
    }
    this.$el = $(this.opt.el)

    this.passwordInput = this.$el.find(this.opt.passwordInput)
    this.password2Input = this.$el.find(this.opt.password2Input)
    this.nameInput = this.$el.find(this.opt.nameInput)
    this.usernameInput = this.$el.find(this.opt.usernameInput)
    this.progressEl = $(this.opt.progressBarEl)
    this.progressEl.addClass("pwd-strength-indicator")
    this.infoEl = $(this.opt.infoEl)

    this.nameInput.keyup(function() {
        addOwnWords()
    })
    this.usernameInput.keyup(function() {
        addOwnWords()
    })
    var addOwnWords = function() {
        _this.ownWords = []
        $(_this.nameInput).val().split(/ /g).forEach(function(word) {
            if(word !== "")
                _this.ownWords.push(word)
        })
        _this.ownWords.push($(_this.usernameInput).val())
    }
    var timeout
    this.passwordInput.keyup(function() {
        var pwd = zxcvbn($(this).val(), _this.ownWords)
        if(timeout)
            clearTimeout(timeout)
        timeout = setTimeout(function() {
            _this.setValue(pwd.score)
            _this.infoEl.empty()
            if(pwd.feedback.warning) {
                _this.infoEl.append($("<p/>", {
                    text: pwd.feedback.warning
                }))
            }
            if(pwd.feedback.suggestions.length) {
                _this.infoEl.append($("<p/>", {
                    text: pwd.feedback.suggestions[0]
                }))
            }
        }, 250)
    })

    var timeout2
    this.password2Input.keyup(function() {
        if(timeout2)
            clearTimeout(timeout2)
        timeout2 = setTimeout(function() {
            _this.infoEl.empty()
            if(_this.passwordInput.val() != _this.password2Input.val()) {
                _this.infoEl.append($("<p/>", {
                    text: "Passwords are not the same!"
                }))
            }
        }, 500)
    })

    this.setValue = function(score) {
        var setClass = function(cl) {
            _this.progressEl.removeClass("bg-green")
            _this.progressEl.removeClass("bg-light-green")
            _this.progressEl.removeClass("bg-yellow")
            _this.progressEl.removeClass("bg-orange")
            _this.progressEl.removeClass("bg-red")

            _this.progressEl.addClass(cl)
        }
        switch(score) {
            case 0:
                setClass("bg-red")
                break;
            case 1:
                setClass("bg-orange")
                break;
            case 2:
                setClass("bg-yellow")
                break;
            case 3:
                setClass("bg-light-green")
                break;
            case 4:
                setClass("bg-green")
        }
    }
}