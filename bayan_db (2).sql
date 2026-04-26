-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : dim. 26 avr. 2026 à 12:50
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `bayan_db`
--

-- --------------------------------------------------------

--
-- Structure de la table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `commentaires`
--

CREATE TABLE `commentaires` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `ticket_id` bigint(20) UNSIGNED DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `contenu` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `commentaires`
--

INSERT INTO `commentaires` (`id`, `created_at`, `updated_at`, `ticket_id`, `user_id`, `contenu`) VALUES
(1, '2026-04-25 15:44:02', '2026-04-25 15:44:02', 3, 3, 'c bien');

-- --------------------------------------------------------

--
-- Structure de la table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `messages`
--

CREATE TABLE `messages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `sender_id` bigint(20) UNSIGNED NOT NULL,
  `receiver_id` bigint(20) UNSIGNED NOT NULL,
  `contenu` text NOT NULL,
  `fichier_nom` varchar(255) DEFAULT NULL,
  `fichier_taille` varchar(255) DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `lu` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `messages`
--

INSERT INTO `messages` (`id`, `sender_id`, `receiver_id`, `contenu`, `fichier_nom`, `fichier_taille`, `file_path`, `lu`, `created_at`, `updated_at`) VALUES
(1, 3, 1, 'Fichier joint', 'Screenshot 2026-03-31 151714.png', '239 Ko', 'messages/Screenshot 2026-03-31 151714.png', 0, '2026-04-25 15:12:18', '2026-04-25 15:12:18'),
(2, 3, 1, 'SALUT', NULL, NULL, NULL, 0, '2026-04-25 15:12:40', '2026-04-25 15:12:40'),
(3, 3, 2, 'cc', NULL, NULL, NULL, 1, '2026-04-25 16:09:45', '2026-04-25 16:11:52'),
(4, 2, 3, 'c bien', NULL, NULL, NULL, 1, '2026-04-25 16:11:58', '2026-04-25 16:12:14'),
(5, 3, 2, 'Fichier joint', 'Screenshot 2026-03-31 161030.png', '337 Ko', 'messages/Screenshot 2026-03-31 161030.png', 1, '2026-04-25 16:12:56', '2026-04-25 16:13:16'),
(6, 2, 3, 'c bien', NULL, NULL, NULL, 1, '2026-04-25 16:56:02', '2026-04-25 16:58:52'),
(7, 2, 3, 'merci', NULL, NULL, NULL, 1, '2026-04-25 16:56:08', '2026-04-25 16:58:52'),
(8, 2, 3, 'Fichier joint', 'Screenshot 2026-03-31 150836.png', '272 Ko', 'messages/QOb8J0DyUyUWli3bR1bXmYRa50J54JzysJOc2ift.png', 1, '2026-04-25 17:20:30', '2026-04-25 17:30:41'),
(9, 3, 2, 'Fichier joint', 'Screenshot 2026-03-31 204128.png', '83 Ko', 'messages/7puHzXHxeerYu8IsJXn7s3ye1eVBshk7cN98EQMB.png', 1, '2026-04-25 17:31:39', '2026-04-25 17:32:05'),
(10, 2, 3, 'Fichier joint', 'Commentaire.php', '1 Ko', 'messages/WRZT4hheUImFBX1CH4eHGvfNICIbxqVEVUqy3A4s', 1, '2026-04-25 17:32:22', '2026-04-25 17:32:59'),
(11, 3, 2, 'Fichier joint', 'CV aya sail.pdf', '107 Ko', 'messages/fNwwYcTjwOGwqPDbSDAGoBC0bAtBuS3lhUWEjIxX.pdf', 1, '2026-04-25 17:42:25', '2026-04-25 22:12:51'),
(12, 3, 4, 'salut', NULL, NULL, NULL, 1, '2026-04-25 18:00:10', '2026-04-25 21:24:47'),
(13, 3, 4, 'salut', NULL, NULL, NULL, 1, '2026-04-25 18:00:16', '2026-04-25 21:24:47'),
(14, 3, 4, 'Fichier joint', 'steven.jpg', '23 Ko', 'messages/UlyxMfNryXNR9nKDr60A2FZh4wJPmmWORE1Zz04R.jpg', 1, '2026-04-25 18:00:32', '2026-04-25 21:24:47'),
(15, 3, 6, 'salut', NULL, NULL, NULL, 1, '2026-04-25 18:03:41', '2026-04-25 22:15:51'),
(16, 4, 3, 'merci', NULL, NULL, NULL, 1, '2026-04-25 21:25:48', '2026-04-25 21:26:03'),
(17, 2, 4, 'salut', NULL, NULL, NULL, 1, '2026-04-25 22:13:09', '2026-04-25 22:13:53'),
(18, 2, 4, 's', NULL, NULL, NULL, 1, '2026-04-25 22:13:14', '2026-04-25 22:13:53'),
(19, 3, 6, 'Fichier joint', 'WhatsApp Image 2026-02-08 at 21.55.60.jpeg', '173 Ko', 'messages/HlbEZwAsanv4kd4zTmyrb1Yd3OSR8qj1B9Q10ZG7.jpg', 1, '2026-04-25 22:15:21', '2026-04-25 22:15:51');

-- --------------------------------------------------------

--
-- Structure de la table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_04_24_214135_create_tickets_table', 1),
(5, '2026_04_24_214142_create_commentaires_table', 1),
(6, '2026_04_24_214637_create_personal_access_tokens_table', 1),
(7, '2026_04_25_142534_create_messages_table', 1);

-- --------------------------------------------------------

--
-- Structure de la table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `tickets`
--

CREATE TABLE `tickets` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `titre` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `service` varchar(255) NOT NULL,
  `priorite` enum('normal','urgent') NOT NULL DEFAULT 'normal',
  `statut` enum('attente','cours','resolu') NOT NULL DEFAULT 'attente',
  `created_by` bigint(20) UNSIGNED NOT NULL,
  `assigned_to` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `tickets`
--

INSERT INTO `tickets` (`id`, `titre`, `description`, `service`, `priorite`, `statut`, `created_by`, `assigned_to`, `created_at`, `updated_at`) VALUES
(1, 'Panne serveur principal', NULL, 'Informatique', 'normal', 'cours', 5, 4, '2026-04-25 13:37:00', '2026-04-25 15:51:43'),
(2, 'Remboursement médical', NULL, 'RH', 'normal', 'attente', 5, NULL, '2026-04-25 13:37:00', '2026-04-25 13:37:00'),
(3, 'Livraison manquante', NULL, 'Logistique', 'normal', 'resolu', 6, 2, '2026-04-25 13:37:00', '2026-04-25 13:37:00'),
(4, 'Accès refusé CRM', NULL, 'Informatique', 'urgent', 'cours', 4, 4, '2026-04-25 13:37:00', '2026-04-25 13:37:00'),
(5, 'Facture incorrecte', NULL, 'Finance', 'normal', 'attente', 6, NULL, '2026-04-25 13:37:00', '2026-04-25 13:37:00'),
(6, 'Climatisation en panne', NULL, 'Externe', 'normal', 'resolu', 5, 6, '2026-04-25 13:37:00', '2026-04-25 13:37:00'),
(7, 'Stock insuffisant', NULL, 'Logistique', 'urgent', 'cours', 2, 2, '2026-04-25 13:37:00', '2026-04-25 13:37:00'),
(8, 'Badge accès refusé', NULL, 'RH', 'urgent', 'cours', 4, NULL, '2026-04-25 13:37:00', '2026-04-25 13:37:00');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nom` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','responsable','employe','intervenant') NOT NULL DEFAULT 'employe',
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `nom`, `email`, `password`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Ahmed Ataki', 'ahmed@bayan.ma', '$2y$12$k/5GqAYW01phoAuoLuTUPOgwNnWcp1QmvuCU5Poj1K9H.gwDXBne6', 'admin', NULL, '2026-04-25 13:37:00', '2026-04-25 13:37:00'),
(2, 'Karim Alami', 'karim@bayan.ma', '$2y$12$lHMfBudoRym8lYH7IWjikemZdgok1oMqhZIJoc9ojpcq5hHhw3BG2', 'responsable', NULL, '2026-04-25 13:37:00', '2026-04-25 13:37:00'),
(3, 'Aya Saïl', 'aya@bayan.ma', '$2y$12$yWN4IwblfcOohviaPVUf7u9A37L33fUzERF/8C4djQwd4hRQ/mjIO', 'responsable', NULL, '2026-04-25 13:37:00', '2026-04-25 13:37:00'),
(4, 'Zakaria Achraf', 'zakaria@bayan.ma', '$2y$12$0vNRhOL2gzKpvl4Vl0KzDO5rjQ9QInIAbo0hKYT0qR7HO2JbYwA3a', 'employe', NULL, '2026-04-25 13:37:00', '2026-04-25 13:37:00'),
(5, 'Sarah Lemarié', 'sarah@bayan.ma', '$2y$12$AU5h6p7CIclutlGxq8f5V.xvEVhUkLSoX4poMmkKLkIJc2SDzDx3K', 'employe', NULL, '2026-04-25 13:37:00', '2026-04-25 13:37:00'),
(6, 'Omar Almsaddek', 'omar@bayan.ma', '$2y$12$SmUt.GDM4wGFCJmZAunzv.ru.3s09sb8T2kqetpfEXkBlkPYHZjRG', 'employe', NULL, '2026-04-25 13:37:00', '2026-04-25 13:37:00'),
(7, 'Intervenant Test', 'intervenant@bayan.ma', '$2y$12$xkdrQEZqnKk2tWwY1Wdu9ulV/qukWpR530vmdATWljqB8LkHWf6Pe', 'intervenant', NULL, '2026-04-25 13:37:00', '2026-04-25 13:37:00');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Index pour la table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Index pour la table `commentaires`
--
ALTER TABLE `commentaires`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_ticket` (`ticket_id`),
  ADD KEY `fk_user` (`user_id`);

--
-- Index pour la table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Index pour la table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Index pour la table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `messages_sender_id_foreign` (`sender_id`),
  ADD KEY `messages_receiver_id_foreign` (`receiver_id`);

--
-- Index pour la table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Index pour la table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Index pour la table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Index pour la table `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tickets_created_by_foreign` (`created_by`),
  ADD KEY `tickets_assigned_to_foreign` (`assigned_to`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `commentaires`
--
ALTER TABLE `commentaires`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT pour la table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `commentaires`
--
ALTER TABLE `commentaires`
  ADD CONSTRAINT `fk_ticket` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_receiver_id_foreign` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_sender_id_foreign` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `tickets`
--
ALTER TABLE `tickets`
  ADD CONSTRAINT `tickets_assigned_to_foreign` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `tickets_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
