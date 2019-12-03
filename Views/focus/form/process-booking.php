<?php

	$to = "";  // Your email here
	$from = $_REQUEST['bookingemail'];
	$name = $_REQUEST['bookingname'];
	$phone = $_REQUEST['bookingphone'];
	$headers = "From: $from";
	$date = $_REQUEST['bookingdate'];
	$time = $_REQUEST['bookingtime'];
	$service = $_REQUEST['bookingservice'];
	$age = $_REQUEST['bookingage'];
	$message = $_REQUEST['bookingmessage'];
	$subject = "Booking Form from Clinic Website";

	$fields = array();
	$fields{"bookingname"} = "First name";
	$fields{"bookingemail"} = "Email";
	$fields{"bookingphone"} = "Phone";
	$fields{"bookingdate"} = "Date";
	$fields{"bookingtime"} = "Time";
	$fields{"bookingservice"} = "Service";
	$fields{"bookingage"} = "Age";
	$fields{"bookingmessage"} = "Message";

	$body = "Here is what was sent:\n\n";
	foreach($fields as $a => $b){
		$body .= sprintf("%20s:%s\r\n",$b,$_REQUEST[$a]);
	}
	$send = mail($to, $subject, $body, $headers);

?>
