CREATE TABLE IF NOT EXISTS userAccounts (
    userID INT NOT NULL AUTO_INCREMENT,
    userName VARCHAR(255) NOT NULL UNIQUE,
    userPassHash VARCHAR(255) NOT NULL,
    userWpName VARCHAR(255),
    userWpPassHash VARCHAR(255),
    userEmail VARCHAR(255) NOT NULL,
    userPhone VARCHAR(255),
    userWebsites INT(11),
    userQuestion VARCHAR(255),
    userAnswer VARCHAR(255),
    userDateCreated TIMESTAMP DEFAULT NOW(),
    userLastLogin TIMESTAMP,
    userTier ENUM('free', 'personal', 'business', 'enterprise') NOT NULL DEFAULT 'free',
    isAdmin BOOLEAN DEFAULT FALSE,
    adminNote VARCHAR(255) DEFAULT NULL,
    bannedUntil TIMESTAMP NULL DEFAULT NULL
    PRIMARY KEY (userID)
);

CREATE TABLE IF NOT EXISTS logins (
    trailID INT NOT NULL AUTO_INCREMENT,
    userID INT NOT NULL,
    loginTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (trailID),
    FOREIGN KEY (userID) REFERENCES userAccounts(userID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS userWebsites (
    siteID INT NOT NULL AUTO_INCREMENT,
    userID INT NOT NULL,
    websiteName VARCHAR(255) NOT NULL,
    websiteDateCreated TIMESTAMP NOT NULL DEFAULT NOW(),
    websiteDateUpdated TIMESTAMP DEFAULT NOW(),
    websitePageCount INT NOT NULL DEFAULT 0,
    websiteStatus ENUM('active', 'inactive') NOT NULL DEFAULT 'inactive',
    isLive BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (userID) REFERENCES userAccounts(userID) ON DELETE CASCADE,
    PRIMARY KEY (siteID)
);

CREATE TABLE IF NOT EXISTS sitePages (
    pageID INT NOT NULL AUTO_INCREMENT,
    siteID INT NOT NULL,
    pagePath VARCHAR(255) NOT NULL,
    pageData JSON, -- JSON so html, css, jc, etc. can be bundled together
    pageLastAccessed TIMESTAMP DEFAULT NOW(),
    UNIQUE KEY (siteID, pagePath), -- Ensures its a unqiue path for this website (but the same path can still be used on other websites)
    FOREIGN KEY (siteID) REFERENCES userWebsites(siteID) ON DELETE CASCADE,
    PRIMARY KEY (pageID)
);

CREATE TABLE IF NOT EXISTS siteMedia (
    mediaID INT NOT NULL AUTO_INCREMENT,
    siteID INT NOT NULL,
    mediaLastAccessed TIMESTAMP DEFAULT NOW(),
    mediaUploaded TIMESTAMP DEFAULT NOW(),
    fileType ENUM('image', 'video', 'audio') NOT NULL,
    fileName VARCHAR(255),
    mimeType VARCHAR(255) NOT NULL,
    fileData LONGBLOB NOT NULL,
    FOREIGN KEY (siteID) REFERENCES userWebsites(siteID) ON DELETE CASCADE,
    PRIMARY KEY (mediaID)
);

DELIMITER //

CREATE TRIGGER trig_website_modified
BEFORE UPDATE ON userWebsites
FOR EACH ROW
BEGIN
    SET NEW.websiteDateUpdated = NOW();
END //

CREATE TRIGGER trig_media_insert
AFTER INSERT ON siteMedia
FOR EACH ROW
BEGIN
    UPDATE userWebsites
    SET websiteDateUpdated = NOW()
    WHERE siteID = NEW.siteID;
END //

CREATE TRIGGER trig_media_deletion
AFTER DELETE ON siteMedia
FOR EACH ROW
BEGIN
    UPDATE userWebsites
    SET websiteDateUpdated = NOW()
    WHERE siteID = OLD.siteID;
END //

CREATE TRIGGER trig_page_insert
AFTER INSERT ON sitePages
FOR EACH ROW
BEGIN
    UPDATE userWebsites
    SET websiteDateUpdated = NOW()
    WHERE siteID = NEW.siteID;
END //

CREATE TRIGGER trig_page_deletion
AFTER DELETE ON sitePages
FOR EACH ROW
BEGIN
    UPDATE userWebsites
    SET websiteDateUpdated = NOW()
    WHERE siteID = OLD.siteID;
END //

CREATE TRIGGER trig_login_creation
AFTER UPDATE ON userAccounts
FOR EACH ROW
BEGIN
    IF OLD.userLastLogin <> NEW.userLastLogin THEN
        INSERT INTO Logins (userID, loginTime)
        VALUES (NEW.userID, NEW.userLastLogin);
    END IF;
END //

CREATE TRIGGER trig_login_on_create
AFTER INSERT ON userAccounts
FOR EACH ROW
BEGIN
    INSERT INTO logins (userID, loginTime)
    VALUES (NEW.userID, NOW());
END //

DELIMITER ;