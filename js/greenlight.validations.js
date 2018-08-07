/*eslint strict:0*/
$.greenlight

/*********************** VALIDATIONS *****************************/
.validation('required', 'This field is required.', function (form, el, value) {
    if (el.is(':checkbox') || el.is(':radio')){
        var myname = el.attr('name'),
            myForm = '#'+form.attr('id');
        return (!!$(myForm+' input[name='+myname+']:checked').val());
    } else if (el.is('select')){
        return (!!value && value !== null && value !== '');
    } else {
        var newVal = value.replace(/^\s+|\s+$/g, '');
        return (newVal.length !== 0);
    }
})
.validation('minLength', 'This field must have a minimum length of {arg1}.', function (form, el, value, min) {
    return (value.length >= +min);
})
.validation('maxLength', 'This field has a maximum length of {arg1}.', function (form, el, value, max) {
    return (value.length <= +max);
})
.validation('rangeLength', 'This field must have a length between {arg1} and {arg2}.', function (form, el, value, min, max) {
    return (value.length >= min && value.length <= max);
})
.validation('min', 'Must be at least {arg1}.', function (form, el, value, min) {
    return (this.isNumber(value) && +value >= +min);
})
.validation('max', 'Can not be greater than {arg1}.', function (form, el, value, max) {
    return (this.isNumber(value) && +value <= +max);
})
.validation('range', 'Must be between {arg1} and {arg2}.', function (form, el, value, min, max) {
    return (this.isNumber(value) && +value >= +min && +value <= +max);
})
.validation('number', 'Must be a number.', function (form, el, value, formatted) {
	if (formatted){
		return (/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/).test(value);
	}else {
		return !isNaN(parseFloat(value)) && isFinite(value);
	}
})
.validation('email', 'Must be a valid E-Mail.', function (form, el, value) {
    return this.isEmail(value);
})
.validation('url', 'Must be a valid URL.', function (form, el, value) {
    return this.isUrl(value);
})
.validation('username', 'Must be a valid username.', function (form, el, value) {
    return this.isUsername(value);
})
.validation('letters', 'Must be letters.', function (form, el, value) {
    // allows for white space characters as well
    return (/^[A-Za-z\s]+$/).test(value);
})
.validation('usZip', 'Must be a valid US Zip Code.', function (form, el, value) {
    // allows for 5 or 9 with hyphen, fails on anything else
    return (/^\d{5}([\-]\d{4})?$/).test(value);
})
.validation('usStateAbbr', 'Must be a valid US State Abbreviation.', function (form, el, value) {
    return (/^A[LKSZRAEP]|C[AOT]|D[EC]|F[LM]|G[AU]|HI|I[ADLN]|K[SY]|LA|M[ADEHINOPST]|N[CDEHJMVY]|O[HKR]|P[ARW]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY]$/).test(value);
})
.validation('lettersAndNumbs', 'Must contain Letters and/or Numbers.', function (form, el, value) {
    return (/^[a-z A-Z.\-\#0-9]+$/).test(value);
})
.validation('usPhone', 'Must be a valid Phone Number.', function (form, el, value) {
    return this.isUSPhone(value);
})
.validation('phone', 'Must be a valid Phone Number.', function (form, el, value) {
    return this.isPhone(value);
})
.validation('match', 'Must be {arg1}.', function (form, el, value, word) {
    return (el.val() === word);
})
.validation('contains', 'Must contain {arg1}', function (form, el, value, word, sensitive) {
    return this.contains(value, word, sensitive);
})
.validation('date', 'Must be a valid date.', function (form, el, value, dateType, noPastDates) {
    return this.isDate(value, dateType, noPastDates);
})
.validation('ipAddress', 'Must be a valid IP Address.', function (form, el, value) {
    return this.isIPAddress(value);
})
.validation('ssn', 'Must be a valid Social Security number.', function (form, el, value, lastFour) {
    if (lastFour){
        return (/^(\d{4,4})$/).test(value);
    } else {
        return (/^(?!(000|666))([0-6]\d{2}|7([0-6]\d|7[012]))-(?!00)\d{2}-(?!0000)\d{4}$/).test(value);
    }
})
.validation('notEmpty', 'This field cannot contain ONLY spaces', function (form, el, value) {
    var str = value.replace(/^\s+|\s+$/g, '');
    return (/^\S*[a-z0-9]*$/i).test(str);
})
// PASSWORDS
.validation('passStrength', 'Invalid Password', function (form, el, value, strength, minLength, maxLength, numbers, lower, upper, special, letters, allowed, repeating, allowSpaces) {
    var isValidPw       = false,
        minChars        = minLength && !isNaN(minLength) ? minLength : 6,
        maxChars        = maxLength && !isNaN(maxLength) ? maxLength : 30,
        numChars        = numbers && !isNaN(numbers) ? numbers : 0,
        upperChars      = upper && !isNaN(upper) ? upper : 0,
        lowerChars      = lower && !isNaN(lower) ? lower : 0,
        specialChars    = special && !isNaN(special) ? special : 0,
        minLetters      = letters && !isNaN(letters) ? letters : 0,
        allowedChars    = allowed && allowed !== 'null' ? allowed : '@#!$%^&+=?*',
        repeatChars     = repeating && !isNaN(repeating) && repeating !== 0 ? repeating : 1,
        spaces          = allowSpaces !== 'true' ? allowSpaces : 'true';
    switch (strength) {
        case 'weak':
            // >1 0-9, >1 a-z, >1 A-Z, between 6-30 characters in length
            // ^((?=(.*[\d]){1,})(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[^\w\d\s]){0,})){6,30}.*$
            isValidPw = this.checkPWStrength(value, 1, 1, 1, '0', minChars, maxChars, allowedChars);
            break;
        case 'medium':
            // >1 0-9, >1 a-z, >1 A-Z, >1 special, between 6-30 characters in length
            // ^((?=(.*[\d]){1,})(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[^\w\d\s]){1,})){6,30}.*$
            isValidPw = this.checkPWStrength(value, 1, 1, 1, 1, minChars, maxChars, allowedChars);
            break;
        case 'strong':
            minChars = minLength || 8;
            // >2 0-9, >2 a-z, >2 A-Z, >2 special, between 8-30 characters in length
            // ^((?=(.*[\d]){2,})(?=(.*[a-z]){2,})(?=(.*[A-Z]){2,})(?=(.*[^\w\d\s]){2,})){8,30}.*$
            isValidPw = this.checkPWStrength(value, 2, 2, 2, 2, minChars, maxChars, allowedChars);
            break;
        case 'custom':
            // allows parameters to be passed in for required elements
            // passStrength(custom, [NUMBERS], [LOWER], [UPPER], [SPECIAL], [MIN-LENGTH], [MAX-LENGTH], [ALLOWED], [MIN-LETTERS], [MAX-REPEATING], [ALLOWED-SPACES])
            isValidPw = this.checkPWStrength(value, numChars, lowerChars, upperChars, specialChars, minChars, maxChars, allowedChars, minLetters, repeatChars, spaces);
            break;
        default:
            // min 6 characters
            isValidPw = this.checkPWStrength(value, '0', '0', '0', '0', minChars, maxChars);
            break;
    }
    return isValidPw;
})
.validation('matchField', 'These fields must match.', function (form, el) {
	var $field	  	= $(el),
		$twins 		= $('input[data-twin="' + el.attr('data-twin') + '"]', form),
		$mainTwin 	= $twins.filter('.isMainTwin'),
		$brother 	= $twins.filter('.isTwin'),
		isTwin      = $field.hasClass('isTwin'),
		currVal     = $mainTwin.val(),
		matchVal    = $brother.val(),
		isValMatch  = currVal.length>0 && (currVal === matchVal);
		
		console.log('CHECKING MATCH', isTwin, isValMatch);
	if (isTwin){
		return isValMatch;
	} else {
		return true;
	}
}, function (form, el) {
    this.bindTwins(form, el);
})
// CUSTOM PASS THRU
.validation('custom', '{arg1}', function (form, el, value, errMsg, pattern) {
    var regString   = decodeURIComponent(pattern),
        passReg     = new RegExp(regString, 'g'),
        result      = passReg.test(value);
    return result;
})
// UNIQUE VALUES
.validation('unique', 'These fields must be unique', function (form, el, value, caseInsensitive) {
    return this.isUnique(form, el, value,  caseInsensitive);
}, function (form, el) {
    this.bindUnique(form, el);
})
// BINDERS
.validation('minSelect', 'Select at least {arg1} checkboxes.', function (form, el, value, min) {
    return (min <= this.inputsWithName(form, el).filter(':checked').length);
}, function (form, el) {
    'use strict';
  this.bindBrothers(form, el);
})
.validation('maxSelect', 'Select not more than {arg1} checkboxes.', function (form, el, value, max) {
    return (max >= this.inputsWithName(form, el).filter(':checked').length);
}, function (form, el) {
    'use strict';
  this.bindBrothers(form, el);
})
.validation('rangeSelect', 'Select between {arg1} and {arg2} checkboxes.', function (form, el, value, min, max) {
    var checked = this.inputsWithName(form, el).filter(':checked').length;
    return (min <= checked && max >= checked);
}, function (form, el) {
    'use strict';
  this.bindBrothers(form, el);
})

/*********************** HELPERS *****************************/
.helper('isNumber', 				function (value) {
    return (/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/).test(value);
})
.helper('contains', 				function (value, word, sensitive) {
    var check   = sensitive!=='true' ? word.toLowerCase() : word,
        val     = sensitive!=='true' ? value.toLowerCase() : value;
    return val.indexOf(check) !== -1;
})
.helper('isEmail', 					function (value) {
    return (/^[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i).test(value);
})
.helper('isUrl', 					function (value) {
    return (/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i).test(value);
})
.helper('isUsername', 				function (value) {
    return (/^([a-zA-Z])[a-zA-Z_-]*[\w_-]*[\S]$|^([a-zA-Z])[0-9_-]*[\S]$|^[a-zA-Z]*[\S]$/).test(value);
})
.helper('isDate', 					function (value, dateType, noPastDates) {
    var month, day, year, regStr, regExp, hasErr,
        errStr  = 'a 4 digit year is required to restrict past dates',
        isDate  = false,
        isValid = false;
    switch (dateType){
        case 'mmdd':
            regStr  = '^((?:0?[1-9]|1[012]))[-/.]((?:0?[1-9]|[12]\\d|3[01]))$';
            hasErr  = true;
            break;
        case 'mmyy':
        case 'mmyyyy':
            regStr  = '^((?:0?[1-9]|1[012]))[-/.]((?:19|20)?\\d{2})$';
            month   = 1;
            year    = 2;
            if (dateType.length === 4){ hasErr = true;}
            break;
        case 'yyyymmdd':
            regStr  = '^((?:19|20)?\\d{2})[-/.]((?:0?[1-9]|1[012]))[-/.]((?:0?[1-9]|[12]\\d|3[01]))$';
            month   = 2;
            day     = 3;
            year    = 1;
            break;
        case 'ddmmyy':
        case 'ddmmyyyy':
            regStr  = '^((?:0?[1-9]|[12]\\d|3[01]))[-/.]((?:0?[1-9]|1[012]))[-/.]((?:19|20)?\\d{2})$';
            month   = 1;
            day     = 2;
            year    = 3;
            if (dateType.length === 6){ hasErr = true;}
            break;
        //case 'mmddyy': falls through to default
        //case 'mmddyyyy': falls through to default
        default:
            regStr  = '^((?:0?[1-9]|1[012]))[-/.]((?:0?[1-9]|[12]\\d|3[01]))[-/.]((?:19|20)?\\d{2})$';
            month   = 1;
            day     = 2;
            year    = 3;
            if (dateType.length === 4){ hasErr = true;}
            break;
    }
    regExp = new RegExp(regStr);
    isDate = regExp.test(value);
    /** VALIDATE THAT DATE ISNT IN THE PAST **/
    if (isDate && noPastDates){
        isValid = isDate;
        if (hasErr){
            throw new Error(errStr);
        } else {
            var today       = new Date(),
                currDate    = new Date(today.getFullYear(), today.getMonth(), today.getDate()),
                dateArr     = regExp.exec(value),
                tempMM      = dateArr[month]-1, // month in date obj begins at 0
                tempDD      = day ? dateArr[day] : today.getDate(),
                tempYY      = dateArr[year],
                tempDate    = new Date(tempYY, tempMM, tempDD);
            isValid      = tempDate >= currDate;
        }
    } else {
        isValid = isDate;
    }
    return isValid;
})
.helper('isIPAddress', 				function (value){
    return (/^(([2]([0-4][0-9]|[5][0-5])|[0-1]?[0-9]?[0-9])[.]){3}(([2]([0-4][0-9]|[5][0-5])|[0-1]?[0-9]?[0-9]))$/).test(value);
})
.helper('isUSPhone', 				function (value){
    return (/^1?\s*\W?\s*([2-9][0-8][0-9])\s*\W?\s*([2-9][0-9]{2})\s*\W?\s*([0-9]{4})(\se?x?t?(\d*))?$/).test(value);
})
.helper('isPhone',                  function (value){
    // not perfect but should catch widely used number and character combinations in a variety of global phone number formats
    //return (/^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/gm).text(value);
    return (value.match(/^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/gm) || []).length > 0;
})
.helper('checkPWStrength', 			function (value, num, lower, upper, special, min, max, allowedChars, letters, repeat, spaces){
    var valMinMax, regString, passReg,
        valNum      = num ? '{'+num+',}' : '',
        valUpper    = upper ? '{'+upper+',}' : '',
        valLower    = lower ? '{'+lower+',}' : '',
        valSpecial  = special ?  '{'+special+',}' : '',
        valMin      = min ? '{'+min+',}' : '',
        valMax      = max ? '{,'+max+'}' : '',
        valLetters  = letters ? '{'+letters+',}' : '',
        allowed     = allowedChars, // allowed special characters
		repeating   = repeat || '',
		basicAllowed= 'a-zA-Z0-9'+allowed,
		allAllowed = spaces === 'true' ? basicAllowed+' ' : basicAllowed;

    if (min && max){
        valMinMax   = '{'+min+','+max+'}';
    } else if (min && !max){
        valMinMax   = valMin;
    } else if (max && !min){
        valMinMax   = valMax;
    } else {
        valMinMax   = '';
    }

    regString = '(?!.*?(.)\\1{'+repeating+',})(?=.'+valMinMax+')(?=(.*[\\d])'+valNum+')(?=(.*[a-z])'+valLower+')(?=(.*[A-Z])'+valUpper+')(?=(.*[a-zA-Z])'+valLetters+')(?=(.*['+allowed+'])'+valSpecial+')(^['+allAllowed+']+$)';

    passReg = new RegExp(regString);
    return passReg.test(value);
 })
.helper('isUnique', 				function (form, el, val, caseInsensitive){
    var testField, fieldVal,
        isUniqueVal      = true,
        fieldID          = el.attr('id'),
        testVal          = caseInsensitive ? val : val.toLowerCase(),
        $uniqueFields    = $(form).find('input[data-unique="' + el.attr('data-unique') + '"]');

        $($uniqueFields).each(function () {
            testField   = $(this);
            fieldVal    = caseInsensitive ? testField.val() : testField.val().toLowerCase();

            if ((fieldVal === testVal) && (testField.attr('id') !== fieldID) && fieldVal.length && testVal.length){
                isUniqueVal = false;
            }
        });
        return isUniqueVal;
})
.helper('inputTwin', 				function (form, el) {
	var $twins 		= $('input[data-twin="' + el.attr('data-twin') + '"]', form),
		$myTwin 	= $twins.not(el);
	return $myTwin;
})
.helper('inputsWithName', 			function (form, el) {
    return $('input[name="' + el.attr('name') + '"]', form);
})
.helper('inputsWithNameNotSelf', 	function (form, el) {
    return this.inputsWithName(form, el).filter(function () {
           return ($(this).index() !== el.index());
         });
})
.helper('inputsWithUnique', 		function (form, el) {
    var uniqueID = el.attr('data-unique');
    return $('input[data-unique="' + uniqueID + '"]', form);
})
.helper('inputsWithUniqueNotSelf', 	function (form, el) {
    return this.inputsWithUnique(form, el).filter(function () {
           return ($(this) !== el);
         });
})
.helper('bindUnique', 				function (form, el) {
    this.inputsWithUniqueNotSelf(form, el)
        .on($.greenlight.defaults.validateEvents,
            function () {
                el.greenlight('validate');
            });
})
.helper('bindTwins', 				function (form, el) {
	var $twins 		= $('input[data-twin="' + el.attr('data-twin') + '"]', form),
		$brother 	= $twins.filter('.isTwin');
		
	$brother
        .on($.greenlight.defaults.validateEvents,
            function () {
		            $(this).greenlight('validate');
            });
})
.helper('bindBrothers', 			function (form, el) {
    this.inputsWithNameNotSelf(form, el)
        .on($.greenlight.defaults.validateEvents,
            function () {
                el.greenlight('validate');
            });
});