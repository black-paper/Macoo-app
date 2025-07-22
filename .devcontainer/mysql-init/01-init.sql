-- Makeoo データベース初期化スクリプト
-- 文字セットとタイムゾーンの設定
SET NAMES utf8mb4;
SET time_zone = '+09:00';

-- 開発用データベースの作成（既にdocker-composeで作成済みだが念のため）
CREATE DATABASE IF NOT EXISTS makeoo_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- テスト用データベースの作成
CREATE DATABASE IF NOT EXISTS makeoo_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 開発用ユーザーに権限付与
GRANT ALL PRIVILEGES ON makeoo_dev.* TO 'dev'@'%';
GRANT ALL PRIVILEGES ON makeoo_test.* TO 'dev'@'%';
FLUSH PRIVILEGES;

-- 開発用データベースを使用
USE makeoo_dev;

-- 基本的なテーブル構造を作成（マイグレーションで管理する予定だが開発用に）
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_username (username)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS recipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    materials JSON,
    steps JSON,
    image_urls JSON,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    view_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_recipes_user_id (user_id),
    INDEX idx_recipes_status (status),
    INDEX idx_recipes_created_at (created_at),
    FULLTEXT idx_recipes_search (title, description)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipe_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_comments_recipe_id (recipe_id),
    INDEX idx_comments_user_id (user_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipe_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_recipe_user (recipe_id, user_id),
    INDEX idx_likes_recipe_id (recipe_id),
    INDEX idx_likes_user_id (user_id)
) ENGINE=InnoDB;

-- 開発用サンプルデータ
INSERT INTO users (email, username, password_hash) VALUES
('test@example.com', 'testuser', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPh7B6fJ7/.kG'), -- password: "testpass123"
('demo@makeoo.com', 'demouser', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPh7B6fJ7/.kG')
ON DUPLICATE KEY UPDATE email = VALUES(email);

INSERT INTO recipes (user_id, title, description, materials, steps, status) VALUES
(1, 'シンプルな木製本立て', 'DIY初心者でも簡単に作れる木製の本立てです。', 
 '["木材（2×4材） 30cm 2本", "木材（1×6材） 20cm 1本", "木ネジ 4本", "サンドペーパー", "木工用ボンド"]',
 '["材料をカットする", "サンドペーパーで表面を滑らかにする", "ボンドで仮固定", "ネジで本固定", "仕上げ研磨"]',
 'published'),
(1, 'エコな鉢カバー', 'ペットボトルをリサイクルした植物の鉢カバー', 
 '["2Lペットボトル 1本", "アクリル絵の具", "ハケ", "カッター", "サンドペーパー"]',
 '["ペットボトルを適切なサイズにカット", "切り口を滑らかに処理", "デザインを描く", "絵の具で着色", "乾燥させて完成"]',
 'published')
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- テーブルの確認
SHOW TABLES;

-- 作成されたテーブルの構造確認
DESCRIBE users;
DESCRIBE recipes;
DESCRIBE comments;
DESCRIBE likes; 