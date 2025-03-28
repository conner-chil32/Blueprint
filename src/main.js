//I created this in main.js because that is where the user portal links to and it did not seem to make sense in any other js file.  - Elijah
class WebsiteSummaryNode{
    constructor(id,name){//Constructor establishing class variables
        this.id = id;
        this.name = name;
        this.preview = null;
        this.statistics = {};
        this.status = "Inactive";
        this.description = "";
    }

    //Setters for summary values
    setPreview(previewImage) {
        this.preview = previewImage;
        return this;
    }
    
    setStatistics(stats) {
    this.statistics = stats;
    return this;
    }

    setStatus(status) {
    this.status = status;
    return this;
    }

    setDescription(description) {
    this.description = description;
    return this;
    }
}

//Two empty functions that return void as specified in SCRUM-183
function addEmptyProject(){
    return void 0;
}

function addProject(){
    return void 0;
}