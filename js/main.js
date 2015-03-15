var app = angular.module('myApp', []);
app.run(function($rootScope) {
  $rootScope.name = "Ari Lerner";
});
app.controller('MyController',['$scope','$http', function($scope,$http) {
  $scope.person = {
    name: "Try It"
  };
  $scope.queryString = "";
$scope.sendPost = function() {
var dataToPost = {query:"SELECT keyspace_name FROM system.schema_keyspaces;"}; /* PostData*/
    //var queryParams = {params: {op: 'saveEmployee'}};/* Query Parameters*/
    $http.post("http://localhost:9000/getKeyspaces", dataToPost)
            .success(function(serverResponse, status) {
                // Updating the $scope postresponse variable to update theview
                $scope.keyspaces = serverResponse;
            });
}


$scope.connectToDB = function() {
var dataToPost = {  hostname:"127.0.0.1",  port:"9042"}; /* PostData*/
    //var queryParams = {params: {op: 'saveEmployee'}};/* Query Parameters*/
    $http.post("http://localhost:9000/connectToCassandra", dataToPost)
            .success(function(serverResponse, status) {
                // Updating the $scope postresponse variable to update theview
                $scope.person.name = serverResponse;
            });
}

$scope.createSchema = function() {
var dataToPost = {query:"CREATE KEYSPACE " + $scope.scehmaName +" WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 3 }"}; 
    //var queryParams = {params: {op: 'saveEmployee'}};/* Query Parameters*/
    $http.post("http://localhost:9000/createKeyspace", dataToPost)
            .success(function(serverResponse, status) {
                // Updating the $scope postresponse variable to update theview
                $scope.person.name = serverResponse;
            });
}

$scope.getKeyspaceSchema = function(keySpace) {
var dataToPost = {query:"SELECT columnfamily_name FROM system.schema_columnfamilies WHERE keyspace_name = '"+keySpace+"';"}; /* PostData*/
    $http.post("http://localhost:9000/getTableSchema", dataToPost)
            .success(function(serverResponse, status) {
                // Updating the $scope postresponse variable to update theview
                $scope.columnfamilynames = serverResponse;
            });
}


$scope.deleteKeyspace = function() {
var dataToPost = {query:"DROP KEYSPACE "+ $scope.DropKeyspace +";"}; /* PostData*/
    $http.post("http://localhost:9000/deleteKeyspace", dataToPost)
            .success(function(serverResponse, status) {
                // Updating the $scope postresponse variable to update theview
                $scope.deleted = serverResponse;
            });
}


$scope.sendQuery = function() {
	var dataToPost = {query:$scope.queryString +";"}; /* PostData*/
	    $http.post("http://localhost:9000/getDataFromCassandra", dataToPost)
	            .success(function(serverResponse, status) {
	                // Updating the $scope postresponse variable to update theview
	                $scope.answerRows = serverResponse;
	            });
}

}]);
/*
app.controller('CQLQueryController',['$scope','$http', function($scope,$http) {

}]);*/

