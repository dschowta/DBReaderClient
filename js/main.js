var app = angular.module('myApp', []);
app.run(function($rootScope) {
  $rootScope.name = "Ari Lerner";
});
app.config(function($httpProvider){
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});
app.controller('MyController',['$scope','$http', function($scope,$http) {
  $scope.person = {
    name: "Try It"
  };
  $scope.queryString = "";
  $scope.rowValue = [];
  $scope.editableRow = -1;
  $scope.editablecolumn = -1;
  
  $scope.keyspacedata ={
	name:"",
	Table:"",
	column:"",
	row:"",
	metadata:"",
	tabledata:""
};

$scope.dataType=[{name:'ascii',id:1},{name:'bigint',id:2},{name:'blob',id:3},{name:'boolean',id:4},{name:'counter',id:5},{name:'decimal',id:6},{name:'double',id:7},{name:'float',id:8},{name:'inet',id:9},{name:'int',id:10},{name:'list',id:11},{name:'map',id:12},{name:'set',id:13},{name:'text',id:14},{name:'timestamp',id:15},{name:'uuid',id:16},{name:'timeuuid',id:17},{name:'varchar',id:18},{name:'varint',id:19}];

$scope.choices = [{id: 'choice1'}];
$scope.columnsname=[];
$scope.primarykeys=[];
$scope.sendPost = function() {
	$scope.keyspacedata.name = "";
	$scope.keyspacedata.Table ="";
	$scope.keyspacedata.metadata = "";
	$scope.keyspacedata.tabledata = "";
	$scope.columnfamilynames="";
var dataToPost = {query:"SELECT keyspace_name FROM system.schema_keyspaces;"}; /* PostData*/
    //var queryParams = {params: {op: 'saveEmployee'}};/* Query Parameters*/
    $http.post("http://localhost:9000/getKeyspaces", dataToPost)
            .success(function(serverResponse, status) {
                // Updating the $scope postresponse variable to update theview
                $scope.keyspaces = serverResponse;
            });
}
$scope.createTable=function(){
angular.forEach($scope.choices,function(value,index){
                $scope.columnsname.push({'name':value.name,'type':value.datatype});
		$scope.primarykeys.push(value.name);
            });
var datatoPost ={table:{name: $scope.NewTableName , columns: $scope.columnsname, primarykeys : $scope.primarykeys}};
$scope.query = datatoPost;
$http.post("http://127.0.0.1:9000/keyspace/"+$scope.keyspacedata.name+"/table", datatoPost)
            .success(function(serverResponse, status) {
                // Updating the $scope postresponse variable to update theview
                $scope.response = serverResponse;
		$scope.choices = [{id: 'choice1'}];
		$scope.NewTableName="";
		$scope.getKeyspaceSchema($scope.keyspacedata.name);
            });
}

$scope.addNewColumn=function(){
var dataToPost={column:{name: $scope.coulmn.name , type:$scope.coulmn.datatype}};
$http.post("http://127.0.0.1:9000/keyspace/"+$scope.keyspacedata.name+"/table/"+$scope.keyspacedata.Table+"/column",dataToPost)
	.success(function(serverResponse,status){
	$scope.tableMetaData($scope.keyspacedata.Table);
	$scope.coulmn.name="";
	$scope.coulmn.datatype="";
	});
}

$scope.deleteColumn=function(columnname){
$http.delete("http://127.0.0.1:9000/keyspace/"+$scope.keyspacedata.name+"/table/"+$scope.keyspacedata.Table+"/column/"+columnname)
	.success(function(serverResponse,status){
		$scope.tableMetaData($scope.keyspacedata.Table);
});
}

$scope.editColumn=function(columnname,datatype){
	var dataToPost={type:datatype};
	$scope.query= dataToPost;
	$http.put("http://127.0.0.1:9000/keyspace/"+$scope.keyspacedata.name+"/table/"+$scope.keyspacedata.Table+"/column/"+columnname,dataToPost)
		.success(function(serverResponse,status){
			$scope.tableMetaData($scope.keyspacedata.Table);
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
	$scope.keyspacedata.name = keySpace;
	$scope.keyspacedata.Table ="";
	$scope.keyspacedata.metadata = "";
	$scope.keyspacedata.tabledata = "";
var dataToPost = {query:"SELECT columnfamily_name FROM system.schema_columnfamilies WHERE keyspace_name = '"+$scope.keyspacedata.name+"';"}; /* PostData*/
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

$scope.tableMetaData = function(tablename) {
	$scope.keyspacedata.Table = tablename;
	$scope.keyspacedata.metadata = "";
	$scope.keyspacedata.tabledata = "";
    $http.get("http://127.0.0.1:9000/keyspace/"+$scope.keyspacedata.name+"/table/" + tablename)
            .success(function(serverResponse, status) {
                // Updating the $scope postresponse variable to update theview
                $scope.keyspacedata.metadata = serverResponse;
            });
}

$scope.getTableData = function(tablename) {
	$scope.keyspacedata.Table = tablename;
	$scope.keyspacedata.tabledata = "";
	$scope.keyspacedata.metadata = "";
	$scope.query ="http://127.0.0.1:9000/keyspace/"+$scope.keyspacedata.name+"/table/" + tablename+"/row";
    $http.get("http://127.0.0.1:9000/keyspace/"+$scope.keyspacedata.name+"/table/" + tablename+"/row")
            .success(function(serverResponse, status) {
                // Updating the $scope postresponse variable to update theview
		$scope.temp=serverResponse;
                $scope.keyspacedata.tabledata = serverResponse;
            });
    
    $scope.tableMetaData(tablename);
}

$scope.dropTable = function(index,tablename) {
	$scope.keyspacedata.Table = tablename;
	$scope.query ="http://127.0.0.1:9000/keyspace/"+$scope.keyspacedata.name+"/table/" + tablename;
    $http.delete("http://127.0.0.1:9000/keyspace/"+$scope.keyspacedata.name+"/table/" + tablename)
            .success(function(serverResponse, status) {
                // Updating the $scope postresponse variable to update theview
		$scope.response=serverResponse;
		$scope.columnfamilynames.splice(index, 1);//delete the index from view
            }).error(function(serverResponse, status) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
	$scope.error = serverResponse;
  });
}

/*Check whether the columns is of string type or not*/
function isStringType(columnname, metadata){
	
		var retVal = false;
		for (var i = 0; i < metadata.length; i++) {
			var element = metadata[i];
			if(element.column_name	 == columnname){
				retVal =  element.validator=="org.apache.cassandra.db.marshal.UTF8Type"?true:false;
				break;
			}
		}
		
		return retVal;
	
}

//check whether the column is primary key or not
function isPrimaryKey (columnname, metadata){
	var retVal = false;
	for (var i = 0; i < metadata.length; i++) {
		var element = metadata[i];
		if(element.column_name	 == columnname){
			retVal =  element.type=="partition_key"?true:false;
			break;
		}
	}
	
	return retVal;
}																																																			
$scope.deleteRow = function(index,tablename) {
	var tableRow = $scope.keyspacedata.tabledata[index];

	
	//$scope.tableMetaData(tablename);
	
	var metadata = $scope.keyspacedata.metadata;
	
	//find the search condition to delete the row
	var conditionVal = "";
	for (var i = 0; i < Object.keys(tableRow).length; i++) {
		
		key = Object.keys(tableRow)[i];
		if(isPrimaryKey(key,metadata)){
			if("" != conditionVal){
				conditionVal += " AND ";
			}
			Value = tableRow[key];
			var quotes = isStringType(key,metadata)?"'":"";//if strring, add quotations
			conditionVal += key + "=" +quotes+  Value + quotes; 
		}
			
	}
	

	var req = {
			 method: 'DELETE',
			 url: "http://127.0.0.1:9000/keyspace/"+$scope.keyspacedata.name+"/table/" + tablename+"/row",
			 headers: {
			   'Content-Type': "application/json"
			 },
			 data: {row:{condition:conditionVal}} 
	};
	$http(req).success(function(serverResponse, status) {
                // Updating the $scope postresponse variable to update theview
		$scope.response=serverResponse;
		$scope.keyspacedata.tabledata.splice(index, 1);//delete the index from view
            }).error(function(serverResponse, status) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
	$scope.error = serverResponse;
  });
}

//get the array of columns
function getColumnNames (metadata){
	var retVal = [];
	for (var i = 0; i < metadata.length; i++) {
		retVal[i] = metadata[i].column_name;
	}
	
	return retVal;
}

$scope.addRow = function(index,tablename) {
	
	/*prepare the queries*/
	var columnNames = getColumnNames($scope.keyspacedata.metadata);//TODO: is this consistent with row values?
	var values = $scope.rowValue.slice();//copy array elements
	for(var i=0; i<values.length; i++){
		if(isStringType(columnNames[i],$scope.keyspacedata.metadata)){
			values[i] = "'"+values[i]+"'";
		}
	}
	var req = {
			 method: 'POST',
			 url: "http://127.0.0.1:9000/keyspace/"+$scope.keyspacedata.name+"/table/" + tablename+"/row",
			 headers: {
			   'Content-Type': "application/json"
			 },
			 data: {row:{columns:columnNames,
				 		 values:values}} 
	};
	$http(req).success(function(serverResponse, status) {
                // Updating the $scope postresponse variable to update theview
					$scope.response=serverResponse;
					/*Add the new row. not by a new query .. just update the view*/
					var newRow = {};
					for(var i=0; i<columnNames.length; i++){
						newRow[columnNames[i]] = $scope.rowValue[i];
						$scope.rowValue[i] = "";//empty the input box
					}
					$scope.keyspacedata.tabledata.push(newRow);
					
            }).error(function(serverResponse, status) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
	$scope.error = serverResponse;
  });
}

//Show the text box for editing
$scope.showRowEdit = function(val,row,col){
	$scope.editableRow = row;
	$scope.editablecolumn = col;
	$scope.rowEditValue = val;
}

$scope.rowEditVisible = function(row,col){
	retVal = false;
	if(row == $scope.editableRow && col == $scope.editablecolumn){
		retVal = true;
	}
	return retVal;
}
//hide the text box for editing
$scope.hideRowEdit = function(){
	$scope.editableRow = -1;
	$scope.editablecolumn = -1;
	
}

$scope.updateRow = function(tablename, column, rowValue) {
	var tableRow = $scope.keyspacedata.tabledata[$scope.editableRow];

	
	//$scope.tableMetaData(tablename);
	
	var metadata = $scope.keyspacedata.metadata;
	var quotes = "";
	
	//find the search condition to delete the row
	var conditionVal = "";
	for (var i = 0; i < Object.keys(tableRow).length; i++) {
		
		key = Object.keys(tableRow)[i];
		if(isPrimaryKey(key,metadata)){
			if("" != conditionVal){
				conditionVal += " AND ";
			}
			Value = tableRow[key];
			quotes = isStringType(key,metadata)?"'":"";//if strring, add quotations
			conditionVal += key + "=" +quotes+  Value + quotes; 
		}
			
	}
	quotes = isStringType(column, metadata)?"'":"";
	var req = {
			 method: 'PUT',
			 url: "http://127.0.0.1:9000/keyspace/"+$scope.keyspacedata.name+"/table/" + tablename+"/row",
			 headers: {
			   'Content-Type': "application/json"
			 },
			 data: {row:{
				 		columns:[column],
				 		values:[quotes+rowValue+quotes],
				 		condition:conditionVal}} 
	};
	$http(req).success(function(serverResponse, status) {
                // Updating the $scope postresponse variable to update theview
		$scope.response=serverResponse;
		tableRow[column] = rowValue;//edit the index from view
		$scope.hideRowEdit();
            }).error(function(serverResponse, status) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
            	$scope.hideRowEdit();
            	$scope.error = serverResponse;
  });
}

$scope.rowEditAction = function(event,tablename ){
	var codes = {ENTER: 13,
				ESC: 27};
	switch (event.which) {
		case codes.ENTER:{
			$scope.updateRow(tablename);
		}
			break;
		case codes.ESC:{
			$scope.hideRowEdit();
		}
			break;
		default:
			break;
	}
}

$scope.sendQuery = function() {
	var dataToPost = {query:$scope.queryString +";"}; /* PostData*/
	    $http.post("http://localhost:9000/getDataFromCassandra", dataToPost)
	            .success(function(serverResponse, status) {
	                // Updating the $scope postresponse variable to update theview
	                $scope.answerRows = serverResponse;
	            });
}

$scope.addNewChoice = function() {
  var newItemNo = $scope.choices.length+1;
  $scope.choices.push({'id':'choice'+newItemNo});
}

$scope.showAddChoice = function(choice) {
  return choice.id === $scope.choices[$scope.choices.length-1].id;
}

$scope.removeChoice = function() {
  var newItemNo = $scope.choices.length-1;
	if($scope.choices.length>1)
{
	$scope.choices.pop();
}
}
}]);


