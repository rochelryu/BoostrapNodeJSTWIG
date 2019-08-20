<?php

	$to = "";  // Your email here
	$from = $_REQUEST['requestemail'];
	$name = $_REQUEST['requestname'];
	$phone = $_REQUEST['requestphone'];
	$headers = "From: $from";
	$date = $_REQUEST['requestdate'];
	$time = $_REQUEST['requesttime'];
	$service = $_REQUEST['requestservice'];
	$subject = "Request Form from Clinic Website";

	$fields = array();
	$fields{"requestname"} = "First name";
	$fields{"requestemail"} = "Email";
	$fields{"requestphone"} = "Phone";
	$fields{"requestdate"} = "Date";
	$fields{"requesttime"} = "Time";
	$fields{"requestservice"} = "Service";

	$body = "Here is what was sent:\n\n";
	foreach($fields as $a => $b){
		$body .= sprintf("%20s:%s\r\n",$b,$_REQUEST[$a]);
	}
	$send = mail($to, $subject, $body, $headers);

?>
