<?php
	header('Access-Control-Allow-Origin:*');
	header('Access-Control-Allow-Headers:X-Request-With');
	header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
	header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
	require_once 'vendor/autoload.php';
	
	$app = new \Slim\App();
	function getConnection() {
		$dbhost="localhost";
		$dbuser="root";
		$dbpass="";
		$dbname="buzz_ouxiang";
		$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
		$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		return $dbh;
	}

	$app->get('/getAllTask', function () {
		$sql = "SELECT * FROM task";
		try {
			$stmt = getConnection()->query($sql);
			$productos = $stmt->fetchAll(PDO::FETCH_OBJ);
			return json_encode($productos);
		}
		catch(PDOException $e) {
			echo '{"error":{"text":'. $e->getMessage() .'}}';
		}
	});
	$app->post('/addTask', function ($request) {
		$task = json_decode($request->getBody());
		$sql = "INSERT INTO `task`(`description`) VALUES (:description)";
		$id = 0;
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam("description", $task->description);
			$stmt->execute();
			$id = $db->lastInsertId();
			if ($id<0) {
				return '{"error":{"text":"Campos introducido incorrecto"}}';
			}else{
				return '{"correct":{"id":"'.$id.'"}}';
			}
			
		}
		catch(Exception $e) {
			echo '{"error":{"text":"'. $e->getMessage() .'"}}';
		}
	});
	$app->delete('/deleteTask', function ($request) {
		$id = json_decode($request->getBody())->id;
		$sql = "DELETE FROM task WHERE id=:id";
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam("id", $id);
			$x = $stmt->execute();
			if($x){
				echo '{"correct":{"text":"Delete Correct"}}';
			}else{
				echo '{"error":{"text":"Campos introducido incorrecto"}}';
			}
		}
		catch(PDOException $e) {
			echo '{"error":{"text":'. $e->getMessage() .'}}';
		}
	});
	$app->put('/changeState', function ($request) {
		$task = json_decode($request->getBody());
		$sql = "UPDATE `task` SET `state`= :state WHERE `id` = :id";
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam("state", $task->state);
			$stmt->bindParam("id", $task->id);
			$x = $stmt->execute();
			if($x){
				echo '{"correct":{"text":"Update Correct"}}';
			}else{
				echo '{"error":{"text":"Campos introducido incorrecto"}}';
			}
		}
		catch(PDOException $e) {
			echo '{"error":{"text":'. $e->getMessage() .'}}';
		}
	});
	$app->put('/modifyDescriptionTask', function ($request) {
		$task = json_decode($request->getBody());
		$sql = "UPDATE `task` SET `description`= :description WHERE `id` = :id";
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam("description", $task->description);
			$stmt->bindParam("id", $task->id);
			$x = $stmt->execute();
			if($x){
				echo '{"correct":{"text":"Update Correct"}}';
			}else{
				echo '{"error":{"text":"Campos introducido incorrecto"}}';
			}
		}
		catch(PDOException $e) {
			echo '{"error":{"text":'. $e->getMessage() .'}}';
		}
	});

	$app->run();
?>