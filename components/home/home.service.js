(function () {
    'use strict';

    /**
     * Service for determining type advantages
     */
    angular.module("mainApp").service("HomeService", ['$http', function ($http) {
        this.types = {};
        this.pokemans = [];
        this.list_poke = {};

        /**
         * $http call accesses the types json that is located in the assets folder and parses it into a dictionary
         * The dictionary will be structured as its key being the type and an object containing information about the type (like weaknesses)
         * For example: this.type("Fire").weaknesses will give an array of all the weaknesses of a Fire type.
         */
        $http.get("assets/types.json")
            .success((data) => {
                console.log(data);
                angular.forEach(data, (object, val) => {
                    this.types[object.name] = object;
                })
                console.log(this.types);
            })
            .error((data) => {
                console.log("error");
                console.log(data);
            })

        $http.get("assets/pokedex.json")
            .success((data) => {
                angular.forEach(data, (object, val) => {
                    //console.log(object);
                    var newObj = { display: object.ename, value: object.ename.toLowerCase() };
                    this.pokemans.push(newObj);
                    this.list_poke[object.ename] = object;
                })
            })
            .error((data) => {
                console.log("error");
                console.log(data);
            })

        this.getTypes = () => {
            return this.types;
        }

        this.getPokemans = () => {
            return this.pokemans;
        }

        this.getList = () => {
            return this.list_poke;
        }

        /**
         * This get type advantage takes in two inputs, the first being the attacking type and the second being the defending type
         * So for instance, fire and water as inputs will return false as in the water is not weak to fire.
         * Might do some more upgrading to this later on but this will do for now.
         */
        this.getTypeAdvantage = (type1, type2) => {
            console.log(this.types[type1])
            if (this.types[type1].strengths.indexOf(type2) !== -1) {
                return true;
            }
            else {
                return false;
            }
        }

        /**
         * Gets the pokemon given the id of the pokemon
         */
        this.getPokeApi = (id) => {
            var url = "http://pokeapi.co/api/v2/pokemon/" + id + "/";
            // $http.get(url)
            //     .success((data) => {
            //         console.log(data);
            //         return data;
            //     })
            //     .error((data) => {
            //         console.log("error");
            //         console.log(data);
            //     })
            return $http({ method: "GET", url: url }).then(function (result) {

                // What we return here is the data that will be accessible 
                // to us after the promise resolves
                return result.data;
            });
        }
    }])
})();