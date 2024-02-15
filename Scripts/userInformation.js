let userInformation = {
    levels: [] 
};

async function fetchTextFile(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let text = await response.text();
        text = text.split("/NEW LEVEL/");
        text.splice(0, 1);
        for(let i = 0; i < text.length; i++) {
            text[i] = text[i].split(/[\n\r↵]+/);
            text[i].splice(i,1);
        }
        for(let i = 0; i < text.length; i++) {
            let obj = {
                name: text[i][0].substring(text[i][0].indexOf('=>') + 2),
                info: text[i][1].substring(text[i][1].indexOf('=>') + 2)
            };
            userInformation.levels.push(obj);
        }
    } catch (e) {
        console.error("Could not load the file:", e);
    }
}

fetchTextFile("Level Files/Levels.txt");