<?php
header("Content-type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");
header("Access-Control-Allow-Headers: *");

$rest_json = file_get_contents("php://input");
$_POST = json_decode($rest_json, true);

include 'db_connnection.php';

$conn = OpenCon();

if (empty($_POST['fname']) && empty($_POST['lname']) && empty($_POST['nrPers']) && empty($_POST['phoneNr'])) die();

if ($_POST) {
    // set response code - 200 OK
    http_response_code(200);
    // gather data
    $fname = $_POST['fname'];
    $lname = $_POST['lname'];
    $nrPers = $_POST['nrPers'];
    $tableNr = $_POST['tableNr'];
    $phoneNr = $_POST['phoneNr'];

    // setup Query
    $stmt = $conn->prepare("INSERT INTO gaeste (Vorname, Nachname, TischNr, AnzahlPersonen, TelNr) VALUES (?, ?, ?, ?, ?)");

    $stmt->bind_param("sssss", $fname, $lname, $tableNr, $nrPers, $phoneNr);

    if ($stmt->execute() === TRUE) {
        // echo json_encode( $_POST );
        echo json_encode(array(
            "sent" => true
        ));
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
        echo json_encode("$conn->error");
    }
} else {

    // tell the user about error
    echo json_encode(["sent" => false, "message" => "Something went wrong"]);
}

CloseCon($conn);
