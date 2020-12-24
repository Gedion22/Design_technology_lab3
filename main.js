// const module_for_metrics = './node_modules/express/';
const module_for_metrics = './check';
const path = require('path');
const fs = require('fs');
let directories = [{path:module_for_metrics}];
let files = [];
let text = [];
let metrics ={
    lines_count:0,
    empty_count:0,
    physical:0,
    logical:0,
    comment:0,
    comment_level: 0,
};
const logical_regex = [
    /typeof/g,
    /=[^\>]/g,
    /for\(/g,
    /if/g,
    /else/g,
    /while/g,
    /do/g,
    /switch/g,
    /case/g,
    /return/g,
    /break/g,
    /continue/g,
    /console/g,
    /\?/g,
    /try/g,
    /catch/g,
    /([a-zA-z0-9]*\.[a-zA-z]*[(])/g
];

const readAllFiles = () => {
    const regex = /\.js$/;
    while (directories.length) {
        const dir_arr = [...directories];
        directories = [];
        dir_arr.map(item => {
            fs.readdirSync(item.path).forEach(file => {
                if (fs.lstatSync(path.resolve(item.path, file)).isDirectory()) {
                        directories.push({path: path.resolve(item.path, file)});
                    } else if(file.match(regex)) {
                        files.push({path: path.resolve(item.path, file)});
                    }
                });
            });
    }
};
const getAllText = () => {
    files.map(item=>{
        text = text.concat(fs.readFileSync(item.path, 'utf8').split('\n'));
    })
};
const checkLogicalRegex = (string) =>{
    let count = 0;
    let matches = [];
    for(let i = 0; i < logical_regex.length; i++){
        // if(i === 1 && [...string.matchAll(logical_regex[2])].length){
        //     continue;
        // }
        matches = [...string.matchAll(logical_regex[i])];
        count += matches.length;
        matches = [];
    }
    return count;
};

const getMetrics = () =>{
    metrics.lines_count = text.length;
    let comm = false;
    for(let i = 0; i < text.length; i++){
        if(!text[i]){
            metrics.empty_count++;
        }else if(comm){
            metrics.comment++;
            comm = !text[i].match(/\*\//g);
        }else if(text[i].match(/\/\//g)){
            metrics.comment++;
        }else if(text[i].match(/\/\*/g)){
            metrics.comment++;
            comm = true;
        } else {
            metrics.logical += checkLogicalRegex(text[i]);
        }
    }
    metrics.physical = metrics.empty_count/metrics.lines_count <=0.25?metrics.lines_count:metrics.lines_count-metrics.empty_count;
    metrics.comment_level = (metrics.comment/metrics.lines_count).toFixed(3);
};



readAllFiles();
getAllText();
getMetrics();



console.log(text.length);
console.log(metrics);



