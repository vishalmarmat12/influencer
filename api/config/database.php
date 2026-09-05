<?php
class Database {
    private $host = "localhost";
    private $db_name = "influencer_connect";
    private $username = "root";
    private $password = "";
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4",
                $this->username,
                $this->password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                ]
            );
        } catch(PDOException $exception) {
            // Attempt auto initialization
            if (file_exists(__DIR__ . '/../init_db.php')) {
                require_once __DIR__ . '/../init_db.php';
                $this->conn = initDatabase();
            }
        }
        return $this->conn;
    }
}
