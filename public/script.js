const fileDrop = document.getElementById('file_drop');
const output = document.getElementById('output');

fileDrop.addEventListener('dragenter', () => {
    fileDrop.classList.add('hover');    
})

fileDrop.addEventListener('dragover', (e) => {
    e.preventDefault();
})

fileDrop.addEventListener('dragend', (e) => {
    e.preventDefault();
})

fileDrop.addEventListener('dragleave', () => {
    fileDrop.classList.remove('hover');
})



async function getFileReport(md5){  // fetch request for the backend server
    const url = 'http://127.0.0.1:5000/checkhash/'+md5;

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        displayData(data);
        return data;
    } catch (error) {
        document.getElementById('output').innerHTML = 'No file report found for ' + md5;

    }
}

fileDrop.addEventListener('drop', (e) => {
    e.preventDefault();
    fileDrop.classList.remove('hover');

    let file = e.dataTransfer.files[0];
    let reader = new FileReader();

    if (e.dataTransfer.items.length > 1) {  // throw error if more than one file dropped
        alert('Please drag only one file');
        throw new Error('error');
    }

    reader.onload = function (e) { // using FileReader api with CryptoJS to get md5 hash
        let binary = e.target.result;
        let md5 = CryptoJS.MD5(binary).toString();
        console.log('MD5:', md5);
        getFileReport(md5);
    }

    reader.readAsBinaryString(file);
})


function emptyOutput() {
    document.getElementById('output').innerHTML = '';
}

function displayData(data) {  //create elements to display file report data
    const stats = data.data.attributes.last_analysis_stats;
    const statsString = `
       <p> Malicious: ${stats.malicious}</p> 
       <p> Suspicious: ${stats.suspicious}</p> 
       <p> Undetected: ${stats.undetected}</p> 
       <p> Timeout: ${stats.timeout}</p> 
       <p> Harmless: ${stats.harmless}</p> 
       <p> Failure: ${stats.failure}</p> 
    `;

    output.innerHTML = statsString;
}