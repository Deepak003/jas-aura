let fs = require("fs");
const path = require('path');
const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    const dirent = fs.statSync(dirFile);
    if (dirent.isDirectory()) {
      console.log('directory', path.join(dir, file));
      var odir = {
        file: dirFile
      }
      odir.files = walkSync(dirFile, dir.files);
      filelist.push(odir);
    } 
  }
  return filelist;
};
var filelist = [];
console.log(walkSync('../spec/unit',filelist));
for(var i=0;i<=filelist.length-1;i++){
  var dir =filelist[i].file;
  var dirName= (filelist[i].file).split("../spec/unit/")[1];
  console.log("-----------------START-------------------------");
  console.log((i+1)+"  :dirName:"+dirName +"  dir:"+dir);
  for(var j=1;j<=2;j++){
    var fileName = dirName+((j==1)? "Controller":"Helper");
    var fileNameExt = fileName+".js";
    var auraFile = "../aura/tsm/"+dirName+"/"+fileNameExt;
    var specFile = "../spec/unit/"+dirName+"/"+fileName+"Spec.js";
    console.log("auraFile:"+auraFile + " || "+ "specFile:"+specFile);
    if (fs.existsSync(specFile) ) 
    {
      try{
        var auraCode = fs.readFileSync(auraFile,"utf8"); 
      }catch(err){
        console.log(err);
      }
      // Processing Aura Files : Adding module.exports Functionality
      
      auraCode = "module.exports = " + auraCode;
      //auraCode = auraCode.replace("({", "function "+fileName+"(){");
      auraCode = auraCode.replace(/^\s+|\s+$/g, '');
      //auraCode = auraCode + "_lcov_";  

      var auraContent = "";
      var codeLineSplitArr = auraCode.split("\n");
      auraContent = codeLineSplitArr[0];
      for (var k = 1; k <= codeLineSplitArr.length - 1; k++) {
        var tmp = codeLineSplitArr[k].replace(/\s/g, "");
        if(tmp[0]+tmp[1]=="//" || tmp.length==0 || tmp=="")
           continue;
        /*if (tmp.indexOf(":function") > -1) {
          codeLineSplitArr[k] = "\tthis." + codeLineSplitArr[k].trim() + "\n";
          codeLineSplitArr[k] = codeLineSplitArr[k].replace(":", " = ");
        }
        if(tmp.trim()=="}," && codeLineSplitArr[k+1].trim()=="}"){
          codeLineSplitArr[k] = codeLineSplitArr[k].replace("},","}");
        } 
        if (tmp.indexOf(")_lcov_") > -1) {
          codeLineSplitArr[k] = codeLineSplitArr[k].replace(")_lcov_","\nmodule.exports = new "+fileName+"();");
        }*/
        auraContent = auraContent + codeLineSplitArr[k] + "\n";
      }
      
      try{
        fs.writeFileSync(auraFile, auraContent);
        console.log("Data written to file::"+auraFile);
      }catch(err){
        console.log(err);
      }  
    }
  }
};
