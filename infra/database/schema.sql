-- =================================
-- Makeoo DIYプラットフォーム データベーススキーマ
-- MySQL 8.0 対応、完全正規化設計
-- =================================

-- データベース作成
CREATE DATABASE IF NOT EXISTS makeoo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE makeoo_db;

-- =================================
-- 1. ユーザー管理テーブル
-- =================================

-- ユーザーテーブル
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    bio TEXT,
    avatar_url VARCHAR(500),
    location VARCHAR(100),
    website_url VARCHAR(500),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
);

-- =================================
-- 2. カテゴリ・タグ管理
-- =================================

-- カテゴリテーブル
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    icon_name VARCHAR(50),
    color_code VARCHAR(7) DEFAULT '#22c55e',
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_sort_order (sort_order)
);

-- タグテーブル
CREATE TABLE tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL UNIQUE,
    slug VARCHAR(30) NOT NULL UNIQUE,
    usage_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_usage_count (usage_count DESC)
);

-- =================================
-- 3. レシピ管理テーブル
-- =================================

-- レシピテーブル（メイン）
CREATE TABLE recipes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(250) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    thumbnail_url VARCHAR(500),
    difficulty ENUM('beginner', 'intermediate', 'advanced') NOT NULL,
    estimated_time_minutes INT NOT NULL,
    category_id INT NOT NULL,
    author_id BIGINT NOT NULL,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    featured BOOLEAN DEFAULT FALSE,
    views_count INT DEFAULT 0,
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    published_at TIMESTAMP NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_slug (slug),
    INDEX idx_status_published (status, published_at),
    INDEX idx_category_id (category_id),
    INDEX idx_author_id (author_id),
    INDEX idx_difficulty (difficulty),
    INDEX idx_featured (featured),
    INDEX idx_likes_count (likes_count DESC),
    INDEX idx_views_count (views_count DESC),
    INDEX idx_created_at (created_at DESC)
);

-- レシピ材料テーブル
CREATE TABLE recipe_materials (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    recipe_id BIGINT NOT NULL,
    name VARCHAR(200) NOT NULL,
    quantity VARCHAR(100),
    notes TEXT,
    sort_order INT DEFAULT 0,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    INDEX idx_recipe_id (recipe_id),
    INDEX idx_sort_order (sort_order)
);

-- レシピ道具テーブル
CREATE TABLE recipe_tools (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    recipe_id BIGINT NOT NULL,
    name VARCHAR(200) NOT NULL,
    is_essential BOOLEAN DEFAULT TRUE,
    notes TEXT,
    sort_order INT DEFAULT 0,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    INDEX idx_recipe_id (recipe_id),
    INDEX idx_sort_order (sort_order)
);

-- レシピ手順テーブル
CREATE TABLE recipe_steps (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    recipe_id BIGINT NOT NULL,
    step_number INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(500),
    tip TEXT,
    estimated_time_minutes INT,
    sort_order INT DEFAULT 0,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    INDEX idx_recipe_id (recipe_id),
    INDEX idx_step_number (step_number),
    UNIQUE KEY unique_recipe_step (recipe_id, step_number)
);

-- レシピタグ関連テーブル（多対多）
CREATE TABLE recipe_tags (
    recipe_id BIGINT NOT NULL,
    tag_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (recipe_id, tag_id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    INDEX idx_tag_id (tag_id)
);

-- =================================
-- 4. インタラクション管理
-- =================================

-- いいねテーブル
CREATE TABLE recipe_likes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    recipe_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_recipe_user_like (recipe_id, user_id),
    INDEX idx_recipe_id (recipe_id),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at DESC)
);

-- コメントテーブル
CREATE TABLE recipe_comments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    recipe_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    parent_comment_id BIGINT NULL,
    content TEXT NOT NULL,
    likes_count INT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_comment_id) REFERENCES recipe_comments(id) ON DELETE CASCADE,
    INDEX idx_recipe_id (recipe_id),
    INDEX idx_user_id (user_id),
    INDEX idx_parent_comment_id (parent_comment_id),
    INDEX idx_created_at (created_at DESC)
);

-- コメントいいねテーブル
CREATE TABLE comment_likes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    comment_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (comment_id) REFERENCES recipe_comments(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_comment_user_like (comment_id, user_id),
    INDEX idx_comment_id (comment_id),
    INDEX idx_user_id (user_id)
);

-- =================================
-- 5. 統計・分析テーブル
-- =================================

-- ページビュー記録テーブル
CREATE TABLE recipe_views (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    recipe_id BIGINT NOT NULL,
    user_id BIGINT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    referrer VARCHAR(500),
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_recipe_id (recipe_id),
    INDEX idx_user_id (user_id),
    INDEX idx_viewed_at (viewed_at),
    INDEX idx_ip_address (ip_address)
);

-- 統計サマリーテーブル（パフォーマンス最適化用）
CREATE TABLE daily_stats (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    date DATE NOT NULL,
    total_recipes INT DEFAULT 0,
    total_users INT DEFAULT 0,
    total_views INT DEFAULT 0,
    total_likes INT DEFAULT 0,
    total_comments INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_date (date),
    INDEX idx_date (date DESC)
);

-- =================================
-- 6. 初期データ投入
-- =================================

