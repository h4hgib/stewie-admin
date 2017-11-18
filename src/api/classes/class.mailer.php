<?php
require_once 'PHPMailerAutoload.php';

require('class.PHPMailer.php');
require('class.SMTP.php');

class CreativeAnimalMail {
    /**
     * Email details
     */
    private $user     = 'info@supercars.gi';
    private $pass     = 'c3r4m1cpr0';
    private $host     = 'sub5.mail.dreamhost.com';

    /** 
     * Other random details for this company
     */
    private $userName = 'Supercars.gi';
    private $url      = 'http://www.supercars.gi/';
    private $logo     = 'http://www.supercars.gi/images/supercarsLogo3.png';

    // Any error details for debugging
    private $error;

    function __construct($toEmail, $toName, $subject, $message) {
        $mail = new PHPMailer;
        $mail->setFrom($this->user, $this->user);
        $mail->addAddress($toEmail, $toName);
        $mail->Subject  = $subject;
        //$mail->Body     = $body;

        $mail->AltBody = "To view the message, please use an HTML compatible email viewer.";

        $mail->MsgHTML('<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>'.$this->userName.'</title>
</head>
<body>
    <table border="0">
        <tr>
            <td><a href="'.$this->url.'"><img src="'.$this->logo.'"></a></td>
        </tr>
        <tr>
            <td>
                Dear '.$toName.',
                <br><br>
                '.$message.'
            </td>
        </tr>
    </table>
</body>
</html>');

        $mail->IsSMTP();

        $mail->SMTPAuth   = true;
        $mail->Username   = $this->user;
        $mail->Password   = $this->pass;
        //$mail->SMTPSecure = 'tls';
        $mail->Host       = $this->host;
        $mail->Port       = 25;
        //$mail->SMTPDebug  = 2; // Output server chat

        $this->error = $mail->ErrorInfo;

        $res = $mail->send();
//var_dump($res);
//var_dump($mail->ErrorInfo);
//die();
        return $res;
    }

    /**
     * Retun any errors
     */
    public function getErrors() {
        return $this->error;
    }
}