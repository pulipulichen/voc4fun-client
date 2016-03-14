<?php
function read_all_files($root = '.'){ 
  $files  = array('files'=>array(), 'dirs'=>array()); 
  $directories  = array(); 
  $last_letter  = $root[strlen($root)-1]; 
  $root  = ($last_letter == '\\' || $last_letter == '/') ? $root : $root.DIRECTORY_SEPARATOR; 
  
  $directories[]  = $root; 
  
  while (sizeof($directories)) { 
    $dir  = array_pop($directories); 
    if ($handle = opendir($dir)) { 
      while (false !== ($file = readdir($handle))) { 
        if ($file == '.' || $file == '..') { 
          continue; 
        } 
        $file  = $dir.$file; 
        if (is_dir($file)) { 
          $directory_path = $file.DIRECTORY_SEPARATOR; 
          array_push($directories, $directory_path); 
          $files['dirs'][]  = $directory_path; 
        } elseif (is_file($file)) { 
          $files['files'][]  = $file; 
        } 
      } 
      closedir($handle); 
    } 
  } 
  
  return $files; 
} 

$exclude_files = array(
    '.\\cache.manifest',
    '.\\list_files.php'
);

$replace_files = array(
    "lib/onsen/css/ionicons/fonts/ionicons.ttf" => "lib/onsen/css/ionicons/fonts/ionicons.ttf?v=2.0.0",
    "lib/onsen/css/ionicons/fonts/ionicons.woff" => "lib/onsen/css/ionicons/fonts/ionicons.woff?v=2.0.0",
);

$ary = read_all_files();
$files = $ary['files'];

echo "CACHE MANIFEST\n";
foreach ($files AS $file) {
    //echo $file;
    if (in_array($file, $exclude_files) !== FALSE) {
        continue;
    }
    
    $file = substr($file, 2);
    $file = str_replace("\\", "/", $file);
    if (isset($replace_files[$file])) {
        $file = $replace_files[$file];
    }
    echo $file."\n";
}