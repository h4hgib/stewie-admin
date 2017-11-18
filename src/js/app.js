'use strict';

/**
 * The main app instance
 */
var app = function (app) {
    /**
     * Configuration attributes, these cannot change
     */
    var config = {
        api: 'api/api.php',
        debug: {
            on: true
        },

        /**
         * Latitude and longitude of business
         */
        maps: {
            lat: 36.126816,
            lon: -5.352780
        },

        url: window.location.host == 'localhost:3000' || window.location.host == 'childline.local' ? 'http://childline.local/' : 'http://www.childline.gi/'
    };

    /**
     * Cached attributes, these can change
     */
    app.cache = {
        un: null,
        key: null
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
            i;

        if (body.dataset.load) {
            app[body.dataset.load]();
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
     * Page specific code for new contact
     */
    app.newCase = function() {
        app.debug('app.newCase()');
        var data = [
                { name : 'p', val : 'newContact' }
            ];

        app.ajax(config.url + config.api, data, app.postNewContact);
    };

    /**
     * Callback after new case created
     */
    app.postNewContact = function(xhr) {
        app.debug('app.postNewContact()');
        var formEle = document.querySelectorAll('input', 'textarea'),
            data = '',
            res  = JSON.parse(xhr.responseText),
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
        } else {
            //app.logout();
            app.debug('XHR Fail');
        }
    };

    /**
     * Save a form to the databse
     */
    app.saveForm = function(e) {
        app.debug('app.saveForm');
        var field = e.target.name,
            value = e.target.value,
            data  = [];

        data = [
            { name : 'p',       val : 'saveContact' },
            { name : 'id',      val : document.getElementById('case-number').innerHTML },
            { name : 'field',   val : field },
            { name : 'value',   val : value }
        ];

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

(function(){
    //var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
    //s1.async=true;
    //s1.src='https://embed.tawk.to/5a1012d8bb0c3f433d4c9eb5/default';
    //s1.charset='UTF-8';
    //s1.setAttribute('crossorigin','*');
    //s0.parentNode.insertBefore(s1,s0);
})();
//var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
