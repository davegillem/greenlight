!function($){"use strict";$.greenlight={defaults:{attribute:"data-validate",validateIndicator:"validate",eventIndicator:"on",validateEvents:"blur",validateElements:["input","textarea","select"],errorDisplayType:"inline",bubbleErrorPosition:"right",fieldErrorClass:"fieldError",parentErrorClass:"parentError",fieldValidClass:"fieldValid",parentValidClass:"parentValid",optionalClass:"optRequired",emptyValidClass:"emptyValid",createErrorContainer:null,showErrorContainer:null,hideErrorContainer:null,addErrorMessages:null},errorMessages:{},dataNames:{validationString:"greenlight-validation-string",validations:"greenlight-validations",events:"greenlight-events",elements:"greenlight-validation-elements",container:"greenlight-container"},validations:{},helpers:{},validation:function(){var t,e,i=arguments[1];return"function"==typeof i?e=i:(t=i,e=arguments[2]),this.validations[arguments[0]]={message:t,func:e,init:arguments[3]||function(t,e){}},this},message:function(t,e){return this.addMessage(t,e),this},messages:function(t){var e,i;for(e in t)t.hasOwnProperty(e)&&(i=t[e],this.addMessage(e,i),this.errorMessages[e]=i);return this},addMessage:function(t,e){this.validations[t]&&(this.validations[t].message=e)},helper:function(t,e){return this.helpers[t]=e,this},init:function(t,e,i){this.options=e;var a=this,n=this.initFunctions().initFields(t,i);n.each(function(){var e=$(this);a.bindValidationEvent(t,e).callInitFunctions(t,e)}),t.data(this.dataNames.elements,n),this.bindFormSubmit(t)},initFunctions:function(){var t,e,i=this.options,a=["createErrorContainer","showErrorContainer","hideErrorContainer","addErrorMessages","useBubbleError","useInlineError"],n=a.length;for(t=0;t<n;t++)e=a[t],i[e]||(i[e]=this[e]);return this},initFields:function(t,e){var i,a,n=this,r=this.dataNames,s=$(e?this.fieldsFromObject(t,e):this.fieldsFromForm(t));return s.each(function(){i=$(this),a=n.extractValidations(i.data(r.validationString),n.options.validateIndicator),i.data(r.validations,a)}),s},callInitFunctions:function(t,e){var i,a=e.data(this.dataNames.validations),n=a.length;for(i=0;i<n;i++)a[i].init.apply(this.helpers,[t,e])},fieldsFromForm:function(t){var e,i,a,n,r,s=this,l=this.options,u=this.dataNames,o=l.validateElements,d=[],h="string"==typeof o?[o]:o,f=h.length;for(e=0;e<f;e++)i=t.find(h[e]+"["+l.attribute+"*="+l.validateIndicator+"]"),i.each(function(){a=$(this),n=a.attr(l.attribute),r=s.extractEvents(n,l.eventIndicator),a.data(u.validationString,n).data(u.events,r||l.validateEvents)}),d.push(i.get());return this.normalizeArray(d)},fieldsFromObject:function(t,e){var i,a,n,r,s=this.options,l=this.dataNames,u=[];for(i in e)e.hasOwnProperty(i)&&("string"==typeof e[i]?(a=e[i],n=s.validateEvents):(a=e[i][0],n=e[i][1]),r=t.find(i),a=this.mergeValidationString(r,a),n=this.mergeEventsString(r,n),r.data(l.validationString,s.validateIndicator+"("+a+")").data(l.events,n),u.push(r.get()));return this.normalizeArray(u)},mergeEventsString:function(t,e){var i,a,n,r=t.data(this.dataNames.events),s="";if(r)for(a=r.split(" "),n=a.length,i=0;i<n;i++)-1===e.indexOf(a[i])&&(s+=" "+a[i]);return $.trim(e+s)},mergeValidationString:function(t,e){var i,a,n,r,s,l,u,o,d,h=this.options,f=e,c=t.data(this.dataNames.validationString),g=function(t){return a=t.name,t.arguments.length&&(a=a+"("+t.arguments.join(",")+")"),a},p=function(t,e){for(n=t.length,i=0;i<n;i++)if(t[i].name===e.name)return!0};if(c){for(l=this.extractValidations(h.validateIndicator+"("+f+")",h.validateIndicator),o=this.extractValidations(c,h.validateIndicator),f="",d=o.length,u=l.length,r=0;r<d;r++)f+=g(o[r])+",";for(s=0;s<u;s++)p(o,l[s])||(f+=g(l[s])+",")}return f},bindFormSubmit:function(t){var e=this,i=this.options;t.submit(function(){return e.allFieldsValid(t,!0)})},allFieldsValid:function(t,e){var i,a=this,n=!0,r=e||!1;return t.data(this.dataNames.elements).each(function(){i=$(this),!0!==a.validateElement(i,t,r)&&(!0===e&&a.triggerValidationEvents(i),n=!1)}),t.trigger("formIs"+(n?"Valid":"Invalid"),[t]),n},bindValidationEvent:function(t,e){var i,a,n,r=this,s=this.options,l=this.dataNames,u=e.data(l.events).split(" "),o=u.length;for(i=0;i<o;i++)e.off("greenlight."+u[i]).on("greenlight."+u[i],function(){a=r.validateElement(e,t),n=e.data(l.container),!0!==a?(n||(n=s.createErrorContainer(t,e),e.data(l.container,n)),s.addErrorMessages(t,e,n,a),s.showErrorContainer(t,e,n)):n&&s.hideErrorContainer(t,e,n)}),this.bindValidationEventBridge(e,u[i]);return this},bindValidationEventBridge:function(t,e){t.on(e,function(){t.trigger("greenlight."+e)})},validateElement:function(t,e,i){var a,n=[],r=t.data(this.dataNames.validations),s=t.is("input")?t.attr("type"):t.get(0).tagName.toLowerCase(),l=r?r.length:0,u=t.val(),o=[e,t,u],d="#"+t.attr("id"),h=t.attr("data-unique"),f=t.hasClass(this.defaults.optionalClass),c=!u||0===u.length,g=t.parent();if("checkbox"!==s&&"radio"!==s||(g=t.parent().parent()),"select"===s&&(g=t.parents("li.gw-form-li:first")),f&&c)return $(d).removeClass(this.defaults.fieldErrorClass).addClass(this.defaults.fieldValidClass).addClass(this.defaults.emptyValidClass),$(g).removeClass(this.defaults.parentErrorClass).addClass(this.defaults.parentValidClass),"inline"===this.defaults.errorDisplayType?this.useInlineError("hide",e,t):this.useBubbleError("hide",e,t),!0;for(c||$(d).removeClass(this.defaults.emptyValidClass),a=0;a<l;a++)r[a].func.apply(this.helpers,o.concat(r[a].arguments))||n.push(r[a].message);return e.trigger("fieldIs"+(n.length?"Invalid":"Valid"),[e,t]),n.length>0&&!1!==i?($(d).addClass(this.defaults.fieldErrorClass).removeClass(this.defaults.fieldValidClass).removeClass(this.defaults.emptyValidClass),$(g).addClass(this.defaults.parentErrorClass).removeClass(this.defaults.parentValidClass)):n.length<=0&&!1!==i&&($(g).removeClass(this.defaults.parentErrorClass).addClass(this.defaults.parentValidClass),"checkbox"!==s&&"radio"!==s||("bubble"!==this.defaults.errorDisplayType?this.useInlineError("hide",e,t):this.useBubbleError("hide",e,t))),n.length<=0&&$(d).removeClass(this.defaults.fieldErrorClass).addClass(this.defaults.fieldValidClass),!n.length||n},elementIsValid:function(t){var e,i=this.dataNames;return t.data(i.validations)?(e=t.parentsUntil("form").last().parent(),!0===this.validateElement(t,e)):!t.data(i.elements)||this.allFieldsValid(t)},triggerValidationEvents:function(t){var e,i=t.data(this.dataNames.events)?t.data(this.dataNames.events).split(" "):[],a=i.length;for(e=0;e<a;e++)t.trigger("greenlight."+i[e])},extractValidations:function(t,e){var i,a,n,r,s,l,u,o,d,h,f,c,g=t.substr(t.indexOf(e)+e.length+1),p=g.length,v="",m=[],F=0,b=[];for(i=0;i<p;i++)switch(g.charAt(i)){case"(":v+="(",F++;break;case")":F?(v+=")",F--):m.push($.trim(v));break;case",":F?v+=",":(m.push($.trim(v)),v="");break;default:v+=g.charAt(i);break}for(h=m.length,a=0;a<h;a++)if(c=m[a],r=c.indexOf("("),s=c,l=[],-1!==r&&(s=c.substring(0,r),l="custom"===s?c.substring(c.indexOf("(")+1,c.lastIndexOf(")")).split(","):$.map(m[a].substr(s.length).split(","),function(t){return $.trim(t.replace("(","").replace(")",""))})),(u=this.validations[s])&&u.message){for(o=u.message,f=l.length,n=1;n<=f;n++)o=o.replace("{arg"+n+"}",l[n-1]),o=o.replace(/^['\s]+|['\s]+$/g,""),"custom"===s&&(d=this.errorMessages["custom-"+o],o=d||o);b.push({name:s,arguments:l,func:u.func,message:o,init:u.init})}return b},extractEvents:function(t,e){var i=!1,a=t.indexOf(e+"(");return-1!==a&&(i=t.substr(a+e.length+1).split(")")[0]),i},normalizeArray:function(t){var e,i,a,n=[],r=t.length;for(e=0;e<r;e++)for(a=t[e].length,i=0;i<a;i++)t[e][i]&&n.push(t[e][i]);return n},createErrorContainer:function(t,e){return"function"==typeof t?(this.defaults.createErrorContainer=t,this):"bubble"!==this.errorDisplayType?this.useInlineError("create",t,e,null,null):this.useBubbleError("create",t,e,null,null)},showErrorContainer:function(t,e,i){if("function"==typeof t)return this.defaults.showErrorContainer=t,this;"bubble"!==this.errorDisplayType?this.useInlineError("show",t,e,i,null):this.useBubbleError("show",t,e,i,null)},hideErrorContainer:function(t,e,i){if("function"==typeof t)return this.defaults.hideErrorContainer=t,this;"bubble"!==this.errorDisplayType?this.useInlineError("hide",t,e,i,null):this.useBubbleError("hide",t,e,i,null)},addErrorMessages:function(t,e,i,a){if("function"==typeof t)return this.defaults.addErrorMessages=t,this;"bubble"!==this.errorDisplayType?this.useInlineError("add",t,e,i,a):this.useBubbleError("add",t,e,i,a)},useBubbleError:function(t,e,i,a,n){var r,s,l,u,o,d,h,f=a,c=i.offset(),g=i.attr("type"),p=i.parent(),v=n?n.length:0;switch("checkbox"!==g&&"radio"!==g||(p=i.parent().parent()),"select"===t&&(p=i.parents("li.gw-form-li:first")),this.bubbleErrorPosition){case"left":l=c.top-i.outerHeight()-5,u=c.left,o={left:c.left+20,opacity:1},d={left:c.left+i.outerWidth()-20,opacity:0},h="arrowDown";break;case"side":l=c.top-5,u=c.left+i.outerWidth(),o={left:c.left+i.outerWidth()+30,opacity:1},d={left:c.left+i.outerWidth(),opacity:0},h="arrowLeft";break;default:l=c.top-i.outerHeight()-5,u=c.left+i.outerWidth()-20,o={left:c.left+i.outerWidth()+5,opacity:1},d={left:c.left+i.outerWidth()-20,opacity:0},h="arrowDown";break}if("create"===t)return $("<div/>",{html:'<ul class="'+h+'"></ul><span></span>',class:"greenlight-error",css:{top:l,left:u}}).appendTo("body");if("show"===t)return void f.show().animate(o,"fast");if("hide"===t)return f||(f=p.children(".greenlight-error-inline")),void f.animate(d,"fast",function(){f.hide()});if("add"!==t);else for(s=f.children("ul").empty(),r=0;r<v;r++)$("<li/>",{text:unescape(n[r])}).appendTo(s)},useInlineError:function(t,e,i,a,n){var r,s,l=i.attr("type"),u=i.parent(),o=a,d=n?n.length:0;if("checkbox"!==l&&"radio"!==l||(u=i.parent().parent()),"select"===t&&(u=i.parents("li.gw-form-li:first")),"create"===t)return $("<div/>",{html:"<ul></ul><span></span>",class:"greenlight-error-inline",css:{}}).appendTo(u);if("show"===t)return void o.addClass("showMe").removeClass("hideMe");if("hide"===t)return a||(o=u.children(".greenlight-error-inline")),void o.addClass("hideMe").removeClass("showMe");if("add"!==t);else for(s=o.children("ul").empty(),r=0;r<d;r++)$("<li/>",{text:unescape(n[r])}).appendTo(s)}},$.fn.triggerCustomErrorMsg=function(t){var e=$(this),i=e.parent("form"),a=$.greenlight.defaults,n="#"+e.attr("id"),r=e.attr("type"),s=e.parent(),l=$.greenlight.createErrorContainer(i,e);return"checkbox"!==r&&"radio"!==r||(s=e.parent().parent()),"select"===r&&(s=e.parents("li.gw-form-li:first")),$.greenlight.addErrorMessages(i,e,l,t),$(n).addClass(a.fieldErrorClass).removeClass(a.fieldValidClass),$(s).addClass(a.parentErrorClass).removeClass(a.parentValidClass),$.greenlight.showErrorContainer(i,e,l)},$.fn.hideCustomErrorMsg=function(){var t=$(this),e=t.parent("form"),i=$.greenlight.defaults,a="#"+t.attr("id"),n=t.attr("type"),r=t.parent();return"checkbox"!==n&&"radio"!==n||(r=t.parent().parent()),"select"===n&&(r=t.parents("li.gw-form-li:first")),$(a).removeClass(i.fieldErrorClass).addClass(i.fieldValidClass),$(r).removeClass(i.parentErrorClass).addClass(i.parentValidClass),$.greenlight.hideErrorContainer(e,t)},$.fn.greenlight=function(t,e){var i=$(this);if("string"==typeof t)switch(t){case"validate":$.greenlight.triggerValidationEvents(i);break;case"isValid":return $.greenlight.elementIsValid(i)}else this.each(function(){$.greenlight.init(i,$.extend({},$.greenlight.defaults,t),e)});return this}}(jQuery),$.greenlight.validation("required","This field is required.",function(t,e,i){if(e.is(":checkbox")||e.is(":radio")){var a=e.attr("name"),n="#"+t.attr("id");return!!$(n+" input[name="+a+"]:checked").val()}return e.is("select")?!!i&&null!==i&&""!==i:0!==i.replace(/^\s+|\s+$/g,"").length}).validation("minLength","This field must have a minimum length of {arg1}.",function(t,e,i,a){return i.length>=+a}).validation("maxLength","This field has a maximum length of {arg1}.",function(t,e,i,a){return i.length<=+a}).validation("rangeLength","This field must have a length between {arg1} and {arg2}.",function(t,e,i,a,n){return i.length>=a&&i.length<=n}).validation("min","Must be at least {arg1}.",function(t,e,i,a){return this.isNumber(i)&&+i>=+a}).validation("max","Can not be greater than {arg1}.",function(t,e,i,a){return this.isNumber(i)&&+i<=+a}).validation("range","Must be between {arg1} and {arg2}.",function(t,e,i,a,n){return this.isNumber(i)&&+i>=+a&&+i<=+n}).validation("number","Must be a number.",function(t,e,i){return!isNaN(parseFloat(i))&&isFinite(i)}).validation("email","Must be a valid E-Mail.",function(t,e,i){return this.isEmail(i)}).validation("url","Must be a valid URL.",function(t,e,i){return this.isUrl(i)}).validation("username","Must be a valid username.",function(t,e,i){return this.isUsername(i)}).validation("letters","Must be letters.",function(t,e,i){return/^[A-Za-z\s]+$/.test(i)}).validation("usZip","Must be a valid US Zip Code.",function(t,e,i){return/^\d{5}([\-]\d{4})?$/.test(i)}).validation("usStateAbbr","Must be a valid US State Abbreviation.",function(t,e,i){return/^A[LKSZRAEP]|C[AOT]|D[EC]|F[LM]|G[AU]|HI|I[ADLN]|K[SY]|LA|M[ADEHINOPST]|N[CDEHJMVY]|O[HKR]|P[ARW]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY]$/.test(i)}).validation("lettersAndNumbs","Must contain Letters and/or Numbers.",function(t,e,i){return/^[a-z A-Z.\-\#0-9]+$/.test(i)}).validation("usPhone","Must be a valid Phone Number.",function(t,e,i){return this.isUSPhone(i)}).validation("phone","Must be a valid Phone Number.",function(t,e,i){return this.isPhone(i)}).validation("match","Must be {arg1}.",function(t,e,i,a){return e.val()===a}).validation("contains","Must contain {arg1}",function(t,e,i,a,n){return this.contains(i,a,n)}).validation("date","Must be a valid date.",function(t,e,i,a,n){return this.isDate(i,a,n)}).validation("ipAddress","Must be a valid IP Address.",function(t,e,i){return this.isIPAddress(i)}).validation("ssn","Must be a valid Social Security number.",function(t,e,i,a){return a?/^(\d{4,4})$/.test(i):/^(?!(000|666))([0-6]\d{2}|7([0-6]\d|7[012]))-(?!00)\d{2}-(?!0000)\d{4}$/.test(i)}).validation("notEmpty","This field cannot contain ONLY spaces",function(t,e,i){var a=i.replace(/^\s+|\s+$/g,"");return/^\S*[a-z0-9]*$/i.test(a)}).validation("passStrength","Invalid Password",function(t,e,i,a,n,r,s,l,u,o,d,h,f,c){var g=!1,p=n&&!isNaN(n)?n:6,v=r&&!isNaN(r)?r:30,m=s&&!isNaN(s)?s:0,F=u&&!isNaN(u)?u:0,b=l&&!isNaN(l)?l:0,E=o&&!isNaN(o)?o:0,C=d&&!isNaN(d)?d:0,y=h&&"null"!==h?h:"@#!$%^&+=?*",w=f&&!isNaN(f)&&0!==f?f:1,D="true"!==c?c:"true";switch(a){case"weak":g=this.checkPWStrength(i,1,1,1,"0",p,v,y);break;case"medium":g=this.checkPWStrength(i,1,1,1,1,p,v,y);break;case"strong":p=n||8,g=this.checkPWStrength(i,2,2,2,2,p,v,y);break;case"custom":g=this.checkPWStrength(i,m,b,F,E,p,v,y,C,w,D);break;default:g=this.checkPWStrength(i,"0","0","0","0",p,v);break}return g}).validation("matchField","These fields must match.",function(t,e){var i=$(e),a=$('input[data-twin="'+e.attr("data-twin")+'"]',t),n=a.filter(".isMainTwin"),r=a.filter(".isTwin"),s=i.hasClass("isTwin"),l=n.val(),u=r.val(),o=l.length>0&&l===u;return console.log("CHECKING MATCH",s,o),!s||o},function(t,e){this.bindTwins(t,e)}).validation("custom","{arg1}",function(t,e,i,a,n){var r=decodeURIComponent(n);return new RegExp(r,"g").test(i)}).validation("unique","These fields must be unique",function(t,e,i,a){return this.isUnique(t,e,i,a)},function(t,e){this.bindUnique(t,e)}).validation("minSelect","Select at least {arg1} checkboxes.",function(t,e,i,a){return a<=this.inputsWithName(t,e).filter(":checked").length},function(t,e){"use strict";this.bindBrothers(t,e)}).validation("maxSelect","Select not more than {arg1} checkboxes.",function(t,e,i,a){return a>=this.inputsWithName(t,e).filter(":checked").length},function(t,e){"use strict";this.bindBrothers(t,e)}).validation("rangeSelect","Select between {arg1} and {arg2} checkboxes.",function(t,e,i,a,n){var r=this.inputsWithName(t,e).filter(":checked").length;return a<=r&&n>=r},function(t,e){"use strict";this.bindBrothers(t,e)}).helper("isNumber",function(t){return/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(t)}).helper("contains",function(t,e,i){var a="true"!==i?e.toLowerCase():e;return-1!==("true"!==i?t.toLowerCase():t).indexOf(a)}).helper("isEmail",function(t){return/^[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(t)}).helper("isUrl",function(t){return/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(t)}).helper("isUsername",function(t){return/^([a-zA-Z])[a-zA-Z_-]*[\w_-]*[\S]$|^([a-zA-Z])[0-9_-]*[\S]$|^[a-zA-Z]*[\S]$/.test(t)}).helper("isDate",function(t,e,i){var a,n,r,s,l,u,o="a 4 digit year is required to restrict past dates",d=!1,h=!1;switch(e){case"mmdd":s="^((?:0?[1-9]|1[012]))[-/.]((?:0?[1-9]|[12]\\d|3[01]))$",u=!0;break;case"mmyy":case"mmyyyy":s="^((?:0?[1-9]|1[012]))[-/.]((?:19|20)?\\d{2})$",a=1,r=2,4===e.length&&(u=!0);break;case"yyyymmdd":s="^((?:19|20)?\\d{2})[-/.]((?:0?[1-9]|1[012]))[-/.]((?:0?[1-9]|[12]\\d|3[01]))$",a=2,n=3,r=1;break;case"ddmmyy":case"ddmmyyyy":s="^((?:0?[1-9]|[12]\\d|3[01]))[-/.]((?:0?[1-9]|1[012]))[-/.]((?:19|20)?\\d{2})$",a=1,n=2,r=3,6===e.length&&(u=!0);break;default:s="^((?:0?[1-9]|1[012]))[-/.]((?:0?[1-9]|[12]\\d|3[01]))[-/.]((?:19|20)?\\d{2})$",a=1,n=2,r=3,4===e.length&&(u=!0);break}if(l=new RegExp(s),(d=l.test(t))&&i){if(h=d,u)throw new Error(o);var f=new Date,c=new Date(f.getFullYear(),f.getMonth(),f.getDate()),g=l.exec(t),p=g[a]-1,v=n?g[n]:f.getDate(),m=g[r];h=new Date(m,p,v)>=c}else h=d;return h}).helper("isIPAddress",function(t){return/^(([2]([0-4][0-9]|[5][0-5])|[0-1]?[0-9]?[0-9])[.]){3}(([2]([0-4][0-9]|[5][0-5])|[0-1]?[0-9]?[0-9]))$/.test(t)}).helper("isUSPhone",function(t){return/^1?\s*\W?\s*([2-9][0-8][0-9])\s*\W?\s*([2-9][0-9]{2})\s*\W?\s*([0-9]{4})(\se?x?t?(\d*))?$/.test(t)}).helper("isPhone",function(t){return(t.match(/^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/gm)||[]).length>0}).helper("checkPWStrength",function(t,e,i,a,n,r,s,l,u,o,d){var h,f,c,g=e?"{"+e+",}":"",p=a?"{"+a+",}":"",v=i?"{"+i+",}":"",m=n?"{"+n+",}":"",F=r?"{"+r+",}":"",b=s?"{,"+s+"}":"",E=u?"{"+u+",}":"",C=l,y=o||"",w="true"===d?"(^[\\S ]+$)":"(^[\\S]+$)";return h=r&&s?"{"+r+","+s+"}":r&&!s?F:s&&!r?b:"",f="(?!.*?(.)1{"+y+",})(?=."+h+")(?=(.*[\\d])"+g+")(?=(.*[a-z])"+v+")(?=(.*[A-Z])"+p+")(?=(.*[a-zA-Z])"+E+")(?=(.*["+C+"])"+m+")"+w,c=new RegExp(f),c.test(t)}).helper("isUnique",function(t,e,i,a){var n,r,s=!0,l=e.attr("id"),u=a?i:i.toLowerCase(),o=$(t).find('input[data-unique="'+e.attr("data-unique")+'"]');return $(o).each(function(){n=$(this),(r=a?n.val():n.val().toLowerCase())===u&&n.attr("id")!==l&&r.length&&u.length&&(s=!1)}),s}).helper("inputTwin",function(t,e){return $('input[data-twin="'+e.attr("data-twin")+'"]',t).not(e)}).helper("inputsWithName",function(t,e){return $('input[name="'+e.attr("name")+'"]',t)}).helper("inputsWithNameNotSelf",function(t,e){return this.inputsWithName(t,e).filter(function(){return $(this).index()!==e.index()})}).helper("inputsWithUnique",function(t,e){var i=e.attr("data-unique");return $('input[data-unique="'+i+'"]',t)}).helper("inputsWithUniqueNotSelf",function(t,e){return this.inputsWithUnique(t,e).filter(function(){return $(this)!==e})}).helper("bindUnique",function(t,e){this.inputsWithUniqueNotSelf(t,e).on($.greenlight.defaults.validateEvents,function(){e.greenlight("validate")})}).helper("bindTwins",function(t,e){$('input[data-twin="'+e.attr("data-twin")+'"]',t).filter(".isTwin").on($.greenlight.defaults.validateEvents,function(){$(this).greenlight("validate")})}).helper("bindBrothers",function(t,e){this.inputsWithNameNotSelf(t,e).on($.greenlight.defaults.validateEvents,function(){e.greenlight("validate")})});
//# sourceMappingURL=./greenlight-min.js.map