function makeNamesUpper(arr){

   return arr.map(function(elm){
    	elm.name = elm.name.toUpperCase();
    	return elm;
    });
}