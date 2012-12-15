<?php
define('_PATH_','./img/');

$url = $_GET['url'];
$path =  explode('/',$url);
$file_name =  $path[count($path)-1];
$ext = pathinfo($file_name, PATHINFO_EXTENSION);

$img = _PATH_.sprintf("%s.%s",SHA1($file_name),$ext);
file_put_contents($img, file_get_contents($url));

$fp = fopen($img, 'rb');
header("Content-Type: image/png");
header("Content-Length: " . filesize($img));
fpassthru($fp);
exit;

?>
