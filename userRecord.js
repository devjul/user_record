;(function (window, document) {

    'use strict';

    var nextTick, ajaxLoad, readCookie;

    nextTick = window.requestAnimationFrame ||
               window.mozRequestAnimationFrame ||
               window.webkitRequestAnimationFrame ||
               function (callback) {
                   window.setTimeout(callback, 1000 / 60);
               };

    ajaxLoad = function(url, callback) {
        if (url && typeof (url) !== 'string') {
            return;
        }

        function reqListener () {
            if (callback && typeof (callback) === 'function') {
                callback(this.responseText);
            }
        }

        var oReq = new XMLHttpRequest();
        oReq.onload = reqListener;
        oReq.open("get", url, true);
        oReq.send();
    };

    readCookie = function (name, c, C, i){
        c = document.cookie.split('; ');
        var cookies = {};
        console.log(c);

        var value_i = c.length - 1;
        if (value_i == 0) return false;
        console.log(value_i);
        for(i = value_i; i >= 0; i--){
           C = c[i].split('=');
           cookies[C[0]] = C[1];
        }

        if (cookies && cookies[name]) { 
            return cookies[name]; 
        }

        return false;
    };

    function userRecord(options) {
        this.options = {
            'recordClick': true,
            'recordInput': true,
            'recordKeyboard': true
        };

        options = options || {};

        Object.keys(options).forEach(function (item) {
            this.options[item] = options[item];
        }.bind(this));

        this.eventClick = false;

        nextTick(function() {
            this.init();
        }.bind(this));
    }

    userRecord.prototype.init = function() {
        this.initialized = true;

        if (this.checkUserPrefs()) {
            this.record('start : ' + Date.now());
            this.checkCookie();
            this.addEvents();
        }
    };

    userRecord.prototype.checkCookie = function() {
        this.idCookie = readCookie('idRecord') || this.generateCookie();
    };

    userRecord.prototype.generateCookie = function() {
        this.idCookie = Math.random().toString(36).substr(2, 14);

        document.cookie = 'idRecord=' + this.idCookie + ';';
    };

    userRecord.prototype.checkUserPrefs = function() {
        var doNotTrack = window.navigator.doNotTrack || false;

        // case 'unspecified'
        if (typeof (window.navigator.doNotTrack) !== 'boolean') {
            doNotTrack = false;
        }

        return !doNotTrack;
    };

    userRecord.prototype.addEvents = function() {
        if (this.options.recordClick) {
            this.addEventsClick();
        }
        if (this.options.recordInput) {

        }
        if (this.options.recordKeyboard) {
            this.addEventsKeyboard();
        }
    };

    userRecord.prototype.record = function(record) {
        console.log(this.idCookie);
        console.log(record);
    };

    userRecord.prototype.addEventsClick = function() {
        var links = document.querySelectorAll('a');
        links = [].slice.call(links);

        links.forEach(function(item) {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                var target = e.target;
                if (this.eventClick) {
                    this.eventClick = false;
                    return;
                }
                this.eventClick = new MouseEvent('click');
                this.record('click on ' + target.href + ' at ' + Date.now());
                target.dispatchEvent(this.eventClick);
            }.bind(this));
        }.bind(this));
    };

    userRecord.prototype.addEventsKeyboard = function() {
        window.addEventListener('keydown', function(e) {
            var recordLine = 'press ' + e.keyCode + ' in ' + e.target.name;
            if (e.target.type !== 'password') {
                recordLine += ' value ' + e.target.value;
            }
            this.record(recordLine);
        }.bind(this));
    };

    userRecord.prototype.addEventsInput = function() {

    };

    /* global module, exports: true, define */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        // CommonJS, just export
        module.exports = exports = userRecord;
    } else if (typeof define === 'function' && define.amd) {
        // AMD support
        define(function () { return userRecord; });
    } else if (typeof window === 'object') {
        // If no AMD and we are in the browser, attach to window
        window.userRecord = userRecord;
    }
    /* global -module, -exports, -define */

}(window, document));