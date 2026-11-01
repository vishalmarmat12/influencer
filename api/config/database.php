<?php
require_once __DIR__ . '/env.php';

class Database {
    private $host;
    private $port;
    private $db_name;
    private $username;
    private $password;
    public $conn;

    public function __construct() {
        $this->host = env('DB_HOST', 'localhost');
        $this->port = env('DB_PORT', '3306');
        $this->db_name = env('DB_NAME', 'influencer_connect');
        $this->username = env('DB_USER', env('DB_USERNAME', 'root'));
        $this->password = env('DB_PASS', env('DB_PASSWORD', ''));
    }

    public function getConnection() {
        $this->conn = null;
        try {
            $dsn = "mysql:host=" . $this->host . ";port=" . $this->port . ";dbname=" . $this->db_name . ";charset=utf8mb4";
            $this->conn = new PDO(
                $dsn,
                $this->username,
                $this->password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                    PDO::ATTR_TIMEOUT => 1
                ]
            );
        } catch(PDOException $exception) {
            // Attempt auto initialization only if MySQL server responded (e.g. database not found 1049)
            if ($exception->getCode() === 1049 && file_exists(__DIR__ . '/../init_db.php')) {
                require_once __DIR__ . '/../init_db.php';
                $this->conn = initDatabase();
            }
        }
        return $this->conn;
    }
}
