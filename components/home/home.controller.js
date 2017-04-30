(function () {
    'use strict';

    angular.module("mainApp").controller("homeCtrl", ['$scope', '$timeout', '$q', '$log', '$http', '$filter', 'HomeService', '$mdDialog', function ($scope, $timeout, $q, $log, $http, $filter, HomeService, $mdDialog) {
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
        $scope.pokeApi = null;
        $scope.pokemonWeak = [];
        var dialogPoke = {};
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
            if (item === undefined || item.display === undefined) {
                return;
            }
            $scope.pokeInfo = list_poke[item.display];
            var selected_poke = $scope.pokeInfo;
            HomeService.getPokeApi(item.value).then(function (result) {
                $scope.pokeApi = result;
                // if ($scope.pokeInfo.ename === "Pikachu") {
                //     console.log(HomeService.getTypeAdvantage("Electric", "Ground"));
                // }
            });

            /**
             * this needs refactoring. currently only checks if one of the types is weak. 
             */
            if (selected_poke.type.length === 1) {
                angular.forEach(list_poke, (pokemon, val) => {
                    if (pokemon.type.length === 1) {
                        if (HomeService.getTypeAdvantage(pokemon.type[0], selected_poke.type[0])) {
                            $scope.pokemonWeak.push(pokemon);
                        }
                    }
                    else {
                        var first = HomeService.getTypeAdvantage(pokemon.type[0], selected_poke.type[0]);
                        var second = HomeService.getTypeAdvantage(pokemon.type[1], selected_poke.type[0]);
                        if (first || second) {
                            $scope.pokemonWeak.push(pokemon);
                        }
                    }
                })
            }
            else {
                angular.forEach(list_poke, (pokemon, val) => {
                    if (pokemon.type.length === 1) {
                        var first = HomeService.getTypeAdvantage(pokemon.type[0], selected_poke.type[0]);
                        var second = HomeService.getTypeAdvantage(pokemon.type[0], selected_poke.type[1]);
                        if (first || second) {
                            $scope.pokemonWeak.push(pokemon);
                        }
                    }
                    else {
                        var first = HomeService.getTypeAdvantage(pokemon.type[0], selected_poke.type[0]);
                        var second = HomeService.getTypeAdvantage(pokemon.type[0], selected_poke.type[1]);
                        var third = HomeService.getTypeAdvantage(pokemon.type[1], selected_poke.type[0]);
                        var fourth = HomeService.getTypeAdvantage(pokemon.type[1], selected_poke.type[1])
                        if (first || second || third || fourth) {
                            $scope.pokemonWeak.push(pokemon);
                        }
                    }
                })
            }
        }

        /**
         * Gets the info of a pokemon and returns it.
         * @param {String: name of the pokemon} name 
         * @param {Event: the event to open up a dialog} ev
         */
        $scope.getPokeInfo = (name, ev) => {
            console.log("clicked");
            HomeService.getPokeApi(name.toLowerCase()).then((result) => {
                console.log(result);
                dialogPoke = result;
                $mdDialog.show({
                    locals: {dialogPoke: dialogPoke, name: name},
                    controller: DialogController,
                    templateUrl: 'components/home/home.dialog.tmpl.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                })
                    .then(function (answer) {
                        //$scope.status = 'You said the information was "' + answer + '".';
                    }, function () {
                        //$scope.status = 'You cancelled the dialog.';
                    });
            })
        }

        //controller for the mdDialog
        function DialogController($scope, $mdDialog, dialogPoke, name) {
            console.log(dialogPoke);
            $scope.pokeResult = dialogPoke;
            $scope.name = name;
            $scope.hide = function () {
                $mdDialog.hide();
            };

            $scope.cancel = function () {
                $mdDialog.cancel();
            };

            $scope.answer = function (answer) {
                $mdDialog.hide(answer);
            };
        }
        /**
         * 
         * @param {Object: object of the pokemon, returns their types} poke 
         */
        function getPokeTypes(poke) {
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