-- カテゴリ初期データ
INSERT INTO categories (name, slug, description, icon_name, color_code, sort_order) VALUES
('ガーデニング', 'gardening', '植物やガーデン関連のDIYプロジェクト', 'leaf', '#22c55e', 1),
('衣類・アクセサリー', 'clothing-accessories', '古着リメイクやアクセサリー制作', 'shirt', '#3b82f6', 2),
('家具・インテリア', 'furniture-interior', '家具制作やインテリアデザイン', 'home', '#f97316', 3),
('収納・整理', 'storage-organization', '収納ボックスや整理用品の制作', 'archive', '#6b7280', 4),
('ライト・照明', 'lighting', '照明器具やキャンドルホルダーなど', 'lightbulb', '#fbbf24', 5);

-- タグ初期データ
INSERT INTO tags (name, slug) VALUES
('エコ', 'eco'),
('リサイクル', 'recycle'),
('初心者', 'beginner'),
('中級', 'intermediate'),
('上級', 'advanced'),
('ペットボトル', 'pet-bottle'),
('古着', 'used-clothes'),
('廃材', 'waste-materials'),
('木工', 'woodwork'),
('裁縫', 'sewing');

-- ダミーユーザー作成
INSERT INTO users (username, email, password_hash, display_name, bio, is_verified) VALUES
('yamada_taro', 'yamada@example.com', '$2b$12$dummy_hash_1', '山田太郎', 'DIY初心者ですが、頑張って投稿しています！', TRUE),
('sato_hanako', 'sato@example.com', '$2b$12$dummy_hash_2', '佐藤花子', '古着リメイクが得意です。環境に優しいDIYを心がけています。', TRUE),
('tanaka_kazuya', 'tanaka@example.com', '$2b$12$dummy_hash_3', '田中和也', '木工職人です。廃材を使った家具作りを教えています。', TRUE),
('suzuki_mika', 'suzuki@example.com', '$2b$12$dummy_hash_4', '鈴木みか', '手芸が趣味です。小物作りが得意です。', FALSE),
('takahashi_ichiro', 'takahashi@example.com', '$2b$12$dummy_hash_5', '高橋一郎', '収納の専門家です。整理整頓のコツをシェアします。', TRUE),
('nakamura_sakura', 'nakamura@example.com', '$2b$12$dummy_hash_6', '中村さくら', 'インテリアデザイナーです。おしゃれなDIYを提案します。', TRUE);

-- =================================
-- 7. パフォーマンス最適化設定
-- =================================

-- レシピ検索用フルテキストインデックス
ALTER TABLE recipes ADD FULLTEXT(title, description);

-- トリガー：いいね数の自動更新
DELIMITER //
CREATE TRIGGER update_recipe_likes_count 
AFTER INSERT ON recipe_likes
FOR EACH ROW
BEGIN
    UPDATE recipes SET likes_count = likes_count + 1 WHERE id = NEW.recipe_id;
END //

CREATE TRIGGER update_recipe_likes_count_delete
AFTER DELETE ON recipe_likes
FOR EACH ROW
BEGIN
    UPDATE recipes SET likes_count = likes_count - 1 WHERE id = OLD.recipe_id;
END //

-- トリガー：コメント数の自動更新
CREATE TRIGGER update_recipe_comments_count
AFTER INSERT ON recipe_comments
FOR EACH ROW
BEGIN
    UPDATE recipes SET comments_count = comments_count + 1 WHERE id = NEW.recipe_id;
END //

CREATE TRIGGER update_recipe_comments_count_delete
AFTER DELETE ON recipe_comments
FOR EACH ROW
BEGIN
    UPDATE recipes SET comments_count = comments_count - 1 WHERE id = OLD.recipe_id;
END //

-- トリガー：タグ使用数の自動更新
CREATE TRIGGER update_tag_usage_count
AFTER INSERT ON recipe_tags
FOR EACH ROW
BEGIN
    UPDATE tags SET usage_count = usage_count + 1 WHERE id = NEW.tag_id;
END //

CREATE TRIGGER update_tag_usage_count_delete
AFTER DELETE ON recipe_tags
FOR EACH ROW
BEGIN
    UPDATE tags SET usage_count = usage_count - 1 WHERE id = OLD.tag_id;
END //
DELIMITER ;

-- =================================
-- 8. 分析クエリの例
-- =================================

-- 人気レシピTop10
-- SELECT r.id, r.title, r.likes_count, r.views_count, u.display_name as author, c.name as category
-- FROM recipes r
-- JOIN users u ON r.author_id = u.id
-- JOIN categories c ON r.category_id = c.id
-- WHERE r.status = 'published'
-- ORDER BY r.likes_count DESC, r.views_count DESC
-- LIMIT 10;

-- カテゴリ別レシピ数
-- SELECT c.name, COUNT(r.id) as recipe_count
-- FROM categories c
-- LEFT JOIN recipes r ON c.id = r.category_id AND r.status = 'published'
-- GROUP BY c.id, c.name
-- ORDER BY recipe_count DESC;

-- ユーザー別投稿数
-- SELECT u.display_name, COUNT(r.id) as recipe_count, AVG(r.likes_count) as avg_likes
-- FROM users u
-- LEFT JOIN recipes r ON u.id = r.author_id AND r.status = 'published'
-- GROUP BY u.id, u.display_name
-- HAVING recipe_count > 0
-- ORDER BY recipe_count DESC; 