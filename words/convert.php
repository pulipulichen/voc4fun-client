<?php

$file_path = "database_t.csv";

$contents = file_get_contents($file_path);

$lines = explode("\r\n", $contents);

foreach ($lines as $index => $line) {
	
	
	if ($index === 0) {
		continue;
	}
	
	//if ($index < 2647) {
	//	continue;
	//}
	
	$values = explode("\t" , $line);
	
	$question_chinese = urlencode($values[0]);
	if (trim($question_chinese) === "") {
		continue;
	}
	
	$question_english = $values[1];
	$options = array($values[2], $values[3], $values[4]);
	
	$json_array = array(
		"word_chinese" => $question_chinese,
		"word_english" => $question_english,
		"test_options" => $options,
	);
	
	//$json_array = urlencode($json_array);
	$json = json_encode($json_array);
	$json = urldecode($json);
	//print_r($json);
	$filename = "word_" . $index . ".js";
	
	file_put_contents($filename, $json);
	
	//break;
}