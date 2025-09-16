# Lectura - Database Schema

This document outlines the database schema for the Lectura application. The database is designed using MySQL and managed via Sequelize ORM.

## Table of Contents

1.  [Users](#users)
2.  [Notes](#notes)
3.  [Files](#files)
4.  [CGPA Semesters](#cgpa_semesters)
5.  [CGPA Courses](#cgpa_courses)
6.  [Admin Actions](#admin_actions)
7.  [Relationships](#relationships)

---

### `users`

Stores user account information.

| Column             | Type                         | Constraints & Notes                                   |
| ------------------ | ---------------------------- | ----------------------------------------------------- |
| `id`               | `INT`                        | **Primary Key**, `AUTO_INCREMENT`                     |
| `email`            | `VARCHAR(255)`               | `NOT NULL`, `UNIQUE`, Indexed                         |
| `password_hash`    | `VARCHAR(255)`               | `NOT NULL`                                            |
| `full_name`        | `VARCHAR(255)`               | `NULLABLE`                                            |
| `university`       | `VARCHAR(255)`               | `NULLABLE`                                            |
| `matric_number`    | `VARCHAR(255)`               | `NULLABLE`                                            |
| `avatar_path`      | `VARCHAR(255)`               | `NULLABLE`, path to user's avatar image               |
| `theme_preference` | `ENUM('light','dark')`       | `NOT NULL`, `DEFAULT 'light'`                         |
| `role`             | `ENUM('user','admin')`       | `NOT NULL`, `DEFAULT 'user'`                          |
| `status`           | `ENUM('active','banned')`    | `NOT NULL`, `DEFAULT 'active'`                        |
| `created_at`       | `TIMESTAMP`                  | `DEFAULT CURRENT_TIMESTAMP`                           |
| `updated_at`       | `TIMESTAMP`                  | `DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` |

---

### `notes`

Stores metadata for each uploaded note.

| Column        | Type                   | Constraints & Notes                                   |
| ------------- | ---------------------- | ----------------------------------------------------- |
| `id`          | `INT`                  | **Primary Key**, `AUTO_INCREMENT`                     |
| `user_id`     | `INT`                  | `NOT NULL`, Foreign Key -> `users.id`, Indexed        |
| `title`       | `VARCHAR(255)`         | `NOT NULL`                                            |
| `course_code` | `VARCHAR(64)`          | `NOT NULL`, Indexed                                   |
| `course_name` | `VARCHAR(255)`         | `NULLABLE`                                            |
| `visibility`  | `ENUM('public','private')` | `NOT NULL`, `DEFAULT 'public'`                      |
| `tags`        | `JSON`                 | `NULLABLE`, stores an array of strings                |
| `created_at`  | `TIMESTAMP`            | `DEFAULT CURRENT_TIMESTAMP`                           |
| `updated_at`  | `TIMESTAMP`            | `DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` |

---

### `files`

Stores information about each individual file associated with a note.

| Column            | Type           | Constraints & Notes                                   |
| ----------------- | -------------- | ----------------------------------------------------- |
| `id`              | `INT`          | **Primary Key**, `AUTO_INCREMENT`                     |
| `note_id`         | `INT`          | `NOT NULL`, Foreign Key -> `notes.id`, Indexed        |
| `filename_original` | `VARCHAR(255)` | `NOT NULL`                                            |
| `file_path`       | `VARCHAR(1024)`| `NOT NULL`, server-relative path to the file          |
| `mimetype`        | `VARCHAR(128)` | `NOT NULL`                                            |
| `filesize_bytes`  | `BIGINT`       | `NOT NULL`                                            |
| `uploaded_at`     | `TIMESTAMP`    | `DEFAULT CURRENT_TIMESTAMP`                           |

---

### `cgpa_semesters`

Stores semester information for the CGPA calculator.

| Column     | Type          | Constraints & Notes                                   |
| ---------- | ------------- | ----------------------------------------------------- |
| `id`       | `INT`         | **Primary Key**, `AUTO_INCREMENT`                     |
| `user_id`  | `INT`         | `NOT NULL`, Foreign Key -> `users.id`, Indexed        |
| `name`     | `VARCHAR(100)`| `NOT NULL`, e.g., "First Semester 2024"               |
| `created_at` | `TIMESTAMP`   | `DEFAULT CURRENT_TIMESTAMP`                           |

---

### `cgpa_courses`

Stores individual course entries for the CGPA calculator.

| Column       | Type            | Constraints & Notes                                   |
| ------------ | --------------- | ----------------------------------------------------- |
| `id`         | `INT`           | **Primary Key**, `AUTO_INCREMENT`                     |
| `semester_id`| `INT`           | `NOT NULL`, Foreign Key -> `cgpa_semesters.id`        |
| `user_id`    | `INT`           | `NOT NULL`, Foreign Key -> `users.id`                 |
| `course_code`| `VARCHAR(64)`   | `NOT NULL`                                            |
| `course_title`| `VARCHAR(255)`  | `NULLABLE`                                            |
| `units`      | `SMALLINT`      | `NOT NULL`                                            |
| `grade_raw`  | `VARCHAR(10)`   | `NOT NULL`, the grade as entered by the user          |
| `grade_point`| `DECIMAL(3,2)`  | `NOT NULL`, normalized grade on a 5.0 scale           |
| `is_retake`  | `BOOLEAN`       | `NOT NULL`, `DEFAULT false`                           |
| `created_at` | `TIMESTAMP`     | `DEFAULT CURRENT_TIMESTAMP`                           |

---

### `admin_actions`

Logs actions performed by administrators.

| Column        | Type        | Constraints & Notes                                   |
| ------------- | ----------- | ----------------------------------------------------- |
| `id`          | `INT`       | **Primary Key**, `AUTO_INCREMENT`                     |
| `admin_user_id` | `INT`     | `NOT NULL`, Foreign Key -> `users.id`                 |
| `action_type` | `VARCHAR(255)`| `NOT NULL`, e.g., "delete_note", "ban_user"         |
| `target_id`   | `INT`       | `NOT NULL`, ID of the user/note that was actioned     |
| `reason`      | `TEXT`      | `NULLABLE`, reason for the action                     |
| `created_at`  | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP`                           |

---

## Relationships

-   **`users` to `notes`**: One-to-Many (`users.id` -> `notes.user_id`)
-   **`notes` to `files`**: One-to-Many (`notes.id` -> `files.note_id`)
-   **`users` to `cgpa_semesters`**: One-to-Many (`users.id` -> `cgpa_semesters.user_id`)
-   **`cgpa_semesters` to `cgpa_courses`**: One-to-Many (`cgpa_semesters.id` -> `cgpa_courses.semester_id`)
-   **`users` to `admin_actions`**: One-to-Many (`users.id` -> `admin_actions.admin_user_id`)
-   **`users` to `cgpa_courses`**: One-to-Many (`users.id` -> `cgpa_courses.user_id`)
