var app = angular.module('myApp', []);
app.run(function($rootScope) {
  $rootScope.name = "Ari Lerner";
});
app.controller('MyController',['$scope','$http', function($scope,$http) {
  $scope.person = {
    name: "Try It"
    scehmaName=""
  };
$scope.sendPost = function() {
var dataToPost = {query:"SELECT keyspace_name FROM system.schema_keyspaces;"}; /* PostData*/
    //var queryParams = {params: {op: 'saveEmployee'}};/* Query Parameters*/
    $http.post("http://localhost:9000/getKeyspaces", dataToPost)
            .success(function(serverResponse, status) {
                // Updating the $scope postresponse variable to update theview
                $scope.person.name = serverResponse;
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
var dataToPost = {query:"CREATE KEYSPACE test123 WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 3 }"}; /* PostData*/
    //var queryParams = {params: {op: 'saveEmployee'}};/* Query Parameters*/
    $http.post("http://localhost:9000/createKeyspace", dataToPost)
            .success(function(serverResponse, status) {
                // Updating the $scope postresponse variable to update theview
                $scope.person.name = serverResponse;
            });
}
}]);
