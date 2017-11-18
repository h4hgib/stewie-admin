<?php
/**
 * Handles all DB connections
 */
class Db {
    /**
     * DB connection details
     */
    private $dbHost = '...';
    private $dbName = '...';
    private $dbUser = '...';
    private $dbPass = '...';

    public $dbh   = null;
    public $dbTbl = array(
        'child' => 'child',
        'user'  => 'user'
    );

    function __construct() {
        if(isset($_SERVER['SERVER_NAME']) && $_SERVER['SERVER_NAME'] == 'supercars.local') {
            $this->dbHost = 'localhost';
            $this->dbName = 'childline';
            $this->dbUser = 'root';
            $this->dbPass = '';
        }
    }

    /**
     * Store the sql command and statement
     */
    public $sql;
    private $stmt;

    /**
     * Open a DB connection
     */
    public function getDb() {
        if($this->dbh===null) {
            //if($_SERVER['SERVER_ADDR']==='127.0.0.1') {
                //$this->dbh = new PDO("mysql:host=$this->LdbHost;dbname=$this->LdbName", $this->LdbUser, $this->LdbPass);
            //} else {
                $this->dbh = new PDO("mysql:host=$this->dbHost;dbname=$this->dbName", $this->dbUser, $this->dbPass);
            //}
        }
        return $this->dbh;
    }

    /**
     * Perform a fetchAll query
     *
     * @param $arr Array The values to bind to the execute statement
     */
    public function fetchAll($arr = array()) {
        $this->execute($arr);
        $res = $this->stmt->fetchAll();

        return $res;
    }

    /**
     * Perform a fetch query
     *
     * @param $arr Array The values to bind to the execute statement
     */
    public function fetch($arr = array()) {
        $this->execute($arr);
        $res = $this->stmt->fetch();

        return $res;
    }

    /**
     * Execute a query
     *
     * @param $arr Array The values to bind to the execute statement
     */
    public function execute($arr = array()) {
        $this->getDb();

        $this->stmt = $this->dbh->prepare($this->sql);

        return $this->stmt->execute($arr);
    }

    /**
     * Get the last insert ID
     *
     * @return Int The ID value of the last inserted row
     */
    public function getLastInsertId() {
        return $this->dbh->lastInsertId();
    }

    /**
     * Open up the errorInfo call to public
     */
    public function errorInfo() {
        return $this->dbh->errorInfo();
    }
}
