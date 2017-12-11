![alt text](https://raw.githubusercontent.com/davegillem/greenlight/master/img/greenlight_sm.png "Greenlight Logo") Greenlight Form Validation - jQuery Plugin
=============================================

Greenlight is a small (6.2KB minified & gzipped) jQuery Plugin that helps you to validate your forms. Originally forked from the awesome Ketchup Validation Plugin (https://github.com/mustardamus/ketchup-plugin) this has been extended to inlude more validations 'out of the box', ability to provide runtime error messages for localization, as well as being updated to current versions of jQuery syntax. 
Out of the box there are 30 basic validations and either an inline (default) or bubble error style. But truly this
Plugin wants to be hacked to fit your needs. Easily write your own validations and overwrite/extend
the default behaviour. There are also default error message text supplied with each validation, however you can provide your own text during the initial setup for any of the validation error displays.


Default Behavior
----------------

If all of validations you need are already included you can get this Plugin up and running like so:

### Your HTML Header

Include the default stylesheet (located in `./css/` in this package) and the bundled and minified Plugin
along with the latest jQuery version in your HTML header.

    <!DOCTYPE html>
    <html>
      <head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8">
        <title>Greenlight Validation Tester</title>

        <link rel="stylesheet" type="text/css" media="screen" href="css/greenlight.css" />

        <script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
        <script type="text/javascript" src="js/greenlight-min.js"></script>
      </head>

      <body>
        ... form stuff ...

### Your HTML

By default Greenlight checks the `data-validate` attribute of form fields if it can find matching
validations. The default indicator for validations is `validate()`, all validations
go in there and are separated by comma. Validations can have arguments, also separated by comma.
**About checkboxes**: You only need to declare the validations on one checkbox. Greenlight binds all other
checkboxes with the same name automatically.

    <form id="default-behavior" action="index.html">
      <ul>
        <li>
          <label for="db-mail">E-Mail</label>
          <input type="text" id="db-mail" data-validate="validate(required, email)" />
        </li>
        <li>
          <label for="db-username">Username</label>
          <input type="text" id="db-username" data-validate="validate(required, username, minlength(3))" />
        </li>
        <li>
          <label for="db-skill">Skills</label>
          <input type="checkbox" id="db-skill" name="db-skill" data-validate="validate(minselect(2))" /> jQuery
          <input type="checkbox" name="db-skill" /> HTML
          <input type="checkbox" name="db-skill" /> CSS
          <input type="checkbox" name="db-skill" /> Rails
        </li>
        <li>
          <input type="submit" value="Has a Greenlight?" />
        </li>
      </ul>
    </form>

### Your Javascript

Just call `greenlight()` on your form, voilà.

    $('#default-behavior').greenlight();


Declare fields to validate in the call
--------------------------------------

In last version Greenlight checked the `class` attribute for validations... which was not everyones taste
because `class` should be used for defining CSS classes. In HTML5 we have the `data-` attributes for the rescue
to set custom data.

However, if you still want to separate the validations declarations from your markup you can do so
by passing an object with jQuery selectors as keys and validations as values to Greenlight.

### Your HTML

Note that `required` is not a validation declaration but an actual class name. We use that to
select the fields to validate.

    <form id="fields-in-call" action="index.html">
      <ul>
        <li>
          <label for="fic-email">E-Mail</label>
          <input type="text" id="fic-email" class="required" />
        </li>
        <li>
          <label for="fic-username">Username</label>
          <input type="text" id="fic-username" class="required" />
        </li>
        <li>
          <input type="submit" value="Has a Greenlight?" />
        </li>
      </ul>
    </form>

### Your Javascript

Right after the options (empty here `{}`) we pass in an object. Use the key to declare the jQuery
selector on which fields the validations in the value are processed.
Validations declared like this don't need the `validate()` indicator.

    $('#fields-in-call').greenlight({}, {
      '.required'    : 'required',              //all fields in the form with the class 'required'
      '#fic-username': 'username, minlength(3)' //one field in the form with the id 'fic-username'
    });
    

Validate on different events
----------------------------

By default Greenlight listens to the `blur` event on form fields. You can overwrite that behaviour
for every field in the options, and you can overwrite it separately for a single field.

### Your HTML

In the `data-validate` attribute you can have a `on()` indicator. Events go in there and are separated by a space. These
are strings jQuery's `bind()` accepts.

    <form id="validation-events" action="index.html">
      <ul>
        <li>
          <label for="ve-username">Username</label>
          <input type="text" id="ve-username" data-validate="validate(required, minlength(3)) on(keyup focus)" />
        </li>
        <li>
          <input type="submit" value="Has a Greenlight?" />
        </li>
      </ul>
    </form>

### Your Javascript

    $('#validation-events').greenlight({
      validateEvents: 'dblclick'
    });

    /*if you set the fields to validate in the call
      you  simply pass  in a array as value.  First
      argument is  the validations string  and  the
      second is the events string. Like so:

    $('#validation-events').greenlight({}, {
      '#ve-username': ['required, minlength(3)', 'keyup focus']
    });*/


Included Validations
--------------------
 * `contain(word)`         - The field must contain `word`.
 * `custom`                - The field value must pass the supplied check
	* `validate(custom(Error message to display, [REGEX_PATTERN])`
		* ex: `validate(custom(I am an error message, /^((?=(.*[\d]){2,})(?=(.*[a-z]){2,})(?=(.*[A-Z]){2,})(?=(.*[^\w\d\s]){2,})){8,30}.*$/)`
 * `date`                  - _(Default)_ The field must be a valid date using the mm/dd/yyyy as well as mm/dd/yy format allowing / or - or . as separators
 	* `date(mmdd)`	- Matches just mm/dd allowing for the same separators listed above.
 	* `date(mmyy)` or date(mmyyyy)	- Matches just mm/yy or mm/yyyy allowing for the same separators listed above.
 	* `date(ddmmyy)` or date(ddmmyyyy)	- Matches just dd/mm/yy or dd/mm/yyyy allowing for the same separators listed above.
 	* `date(yyyymmdd)`	- Matches a (4) digit year followed by a (2) digit month followed by a (2) digit day allowing for the same separators listed above.
 	* `date(mmyyyy, true)` or `date(ddmmyyyy, true)` or `date(yyyymmdd, true)`  - _(Optional Parameter)_ by passing the optional boolean as true, you can force future dates and current day only. This option does however require a 4 digit year in order to make sure the date isnt in the past. In addition if no day is provided the current day will be used.  
	_Note:_ If the optional parameter is set to true but the year format is set to only 2 digits the validation will succeed but no check for past date will be performed.

 * `digits`                - The field must be a digit (full number).
 * `email`                 - The field must be a valid email.
 * `ipAddress`             - The field value must be a valid IP Address
 * `letters`			   - The field value must be uppercase letter, lowercase letters or white space characters
 * `lettersAndNumbs`       - The field value must contain Letters and/or Numbers
 * `match(word)`           - The field must match the value `word`.
 * `matchField`            - Requires that another field contain the same `matchField` validation, a `data-twin` attribute to connect the values together (e.g. `data-twin="matchTest1"`) to allow for multiple match fields on the same page, contain the following classes `isMainTwin` (for the main field) and `isTwin` (for any field that must match the main field) and both field values must match exactly _(todo: make this class and data-attr added automatically)_
 * `max(max)`              - The field must have a maximal number of `max` (ex. 10).
 * `maxlength(max)`        - The field must have a maximal length of `max` characters (ex. 10 characters).
 * `maxselect(max)`        - No more than `max` checkboxes with the same name must be selected (checkboxes, multi-select lists).
 * `min(min)`              - The field must have a minimal number of `min` (ex. 4).
 * `minlength(min)`        - The field must have a minimal length of `min` characters (ex. 4 characters).
 * `minselect(min)`        - At least `min` checkboxes with the same name must be selected (checkboxes, multi-select lists).
 * `notEmpty`              - The field cannot contain ONLY spaces
 * `number`                - _(Default)_ The field must be a number.
	* `number(true)`		   - _(Optional)_ If a value of true is passed, the field will expect a formatted number that allows for commas and decimals 
 * `passStrength(strength)`- The field value must pass the provided strength check
 	* `[default]`	- If no setting (or anything other than the options allowed) is provided, it will default to checking for a max length of 6 characters
	* `weak`		- >1 0-9, >1 a-z, >1 A-Z, between 6-30 characters in length
	* `medium`		- >1 0-9, >1 a-z, >1 A-Z, >1 special, between 6-30 characters in length
	* `strong`		- >2 0-9, >2 a-z, >2 A-Z, >2 special, between 8-30 characters in length
	* `custom`		- allows parameters to be passed in for required elements
		* `passStrength(custom, [NUMBERS], [LOWER], [UPPER], [SPECIAL], [MIN-LENGTH], [MAX-LENGTH], [ALLOWED], [MIN-LETTERS], [MAX-REPEATING], [ALLOWED-SPACES])`  
		For example, the following `passStrength(custom, 8,20, 0, 1, 2, 3, 5, null, 3, false)`  
		Would mean that the password should contain:
			* A minimum length of 8 characters and a maximum length of 20 characters
			* No numbers are required
			* At least 1 lower-case character
			* At least 2 upper-case characters
			* At least 3 special characters (non-alpha or digits)
			* At least 5 letters
			* Will use default special character set (@#!$%^&+=)
			* No more than 3 repeating characters
			* Spaces are NOT allowed 

 * `phone`                 - The field value must be a valid Phone Number
 * `required`              - The field is required.
 * `range(min, max)`       - The field must have a number between `min` and `max` (ex. Between 4-10).
 * `rangelength(min, max)` - The field must have a length between `min` and `max` characters (ex. Between 4-10 characters).
 * `rangeselect(min, max)` - Between `min` and `max` checkboxes with the same name must be selected.
 * `ssn`              	   - The field value must be a valid Social Security number
 	* `ssn(true)`		   - _(Optional)_ Matches just the last 4 numbers of the SSN 
 * `unique`                - The field values must be unique
 * `url`                   - The field must be a valid URL.
 * `username`              - The field must be a valid username, allows for letters numbers and certain special characters
 * `usPhone`               - The field value must be a valid US formatted Phone Number allowing for - . And () as separators as well as a space
 * `usStateAbbr`           - The field value must be a valid US State Abbreviation
 * `usZip`                 - The field value must be a valid US Zip Code (allows for 5 digits or 9 digits with hyphen, fails on anything else)


Write your own validations
--------------------------

You can write your own validation functions for Greenlight. A validation function must return a
boolean, `true` if the field validates fine and `false` if it fails to validate.

Validations pass in at least three arguments:

 * `form`  - the jQuery object for the form (we validate in this form)
 * `el`    - the jQuery object for the form field (we validate on this field)
 * `value` - the value of the form field (short for `el.val()`)

After these three arguments you can declare the arguments for your validation. In this example the
`word` validation has two arguments, `word1` and `word2`. You pass in the arguments in your validation call like
`word(greenlight, redlight)`. Now 'greenlight' is the `word1` argument and so on.

Validation messages have `{argN}` placeholders for your arguments. `Is {arg1}` would become `Is greenlight`.

A validation can have a initial callback, optionally passed in as function as the second argument. Use this to bind
elements with the same name, checkboxes for example. Or apply a class to the field to style Greenlight enabled fields.
The initial callback passes in two arguments, `form` and `el`. You already know what these are.

### Your HTML

    <form id="own-validation" action="index.html">
      <ul>
        <li>
          <label for="ov-word">Greenlight or Mustard</label>
          <input type="text" id="ov-word" data-validate="validate(word(greenlight, redlight))" />
        </li>
        <li>
          <input type="submit" value="Has a Greenlight?" />
        </li>
      </ul>
    </form>

### Your Javascript

    $.greenlight.validation('word', 'Either "{arg1}" or "{arg2}"', function(form, el, value, word1, word2) {
      if(value == word1 || value == word2) {
        return true;
      } else {
        return false;
      }
    }, function(form, el) {
      //initial callback, this is optional
    });

    $('#own-validation').greenlight();


Helpers for your validations
----------------------------

Helpers are repeating functions you can use in your validations via `this`.

 * `bindBrothers(form, el)` 		- Bind all elements in the `form` with `el`'s name to `el`'s Greenlight events. This is helpful on checkboxes and co. Returns `undefined`.
 * `bindTwins(form, el)`			- Bind all elements in the `form` with `el`'s `data-twin` attribute to `el`'s Greenlight events. Returns `undefined`.
 * `bindUnique(form, el)`			- Bind all elements in the `form` with `el`'s name to `el`'s Greenlight events. Returns `undefined`.
 * `checkPWStrength(value, num, lower, upper, special, min, max, allowedChars, letters, repeat, spaces)` - Check if the `value` passes the supplied requirements. Returns `true`/`false`.
 * `contains(value, word)` 			- Check if the `value` contains `word`. Returns `true`/`false`.
 * `getGreenlightEvents(el)` 		- Get all events Greenlight has used on the `el`. Returns a String.
 * `inputsWithName(form, el)` 		- Get all elements in the `form` with the name of `el`. Returns a jQuery object.
 * `inputsWithNameNotSelf(form, el)` - Get all elements in the `form` with the name of `el` but not itself. Returns a jQuery object.
 * `inputsWithUnique(form, el)`			- Get all elements in the `form` with the name of `el`. Returns a jQuery object.
 * `inputsWithUniqueNotSelf(form, el)`	- Get all elements in the `form` with the name of `el` but not itself. Returns a jQuery object.
 * `inputTwin(form, el)`				- Get all elements in the `form` with `el`'s `data-twin` attribute. Returns a jQuery object.
 * `isDate(value)` 					- Check if the `value` is a valid date. Returns `true`/`false`.
 * `isEmail(value)` 				- Check if the `value` is a valid email. Returns `true`/`false`.
 * `isIPAddress(value)`				- Check if the `value` is a valid IP Address. Returns `true`/`false`.
 * `isNumber(value)` 				- Check if the `value` is a valid number. Returns `true`/`false`.
 * `isPhone(value)`					- Check if the `value` is a valid Phone number. Returns `true`/`false`.
 * `isUnique(form, el, value, caseInsensitive)` - Check if the 'el` `value` is unique when compared to the other elements in the form with matching validation. Also can allow for case insensitivity if `caseInsensitive` is set to `true`. Returns `true`/`false`.
 * `isUrl(value)` 					- Check if the `value` is a valid URL. Returns `true`/`false`.
 * `isUsername(value)` 				- Check if the `value` is a valid username. Returns `true`/`false`.
 * `isUSPhone(value)`				- Check if the `value` is a valid US Phone number. Returns `true`/`false`.

### Your HTML

    <form id="validation-helper" action="index.html">
      <ul>
        <li>
          <label for="vh-email">Your E-Mail (must contain 'greenlight')</label>
          <input type="text" id="vh-email" data-validate="validate(greenlightEmail)" />
        </li>
        <li>
          <input type="submit" value="Has a Greenlight?" />
        </li>
      </ul>
    </form>

### Your Javascript

    $.greenlight.validation('greenlightEmail', 'Must be a valid e-mail and contain "greenlight"', function(form, el, value) {
      if(this.isEmail(value) && this.contains(value.toLowerCase(), 'greenlight')) {
        return true;
      } else {
        return false;
      }
    });
    
    $('#validation-helper').greenlight();


Write your own helpers
----------------------

Of course you can extend helpers too. Pass a helper name and the actual helper function with the arguments
to `helper()`.

### Your HTML

    <form id="own-helper" action="index.html">
      <ul>
        <li>
          <label for="oh-rand1">This field is validated randomly</label>
          <input type="text" id="oh-rand1" data-validate="validate(random)" />
        </li>
        <li>
          <label for="oh-rand2">Words are validated randomly: greenlight, redlight</label>
          <input type="text" id="oh-rand2" data-validate="validate(randomWord(greenlight, redlight))" />
        </li>
        <li>
          <input type="submit" value="Has a Greenlight?" />
        </li>
      </ul>
    </form>

### Your Javascript

    $.greenlight.helper('randomNumber', function(min, max) {
      return (min + parseInt(Math.random() * (max - min + 1)));
    });
    
    $.greenlight.validation('random', 'Not this time...', function(form, el, value) {
      return (this.randomNumber(0, 1) ? true : false);
    });
    
    $.greenlight.validation('randomWord', 'Try the other word', function(form, el, value, word1, word2) {      
      return (this.randomNumber(0, 1) ? word1 : word2) == value;
    });

    $('#own-helper').greenlight();
    

Set the messages for your validations
-------------------------------------

In the examples above we set the message for the validations directly as second argument in the `validate()`
function. This is not necessary. If you want to seperate the messages from the validation code you have
two choices.

Either overwrite single messages:

    $.greenlight.message('word', 'Guess the word!');

Or pass in an object to the `messages()` method (you can copy and paste them from the last version of Greenlight).
Note that only declared validation messages gets overwritten, the others are still set.

    $.greenlight.messages({
      required : 'Something?',
      minlength: '>= {arg1}'
    });


Control the behavior of the error container
-------------------------------------------

Time to control the behavior and the style of the error container. Several functions can be overwritten leaving
creating, showing and hiding the error container and add error messages completely up to you.

 * `createErrorContainer(function(form, el) {})`
 
   This function creates the error container one time. `form` is the form we are currently in and `el` the element
   we are currently validating. It must return a jQuery object of the error container.
   
 * `showErrorContainer(function(form, el, container) {})`
 
   This function shows the error container every time the field `el` fails to validate.
   `form` is the form we are currently in and `el` the element we are currently validating.
   `container` is the jQuery object of the error container, you created it with `createErrorContainer()`.
   Must not return anything
 
 * `hideErrorContainer(function(form, el, container) {})`
 
   As opposite to `showErrorContainer()` this function hides the error container when the field `el` validates fine.
   It pass in the same arguments as `showErrorContainer()` and must not return anything.
 
 * `addErrorMessages(function(form, el, container, messages) {})`
 
   If the field `el` fails to validate you need to update the error messages via this function. `form`, `el` and `container`
   are the same arguments as in `showErrorContainer()` and `hideErrorContainer()`. `messages` is a Array containing strings
   of all error messages the field fails to validate.

### Your CSS

    .greenlight-custom {
      line-height: 1em;
      display: none;
    }

    .greenlight-custom li {
      font-size: 10px;
      text-transform: uppercase;
      text-shadow: 1px 1px 0 #9F4631;
      border: 0;
      color: white;
      background: #F46644;
      padding: 1px 10px;
      margin-top: 1px;
    }

### Your HTML

    <form id="custom-behavior" action="index.html">
      <ul>
        <li>
          <label for="cb-mail">E-Mail</label>
          <input type="text" id="cb-mail" data-validate="validate(required, email)" />
        </li>
        <li>
          <label for="cb-username">Username</label>
          <input type="text" id="cb-username" data-validate="validate(required, minlength(3))" />
        </li>
        <li>
          <input type="submit" value="Has a Greenlight?" />
        </li>
      </ul>
    </form>

### Your Javascript

    $.greenlight
    
    .createErrorContainer(function(form, el) {
      return $('<ul/>', {
               'class': 'greenlight-custom'
             }).insertAfter(el);
    })
    
    .addErrorMessages(function(form, el, container, messages) {
      container.html('');
      
      for(i = 0; i < messages.length; i++) {
        $('<li/>', {
          text: messages[i]
        }).appendTo(container);
      }
    })
    
    .showErrorContainer(function(form, el, container) {
      container.slideDown('fast');
    })
    
    .hideErrorContainer(function(form, el, container) {
      container.slideUp('fast');
    });

    $('#custom-behavior').greenlight({
      validateEvents: 'blur focus keyup'
    });


Greenlight Events
--------------

### Your HTML

    <form id="greenlight-events" action="index.html">
      <ul>
        <li>
          <label for="gl-username">Username</label>
          <input type="text" id="gl-username" data-validate="validate(required, username, minlength(5))" />
        </li>
        <li>
          <input type="submit" value="Has a Greenlight?" />
        </li>
      </ul>
    </form>

### Your Javascript
    
    $('#greenlight-events')
      .on('formIsValid', function(event, form) {
        //do whatever when the form is valid
        //form - the form that is valid (jQuery Object)
      })
      .on('formIsInvalid', function(event, form) {
        //do whatever when the form is invalid
        //form - the form that is invalid (jQuery Object)
      })
      .on('fieldIsValid', function(event, form, el) {
        //do whatever if a field is valid
        //form - the form where the el is located (jQuery Object)
        //el   - the element that is valid (jQuery Object)
      })
      .on('fieldIsInvalid', function(event, form, el) {
        //do whatever if a field is invalid
        //form - the form where the el is located (jQuery Object)
        //el   - the element that is invalid (jQuery Object)
      })
      .greenlight();


Check if the form and fields are valid from outside
---------------------------------------------------

You can use Greenlight's internal function to check if a form or a field is valid from your own script without
triggering the validation container. `el.greenlight('isValid')` returns `true` if the form/field (`el`) is valid,
otherwise it returns `false`.

If you want to trigger the validation from your script use `el.greenlight('validate')` where `el` is the field.

### Your CSS
    #from-outside { position: relative; }
    
    #fo-errors {
      position: absolute;
      top: 30px;
      left: 200px;
    }
    
    #fo-errors li { padding: 0 10px; margin-bottom: 1px; }
    #fo-errors .valid { background: #9ADF61; }
    #fo-errors .invalid { background: #F46644; }
    
    #from-outside .greenlight-custom { position: absolute; left: -30000px; } /* hide greenlight errors on blur and form submit */

### Your HTML

    <form id="from-outside" action="index.html">
      <ul>
        <li>
          <label for="fo-mail">E-Mail</label>
          <input type="text" id="fo-mail" data-validate="validate(required, email)" />
        </li>
        <li>
          <label for="fo-username">Username</label>
          <input type="text" id="fo-username" data-validate="validate(required, username, minlength(5))" />
        </li>
        <li>
          <input type="submit" value="Has a Greenlight?" />
        </li>
      </ul>
    </form>

### Your Javascript
    
    var form     = $('#from-outside'),
        mail     = $('#fo-mail', form),
        username = $('#fo-username', form),
        result   = $('<ul/>', { id: 'fo-errors' }).appendTo(form);
    
    form
      .greenlight()
      .find('input').keyup(function() {
        result.html('');
      
        $.each([form, mail, username], function(index, el) {
          var valid = el.greenlight('isValid') ? 'valid' : 'invalid';
        
          $('<li/>', {
            'class': valid,
            text   : '#' + el.attr('id') + ' is ' + valid
          }).appendTo(result);
        });
      })
      .last().keyup();


Default Options
---------------
	attribute             : 'data-validate',              // look in that attribute for a validation string
    addErrorMessages      : null			      // function to add error messages to the error container (can also be set via $.greenlight.addErrorMessages(fn))
    bubbleErrorPosition   : 'right',		      // where the bubble error appears (right=top right corner, left=top left corner, side=right side of field)
    createErrorContainer  : null,                         // function to create the error container (can also be set via $.greenlight.createErrorContainer(fn))
    emptyValidClass       : 'emptyValid',                 // css class used to identify a field that is optional ^^ but is also empty which means its valid
    errorDisplayType      : 'inline',                     // accepts either 'inline' or 'bubble' for displaying validation errors
    eventIndicator        : 'on',                         // in the validation string this indicates the events when validations get fired eg on(blur)
    fieldErrorClass       : 'fieldError',                 // ability to add a class to the field for CSS modifications to display on error
    fieldValidClass       : 'fieldValid',                 // ability to add a class to the field for CSS modifications to display on error
    hideErrorContainer    : null,                         // function to hide the error container (can also be set via $.greenlight.hideErrorContainer(fn))
    optionalClass         : 'optRequired',                // css class used to identify a field that is optional but requires validation check if it isnt empty
    parentErrorClass      : 'parentError',                // ability to add a class to the parent tag of the field for CSS modifications to display on error
    parentValidClass      : 'parentValid',                // ability to add a class to the parent tag of the field for CSS modifications to display on error
    showErrorContainer    : null,                         // function to show the error container (can also be set via $.greenlight.showErrorContainer(fn))
    validateElements      : ['input', 'textarea', 'select'],  // check this fields in the form for a validation string on the attribute
    validateEvents        : 'blur',                       // the default event when validations get fired on every field
    validateIndicator     : 'validate',                   // in the validation string this indicates the validations eg validate(required)

You can also _(optionally)_ provide your own error mesages at runtime to allow for custom error messages based on language , local or any number of use-cases. Just pass an object using the validation name as the property and the new error string as the value into the `$.greenlight.messages();` method.

For example:
------------  
	var textKeys : {
				date                             : 'Must be a valid date.',
				email                            : 'Must be a valid E-Mail.',
				letters                          : 'Must be letters.',
				lettersAndNums                   : 'Must contain Letters and Numbers.',
				matchField                       : 'These fields must match.',
				number                           : 'Must be a number.',
				range                            : 'Must be between {arg1} and {arg2}.'
			}
	$.greenlight.messages(textKeys);
As you can see above, you can also use `{arg#}` to have the validation parameter be used inside the error message. The `#` will be the argument position when calling the validation method. for example if you assigned a validation using `range(4,12)` and used the textKey listed above, your error would appear as  **_`Must be between 4 and 12.`_** (replacing the `{arg#}` values with the validation parameters).

License and Copyright
---------------------

The Greenlight Plugin is dual licensed under the [GPL](http://www.gnu.org/licenses/gpl.html
) and [MIT](http://www.opensource.org/licenses/mit-license.php) licenses.

Copyright (c) 2017 by Dave Gillem / http://davegillem.com
 
Original Copyright (c) 2011 by Sebastian Senf / forked from jQuery Ketchup Plugin
[http://redlightamus.com](http://redlightamus.com) - [http://usejquery.com](http://usejquery.com) - [@redlightamus](http://twitter.com/redlightamus)
