<?php
header('Content-Type: text/html; charset=utf-8');
/**
 * Handles all supercars app behaviour
 */
class Childline {
    /**
     * The output to convert to json and send
     */
    private $output = array(
        'success' => null
    );

    /**
     * The local database object
     */
    private $db;

    /**
     * The session ID for logged in admin users
     */
    private $sessionId;

    /**
     * List of valid commands and their functions
     */
    private $commands = array(

    );

    function __construct() {
        $this->openSession();
        $this->openDb();
    }

    /**
     * Process the current command
     */
    public function process() {
        $call = $this->getData('p');

        if(method_exists($this, $call)) {
            $this->$call();
        } else {
            $this->output = array(
                'success' => false,
                'key'     => 'eeek'
            );

            $this->renderOutput();
        }
    }

    /**
     * Attempt to log a user in
     */
    public function login() {
        $this->db->sql = 'SELECT * FROM '.$this->db->dbTbl['users'].' WHERE username = :username LIMIT 1';

        $user = $this->db->fetch(array(
            ':username' => $this->getData('un')
        ));

        if($user['hash'] === $this->hashPw($user['salt'], $this->getData('pw'))) {
            $this->sessionId   = md5($user['id']);
            $_SESSION['user']  = $user['username'];
            $_SESSION['valid'] = true;
            $this->output = array(
                'success' => true,
                'sKey'    => $this->sessionId
            );
        } else {
            $this->logout();
            $this->output = array(
                'success' => false,
                'key'     => 'WfzBq'
            );
        }

        $this->renderOutput();
    }


    /**
     * Save a new contact form submission
     */
    public function contact() {
        $this->db->sql = 'INSERT INTO '.$this->db->dbTbl['contact'].' (name, email, phone, message) VALUES (:name, :email, :phone, :message)';

        $res = $this->db->execute(array(
            ':name'    => $this->getData('name'),
            ':email'   => $this->getData('email'),
            ':phone'   => $this->getData('phone'),
            ':message' => $this->getData('message')
        ));

        if($res === false) {
            $this->output = array(
                'success' => false,
                'key'     => 'sGty6'
            );
        } else {
            $this->output = array(
                'success' => true,
                'key'     => 'gSeD5'
            );
        }

        $message = 'New Message From: '.$this->getData('name').'<br><br>'.'Email: '.$this->getData('email').'<br><br>'.'Phone: '.$this->getData('phone').'<br><br>'.'Message:<br><br>'.nl2br($this->getData('message'));

        require_once 'class.mailer.php';

        $m = new CreativeAnimalMail('stu.tippett@gmail.com', 'Childline Contact', 'New Message', $message);

        $this->renderOutput();
    }

    /**
     * Search for a bound variable (POST / GET etc) and return it
     *
     * @param string $var The variable name to look up
     *
     * @return string The variable, if it exists, or null
     */
    private function getData($var) {
        return isset($_POST[$var]) ? $_POST[$var] : (isset($_GET[$var]) ? $_GET[$var] : null);
    }

    /**
     * Check if a user is logged in
     */
    private function checkValidUser() {
        if(!($this->getData('key') == $this->sessionId && isset($_SESSION['user']) && isset($_SESSION['valid']) && $_SESSION['valid'] === true)) {
            $this->output = array(
                'success' => false,
                'key'     => 'kMIvl'
            );

            // Terminate the call now, user isn't allowed to perform this action
            $this->renderOutput(true);
        }
    }

    /**
     * Render the output and optionally kill the process
     * 
     * @param bool $terminate Whether to force terminate the application
     */
    private function renderOutput($terminate = false) {
        // In case nothing was set - shouldn't happen, but this is the fallback
        if(!isset($this->output['success']) || $this->output['success'] === null) {
            $this->output = array(
                'success' => false,
                'key'     => 'IKDwv'
            );
        }

        echo json_encode($this->output);

        // Stop doing anything else
        if($terminate === true) {
            die();
        }
    }

    /**
     * Generate a random string, using a cryptographically secure 
     * pseudorandom number generator (random_int)
     * 
     * For PHP 7, random_int is a PHP core function
     * For PHP 5.x, depends on https://github.com/paragonie/random_compat
     * 
     * @param int $length How many characters do we want?
     * @param string $keyspace A string of all possible characters to select from
     *
     * @return string
     *
     * Thanks http://stackoverflow.com/questions/4356289/php-random-string-generator/31107425#31107425
     */
    function getNewSalt($length, $keyspace = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'){
        $str = '';
        $max = mb_strlen($keyspace, '8bit') - 1;
        for ($i = 0; $i < $length; ++$i) {
            //$str .= $keyspace[random_int(0, $max)]; // Fuck this shit for now, I'm in a hurry, so rand() it is
            $str .= $keyspace[rand(0, $max)];
        }
        return $str;
    }

    /**
     * Hash a password for the database
     *
     * @param string $salt The salt
     * @param string $password The password
     *
     * @return The hash value of the above two strings
     */
    private function hashPw($salt, $password) {
        return md5($salt.$password);
    }

    /**
     * Log out the user and close their session
     */
    private function logout() {
        $_SESSION['user']  = null;
        $_SESSION['valid'] = false;
    }

    /**
     * Open a php session
     */
    private function openSession() {
        $this->sessionId = isset($_POST['key']) ? $_POST['key'] : (isset($_GET['key']) ? $_GET['key'] : 'null');

        if($this->sessionId == 'null' || strlen($this->sessionId) === 0) {
            $this->sessionId = rand(0, 999999999);
        }

        session_id($this->sessionId);
        session_name("gibSession");
        session_start();
    }

    /**
     * Open a database connection
     */
    private function openDb() {
        if(!$this->db) {
            $this->db = new Db();
        }
    }
}