(function() {
    'use strict';

    var app = angular.module("mainApp", ['ngMaterial', 'ui.router']);

    app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/home');

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: '/components/home/home.tmpl.html',
                controller: 'homeCtrl as vm'
            })
    }])
})();