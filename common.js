if(typeof hasPluginRequirements === 'undefined') {
    function hasPluginRequirements(pluginName, requirements) {
        let noRequiredFunctions = []

        requirements.forEach(function (requirement) {
            if (typeof this[requirement] !== 'function') {
                noRequiredFunctions.push(requirement)
            }
        })

        if (noRequiredFunctions.length) {
            console.error(`BLACKBOOK plugin "${pluginName}": requires ${noRequiredFunctions.join('(), ')}() functions`)
        }
        return !noRequiredFunctions.length
    }
}

if(typeof selectAll === 'undefined') {
    function selectAll(selector, container = false) {
        return Array.from(!container ? document.querySelectorAll(selector) : container.querySelectorAll(selector));
    }
}
if(typeof printf === 'undefined') {
    function printf(string, vars = [], addToEnd = true, char = '&') {
        vars.forEach(function (thisVar, index) {
            let r = new RegExp(char + (index + 1) + '(?![0-9])', 'g');

            if(r.test(string)) {
                string = string.replace(r, thisVar);
            } else if(addToEnd) {
                string += ' '+thisVar
            }
        })
        return string;
    }
}

if(typeof setCookie === 'undefined') {
    function setCookie(name, value, days, path = '/') {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + (path ? `; path=${path}` : ';');
    }
}
if(typeof getCookie === 'undefined') {
    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
}
if(typeof eraseCookie === 'undefined') {
    function eraseCookie(name) {
        document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
}
if(typeof indexOf === 'undefined') {
    function indexOf(el) {
        return Array.from(el.parentElement.children).indexOf(el)
    }
}
if(typeof closestEl === 'undefined') {
    function closestEl(el, closestParent){
        let foundClosest = false;
        let nextParent = el;
        let i = 0

        while (true){
            i++;
            if(!nextParent || nextParent.nodeName === 'BODY' || i > 20){
                break;
            }
            if(nextParent == closestParent){
                foundClosest = nextParent
                break;
            }
            nextParent = nextParent.parentElement
        }

        return foundClosest;
    }
}

if(typeof dynamicListener === 'undefined') {
    function dynamicListener(events, selector, handler, context){
        events.split(' ').forEach(function (event) {
            (document || context).addEventListener(event, function (e) {
                if(e.target.matches(selector) || e.target.closest(selector)){
                    handler.call(e.target.closest(selector), e);
                }
            })
        })
    }
}
if(typeof trigger === 'undefined') {
    function trigger(el, eventName, params = {}) {
        //trigger('click',  undefined,   undefined)
        //trigger('click',  {},          undefined)
        //trigger(el,       'click',     undefined)
        //trigger(el,       'click',     {})
        // passed data will be at e.detail (JS), and e.originalEvent.detail (jQuery)
        let thisEl = el
        let thisEventName = eventName
        let thisParams = params

        if(typeof el === 'string'){
            thisEventName = el
            thisEl = document
            if(typeof eventName === 'object'){
                thisParams = eventName
            }
        }

        let newEvent = new CustomEvent(thisEventName, { bubbles: true, detail: thisParams });
        thisEl.dispatchEvent(newEvent)
    }
}
if(typeof animateOpacity === 'undefined') {
    function animateOpacity(element, duration, display = 'block', targetOpacity, onComplete) {
        const elStyles = window.getComputedStyle(element)
        const startOpacity = elStyles.display === 'none' ? 0 : parseFloat(elStyles.opacity)
        let currentOpacity = startOpacity;

        if(startOpacity !== 1) {
            duration = duration - (duration * startOpacity);
        }

        if (targetOpacity) {
            element.style.opacity = startOpacity
            element.style.display = display
        }

        if (element.animation && element.animation.stop) {
            element.animation.stop()
        }

        function updateOpacity() {
            const elapsedTime = performance.now() - startTime;
            const progress = Math.min(1, elapsedTime / duration);
            currentOpacity = startOpacity + progress * (targetOpacity - startOpacity);
            element.style.opacity = currentOpacity.toFixed(2);

            if (progress < 1) {
                element.animation.raf = requestAnimationFrame(updateOpacity);
            } else {
                element.style.opacity = ''
                element.animation = false
                if (!targetOpacity) {
                    element.style.display = 'none'
                }
                if (onComplete) {
                    onComplete();
                }
            }
        }

        function stopAnimation() {
            cancelAnimationFrame(element.animation.raf);
        }

        const startTime = performance.now();
        element.animation = {
            raf: 0,
            type: targetOpacity ? 'fadeIn' : 'fadeOut',
            stop: stopAnimation,
        };
        updateOpacity();
    }
}
if(typeof fadeIn === 'undefined') {
    function fadeIn(el, timeout, display = 'block', afterFunc = false) {
        animateOpacity(el, timeout, display, 1, afterFunc);
    }
}
if(typeof fadeOut === 'undefined') {
    function fadeOut(el, timeout, afterFunc = false) {
        animateOpacity(el, timeout, '', 0, afterFunc);
    }
}
if(typeof fadeToggle === 'undefined') {
    function fadeToggle(target, duration = 300, display = 'block', afterFunction = false) {
        if ((target.animation && target.animation.type === 'fadeOut') || (!target.animation && window.getComputedStyle(target).display === 'none')) {
            return fadeIn(target, duration, display, afterFunction);
        } else {
            return fadeOut(target, duration, afterFunction);
        }
    }
}
if(typeof animateHeight === 'undefined') {
    function animateHeight(element, duration, startHeight, targetHeight, onComplete) {
        let elStyles = window.getComputedStyle(element)
        let paddingTop = elStyles.paddingTop.replace('px', '')
        let paddingBottom = elStyles.paddingBottom.replace('px', '')
        if (!startHeight) {
            startHeight = element.clientHeight
        }
        let currentHeight = startHeight;


        element.style.transition = '';

        if (targetHeight) {
            if (paddingTop) {
                startHeight -= paddingTop
                element.style.paddingTop = '0'
                setTimeout(function () {
                    element.style.transition = `padding ${duration}ms linear`
                    element.style.paddingTop = paddingTop + 'px'
                }, 10)
            }
            if (paddingBottom) {
                startHeight -= paddingBottom
                element.style.paddingBottom = '0px'
                setTimeout(function () {
                    element.style.transition = `padding ${duration}ms linear`
                    element.style.paddingBottom = paddingBottom + 'px'
                }, 10)
            }
            currentHeight = startHeight
        } else {
            if (paddingTop) {
                element.style.transition = `padding ${duration}ms linear`
                element.style.paddingTop = '0px'
            }
            if (paddingBottom) {
                element.style.transition = `padding ${duration}ms linear`
                element.style.paddingBottom = '0px'
            }
        }
        if ((startHeight / targetHeight) !== Infinity) {
            duration = duration - (duration * (startHeight / targetHeight))
        }

        if (element.animation && element.animation.stop) {
            element.animation.stop();
        }

        function updateHeight() {
            const elapsedTime = performance.now() - startTime;
            const progress = Math.min(1, elapsedTime / duration);
            currentHeight = startHeight + progress * (targetHeight - startHeight);
            element.style.height = currentHeight.toFixed(2) + 'px';

            if (progress < 1) {
                element.animation.raf = requestAnimationFrame(updateHeight);
            } else {
                element.style.height = '';
                element.style.paddingTop = '';
                element.style.paddingBottom = '';
                element.style.overflow = '';
                element.style.transition = '';
                element.animation = false;
                if (!targetHeight) {
                    element.style.display = 'none'
                }
                if (onComplete) {
                    onComplete();
                }
            }
        }

        function stopAnimation() {
            cancelAnimationFrame(element.animation.raf);
        }

        const startTime = performance.now();
        element.animation = {
            raf: 0,
            type: targetHeight > startHeight ? 'slideDown' : 'slideUp',
            stop: stopAnimation,
        };
        updateHeight();
    }
}
if(typeof slideDown === 'undefined') {
    function slideDown(element, duration, display = 'block', onComplete) {
        let startHeight = element.clientHeight;
        element.style.display = display;
        element.style.height = 'unset'
        const targetHeight = element.clientHeight;
        element.style.height = '0px';
        element.style.overflow = 'hidden';

        animateHeight(element, duration, startHeight, targetHeight, onComplete);
    }
}
if(typeof slideUp === 'undefined') {
    function slideUp(element, duration, onComplete) {
        const targetHeight = 0;
        element.style.overflow = 'hidden';

        animateHeight(element, duration, false, targetHeight, onComplete);
    }
}
if(typeof slideToggle === 'undefined') {
    function slideToggle(target, duration, display = 'block', afterFunction) {
        if ((target.animation && target.animation.type === 'slideUp') || (!target.animation && window.getComputedStyle(target).display === 'none')) {
            return slideDown(target, duration, display, afterFunction);
        } else {
            return slideUp(target, duration, afterFunction);
        }
    }
}
if(typeof isElementInViewport === 'undefined') {
    function isElementInViewport(el) {
        if (typeof jQuery === "function" && el instanceof jQuery) {
            el = el[0];
        }
        if (!el) return false;
        let x = el.getBoundingClientRect().left;
        let y = el.getBoundingClientRect().top;
        let ww = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        let hw = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        let w = el.clientWidth;
        let h = el.clientHeight;
        return (
            (y < hw &&
                y + h > 0) &&
            (x < ww &&
                x + w > 0)
        );
    }
}

function dropdown(options) {
    if(!hasPluginRequirements('dropdown', ['dynamicListener', 'fadeIn', 'fadeOut', 'slideDown', 'slideUp'])){
        return;
    }
    let opts = {
        globalContainer: '',
        containerClass: 'header__lang',
        btnSelector: '.header__lang-btn',
        closeBtnClass: '',
        dropdownSelector: '.header__lang-dropdown',
        timing: 300,
        effect: 'fade',
        closeOnClick: true,
        closeOnClickOutside: true,
    };
    let timing = 300;
    opts = { ...opts, ...options }

    let openTimeout = false;

    function open(e) {
        e.preventDefault();
        let container = e.target.closest('.' + opts.containerClass);
        let thisDropdown = container.querySelector(opts.dropdownSelector);
        if(openTimeout){
            return;
        }
        setTimeout(function () {
            openTimeout = false
        }, 200)
        openTimeout = true
        if(container.classList.contains('is-open')){
            close()
            return;
        }
        if (e.type === 'focusin') {
            container.classList.add('focusin');
        }
        if (e.type !== 'focusin') {
            container.classList.remove('focusin');
        }
        close(container);

        container.classList.add('is-open')
        container.style.zIndex = '4';

        if (opts.effect === 'fade') {
            fadeIn(thisDropdown, timing)
        } else if(opts.effect === 'slide') {
            slideDown(thisDropdown, timing)
        } else {
            console.error('Dropdown plugin: There is no effect called "' + opts.effect + '". Effects: "slide", "fade".')
        }
    }
    function close(dontClose) {
        let dropdownsToClose = document.querySelectorAll('.' + opts.containerClass);

        if (dontClose) {
            dropdownsToClose = Array.from(dropdownsToClose).filter(item => item !== dontClose);
        }

        if(!dropdownsToClose.length) {
            return;
        }

        dropdownsToClose.forEach(function (dropdownToClose) {
            if(!dropdownToClose.classList.contains('is-open')){
                return;
            }
            dropdownToClose.classList.remove('is-open')
            dropdownToClose.querySelectorAll('li').forEach(item => item.classList.remove('hover'))
            dropdownToClose.style.zIndex = ''
            if (opts.effect === 'fade') {
                fadeOut(dropdownToClose.querySelector(opts.dropdownSelector), timing)
            } else if(opts.effect === 'slide') {
                slideUp(dropdownToClose.querySelector(opts.dropdownSelector), timing)
            } else {
                console.error('Dropdown plugin: There is no effect called "' + opts.effect + '". Effects: "slide", "fade".')
            }
        })
    }


    if(opts.closeOnClickOutside) {
        document.addEventListener('click', function (e) {
            let thisEl = e.target;
            if (opts.closeBtnClass ? thisEl.classList.contains(opts.closeBtnClass) : false) {
                close();
            }
            if (!thisEl.classList.contains(opts.containerClass) && !thisEl.closest('.' + opts.containerClass)) {
                close();
            }
        })
    }
    dynamicListener('click', opts.globalContainer + ' .' + opts.containerClass + ' ' + opts.btnSelector, open)
    dynamicListener('focusin', opts.globalContainer + ' .' + opts.containerClass + ' ' + opts.btnSelector, open);
    dynamicListener('focusout', opts.globalContainer + ' .' + opts.containerClass + ' ' + opts.btnSelector, function (e) {
        e.target.closest('.' + opts.containerClass).classList.remove('focusin');
        close(e.target.closest('.' + opts.containerClass));
    });
    document.addEventListener('close-dropdown', close);

    if (opts.timing !== false) {
        timing = opts.timing;
    }
    if (opts.containerClass === 'select') {
        timing = 0;
    }
    if (opts.closeOnClick) {
        dynamicListener('click', opts.globalContainer + ' .' + opts.containerClass + ' ' + opts.dropdownSelector, function (e) {
            if (!e.target.closest('.' + opts.containerClass).classList.contains('checkbox')) {
                close();
            }
        });
    }
}
function accordion(options){
    if(!hasPluginRequirements('accordion', ['dynamicListener', 'slideUp', 'slideDown', 'slideToggle'])){
        return;
    }
    let opts = {
        globalContainer: '.accordion-container',
        containerSelector: '.accordion',
        btnSelector: '.accordion__head',
        dropdownSelector: '.accordion__content',
        slideDisplay: 'block',
        timing: 300,
    };

    opts = { ...opts, ...options }

    document.querySelectorAll(opts.containerSelector).forEach(function (item) {
        if(!item.querySelector(opts.dropdownSelector)){
            item.classList.add('is-empty')
        }
    })
    document.querySelectorAll(opts.containerSelector+'.is-open').forEach(function (item) {
        if(item.querySelector(opts.dropdownSelector)){
            item.querySelector(opts.dropdownSelector).style.display = 'block'
        }
    })
    let clickTimeout = true
    dynamicListener('click', opts.containerSelector + ':not(.is-empty) ' + opts.btnSelector, function (e){
        if(!clickTimeout){
            return;
        } else {
            clickTimeout = false
            setTimeout(function () {
                clickTimeout = true
            }, 100)
        }
        let thisContainer = e.target.closest(opts.containerSelector)
        let accordionsContainer = opts.globalContainer ? thisContainer.closest(opts.globalContainer) : false
        let allAccordions = accordionsContainer ? Array.from(accordionsContainer.querySelectorAll('.is-open')) : []
        if(allAccordions.length){
            allAccordions = allAccordions.filter(item => item !== thisContainer)
        }
        let thisContent = thisContainer.querySelector(opts.dropdownSelector)

        if(allAccordions.length) {
            allAccordions.forEach(item => item.classList.remove('is-open'))
            allAccordions.forEach(item => item.querySelector(opts.dropdownSelector) ? slideUp(item.querySelector(opts.dropdownSelector), opts.timing) : false)
        }

        slideToggle(thisContent, opts.timing, opts.slideDisplay)
        setTimeout(function () {
            thisContainer.classList.toggle('is-open');
        },1)
    })
}
function validate(form, newOpts = {}) {
    if(!hasPluginRequirements('validate', ['printf', 'selectAll'])){
        return;
    }
    let defaultOpts = {
        methodsOnInput: ['regexReplace', 'maxlength'],
        submitFunction: null,
        highlightFunction: null,
        unhighlightFunction: null,
        checkOnInput: false,
        checkOnInputAfterSubmit: true,
        checkOnFocusOut: true,
        disableButton: false,
        errorClass: 'is-error',
        dontValidateInputs: 'input:not([type="hidden"])[name], .output_value, select, textarea',
        inputContainerSelector: '.input',
        formErrorBlock: '',
        addInputErrors: true,
        validationRules: typeof validationRules !== 'undefined' ? validationRules : {},
        validationErrors: typeof validationErrors !== 'undefined' ? validationErrors : {},
        methods: {
            "regex": function (value, element, regexp) {
                return value == '' || new RegExp(regexp).test(value);
            },
            "required": function (value, input) {
                if(input.getAttribute('type') === 'checkbox' || input.getAttribute('type') === 'radio'){
                    let elseInputs = Array.from(form.querySelectorAll(`[name="${input.getAttribute('name')}"]`))
                    let hasChecked = !!elseInputs.find(item => item.checked)

                    if(hasChecked){
                        elseInputs.forEach(function (elseInput) {
                            if(typeof elseInput.removeError === 'function') {
                                elseInput.removeError()
                            }
                        })
                    }

                    return hasChecked
                } else {
                    return !!value.trim()
                }
            },
            "regexReplace": function (value, element, regexp) {
                element.value = element.value.replace(new RegExp(regexp), "");
                return true;
            },
            "password_repeat": function (value, element, regexp) {
                let password = element.closest('form').querySelector('[data-validation="password"]');
                return !element.hasAttribute('required') && !value || value === password.value;
            },
            "tel_mask": function (value, element, regexp) {
                if (typeof element['checkValidCallback'] !== 'undefined') {
                    element.checkValidCallback();
                }
                return typeof element['telMask'] !== 'undefined' ? element['telMask'].isValidNumber() || value === '' : true;
            },
            "minlength": function (value, element, passedValue) {
                let min = passedValue || +element.getAttribute("minlength");

                if (!min || !value) return true;
                return value.length >= min;
            },
            "maxlength": function (value, element, regexp) {
                let max = +element.getAttribute("maxlength");
                if (!max) return true;
                if (element.value.length > max) {
                    element.value = element.value.substr(0, max);
                }
                return true;
            }
        }
    };
    let opts = {
        ...defaultOpts,
        ...newOpts
    };
    if(typeof validationMethods === 'object') {
        opts["methods"] = {
            ...opts["methods"],
            ...validationMethods
        }
    }
    if (typeof form === 'string') form = document.querySelector(form);

    function getMethodError(input, methodName, defaultText, variable = []) {
        let dataValidation = input.getAttribute('data-validation');
        let errorMessage = printf(defaultText, variable)

        if(opts.validationErrors[methodName]){
            errorMessage = printf(opts.validationErrors[methodName], variable)
        }
        if(opts.validationErrors[dataValidation] && opts.validationErrors[dataValidation][methodName]){
            errorMessage = printf(opts.validationErrors[dataValidation][methodName], variable)
        }

        return errorMessage;
    }

    function formSubmitListener(e) {
        e.preventDefault();
        _this.validate();
        _this.formSubmitted = true;
    }
    function inputInputListener(e) {
        this['had_input'] = true;
        if(opts.disableButton){
            _this.checkDisableButton()
        }
        if (opts.methodsOnInput.length) {
            _this.valid(this, opts.methodsOnInput);
            return;
        }
        if (opts.checkOnFocusOut && input['had_focusout']) {
            _this.valid(this);
            return;
        }
        if (opts.checkOnInput) {
            _this.valid(this);
            return;
        }
        if (opts.checkOnInputAfterSubmit && _this.formSubmitted) {
            _this.valid(this);
        }

        let inputsSameName = Array.from(form.querySelectorAll(`[name="${this.getAttribute('name')}"]`))

        if(inputsSameName.length > 1){
            let isTypesSame = !inputsSameName.find(item => item.getAttribute('type') !== inputsSameName[0].getAttribute('type'))
            let hasRequired = inputsSameName.find(item => typeof item.getAttribute('required') !== 'undefined')

            if(!isTypesSame && hasRequired) {
                if(this.getAttribute('type') !== 'checkbox' && this.getAttribute('type') !== 'radio'){
                    let diffInputs = inputsSameName.filter(item => item.getAttribute('type') !== this.getAttribute('type'))

                    if(diffInputs.length){
                        if(this.value.trim()){
                            diffInputs.forEach(item => item.isValid())
                        }
                    }
                }
            }
        }
    }
    function inputFocusListener(e) {
        let inputsSameName = Array.from(form.querySelectorAll(`[name="${this.getAttribute('name')}"]`))

        if(opts.disableButton){
            _this.checkDisableButton()
        }
        if(inputsSameName.length > 1){
            let isTypesSame = !inputsSameName.find(item => item.getAttribute('type') !== inputsSameName[0].getAttribute('type'))
            let hasRequired = inputsSameName.find(item => typeof item.getAttribute('required') !== 'undefined')

            if(!isTypesSame && hasRequired) {
                if(this.getAttribute('type') !== 'checkbox' && this.getAttribute('type') !== 'radio'){
                    let diffInputs = inputsSameName.filter(item => item.getAttribute('type') !== this.getAttribute('type'))

                    if(diffInputs.length){
                        diffInputs.forEach(item => item.removeRequired())
                        diffInputs.forEach(item => item.checked = false)
                        diffInputs.forEach(item => item.isValid())
                    }
                    this.setRequired()
                }
            }
        }
    }
    function inputFocusoutListener(e) {
        if(opts.disableButton){
            _this.checkDisableButton()
        }
        if (!opts.checkOnInput && opts.checkOnFocusOut) {
            this['had_focusout'] = true;
            if (!this['had_focusout'] || !this['had_input']) return;
            _this.valid(this);
        }
    }
    function inputChangeListener(e) {
        if(opts.disableButton){
            _this.checkDisableButton()
        }
        if (this.getAttribute('type') === 'checkbox' || this.getAttribute('type') === 'radio' ) {
            this.isValid()
        }


        let inputsSameName = Array.from(form.querySelectorAll(`[name="${this.getAttribute('name')}"]`))

        if(inputsSameName.length > 1){
            let isTypesSame = !inputsSameName.find(item => item.getAttribute('type') !== inputsSameName[0].getAttribute('type'))
            let hasRequired = inputsSameName.find(item => typeof item.getAttribute('required') !== 'undefined')

            if(!isTypesSame && hasRequired) {
                if(this.getAttribute('type') === 'checkbox' || this.getAttribute('type') === 'radio'){
                    let diffInputs = inputsSameName.filter(item => item.getAttribute('type') !== this.getAttribute('type'))
                    let thisInputs = inputsSameName.filter(item => item.getAttribute('type') === this.getAttribute('type'))
                    let oneChecked = thisInputs.find(item => item.checked)

                    if(diffInputs.length){
                        if(oneChecked){
                            diffInputs.forEach(item => item.removeRequired())
                            diffInputs.forEach(item => item.isValid())
                        } else {
                            diffInputs.forEach(item => item.setRequired())
                        }
                    }
                }
            }
        }
    }
    let _this = {
        isValid: true,
        allInputs: selectAll(opts.dontValidateInputs, form),
        formSubmitted: false,
        init: function () {
            _this.allInputs = selectAll(opts.dontValidateInputs, form)
            form.setAttribute('novalidate', 'novalidate');
            form.setAttribute('data-js-validation', 'novalidate');
            form.addEventListener('submit', formSubmitListener);
            form.valid = function () {
                let addErrors = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
                return _this.validate(false, addErrors);
            };
            _this.allInputs.map(function (input) {
                let thisInputMethods = [];
                let dataValidation = input.getAttribute('data-validation');
                if (input.hasAttribute('required')) {
                    thisInputMethods.push({
                        callback: opts.methods['required'],
                        errorMessage: getMethodError(input, 'required', 'This field is required')
                    });
                }
                if (input.hasAttribute('data-tel-mask')) {
                    thisInputMethods.push({
                        callback: opts.methods['tel_mask'],
                        errorMessage: ''
                    });
                }
                if (input.hasAttribute('minlength')) {
                    thisInputMethods.push({
                        callback: opts.methods['minlength'],
                        errorMessage: getMethodError(input, 'minlength', 'Min length is &1 symbols', [input.getAttribute('minlength')])
                    });
                }
                if (input.hasAttribute('maxlength')) {
                    thisInputMethods.push({
                        callback: opts.methods['maxlength'],
                        errorMessage: getMethodError(input, 'maxlength', 'Max length is &1 symbols', [input.getAttribute('maxlength')])
                    });
                }



                // if (input.getAttribute('type') === 'email') {
                //   thisInputMethods.push({
                //     callback: opts.methods['regex'],
                //     passedValue: email_reg,
                //     errorMessage: opts.validationErrors['email']['regex'] || opts.validationErrors['invalid'] || 'This field is invalid'
                //   });
                // }
                if (dataValidation) {
                    let thisValidation = opts.validationRules[input.getAttribute('data-validation')];
                    if (thisValidation) {
                        thisValidation = thisValidation['rules'];
                    }
                    if (thisValidation) {
                        Object.keys(thisValidation).forEach(methodName => {
                            let existingMethod = false;
                            let thisValidationValue = thisValidation[methodName];
                            if (opts.methods[methodName]){
                                existingMethod = {
                                    callback: opts.methods[methodName],
                                    passedValue: thisValidationValue,
                                    errorMessage: getMethodError(input, methodName, opts.validationErrors['invalid'] || 'This field is invalid')
                                };
                            }

                            if (existingMethod) thisInputMethods.push(existingMethod);
                        });
                    }
                }
                function isInputRequired() {
                    let removeIt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
                    let thisInputActualMethods = input['validationMethods'];
                    let hasRequired = false;
                    thisInputActualMethods.map(function (method) {
                        if (method.callback.name === 'required') {
                            hasRequired = true;
                            if (removeIt) thisInputActualMethods.splice(thisInputActualMethods.indexOf(method), 1);
                        }
                    });
                    return hasRequired;
                }
                function setRequired() {
                    let thisInputActualMethods = input['validationMethods'];
                    if (isInputRequired()) return;
                    thisInputActualMethods.push({
                        callback: opts.methods['required'],
                        errorMessage: getMethodError(input, 'required', 'This field is required')
                    });
                    input['validationMethods'] = thisInputMethods;
                }
                function removeRequired() {
                    isInputRequired(true);
                }
                function setError(message) {
                    _this.highlight(input)
                    _this.errorPlacement(message, input)
                }
                function removeError() {
                    _this.unhighlight(input)
                    _this.errorRemove(input)
                }
                input['setError'] = setError
                input['removeError'] = removeError
                input['setRequired'] = setRequired;
                input['removeRequired'] = removeRequired;
                input['isRequired'] = isInputRequired;
                input['validationMethods'] = thisInputMethods;
                input['had_input'] = false;
                input['had_focusout'] = false;
                input['isValid'] = function () {
                    return _this.valid(input);
                };
                input.addEventListener('input', inputInputListener);
                input.addEventListener('change', inputChangeListener);
                input.addEventListener('focus', inputFocusListener);
                input.addEventListener('focusout', inputFocusoutListener);
            });
            if (opts['rules']) {
                Object.keys(opts['rules']).forEach(function (rule) {
                    let input = document.querySelector('[name="' + rule + '"]');
                    let thisRuleValue = opts['rules'][rule];
                    let thisInputMethods = input['validationMethods'] || [];
                    if (!input) return;
                    if (thisRuleValue['laravelRequired']) thisRuleValue = 'required';
                    let thisRuleMessage = getMethodError(input, thisRuleValue, opts.validationErrors['invalid'] || 'This field is invalid')
                    if (opts['messages'] && opts['messages'][rule] && (opts['messages'][rule][thisRuleValue] || opts['messages'][rule]['laravelRequired'])) thisRuleMessage = opts['messages'][rule][thisRuleValue] || opts['messages'][rule]['laravelRequired'];
                    if (opts.methods[thisRuleValue]) {
                        thisInputMethods.push({
                            callback: opts.methods[thisRuleValue],
                            errorMessage: thisRuleMessage
                        });
                        input['validationMethods'] = thisInputMethods;
                    }
                });
            }

            if(opts.disableButton){
                _this.checkDisableButton()
            }

            _this.updateDefaultFormData()
        },
        destroy: function () {
            form.removeAttribute('novalidate', 'novalidate');
            form.removeAttribute('data-js-validation', 'novalidate');
            form.removeEventListener('submit', formSubmitListener);
            form.valid = null;
            _this.allInputs.map(function (input) {
                input['setError'] = null
                input['removeError'] = null
                input['setRequired'] = null;
                input['removeRequired'] = null;
                input['isRequired'] = null;
                input['validationMethods'] = null;
                input['had_input'] = false;
                input['had_focusout'] = false;
                input['isValid'] = null
                input.removeEventListener('input', inputInputListener);
                input.removeEventListener('change', inputChangeListener);
                input.removeEventListener('focus', inputFocusListener);
                input.removeEventListener('focusout', inputFocusoutListener);
            });
        },
        valid: function (input) {
            if(input['dont-check']){
                return true;
            }
            let checkMethods = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
            let addError = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
            let thisMethods = input['validationMethods'];
            if (!thisMethods) return true;
            let isInputValid = true;
            if (checkMethods.length) {
                thisMethods = [];
                checkMethods.forEach(function (thisMethod) {
                    let thisInputMethod = input['validationMethods'].find(obj => obj.callback.name === thisMethod);
                    if (thisInputMethod) {
                        thisMethods.push(thisInputMethod);
                    }
                });
            }
            thisMethods.forEach(function (thisMethod) {
                if (!isInputValid) return;
                let isThisValid = thisMethod['callback'](input.value, input, thisMethod['passedValue']);
                if (!isThisValid) {
                    if (addError) {
                        _this.errorPlacement(thisMethod['errorMessage'], input);
                        _this.highlight(input);
                    }
                    _this.isValid = isInputValid = input['validity']['valid'] = false;
                }
            });
            if (isInputValid) {
                _this.errorRemove(input);
                _this.unhighlight(input);
                input['validity']['valid'] = true;
            }
            return isInputValid;
        },
        validate: function () {
            let submit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
            let addError = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
            _this.isValid = true;
            _this.allInputs.map(function (input) {
                if (!_this.valid(input, addError)) {
                    _this.isValid = false;
                }
            });
            if (_this.isValid){
                form.classList.remove('has-error')
                if(submit) {
                    _this.submitHandler();
                }
            } else {
                form.classList.add('has-error')
            }
            return _this.isValid;
        },
        highlight: function (element) {
            if (typeof opts.highlightFunction === 'function') {
                opts.highlightFunction(form, element);
                return;
            }
            let container;
            if(typeof opts.inputContainerSelector === 'object'){
                opts.inputContainerSelector.forEach(function (item) {
                    if(element.closest(item)) {
                        container = element.closest(item)
                    }
                })
            } else {
                container = element.closest(opts.inputContainerSelector)
            }
            if (container) container.classList.add(opts.errorClass);
        },
        unhighlight: function (element) {
            if (typeof opts.unhighlightFunction === 'function') {
                opts.unhighlightFunction(form, element);
                return;
            }
            let container;
            if(typeof opts.inputContainerSelector === 'object'){
                opts.inputContainerSelector.forEach(function (item) {
                    if(element.closest(item)) {
                        container = element.closest(item)
                    }
                })
            } else {
                container = element.closest(opts.inputContainerSelector)
            }
            if (container) container.classList.remove(opts.errorClass);
        },
        updateDefaultFormData: function () {
            let submBtn = form.querySelector('[type="submit"]')
            if(!submBtn){
                return;
            }

            _this.defaultFormData = new FormData(form)
        },
        checkDisableButton: function () {
            let submBtn = form.querySelector('[type="submit"]')
            if(!submBtn || !form.querySelector('input:not([type="hidden"])')){
                return;
            }
            let currentFormData = new FormData(form)
            let formHasChanges = false
            let formIsValid = form.valid(false)

            if(typeof _this.defaultFormData !== 'undefined') {
                for (let [key, value] of currentFormData.entries()) {
                    if (!_this.defaultFormData.get(key) || _this.defaultFormData.get(key) !== value) {
                        formHasChanges = true
                    }
                }
            }

            if(formIsValid && formHasChanges){
                submBtn.removeAttribute('disabled')
            } else {
                submBtn.setAttribute('disabled', 'disabled')
            }
        },
        errorPlacement: function (error, element) {
            if (!error) return;
            let container;
            if(typeof opts.inputContainerSelector === 'object'){
                opts.inputContainerSelector.forEach(function (item) {
                    if(element.closest(item)) {
                        container = element.closest(item)
                    }
                })
            } else {
                container = element.closest(opts.inputContainerSelector)
            }
            let formErrorBlock = opts.formErrorBlock ? form.querySelector(opts.formErrorBlock) : false
            if(formErrorBlock){
                if(!formErrorBlock.querySelector(`[data-name="${element.getAttribute('name')}"]`)) {
                    formErrorBlock.innerHTML += `<p data-name="${element.getAttribute('name')}">${error}</p>`;
                }
            }
            if (!container){ console.warn('BLACKBOOK Validate: no container for: ', element, opts.inputContainerSelector); return; }

            if(opts.addInputErrors) {
                let errorEl = container.querySelector('.input__message');
                if (!errorEl) {
                    errorEl = document.createElement('div');
                    errorEl.classList.add('input__message');
                    container.append(errorEl);
                }
                errorEl.innerHTML = `<p>${error}</p>`;
            }
        },
        errorRemove: function (element) {
            let container;
            if(typeof opts.inputContainerSelector === 'object'){
                opts.inputContainerSelector.forEach(function (item) {
                    if(element.closest(item)) {
                        container = element.closest(item)
                    }
                })
            } else {
                container = element.closest(opts.inputContainerSelector)
            }
            let formErrorBlock = opts.formErrorBlock ? form.querySelector(opts.formErrorBlock) : false
            if(formErrorBlock){
                if(formErrorBlock.querySelector(`[data-name="${element.getAttribute('name')}"]`)) {
                    formErrorBlock.querySelector(`[data-name="${element.getAttribute('name')}"]`).remove()
                }
            }
            if(opts.addInputErrors) {
                if (!container) {
                    console.warn('BLACKBOOK Validate: no container for: ', element, opts.inputContainerSelector);
                    return;
                }
                container = container.querySelector('.input__message');
                if (!container) return;
                container.innerHTML = '';
            }
        },
        submitHandler: function () {
            if (typeof opts.submitFunction === 'function') {
                opts.submitFunction(form);
            } else {
                form.submit();
            }
        }
    };

    if (form.hasAttribute('data-js-validation')){
        _this.destroy();
        _this.init();
    } else {
        _this.init();
    }
    form.validateMethods = _this;
    return _this;
}





function inputFile(input, options) {
    if(!hasPluginRequirements('inputFile', ['selectAll', 'trigger', 'dynamicListener', 'printf'])){
        return;
    }
    let defaultOpts = {
        previewExtension: true,
        maxNameSize: 22,
        context: false,
        inputContainerSelector: '.input--file',

        removeAll: '.remove_all',

        outputName: '.output_name',
        outputDocuments: '.output_images',
        outputImages: '.output_images',
        attrSize: 'data-max-size',
        attrLength: 'data-max-files',
        attrExt: 'accept',

        errorSize: validationErrors['max_size'],
        errorExtension: validationErrors['allowed_ext'],
        errorMaxFiles: validationErrors['max_files'],
        placeholder: ''
    }
    let opts = {
        ...defaultOpts,
        ...options
    };


    function removeFileFromInput(fileInput, file) {
        let files = Array.from(fileInput.files);
        let index = files.indexOf(file);
        let thisContainer = fileInput.closest(opts.inputContainerSelector)
        let resultBlockName = opts.outputName ? (thisContainer.querySelector(opts.outputName) ?? false) : false
        let removeBtn = opts.removeAll ? (thisContainer.querySelector(opts.removeAll) ?? false ) : false

        if (index > -1) {
            files.splice(index, 1);


            let newFileList = new DataTransfer();
            for (let i = 0; i < files.length; i++) {
                newFileList.items.add(files[i]);
            }

            fileInput.files = newFileList.files;
        }

        if(!fileInput.files.length){
            if(resultBlockName)
                resultBlockName.innerHTML = opts.placeholder
            if(removeBtn)
                removeBtn.style.display = 'none'

            thisContainer.classList.add('empty-input')
            thisContainer.classList.remove('upload-success')
        } else {
            thisContainer.classList.remove('empty-input')
        }

    }
    function removeAll(e) {
        let thisContainer = !e.target ? e : e.target.closest(opts.inputContainerSelector)
        let thisInput = thisContainer.querySelector('[type="file"]')
        let resultBlockName = opts.outputName ? (thisContainer.querySelector(opts.outputName) ?? false) : false
        let resultBlockDocs = opts.outputDocuments ? (thisContainer.querySelector(opts.outputDocuments) ?? false) : false
        let resultBlockImages = opts.outputImages ? (thisContainer.querySelector(opts.outputImages) ?? false) : false

        if(resultBlockName)
            resultBlockName.innerHTML = opts.placeholder
        if(resultBlockDocs)
            resultBlockDocs.innerHTML = ''
        if(resultBlockImages)
            resultBlockImages.innerHTML = ''
        if(thisInput)
            thisInput.value = ''

        if(thisContainer.querySelector(opts.removeAll).style)
            thisContainer.querySelector(opts.removeAll).style.display = 'none'
        thisContainer.classList.add('empty-input')
        thisContainer.classList.remove('upload-success')
    }
    function fileChange(e) {
        let thisInput = e.dataTransfer ? e.target.querySelector('[type="file"]') : e.target
        let fileTypes = thisInput.getAttribute(opts.attrExt) ? thisInput.getAttribute(opts.attrExt).split(',') : false;
        let maxFileSize = thisInput.getAttribute(opts.attrSize) ? parseFloat(thisInput.getAttribute(opts.attrSize)) * 1024 * 1024 : false;
        let maxFiles = thisInput.getAttribute(opts.attrLength) ? parseInt(thisInput.getAttribute(opts.attrLength)) : false
        let files = e.dataTransfer ? e.dataTransfer.files : thisInput.files;
        let thisContainer = thisInput.closest('.input--file')
        let resultBlockName = opts.outputName ? (thisContainer.querySelector(opts.outputName) ?? false) : false
        let resultBlockDocs = opts.outputDocuments ? (thisContainer.querySelector(opts.outputDocuments) ?? false) : false
        let resultBlockImages = opts.outputImages ? (thisContainer.querySelector(opts.outputImages) ?? false) : false
        let removeBtn = opts.removeAll ? (thisContainer.querySelector(opts.removeAll) ?? false ) : false
        let allValid = true

        if(!opts.placeholder) {
            opts.placeholder = opts.outputName ? (thisInput.closest(opts.inputContainerSelector).querySelector(opts.outputName) ? thisInput.closest(opts.inputContainerSelector).querySelector(opts.outputName).textContent : '') : ''
        }

        if(resultBlockName)
            resultBlockName.innerHTML = ''
        if(resultBlockDocs)
            resultBlockDocs.innerHTML = ''
        if(resultBlockImages)
            resultBlockImages.innerHTML = ''

        if(removeBtn)
            removeBtn.style.display = 'block'

        if(fileTypes.indexOf('*/*') > -1)
            fileTypes = false

        thisContainer.classList.remove('empty-input')


        if(maxFiles && files.length > maxFiles){
            for (let delI = maxFiles-1; delI < thisInput.files.length; delI++){
                removeFileFromInput(thisInput, files[delI])
            }
            files = e.dataTransfer ? e.dataTransfer.files : thisInput.files;

            if(typeof thisInput.setError === 'function'){
                thisInput.setError(printf(opts.errorMaxFiles, [maxFiles]))
            } else {
                thisContainer.classList.add('is-error')
            }

            allValid = false
        }

        Array.from(files).forEach(function (file) {
            let isValid = false;
            let fileName = ''
            let thisName = file.name.split('.')
            let thisExt = thisName[thisName.length - 1]
            let isMedia = 'video, image'.indexOf(file.type.split('/')[0]) > -1

            thisName.pop()

            if (thisName.length > 1) {
                thisName = thisName.join('.')
            } else {
                thisName = thisName[0]
            }

            if(opts.maxNameSize) {
                if (thisName.length > opts.maxNameSize) {
                    thisName = thisName.substring(0, opts.maxNameSize) + '... '
                }
            }

            fileName = thisName + (opts.previewExtension ? '.' + thisExt : '' )

            if (fileTypes) {
                fileTypes.forEach(function (type) {
                    type = type.trim()
                    if(type.indexOf('/') > -1){
                        let fileTypeSplit = file.type.split('/')
                        type = type.split('/')

                        if(fileTypeSplit[0] === type[0]){
                            if(type[1] === '*' || fileTypeSplit[1] === type[1]) {
                                isValid = true
                            } else {
                                isValid = false
                            }
                        } else {
                            isValid = false
                        }
                    } else {
                        if (type === '.' + thisExt) {
                            isValid = true;
                        } else {
                            isValid = false
                        }
                    }
                })
            } else {
                isValid = true
            }

            if (!isValid) {
                if(typeof thisInput.setError === 'function'){
                    thisInput.setError(printf(opts.errorExtension, [fileTypes.join(', ')]))
                } else {
                    thisContainer.classList.add('is-error')
                }
                thisContainer.classList.remove('upload-success')
                removeFileFromInput(thisInput, file)
                allValid = false
                return false;
            }

            if(maxFileSize) {
                if (file.size > maxFileSize) {
                    if(typeof thisInput.setError === 'function'){
                        thisInput.setError(printf(opts.errorSize, [(maxFileSize / 1024 / 1024) + 'mb']))
                    } else {
                        thisContainer.classList.add('is-error')
                    }
                    thisContainer.classList.remove('upload-success')
                    removeFileFromInput(thisInput, file)
                    allValid = false
                    return false;
                }
            }

            thisContainer.classList.add('upload-success')

            let fileNameEl = document.createElement('span')

            if(resultBlockName){
                fileNameEl.innerHTML = fileName
                resultBlockName.append(fileNameEl)
            }
            if(resultBlockImages && isMedia){
                let newImg = document.createElement('div')

                newImg.classList.add('input__file-img')

                if(file.type.split('/')[0] === 'image') {
                    newImg.innerHTML = `<img src="${URL.createObjectURL(file)}" alt="${fileName}"><button type="button" class="input__file-remove">x</button>`
                } else if(file.type.split('/')[0] === 'video') {
                    newImg.innerHTML = `<video src="${URL.createObjectURL(file)}" controls></video><button type="button" class="input__file-remove">x</button>`
                } else {
                    return false;
                }
                newImg.querySelector('.input__file-remove').addEventListener('click', function () {
                    newImg.remove()
                    fileNameEl.remove()
                    if(resultBlockName && !resultBlockName.querySelector('span')){
                        resultBlockName.innerHTML = opts.placeholder
                        removeBtn.style.display = 'none'
                    }
                    removeFileFromInput(thisInput, file)
                })
                resultBlockImages.append(newImg)
            }
            if(resultBlockDocs && !isMedia){
                let newDoc = document.createElement('div')

                newDoc.classList.add('input__file-doc')

                newDoc.innerHTML = `<a href="${URL.createObjectURL(file)}" target="_blank">${fileName}</a><button type="button" class="input__file-remove">x</button>`

                newDoc.querySelector('.input__file-remove').addEventListener('click', function () {
                    newDoc.remove()
                    fileNameEl.remove()
                    if(resultBlockName && !resultBlockName.querySelector('span')){
                        resultBlockName.innerHTML = opts.placeholder
                        removeBtn.style.display = 'none'
                    }
                    removeFileFromInput(thisInput, file)
                })
                resultBlockDocs.append(newDoc)
            }
        })

        if(allValid) {
            if (typeof thisInput.removeError === 'function') {
                thisInput.removeError()
            } else {
                thisInput.classList.remove('is-error')
                thisContainer.classList.remove('is-error')
            }
        }
        if(typeof trigger === 'function'){
            trigger(thisInput, 'upload', input.files)
        }
    }



    if(typeof input === 'object'){
        let inputContainer = input.closest(opts.inputContainerSelector)
        let inputForm = input.closest('form')

        inputContainer['inputFileOpts'] = opts

        if(inputForm){
            inputForm.addEventListener('reset', function(){
                removeAll({target: input})
            })
        }

        ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(function (eventName) {
            inputContainer.addEventListener(eventName, function (e) {
                e.preventDefault();
                e.stopPropagation();
            })
        });
        ['dragover', 'dragenter'].forEach(function (eventName) {
            inputContainer.addEventListener(eventName, function (e) {
                inputContainer.classList.add('is-dragover');
            })
        });
        ['dragleave', 'dragend', 'drop'].forEach(function (eventName) {
            inputContainer.addEventListener(eventName, function (e) {
                inputContainer.classList.remove('is-dragover');
            })
        });
        inputContainer.addEventListener('drop', fileChange)
        input.addEventListener('change', fileChange)


        if(opts.removeAll){
            let removeBtn = input.closest('.input--file').querySelector(opts.removeAll)

            if(removeBtn) {
                removeBtn.style.display = 'none'
                removeBtn.addEventListener('click', removeAll)
            }
        }

    } else {
        dynamicListener('change', input, fileChange, opts.context)
        dynamicListener('drag dragstart dragend dragover dragenter dragleave drop', opts.inputContainerSelector, function (e) {
            e.preventDefault();
            e.stopPropagation();
        }, opts.context)
        dynamicListener('dragover dragenter', opts.inputContainerSelector, function (e) {
            e.target.classList.add('is-dragover');
        }, opts.context)
        dynamicListener('dragleave dragend drop', opts.inputContainerSelector, function (e) {
            e.target.classList.remove('is-dragover');
        }, opts.context)
        dynamicListener('drop', opts.inputContainerSelector, fileChange, opts.context)

        if(opts.removeAll) {
            selectAll(opts.removeAll, opts.context).forEach(function (thisEl) {
                thisEl.style.display = 'none'
            })
            dynamicListener('click', opts.inputContainerSelector + ' ' + opts.removeAll, removeAll, opts.context)
        }
    }
}

function scrollAppearance(container, options = {}) {
  let defaultOpts = {
    timeout: false,
    decreaseTimeout: false,
    afterFunction: false,
    horizontalBar: 'bottom',
    horizontalBarOffset: 0,

    debug: false
  }

  function offsetTop(el) {
    let thisOffset = 0
    while (true){
      if(!el.offsetParent || el.tagName.toLowerCase() === 'body') {
        break;
      }
      thisOffset += el.offsetTop
      el = el.offsetParent
    }
    return thisOffset;
  }
  function init() {
    window.addEventListener('scroll', function () {
      if (document.scrollSections.length) {
        checkBlocks();
      }
    });
    document.addEventListener('check-appearance', checkBlocks);
  }
  function showVisible(scrollSection) {
    if(scrollSection.section.classList.contains('scroll-appearance-done') || !scrollSection.blocks.filter(block=>!block.el.classList.contains('scroll-appearance-animating') && !block.el.classList.contains('scroll-appearance-shown')).length){
      scrollSection.section.classList.add('scroll-appearance-done')
      return;
    }
    scrollSection.visibleBlocks.forEach(function (block) {
      if(block.classList.contains('scroll-appearance-animating') || block.classList.contains('scroll-appearance-shown')){
        return;
      }
      block.classList.add('scroll-appearance-animating');

      setTimeout(function () {
        block.classList.add('scroll-appearance-shown');
        block.classList.remove('scroll-appearance-animating');

        trigger(block, 'scroll-appearance-shown')

        if (typeof scrollSection.afterFunction === 'function') {
          scrollSection.afterFunction(block);
        }

        let innerBlocks = block.querySelectorAll('.scroll-appearance:not(.scroll-appearance-animating):not(.scroll-appearance-shown)');

        if(innerBlocks.length) {
          innerBlocks.forEach(function (innerBlock) {
            if(isElementInViewport(innerBlock)){
              innerBlock.classList.add('scroll-appearance-animating');
              setTimeout(function () {
                innerBlock.classList.add('scroll-appearance-shown');
                innerBlock.classList.remove('scroll-appearance-animating');
                trigger(innerBlock, 'scroll-appearance-shown')
              }, scrollSection.tempTimeout || 0)
            }
          })
        }
      }, scrollSection.tempTimeout || 0);

      if(scrollSection.tempTimeout){
        if (scrollSection.decreaseTimeout) {
          scrollSection.tempTimeout = scrollSection.tempTimeout - scrollSection.decreaseTimeout > 0 ? scrollSection.tempTimeout - scrollSection.decreaseTimeout : 0;
        }
        scrollSection.tempTimeout += scrollSection.timeout
      }
    })
    scrollSection.tempTimeout = scrollSection.timeout
  }
  function checkBlocks() {
    document.scrollSections.forEach(function (item, index) {
      let thisContainerVisible = isElementInViewport(item.section);
      let sectionScrollProgress;
      let sectionOffsetTop = offsetTop(item.section)
      let sectionHeight = item.section.offsetHeight;
      let windowY = window.scrollY;
      let windowHeight = window.innerHeight;
      let offsetValue = 0

      switch(item.horizontalBar){
        case 'top':
          windowHeight = 0;
          break;
        case 'center':
          windowHeight = windowHeight/2
          break;
      }

      if(typeof item.horizontalBarOffset === 'number'){
        offsetValue = item.horizontalBarOffset
      } else {
        if(typeof item.horizontalBarOffset === 'string' && (item.horizontalBarOffset.indexOf('%') > -1 || item.horizontalBarOffset.indexOf('vh') > -1) && parseFloat(item.horizontalBarOffset) ){
          offsetValue = parseFloat(item.horizontalBarOffset)
          offsetValue = windowHeight * (offsetValue/100)
        }
      }

      if(item.debug && !document.querySelector('.bar-' + item.section.className.split(' ')[0])) {
        let fff = `<div class="bar-${item.section.className.split(' ')[0]}" style="position: fixed; left: 0;right: 0;height: 2px; background: #787878;color:#787878; top: ${windowHeight - offsetValue + 'px'}; z-index: 9999">${item.section.className.split(' ')[0]}</div>`
        document.body.insertAdjacentHTML('beforeend', fff)
      }

      if(!thisContainerVisible){
        item.section.scrollAppearance['scrollProgress'] =  (offsetTop(item.section) > window.scrollY ? 0 : 1)
        item.section.style.setProperty('--scroll-progress', offsetTop(item.section) > window.scrollY ? 0 : 1);
        return;
      }

      windowY = windowY + windowHeight - offsetValue

      sectionScrollProgress = ((windowY - sectionOffsetTop) / sectionHeight).toFixed(3)

      if(sectionScrollProgress > 1){
        sectionScrollProgress = 1
      }
      if(sectionScrollProgress <= 0.01){
        sectionScrollProgress = 0
      }

      item.section.scrollAppearance['scrollProgress'] = sectionScrollProgress
      item.section.style.setProperty('--scroll-progress', sectionScrollProgress)

      item.blocks.forEach(function (blockArr, blockIndex) {
        let block = blockArr.el
        let blockInView = isElementInViewport(block)

        if(!blockInView) {
          block.scrollProgress = blockArr.scrollProgress = (offsetTop(block) > window.scrollY ? 0 : 1)
          block.style.setProperty('--scroll-block-progress', offsetTop(block) > window.scrollY ? 0 : 1)
          return;
        }
        let blockScrollProgress;
        let blockOffsetTop = offsetTop(block)
        let blockHeight = block.offsetHeight;
        blockScrollProgress = ((windowY - blockOffsetTop) / blockHeight).toFixed(3)

        if(blockScrollProgress > 1){
          blockScrollProgress = 1
        }
        if(blockScrollProgress <= 0.01){
          blockScrollProgress = 0
        }

        block.scrollProgress = blockArr.scrollProgress = block.dataset.easing && jsEase[block.dataset.easing] ? jsEase[block.dataset.easing](blockScrollProgress) : blockScrollProgress
        block.style.setProperty('--scroll-block-progress', (block.dataset.easing && jsEase[block.dataset.easing] ? jsEase[block.dataset.easing](blockScrollProgress) : blockScrollProgress))

        if(item.section.classList.contains('scroll-appearance-done') || block.classList.contains('scroll-appearance-shown') || block.classList.contains('scroll-appearance-animating')){
          return;
        }
        if(blockScrollProgress <= 0 || (blockScrollProgress >= 1 && (block.classList.contains('scroll-appearance-shown') || block.classList.contains('scroll-appearance-animating')))){
          return;
        }
        if(blockInView && !item.visibleBlocks.find(fItem=>fItem==block) && (!block.parentElement.closest('.scroll-appearance') || block.parentElement.closest('.scroll-appearance-shown') || block.parentElement.closest('.scroll-appearance-animating'))) {
          item.visibleBlocks.push(block)
        }
      })

      showVisible(item)

      item.section.scrollAppearance['blocks'] = item.blocks
      item.section.scrollAppearance['visibleBlocks'] = item.visibleBlocks
    });
  }
  function addSection(section, sectionOpts = {}) {
    let blocks = Array.from(section.querySelectorAll('.scroll-appearance:not(.scroll-appearance-shown)'));
    let blocksArr = []

    let sOpts = {
      ...defaultOpts,
      ...sectionOpts
    }

    sOpts.timeout = section.dataset.timeout || sOpts.timeout
    sOpts.decreaseTimeout = section.dataset.decreaseTimeout || sOpts.decreaseTimeout
    sOpts.horizontalBar = section.dataset.horizontalBar || sOpts.horizontalBar
    sOpts.horizontalBarOffset = (section.dataset.horizontalBarOffset ? (section.dataset.horizontalBarOffset.indexOf('%') === -1 && section.dataset.horizontalBarOffset.indexOf('vh') === -1) ? parseInt(section.dataset.horizontalBarOffset) : (section.dataset.horizontalBarOffset) : sOpts.horizontalBarOffset )
    sOpts.debug = section.dataset.debug || sOpts.debug

    blocks.forEach(function (block) {
      blocksArr.push({
        el: block,
        scrollProgress: 0
      })
    })
    section.scrollAppearance = {
      blocks: blocksArr,
      scrollProgress: 0,
      timeout: sOpts.timeout,
      decreaseTimeout: sOpts.decreaseTimeout,
      afterFunction: sOpts.afterFunction,
    }
    document.scrollSections.push({
      section: section,
      blocks: blocksArr,
      visibleBlocks: [],
      sumTimeout: 0,
      ...sOpts
    });

    checkBlocks();

    let swipers = section.querySelectorAll('.swiper')
    let swiperInterval = 0;

    function checkSwiper(swiper) {
      if(!swiper){
        return;
      }
      clearInterval(swiperInterval)
      let visibleSlides = (Math.ceil(swiper.params.slidesPerView) - 1) || 1
      swiper.slides.forEach(function (slide, index) {
        if(index > visibleSlides){
          slide.classList.add('scroll-appearance-shown')
          slide.querySelectorAll('.scroll-appearance').forEach(item=>item.classList.add('scroll-appearance-shown'))
        }
      })
    }
    swipers.forEach(function (swiper) {
      if(!swiper.swiper){
        swiperInterval = setInterval(function () {
          checkSwiper(swiper.swiper)
        }, 100)
      } else {
        checkSwiper(swiper.swiper)
      }
    })
    setTimeout(function () {
      clearInterval(swiperInterval)
    }, 5000)
  }

  if (!document.scrollSections) {
    document.scrollSections = []
    init();
  }

  if(container) {
    addSection(container, {
      ...defaultOpts,
      ...options
    });
  }

  return {
    checkBlocks: checkBlocks,
    addSection: addSection,
    showVisible: showVisible
  };
}
