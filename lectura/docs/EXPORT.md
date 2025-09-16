# Lectura - Backup and Restore Guide

This document provides instructions on how to back up and restore the user-generated content for the Lectura application. This includes the database and the user-uploaded files.

## Overview

There are two main components to back up:

1.  **The MySQL Database:** Contains all user data, note metadata, CGPA entries, etc.
2.  **Uploaded Files:** Contains the actual note files (images, PDFs, DOCX) that users have uploaded.

---

## 1. Backing Up Data

### Backing Up the Database

The easiest way to back up the MySQL database is by using `mysqldump` or a tool like phpMyAdmin in cPanel.

**Using `mysqldump` (Command Line):**

```bash
mysqldump -u [username] -p [database_name] > backup-$(date +%F).sql
```

Replace `[username]` and `[database_name]` with your database credentials. This will create a single SQL file containing all the data and table structures.

**Using cPanel:**

1.  Log in to cPanel.
2.  Go to "Backup" or "Backup Wizard".
3.  Under "Full Backup" or "Partial Backups", select "Download a MySQL Database Backup".
4.  Choose the database for your Lectura application and download the `.sql.gz` file.

### Backing Up Uploaded Files

All user-uploaded files are stored in the `backend/uploads` directory on the server. The structure is `/uploads/{user_id}/{note_id}/`.

To back up all files, you simply need to create a compressed archive of this entire `uploads` directory.

**Using `zip` (Command Line):**

Navigate to the `backend` directory on your server and run:

```bash
zip -r uploads-backup-$(date +%F).zip uploads/
```

This will create a zip file containing all user uploads.

**Using cPanel File Manager:**

1.  Navigate to the `backend/uploads` directory.
2.  Right-click the `uploads` folder.
3.  Select "Compress".
4.  Choose "Zip Archive" as the compression type.
5.  Download the generated zip file.

---

## 2. Restoring Data

Restoring requires reversing the backup process. **Always back up your current state before attempting a restore.**

### Restoring the Database

**Using `mysql` (Command Line):**

```bash
mysql -u [username] -p [database_name] < [backup_file.sql]
```

This command will execute the SQL script and restore the database to the state contained in the backup file.

**Using cPanel:**

1.  Go to "Backup".
2.  Under "Restore a MySQL Database Backup", choose the backup file from your local machine.
3.  Click "Upload".

### Restoring Uploaded Files

1.  **Delete** the existing `uploads` directory on your server (or rename it as a temporary backup).
2.  Upload the `uploads-backup.zip` file to the `backend` directory.
3.  Extract the contents of the zip file. This will recreate the `uploads` directory and all its contents.
4.  Ensure the file permissions are correct. The web server (Node.js application) needs write permissions to this directory. You can usually set permissions to `755` for directories and `644` for files.
