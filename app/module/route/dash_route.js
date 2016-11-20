dash.config(function($routeProvider){
	$routeProvider
	.when("/",{
		templateUrl:"views/dash.view.html"
	})
	.when("/404",{
		templateUrl:"views/error/404.view.html"
	})
	.when("/rides",{
		templateUrl:"views/ride-list.view.html",
		controller: "rideListCtrl"
	})
	.otherwise({
		redirectTo:'/404'
	})
})
