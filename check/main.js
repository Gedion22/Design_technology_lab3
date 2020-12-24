const getAllText = () => {
    files.map(item=>{
        text = text.concat(fs.readFileSync(item.path, 'utf8').split('\n'));
    })
};
const checkPhysicalRegex = (string) =>{
    let count = 0;
    let matches = [];
    for(let i = 0; i < logical_regex.length; i++){
        matches = [...string.matchAll(logical_regex[i])];
        count += matches.length;
        matches = [];
    }
    return count;
};





//asdasdasd
//asdasdsadsad
//asdasdas
/*asasdadasd
asdasdasdsad
asdasdsa
daasd
 */
