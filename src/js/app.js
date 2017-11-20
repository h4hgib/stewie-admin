'use strict';

/**
 * The main app instance
 * Developed during the Hacking For Humanity Hackathon in Gibraltar, 19th November 2017
 *
 * Author: stu.tippett@gmail.com
 */
var app = function (app) {
    /**
     * Configuration attributes
     */
    var config = {
        api : 'api/api.php',
        debug : {
            on: true
        },
        url : window.location.host == 'localhost:3000' || window.location.host == 'childline.local' ? 'http://childline.local/' : 'http://www.childline.gi/'
    };

    /**
     * Cached attributes
     */
    app.cache = {
        un :  null,
        key : null
    };

    /**
     * Log a debug message to the console if debug is on
     *
     *  @param String msg The message to log
     */
    app.debug = function (msg) {
        if (config.debug.on == true) {
            console.log(msg);
        }
    };

    /**
     * Make an ajax call to a given url
     *
     * @param url string The to make the call to
     * @param data mixed The data to send
     * @param object The callback function to run on success
     */
    app.ajax = function (url, data, callback) {
        app.debug('app.ajax()');
        var i = 0,
            xhr = new XMLHttpRequest(),
            postData = null;

        app.loading(true);

        data.push( { name: 'key', val: app.cache.key } );

        app.debug('posting: ' + data);

        postData = new FormData();

        for (i = 0; i < data.length; i++) {
            postData.append(data[i].name, data[i].val);
        }

        xhr.open('POST', url + '?t=' + Math.random(), true);
        xhr.send(postData);
        xhr.myCallback = callback;
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                xhr.myCallback(xhr);
                app.loading(false);
            } else if (xhr.readyState === 4 && xhr.status !== 200) {
                // Error handling here
                app.loading(false);
            }
        };
    };

    /**
     * Initialise the app
     */
    app.init = function () {
        app.debug('app.init()');

        app.cache.key = localStorage.getItem('key');
        app.loadPage();
    };

    /**
     * Bind any page specific code
     */
    app.loadPage = function () {
        app.debug('app.loadPage()');
        var body    = document.getElementsByTagName('body')[0],
            actions = document.querySelectorAll('*[data-action]'),
            agent   = document.querySelectorAll('.agent-name'),
            i;

        if (body.dataset.load) {
            app[body.dataset.load]();
        }

        for(i = 0; i < agent.length; i++) {
            agent[i].innerHTML = localStorage.getItem('un');
        }

        for(i = 0; i < actions.length; i++) {
            actions[i].onclick = app[actions[i].dataset.action] ? app[actions[i].dataset.action] : null;
        }
    };

    /**
     * Bind an element to an action
     *
     * @param ele string the ID of the element to bind to
     * @param method string The method to call
     */
    app.bind = function (id, method) {
        app.debug('app.bind()');
        var ele = document.getElementById(id);

        if (ele) {
            ele.onclick = app[method];
        }
    };

    /**
     * Home Page
     */
    app.home = function() {
        app.debug('app.home()');
        document.getElementById('search').addEventListener("keypress", app.search);
    }

    /**
     * Search
     */
    app.search = function(e) {
        if(e.code == 'Enter') {
            app.debug('app.search()');
            var data = [
                    { name : 'p', val : 'search' },
                    { name : 'search', val : document.getElementById('search').value }
                ];

            app.ajax(config.url + config.api, data, app.postSearch);
        }
    }

    /**
     * Search callback
     */
    app.postSearch = function(xhr) {
        app.debug('app.postSearch()');
        var res    = JSON.parse(xhr.responseText);

        if(res.success) {
            app.addCases(res.cases,'.search-results');
        } else {
            app.debug('XHR Fail');
        }
    }

    /**
     * Add cases to the DOM
     */
    app.addCases = function(cases, ele) {
        app.debug('app.addCases()');
        var output      = '',
            searchAreas = document.querySelectorAll('.case-results'),
            date,month,sexFull,fu,i;

        for(i = 0; i < searchAreas.length; i++) {
            searchAreas[i].style.display = 'none';
        }

        for(i = 0; i < cases.length; i++) {
            date = new Date(cases[i].timestamp);
            month = date.getMonth() + 1;
            fu   = cases[i].follow_up === 'y' ? 'Yes' : 'No';
            sexFull = cases[i].sex === 'm' ? 'male' : 'female';

            output += '<div class="cases clearfix"><div class="case ' + sexFull + '"><div class="case-main"><span class="case-number">CN: '+ cases[i].id + '</span><span class="case-date">' + date.getDate() + '/' + month + '/' + date.getFullYear() + '</span><div class="case-sex">' + cases[i].sex + '</div><div><span>Age</span><span>' + cases[i].age + '</span></div><div><span>Case Type</span><span>' + cases[i].category + '</span></div><div><span>Primary Reason</span><span>' + cases[i].primary_call_reason + '</span></div><div><span>Follow Ups</span><span>' + fu + '</span></div></div><div class="case-view"><a href="/new-case.html?id=' + cases[i].id + '">View Case Details</a></div></div></div>'
        }

        document.querySelector(ele).children[1].innerHTML = output;
        document.querySelector(ele).style.display = 'block';
    }

    /**
     * Create a new user
     */
    app.newUser = function() {
        app.debug('app.newUser()');
        var password  = document.getElementById('password').value,
            passwordC = document.getElementById('passwordC').value,
            data;

        if(password !== passwordC) {
            alert('Passwords do not match, please try again.');
            return;
        }

        data = [
            { name : 'p', val : 'newUser' },
            { name : 'username', val : document.getElementById('username').value },
            { name : 'password', val : password }
        ];

        app.ajax(config.url + config.api, data, app.postNewUser);
    };

    /**
     * Callback for new user
     */
    app.postNewUser = function(xhr) {
        app.debug('app.postNewUser()');
        var res  = JSON.parse(xhr.responseText);

        if(res.success) {
            app.gotUsers();
        } else {
            app.debug('XHR Fail');
        }
    };

    /**
     * Get admin users
     */
    app.getUsers = function() {
        app.debug('app.getUsers()');
        var data = [
                { name : 'p', val : 'getUsers' }
            ];

        app.ajax(config.url + config.api, data, app.gotUsers);
    };

    /**
     * Callback after got users
     */
     app.gotUsers = function(xhr) {
        app.debug('app.gotUsers()');
        var res    = JSON.parse(xhr.responseText),
            output = '',
            i;

        if(res.success) {
            for(i = 0; i < res.users.length; i++) {
                output += '<div class="username">' + res.users[i].username + ' [ edit ] </div>';
            }

            document.getElementById('user-list').innerHTML = output;
        } else {
            //app.logout();
            app.debug('XHR Fail');
        }
     };

    /**
     * Page specific code for new contact
     */
    app.newCase = function() {
        app.debug('app.newCase()');
        var data = [
                { name : 'p', val : 'newContact' }
            ];

        app.ajax(config.url + config.api, data, app.postNewContact);
    };

    app.getParameterByName = function(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    };

    /**
     * Page specific code for edit contact
     */
    app.editCase = function() {
        app.debug('app.editCase()');
        var data = [
                { name : 'p',  val : 'getContact' },
                { name : 'id', val : app.getParameterByName('id') }
            ];

        app.ajax(config.url + config.api, data, app.postEditContact);
    };

    /**
     * Callback after edit case found
     */
    app.postEditContact = function(xhr) {
        app.debug('app.postEditContact()');
        var formEle = document.querySelectorAll('input, textarea, select'),
            res  = JSON.parse(xhr.responseText),
            eles = document.querySelectorAll('*[data-input]'),
            date,month,fields,i;

        if(res.success) {
            date = new Date();
            date.setTime = res.timestamp;
            month = date.getMonth()+1;
            document.getElementById('case-number').innerHTML = res.caseId;
            document.getElementById('time-log').innerHTML    = date.getHours() + ':' + date.getMinutes() + ' ' + date.getDate() + '/' + month + '/' + date.getFullYear();

            fields = Object.values(res.fields);

            if(document.querySelector('input[name="name_of_caller"]')) {
                document.querySelector('input[name="name_of_caller"]').value = res.fields['name_of_caller'];
            }

            for(i = 0; i < fields.length; i++) {
                console.log(i);
                if(document.querySelector('input[name="' + fields[i] + '"]')) {
                    document.querySelector('input[name="' + fields[i] + '"]').value = fields[i];
                }
            }
            for(i = 0; i < fields.length; i++) {
                if(document.querySelector('textarea[name="' + fields[i] + '"]')) {
                    document.querySelector('textarea[name="' + fields[i] + '"]').innerHTML = fields[i];
                }
            }
            for(i = 0; i < fields.length; i++) {
                if(document.querySelector('select[name="' + fields[i] + '"]')) {
                    document.querySelector('select[name="' + fields[i] + '"]').value = fields[i];
                }
            }

            for(i = 0; i < formEle.length; i++) {
                formEle[i].onblur = app.saveForm;
            }

            for(i = 0; i < eles.length; i++) {
                eles[i].onclick = app.bindValue;
            }
        } else {
            //app.logout();
            app.debug('XHR Fail');
        }
    };

    /**
     * Callback after new case created
     */
    app.postNewContact = function(xhr) {
        app.debug('app.postNewContact()');
        var formEle = document.querySelectorAll('input, textarea, select'),
            res  = JSON.parse(xhr.responseText),
            eles = document.querySelectorAll('*[data-input]'),
            date,month,i;

        if(res.success) {
            date = new Date();
            date.setTime = res.timestamp;
            month = date.getMonth()+1;
            document.getElementById('case-number').innerHTML = res.caseId;
            document.getElementById('time-log').innerHTML    = date.getHours() + ':' + date.getMinutes() + ' ' + date.getDate() + '/' + month + '/' + date.getFullYear();

            for(i = 0; i < formEle.length; i++) {
                formEle[i].onblur = app.saveForm;
            }

            for(i = 0; i < eles.length; i++) {
                eles[i].onclick = app.bindValue;
            }
        } else {
            //app.logout();
            app.debug('XHR Fail');
        }
    };

    /**
     * Bind a value to a form element
     */
    app.bindValue = function(e) {
        app.debug('app.bindValue()');
        var details = e.target.dataset;

        document.querySelector('[name="' + details.input + '"]').value = details.value;

        app.saveForm({ target : document.querySelector('[name="' + details.input + '"]') });
    }

    /**
     * Change step on form
     */
    app.showStep = function(step) {
        var steps = document.querySelectorAll('.step'),
            nextStep = document.querySelector('.step-'+step),
            i;

        for(i = 0; i < steps.length; i++) {
            steps[i].style.display = 'none';
        }

        nextStep.style.display = 'block';
        nextStep.scrollIntoView();
    }

    /**
     * Save a form to the databse
     */
    app.saveForm = function(e) {
        app.debug('app.saveForm');
        var field = e.target.name,
            value = e.target.value,
            data  = [],
            steps = document.querySelectorAll('.step-two-option'),
            i;

        data = [
            { name : 'p',       val : 'saveContact' },
            { name : 'id',      val : document.getElementById('case-number').innerHTML },
            { name : 'field',   val : field },
            { name : 'value',   val : value }
        ];

        if(field == 'age') {
            app.showStep('two');
        } else if(field === 'category') {
            for(i = 0; i < steps.length; i++) {
                steps[i].style.display = 'none';
            }
            document.querySelector('.step-two-option.case-type-'+ value.replace(' ','-')).style.display = 'block';
        }

        app.ajax(config.url + config.api, data, app.postSaveContact);
    }

    /**
     * Callback after field save
     */
    app.postSaveContact = function(xhr) {
        app.debug('app.postSaveContact()');
        var data = '',
            res  = JSON.parse(xhr.responseText);

        if(res.success) {
            app.debug('saved ok');
        } else {
            alert('failed to save');
            app.debug('XHR Fail');
        }
    };

    /**
     * Render any errors for a given form
     *
     * @param Object errors Any errors from a validate.js form submission
     *
     * @return bool false if there are errors, true if no errors
     */
    app.renderFormErrors = function(errors) {
        app.debug('app.renderFormErrors()');
        var i  = 0,
            j  = 0,
            f  = null,
            x  = null,
            p  = null,
            el = document.getElementById('form-error');

        f = document.querySelectorAll('.form-validation-error');
        for(j = 0; j < f.length; j++) {
            f[j].classList.remove('form-validation-error');
        }

        while (el.firstChild) el.removeChild(el.firstChild);

        if (errors.length > 0) {

            for (i = 0; i < errors.length; i++) {

                // Highlight the problem inputs
                f = errors[i].eleQuery ? document.querySelector(errors[i].eleQuery) : errors[i].element;
                if(f) {
                    f.classList.add('form-validation-error');
                }

                p = document.createElement('p');
                x = document.createTextNode(errors[i].message);
                p.appendChild(x);
                el.appendChild(p);
            }

            window.scrollTo(0, el.offsetTop);

            return false;
        }

        return true;
    };

    /**
     * Page specific code for login
     */
    app.adminLogin = function() {
        app.debug('app.adminLogin()');

        app.bind('login','doLogin');
    };

    /**
     * Process the login
     */
    app.doLogin = function(e) {
        e.preventDefault();
        app.debug('app.login()');
        var data = '',
            un = document.getElementById('username').value,
            pw = document.getElementById('password').value;

        app.cache.un = document.getElementById('username').value;

        data = [
            { name : 'p',  val : 'login' },
            { name : 'un', val : un },
            { name : 'pw', val : pw }
        ];

        app.ajax(config.url + config.api, data, app.postLogin);
    };

    /**
     * Login callback
     */
    app.postLogin = function(xhr) {
        app.debug('app.postLogin()');
        var res = JSON.parse(xhr.responseText);

        if(res.success) {
            app.cache.key = res.sKey;
            localStorage.setItem('key', app.cache.key);
            localStorage.setItem('un', app.cache.un);

           /* var adminUser = document.getElementById('userCon');
            adminUser.innerHTML = localStorage.getItem('un');*/
            //document.getElementById('userCon').innerHTML = localStorage.getItem('un');

            window.location.href = config.url + 'new-case.html';
        } else {
            app.debug('XHR Fail');
            app.cache.un = null;
            app.xhrFail(res);
        }
    };

    /**
     * Log out a user
     */
    app.logout = function(e) {
        e && e.preventDefault ? e.preventDefault() : null;
        app.debug('app.logout()');

        app.cache.key = null;
        localStorage.setItem('key', '');
        localStorage.setItem('un', '');

        window.location.href = config.url + 'admin-login.html';
    };

    /**
     * Failed xhr request
     */
    app.xhrFail = (res) => {
        if(res.key == 'kMIvl') {
            window.location.href = config.url + '/admin-login.html';
        }
    };

    /**
     * Show / hide loading spinner
     */
    app.loading = function (on) {
        app.debug('app.loading()');
    };

    return app;
}({});

window.initMap = function () {
    app.loadGoogleMaps();
};

app.init();
