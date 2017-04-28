(function () {
    'use strict';

    angular.module("mainApp").controller("homeCtrl", ['$scope', '$timeout', '$q', '$log', '$http', '$filter', 'HomeService', function ($scope, $timeout, $q, $log, $http, $filter, HomeService) {
        var self = this;

        self.simulateQuery = false;
        self.isDisabled = false;

        // list of `state` value/display objects
        //self.states = loadAll();
        self.states = [];
        console.log(self.states);
        self.querySearch = querySearch;
        self.selectedItemChange = selectedItemChange;
        self.searchTextChange = searchTextChange;

        self.newState = newState;

        var pokemans = HomeService.getPokemans();
        var list_poke = HomeService.getList();
        self.states = pokemans;

        $scope.pokeInfo = null;
        /**
         * This $http get request simply reads the pokedex json and parses it accordingly. 
         */

        
        function newState(state) {
            alert("Sorry! You'll need to create a Constitution for " + state + " first!");
        }

        // ******************************
        // Internal methods
        // ******************************

        /**
         * Search for states... use $timeout to simulate
         * remote dataservice call.
         */
        function querySearch(query) {
            var results = query ? self.states.filter(createFilterFor(query)) : self.states,
                deferred;
            if (self.simulateQuery) {
                deferred = $q.defer();
                $timeout(function () { deferred.resolve(results); }, Math.random() * 1000, false);
                return deferred.promise;
            } else {
                return results;
            }
        }

        function searchTextChange(text) {
            //$log.info('Text changed to ' + text);
        }

        /**
         * Displays info upon clicking on the pokemon info.
         * @param item the object containing the display and value of the autocomplete search. 
         */
        function selectedItemChange(item) {
            if (item.display === undefined){
                return;
            }
            $scope.pokeInfo = list_poke[item.display];
            if ($scope.pokeInfo.ename === "Pikachu"){
                console.log(HomeService.getTypeAdvantage("Electric", "Ground"));
            }
        }

        /**
         * 
         * @param {*} poke the object of the pokemon, returns their types
         */
        function getPokeTypes(poke){
            return list_poke[poke.display];
        }

        /**
         * Build `states` list of key/value pairs
         */
        function loadAll() {
            var allStates = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
              Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
              Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
              Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina,\
              North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
              South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
              Wisconsin, Wyoming';

            return allStates.split(/, +/g).map(function (state) {
                return {
                    value: state.toLowerCase(),
                    display: state
                };
            });
        }

        /**
         * Create filter function for a query string
         */
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);

            return function filterFn(state) {
                return (state.value.indexOf(lowercaseQuery) === 0);
            };

        }
    }]);
})();