<?php
header('Access-Control-Allow-Origin: http://localhost:3000', false);
require('classes/class.db.php');
require('classes/class.childline.php');

$supercars = new Childline();
