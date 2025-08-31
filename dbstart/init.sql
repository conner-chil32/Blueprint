CREATE TABLE IF NOT EXISTS userAccounts (
    userId INT NOT NULL AUTO_INCREMENT,
    userName VARCHAR(255) NOT NULL,
    userPassHash VARCHAR(255) NOT NULL,
    userWpName VARCHAR(255),
    userWpPassHash VARCHAR(255),
    userEmail VARCHAR(255) NOT NULL,
    userPhone VARCHAR(255),
    userWebsites INT(11),
    userDateCreated TIMESTAMP,
    userLastLogin TIMESTAMP,
    isAdmin BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (userId)
);

CREATE TABLE IF NOT EXISTS userWebsites (
    id INT NOT NULL AUTO_INCREMENT,
    userId INT NOT NULL,
    websiteName VARCHAR(255) NOT NULL,
    websiteDateAdded TIMESTAMP NOT NULL DEFAULT NOW(),
    websiteDateLastVisited TIMESTAMP DEFAULT NOW(),
    websiteDateLastModified TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (userId) REFERENCES userAccounts(userId),
    PRIMARY KEY (id)
);