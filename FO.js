const { Console } = require('console')
const fs = require('fs')
const path = require('path')
const { send } = require('process')
let input = process.argv.slice(2) // used to take input from  integrated terminal as array and slice will take all indexes after 0 and 1
let inputArr = input  // inputArr will now have an array with elements after 2nd index  ie [node FO.js ke baad jitne bhe elementss honge vo sub inputArr  array mai aa jynge]

let command = inputArr[0] //command mai inputArr array ka first index store ho jyega
// console.log(command)
let types = {
    media: ["mp4", "mkv", "mp3","PNG","jpeg","jpg"],
    archives: ["zip", "7z", "rar", "tar", "gz", "ar", "iso", "xz"],
    documents: ["docx", "doc", "pdf", "xlsx", "xls", "odt", "ods", "odp", "odg", "odf", "txt", "ps", "tex",],
    app: ["exe", "dmg", "pkg", "deb"],
};


switch (command) { //switch  takes a input as command and matches it with all the cases if the  case matches with the command the coresponding text with that case will gets execuited
    case 'tree': console.log('tree implemented')
        break //  case agar command se match ho jata ha toh uske neeche vale bhe sub chal jate hai ,so we use break 
    case 'organise': organisefn(inputArr[1])
        break
    case 'help': helpfn()
        break
    default: console.log('please enter a valid command')
        break
}


function helpfn() {
    console.log(`list of all the commands ->
                1) Tree - node FO.fs tree <directory path>
                2) organise - node FO.js organize <directory path>
                3) help - node FO.js help`)
}

function organisefn(targetfolder) {
    // targetfolder = path given by the user where files need to be organised
    // NewFolderWithOrganisedFIles = path of the folder where organised files will be brought


    if (targetfolder == undefined) { //if user does not pass the path 
        console.log('please enter a valid derectory path')
        return; // exits the program
    }
    let doesexixts = fs.existsSync(targetfolder)  //to check wether the path exists ot not,returns true if the path is valid

    let NewFolderWithOrganisedFIles

    if (doesexixts == true) {      //  if the path does exists 
        NewFolderWithOrganisedFIles = path.join(targetfolder, 'organised_files_By_Rohti_Tyagi') // path mai folder na name jin krdo,to creath the folder

        if (fs.existsSync(NewFolderWithOrganisedFIles) == false) { // to check wether a folder with same name is already opresent or not if not then make a directory  with name organised_files
            fs.mkdirSync(NewFolderWithOrganisedFIles) // used to make a directory/folder
        }
        else {
            console.log('folder already exists ')
            // NewFolderWithOrganisedFIles = path.join(targetfolder,'organised_folder2')
            // fs.mkdirSync(NewFolderWithOrganisedFIles)
        }
    }
    else {
        console.log('enter a valid path')
    }
    organisehelper(targetfolder, NewFolderWithOrganisedFIles) //call ing another function

}

function organisehelper(src, dest) {
    let childnames = fs.readdirSync(src) //reads and returns an array of names of  all files in  a directory
    console.log('folder content', childnames)

    for (let i = 0; i < childnames.length; i++) { //loop for extraction only files froma folder and excluding all other folders
        let childaddress = path.join(src, childnames[i]) // to take out path of each file in the directory
        // console.log(childaddress)
        let isfile = fs.lstatSync(childaddress).isFile()    //lstatscnc is used to get stats of a file and then returns true if the given path is  file by (.isFile function)

        if (isfile == true) {
            let filecategory = getcategory(childnames[i])//calling another function to get the extension of all the files
            console.log(childnames[i],'belongs to' ,filecategory)
            sendfiles(childaddress,dest,filecategory)
            

        }
    }

}



function getcategory(filename) {
    let ext = path.extname(filename).slice(1)//slice(1) will remove "." from the extension so that is matches the  keys of object declared above
    // console.log(ext)
    
    for(let key in types){ //loop for each key in the object above
        let cTYpeArr = types[key]
        // console.log(cTYpeArr)
        for(let i=0;i<cTYpeArr.length;i++){ 
            if(ext==cTYpeArr[i]){ // matching each extension with the object file and if it matches key is returned else others is returned
                return key
            }
            
            }
        }
        return 'others'
    }
    
function sendfiles(srcfilePath , destfilepath,filecatagory){  //function for creating folders  corresponding to keys in objects

    let catPAth = path.join(destfilepath,filecatagory)
    if(fs.existsSync(catPAth)==false){ // check  if same name folder already present or not 
        fs.mkdirSync(catPAth) //if not then mane a folder 
    }
    let fileName= path.basename(srcfilePath)
    let destFilePAth = path.join(catPAth,fileName) 
    fs.copyFileSync(srcfilePath,destFilePAth)
    console.log('files organised')


}    
    

