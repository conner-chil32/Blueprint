CREATE TABLE IF NOT EXISTS userAccounts (
    userId INT NOT NULL AUTO_INCREMENT,
    userName VARCHAR(255) NOT NULL,
    userPassHash VARCHAR(255) NOT NULL,
    userWpName VARCHAR(255),
    userWpPassHash VARCHAR(255),
    userEmail VARCHAR(255) NOT NULL,
    userPhone VARCHAR(255),
    userWebsites INT(11),
    userQuestion VARCHAR(255),
    userAnswer VARCHAR(255),
    userDateCreated TIMESTAMP,
    userLastLogin TIMESTAMP,
    isAdmin BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (userId)
);

CREATE TABLE IF NOT EXISTS userWebsites (
    siteID INT NOT NULL AUTO_INCREMENT,
    userId INT NOT NULL,
    websiteName VARCHAR(255) NOT NULL,
    websiteDateCreated TIMESTAMP NOT NULL DEFAULT NOW(),
    websiteDateLastModified TIMESTAMP DEFAULT NOW(),
    websitePageCount INT NOT NULL,
    webisteStatus ENUM('active', 'inactive',) NOT NULL DEFAULT 'inactive';
    isAdmin BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (userId) REFERENCES userAccounts(userId),
    PRIMARY KEY (siteID)
);

CREATE TABLE IF NOT EXISTS websitePages (
    pageID INT NOT NULL AUTO_INCREMENT,
    siteID INT NOT NULL,
    pagePath VARCHAR(255) NOT NULL,
    pageData JSON, -- JSON so html, css, jc, etc. can be bundled together
    pageLastAccessed TIMESTAMP DEFAULT NOW(),
    UNIQUE KEY (siteID, pagePath), -- Ensures its a unqiue path for this website (but the same path can still be used on other websites)
    FOREIGN KEY (siteID) REFERENCES userWebsites(siteID) ON DELETE CASCADE,
    PRIMARY KEY (pageID)
);

CREATE TABLE IF NOT EXISTS websiteMedia (
    mediaID INT NOT NULL AUTO_INCREMENT,
    siteID INT NOT NULL,
    mediaLastAccessed TIMESTAMP DEFAULT NOW(),
    fileType ENUM('image', 'video', 'audio') NOT NULL,
    mimeType VARCHAR(255) NOT NULL,
    fileData LONGBLOB NOT NULL,
    FOREIGN KEY (siteID) REFERENCES userWebsites(siteID) ON DELETE CASCADE,
    PRIMARY KEY (mediaID)
);