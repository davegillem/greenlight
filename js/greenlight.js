/*eslint no-loop-func:0*/
/*eslint no-unused-vars:0*/
/*jshint loopfunc:true*/
/*jshint unused:false */
/*************************************************
 * Greenlight Form Validation Plugin
 *
 * Copyright (c) 2017 by Dave Gillem / http://davegillem.com
 *
 *
 * Originally forked from jQuery Ketchup Plugin
 * Original Copyright (c) 2011 by Sebastian Senf:
 * 			http://github.com/mustardamus/ketchup-plugin
 *
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
*************************************************/
(function ($) {
    'use strict';
    $.greenlight = {
        /* SETUP VARIABLES */
        defaults                : {
            attribute             : 'data-validate',                  // look in that attribute for a validation string
            validateIndicator     : 'validate',                       // in the validation string this indicates the validations eg validate(required)
            eventIndicator        : 'on',                             // in the validation string this indicates the events when validations get fired eg on(blur)
            validateEvents        : 'blur',                           // the default event when validations get fired on every field
            validateElements      : ['input', 'textarea', 'select'],  // check this fields in the form for a validation string on the attribute
            errorDisplayType      : 'inline', //'bubble',              // accepts either inline or bubble for displaying validation errors
            bubbleErrorPosition   : 'right', //'left',// right, side   // where the bubble error appears (right=top right corner, left=top left corner, side=right side of field)
            fieldErrorClass       : 'fieldError',                     // ability to add a class to the field for CSS modifications to display on error
            parentErrorClass      : 'parentError',                    // ability to add a class to the parent tag of the field for CSS modifications to display on error
            fieldValidClass       : 'fieldValid',                     // ability to add a class to the field for CSS modifications to display on error
            parentValidClass      : 'parentValid',                    // ability to add a class to the parent tag of the field for CSS modifications to display on error
            optionalClass         : 'optRequired',                    // css class used to identify a field that is optional but requires validation check if it isnt empty
            emptyValidClass       : 'emptyValid',                     // css class used to identify a field that is optional ^^ but is also empty which means its valid
            createErrorContainer  : null,                             // function to create the error container (can also be set via $.greenlight.createErrorContainer(fn))
            showErrorContainer    : null,                             // function to show the error container (can also be set via $.greenlight.showErrorContainer(fn))
            hideErrorContainer    : null,                             // function to hide the error container (can also be set via $.greenlight.hideErrorContainer(fn))
            addErrorMessages      : null                              // function to add error messages to the error container (can also be set via $.greenlight.addErrorMessages(fn))
        },
        errorMessages           : {},
        dataNames               : {
            validationString      : 'greenlight-validation-string',
            validations           : 'greenlight-validations',
            events                : 'greenlight-events',
            elements              : 'greenlight-validation-elements',
            container             : 'greenlight-container'
        },
        validations             : {},
        helpers                 : {},
        /* PRIVATE METHODS */
        validation              : function () {
            var message, func,
                arg1 = arguments[1];

            if (typeof arg1 === 'function') {
                func    = arg1;
            } else {
                message = arg1;
                func    = arguments[2];
            }

            this.validations[arguments[0]] = {
                message : message,
                func    : func,
                init    : arguments[3] || function (form, el) {}
            };
            return this;
        },
        message                 : function (name, message) {
            this.addMessage(name, message);
            return this;
        },
        messages                : function (messages) {
            var name, errMsg;
            for (name in messages) {
                if (messages.hasOwnProperty(name)) {
                    errMsg = messages[name];
                    this.addMessage(name, errMsg);
                    this.errorMessages[name] = errMsg;
                }
            }
            return this;
        },
        addMessage              : function (name, message) {
            if (this.validations[name]) {
                this.validations[name].message = message;
            }
        },
        helper                  : function (name, func) {
            this.helpers[name] = func;
            return this;
        },
        init                    : function (form, options, fields) {
            this.options = options;
            var $self        = this,
                valEls       = this.initFunctions().initFields(form, fields);

            valEls.each(function () {
                var el = $(this);

                $self
                    .bindValidationEvent(form, el)
                    .callInitFunctions(form, el);
            });
            form.data(this.dataNames.elements, valEls);
            this.bindFormSubmit(form);
        },
        initFunctions           : function () {
            var f,
                funcName,
                opt         = this.options,
                initFuncs   = [
                                'createErrorContainer',
                                'showErrorContainer',
                                'hideErrorContainer',
                                'addErrorMessages',
                                'useBubbleError',
                                'useInlineError'
                            ],
                initLen     = initFuncs.length;

            for (f = 0; f < initLen; f++) {
                funcName = initFuncs[f];
                if (!opt[funcName]) {
                    opt[funcName] = this[funcName];
                }
            }
            return this;
        },
        initFields              : function (form, fields) {
            var el, vals,
                self      = this,
                dataNames = this.dataNames,
                valEls    = $(!fields ? this.fieldsFromForm(form) : this.fieldsFromObject(form, fields));

            valEls.each(function () {
                el   = $(this);
                vals = self.extractValidations(el.data(dataNames.validationString), self.options.validateIndicator);
                el.data(dataNames.validations, vals);
            });
            return valEls;
        },
        callInitFunctions       : function (form, el) {
            var i,
                vals    = el.data(this.dataNames.validations),
                valLen  = vals.length;

            for (i = 0; i < valLen; i++) {
                vals[i].init.apply(this.helpers, [form, el]);
            }
        },
        fieldsFromForm          : function (form) {
            var i, els, el, attr, events,
                self        = this,
                opt         = this.options,
                dataNames   = this.dataNames,
                optValEls   = opt.validateElements,
                retArr      = [],
                valEls      = typeof optValEls === 'string' ? [optValEls] : optValEls,
                valElsLen   = valEls.length;

            for (i = 0; i < valElsLen; i++) {
                els = form.find(valEls[i] + '[' + opt.attribute + '*=' + opt.validateIndicator + ']');

                els.each(function () {
                    el     = $(this);
                    attr   = el.attr(opt.attribute);
                    events = self.extractEvents(attr, opt.eventIndicator);

                    el.data(dataNames.validationString, attr)
                    .data(dataNames.events, events ? events : opt.validateEvents);
                });
                retArr.push(els.get());
            }
            return this.normalizeArray(retArr);
        },
        fieldsFromObject        : function (form, fields) {
            var s, valString, events, valEls,
                opt       = this.options,
                dataNames = this.dataNames,
                retArr    = [];

            for (s in fields) {
                if (fields.hasOwnProperty(s)) {
                    if (typeof fields[s] === 'string') {
                        valString = fields[s];
                        events    = opt.validateEvents;
                    } else {
                        valString = fields[s][0];
                        events    = fields[s][1];
                    }

                    valEls    = form.find(s);
                    valString = this.mergeValidationString(valEls, valString);
                    events    = this.mergeEventsString(valEls, events);

                    valEls
                        .data(dataNames.validationString, opt.validateIndicator + '(' + valString + ')')
                        .data(dataNames.events, events);

                    retArr.push(valEls.get());
                }
            }
            return this.normalizeArray(retArr);
        },
        mergeEventsString       : function (valEls, events) {
            var i, eveArr, eveArrLen,
                oldEvents = valEls.data(this.dataNames.events),
                newEvents = '';

            if (oldEvents) {
                eveArr      = oldEvents.split(' ');
                eveArrLen   = eveArr.length;

                for (i = 0; i < eveArrLen; i++) {
                    if (events.indexOf(eveArr[i]) === -1) {
                        newEvents += ' ' + eveArr[i];
                    }
                }
            }
            return $.trim(events + newEvents);
        },
        mergeValidationString   : function (valEls, newVal) {
            var i, ret, valsToCheckLen, o, n, newVals, newValsLen, oldVals, oldValsLen,
                opt             = this.options,
                newValString    = newVal,
                valString       = valEls.data(this.dataNames.validationString),
                buildValFunc    = function (validation) {
                                    ret = validation.name;
                                    if (validation.arguments.length) {
                                        ret = ret + '(' + validation.arguments.join(',') + ')';
                                    }
                                    return ret;
                                },
                inVals          = function (valsToCheck, val) {
                                    valsToCheckLen  = valsToCheck.length;
                                    for (i = 0; i < valsToCheckLen; i++) {
                                        if (valsToCheck[i].name === val.name) {
                                            return true;
                                        }
                                    }
                                };
            if (valString) {
                newVals         = this.extractValidations(opt.validateIndicator + '(' + newValString + ')', opt.validateIndicator);
                oldVals         = this.extractValidations(valString, opt.validateIndicator);
                newValString    = '';
                oldValsLen      = oldVals.length;
                newValsLen      = newVals.length;

                for (o = 0; o < oldValsLen; o++) {
                    newValString += buildValFunc(oldVals[o]) + ',';
                }
                for (n = 0; n < newValsLen; n++) {
                    if (!inVals(oldVals, newVals[n])) {
                        newValString += buildValFunc(newVals[n]) + ',';
                    }
                }
            }
            return newValString;
        },
        bindFormSubmit          : function (form) {
            var self = this,
                opt  = this.options;

            form.submit(function () {
                return self.allFieldsValid(form, true);
            });
        },
        allFieldsValid          : function (form, triggerEvents) {
            var el,
                self  = this,
                hasGreenlight = true,
                // added triggerMe to only add classnames if events also get triggered
                triggerMe = triggerEvents || false;

            form.data(this.dataNames.elements).each(function () {
                el = $(this);
                if (self.validateElement(el, form, triggerMe) !== true) {
                    if (triggerEvents === true) {
                        self.triggerValidationEvents(el);
                    }
                    hasGreenlight = false;
                }
            });
            form.trigger('formIs' + (hasGreenlight ? 'Valid' : 'Invalid'), [form]);
            return hasGreenlight;
        },
        bindValidationEvent     : function (form, el) {
            var i, hasGreenlight, container,
                self        = this,
                opt         = this.options,
                dataNames   = this.dataNames,
                events      = el.data(dataNames.events).split(' '),
                eventsLen   = events.length;

            for (i = 0; i < eventsLen; i++) {
                el.off('greenlight.' + events[i])
                .on('greenlight.' + events[i], function () {
                    hasGreenlight     = self.validateElement(el, form);
                    container = el.data(dataNames.container);
                    if (hasGreenlight !== true) {
                        if (!container) {
                            container = opt.createErrorContainer(form, el);
                            el.data(dataNames.container, container);
                        }
                        opt.addErrorMessages(form, el, container, hasGreenlight);
                        opt.showErrorContainer(form, el, container);
                    } else {
                        if (container){
                            opt.hideErrorContainer(form, el, container);
                        }
                    }
                });
                this.bindValidationEventBridge(el, events[i]);
            }
            return this;
        },
        bindValidationEventBridge: function (el, event) {
            el.on(event, function () {
                el.trigger('greenlight.' + event);
            });
        },
        validateElement         : function (el, form, triggerEvent) {
            var i,
                hasGreenlight           = [],
                vals            = el.data(this.dataNames.validations),
                type            = el.is('input') ? el.attr('type') : el.get(0).tagName.toLowerCase(),
                valLength       = vals ? vals.length : 0,
                fieldVal        = el.val(),
                args            = [form, el, fieldVal],
                theField        = '#'+el.attr('id'),
                isUnique        = el.attr('data-unique'),
                isOptional      = el.hasClass(this.defaults.optionalClass),
                isEmpty         = !fieldVal || fieldVal.length === 0,
                theParent       = el.parent();
            if (type === 'checkbox' || type === 'radio'){
                theParent = el.parent().parent();
            }
            if (type === 'select'){
                theParent = el.parents('li.gw-form-li:first');
            }
            if (isOptional && isEmpty){
                $(theField)
                    .removeClass(this.defaults.fieldErrorClass)
                    .addClass(this.defaults.fieldValidClass)
                    .addClass(this.defaults.emptyValidClass);
                $(theParent)
                    .removeClass(this.defaults.parentErrorClass)
                    .addClass(this.defaults.parentValidClass);
                if (this.defaults.errorDisplayType === 'inline'){
                    this.useInlineError('hide', form, el);
                } else {
                    this.useBubbleError('hide', form, el);
                }
                return true;
            } else if (!isEmpty){
                $(theField).removeClass(this.defaults.emptyValidClass);
            }
            for (i = 0; i < valLength; i++) {
                if (!vals[i].func.apply(this.helpers, args.concat(vals[i].arguments))) {
                    hasGreenlight.push(vals[i].message);
                }
            }

            form.trigger('fieldIs' + (hasGreenlight.length ? 'Invalid' : 'Valid'), [form, el]);

            if (hasGreenlight.length>0 && triggerEvent !== false){
                $(theField)
                    .addClass(this.defaults.fieldErrorClass)
                    .removeClass(this.defaults.fieldValidClass)
                    .removeClass(this.defaults.emptyValidClass);
                $(theParent)
                    .addClass(this.defaults.parentErrorClass)
                    .removeClass(this.defaults.parentValidClass);
            } else if (hasGreenlight.length<=0 && triggerEvent !== false){
                $(theParent)
                    .removeClass(this.defaults.parentErrorClass)
                    .addClass(this.defaults.parentValidClass);
                    // Hack to fix radio/CB error hiding
                    if (type === 'checkbox' || type === 'radio'){
                        if (this.defaults.errorDisplayType !== 'bubble'){
                            this.useInlineError('hide', form, el);
                        } else {
                            this.useBubbleError('hide', form, el);
                        }
                    }
            }
            //add valid class to field only
            if (hasGreenlight.length<=0){// && (isOptional || !isEmpty)){
                $(theField)
                    .removeClass(this.defaults.fieldErrorClass)
                    .addClass(this.defaults.fieldValidClass);
            }
            return hasGreenlight.length ? hasGreenlight : true;
        },
        elementIsValid          : function (el) {
            var form,
                dataNames = this.dataNames;

            if (el.data(dataNames.validations)) {
                form = el.parentsUntil('form').last().parent();
                return (this.validateElement(el, form) === true ? true : false);
            } else if (el.data(dataNames.elements)) {
                return this.allFieldsValid(el);
            }
            return true; // if no field validations are found default to true
        },
        triggerValidationEvents : function (el) {
            var e,
                events      = el.data(this.dataNames.events) ? el.data(this.dataNames.events).split(' ') : [],
                eventsLen   = events.length;

            for (e = 0; e < eventsLen; e++) {
                el.trigger('greenlight.' + events[e]);
            }
        },
        extractValidations      : function (toExtract, indicator) {
            var i, v, a, hasArgs, valName, valArgs, valFunc, message, tmpMessage, tempArrLen, valArgsLen, valObj,
                fullString      = toExtract.substr(toExtract.indexOf(indicator) + indicator.length + 1),
                fullStringLen   = fullString.length,
                tempStr         = '',
                tempArr         = [],
                openBrackets    = 0,
                validations     = [];

            for (i = 0; i < fullStringLen; i++) {
                switch (fullString.charAt(i)) {
                    case '(':
                        tempStr += '(';
                        openBrackets++;
                        break;
                    case ')':
                        if (openBrackets) {
                            tempStr += ')';
                            openBrackets--;
                        } else {
                            tempArr.push($.trim(tempStr));
                        }
                        break;
                    case ',':
                        if (openBrackets) {
                            tempStr += ',';
                        } else {
                            tempArr.push($.trim(tempStr));
                            tempStr = '';
                        }
                        break;
                    default:
                        tempStr += fullString.charAt(i);
                        break;
                }
            }
            tempArrLen  = tempArr.length;
            for (v = 0; v < tempArrLen; v++) {
                valObj  = tempArr[v];
                hasArgs = valObj.indexOf('(');
                valName = valObj;
                valArgs = [];
                if (hasArgs !== -1) {
                    valName = valObj.substring(0, hasArgs);
                    if (valName === 'custom'){
                        valArgs   = valObj.substring(valObj.indexOf('(')+1, valObj.lastIndexOf(')')).split(',');
                    } else {
                        valArgs = $.map(tempArr[v].substr(valName.length).split(','), function (n) {
                            return $.trim(n.replace('(', '').replace(')', ''));
                        });
                    }
                }
                valFunc = this.validations[valName];
                if (valFunc && valFunc.message) {
                    message = valFunc.message;
                    valArgsLen  = valArgs.length;
                    for (a = 1; a <= valArgsLen; a++) {
                        message = message.replace('{arg' + a + '}', valArgs[a - 1]);
                        message = message.replace(/^['\s]+|['\s]+$/g, '');

                        if (valName === 'custom'){
                            tmpMessage  = this.errorMessages['custom-'+message];
                            message     = tmpMessage || message;
                        }
                    }
                    validations.push({
                                        name     : valName,
                                        arguments: valArgs,
                                        func     : valFunc.func,
                                        message  : message,
                                        init     : valFunc.init
                                    });
                }
            }
            return validations;
        },
        extractEvents           : function (toExtract, indicator) {
            var events  = false,
                pos     = toExtract.indexOf(indicator + '(');
            if (pos !== -1) {
                events = toExtract.substr(pos + indicator.length + 1).split(')')[0];
            }
            return events;
        },
        normalizeArray          : function (array) {
            var i, e, tempArrLen,
                returnArr   = [],
                arrayLen    = array.length;
            for (i = 0; i < arrayLen; i++) {
                tempArrLen  = array[i].length;
                for (e = 0; e < tempArrLen; e++) {
                    if (array[i][e]) {
                        returnArr.push(array[i][e]);
                    }
                }
            }
            return returnArr;
        },
        /* ERRORS */
        createErrorContainer    : function (form, el) {
            if (typeof form === 'function') {
                this.defaults.createErrorContainer = form;
                return this;
            } else {
                if (this.errorDisplayType !== 'bubble'){
                    return this.useInlineError('create', form, el, null, null);
                } else {
                    return this.useBubbleError('create', form, el, null, null);
                }
            }
        },
        showErrorContainer      : function (form, el, container) {
            if (typeof form === 'function') {
                this.defaults.showErrorContainer = form;
                return this;
            } else {
                if (this.errorDisplayType !== 'bubble'){
                    this.useInlineError('show', form, el, container, null);
                } else {
                    this.useBubbleError('show', form, el, container, null);
                }
            }
        },
        hideErrorContainer      : function (form, el, container) {
            if (typeof form === 'function') {
                this.defaults.hideErrorContainer = form;
                return this;
            } else {
                if (this.errorDisplayType !== 'bubble'){
                    this.useInlineError('hide', form, el, container, null);
                } else {
                    this.useBubbleError('hide', form, el, container, null);
                }
            }
        },
        addErrorMessages        : function (form, el, container, messages) {
            if (typeof form === 'function') {
                this.defaults.addErrorMessages = form;
                return this;
            } else {
                if (this.errorDisplayType !== 'bubble'){
                    this.useInlineError('add', form, el, container, messages);
                } else {
                    this.useBubbleError('add', form, el, container, messages);
                }
            }
        },
        useBubbleError          : function (type, form, el, containerObj, messages){
            var i, list, topPos, leftPos, showPos, hidePos, arrowClass,
                container   = containerObj,
                elOffset    = el.offset(),
                fieldType   = el.attr('type'),
                fieldParent = el.parent(),
                messageLen  = messages ? messages.length : 0;
            if (fieldType === 'checkbox' || fieldType === 'radio'){
                fieldParent = el.parent().parent();
            }
            if (type ===  'select'){
                fieldParent = el.parents('li.gw-form-li:first');
            }
            switch (this.bubbleErrorPosition) {
                case 'left':
                    topPos     = elOffset.top - el.outerHeight()-5;
                    leftPos    = elOffset.left;
                    showPos    = {left: elOffset.left+20, opacity: 1};
                    hidePos    = {left: elOffset.left + el.outerWidth()-20, opacity: 0};
                    arrowClass = 'arrowDown';
                    break;
                case 'side':
                    topPos     = elOffset.top-5;
                    leftPos    = elOffset.left + el.outerWidth();
                    showPos    = {left: elOffset.left + el.outerWidth()+30, opacity: 1};
                    hidePos    = {left: elOffset.left + el.outerWidth(), opacity: 0};
                    arrowClass = 'arrowLeft';
                    break;
                default:
                    topPos     = elOffset.top - el.outerHeight()-5;
                    leftPos    = elOffset.left + el.outerWidth()- 20;
                    showPos    = {left: elOffset.left + el.outerWidth()+5, opacity: 1};
                    hidePos    = {left: elOffset.left + el.outerWidth()-20, opacity: 0};
                    arrowClass = 'arrowDown';
                    break;
                }
            if (type === 'create'){
                return $('<div/>', {
                                    html   : '<ul class="'+arrowClass+'"></ul><span></span>',
                                    'class': 'greenlight-error',
                                    css    : {
                                                top : topPos,
                                                left: leftPos
                                            }
                        })
                        .appendTo('body');
            } else if (type === 'show'){
                container.show().animate(showPos, 'fast');
                return;
            } else if (type === 'hide'){
                if (!container){
                    container = fieldParent.children('.greenlight-error-inline');
                }
                container.animate(hidePos, 'fast', function () {
                    container.hide();
                });
                return;
            } else if (type === 'add'){
                list = container.children('ul').empty();
                for (i = 0; i < messageLen; i++) {
                    $('<li/>', {
                                text: unescape(messages[i])
                                })
                                .appendTo(list);
                }
                return;
            }
        },
        useInlineError          : function (type, form, el, container, messages){
            var i, list,
                fieldType   = el.attr('type') === undefined ? undefined : el.attr('type').toLowerCase(),
                fieldParent = el.parent(),
                errContainer= container,
                messageLen  = messages ? messages.length : 0;
            if (fieldType === 'checkbox' || fieldType === 'radio'){
                fieldParent = el.parent().parent();
            }
            if (type ===  'select'){
                fieldParent = el.parents('li.gw-form-li:first');
            }
            if (type === 'create'){
                return $('<div/>', {
                                    html   : '<ul></ul><span></span>',
                                    'class': 'greenlight-error-inline',
                                    css    : {}
                    })
                    .appendTo(fieldParent);
            } else if (type === 'show'){
                errContainer.addClass('showMe').removeClass('hideMe');
                return;
            } else if (type === 'hide'){
                if (!container){
                    errContainer = fieldParent.children('.greenlight-error-inline');
                }
                errContainer.addClass('hideMe').removeClass('showMe');
                return;
            } else if (type === 'add'){
                list = errContainer.children('ul').empty();//.html('');
                for (i = 0; i < messageLen; i++) {
                    $('<li/>', {
                                text: unescape(messages[i])
                                })
                                .appendTo(list);
                }
                return;
            }
        }
    };
    /* PUBLIC METHODS */
    $.fn.triggerCustomErrorMsg  = function (messages){
        var el          = $(this),
            form        = el.parent('form'),
            defaults    = $.greenlight.defaults,
            theField    = '#'+el.attr('id'),
            type        = el.attr('type'),
            parentItem  = el.parent(),
            container   = $.greenlight.createErrorContainer(form, el);
        if (type === 'checkbox' || type === 'radio'){
            parentItem = el.parent().parent();
        }
        if (type ===  'select'){
            parentItem = el.parents('li.gw-form-li:first');
        }
        $.greenlight.addErrorMessages(form, el, container, messages);
        $(theField)
            .addClass(defaults.fieldErrorClass)
            .removeClass(defaults.fieldValidClass);
        $(parentItem)
            .addClass(defaults.parentErrorClass)
            .removeClass(defaults.parentValidClass);

        return $.greenlight.showErrorContainer(form, el, container);
    };
    $.fn.hideCustomErrorMsg     = function (){
        var el          = $(this),
            form        = el.parent('form'),
            defaults    = $.greenlight.defaults,
            theField    = '#'+el.attr('id'),
            type        = el.attr('type'),
            parentItem  = el.parent();
        if (type === 'checkbox' || type === 'radio'){
            parentItem = el.parent().parent();
        }
        if (type ===  'select'){
            parentItem = el.parents('li.gw-form-li:first');
        }
        $(theField)
            .removeClass(defaults.fieldErrorClass)
            .addClass(defaults.fieldValidClass);
        $(parentItem)
            .removeClass(defaults.parentErrorClass)
            .addClass(defaults.parentValidClass);

        return $.greenlight.hideErrorContainer(form, el);
    };
    $.fn.greenlight             = function (options, fields) {
        var el = $(this);
        if (typeof options === 'string') {
            switch (options) {
                case 'validate':
                    $.greenlight.triggerValidationEvents(el);
                    break;
                case 'isValid':
                    return $.greenlight.elementIsValid(el);
            }
        } else {
            this.each(function () {
                $.greenlight.init(el, $.extend({}, $.greenlight.defaults, options), fields);
            });
        }
        return this;
    };
})(jQuery);
