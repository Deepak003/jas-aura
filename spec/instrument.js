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
//console.log("len-->"+filelist.length);
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
      //file exists
      try{
        var auraCode = fs.readFileSync(auraFile,"utf8"); 
        //var specCode = fs.readFileSync(specFile,"utf8"); 
      }catch(err){
        console.log(err);
      }
      auraCode = auraCode.replace("({", "function "+fileName+"(){");
      auraCode = auraCode.replace(/^\s+|\s+$/g, '');
      //auraCode = auraCode.replace(/(\r\n|\n|\r)/gm, "");
      auraCode = auraCode + "_lcov_";  
      // Processing Aura Files : Adding module.exports Functionality
      var auraContent = "";
      var codeLineSplitArr = auraCode.split("\n");
      auraContent = codeLineSplitArr[0];
      //var count=0;
      for (var k = 1; k <= codeLineSplitArr.length - 1; k++) {
        var tmp = codeLineSplitArr[k].replace(/\s/g, "");
        //console.log("tmp.length:"+tmp.length);
        if(tmp[0]+tmp[1]=="//" || tmp.length==0 || tmp=="")
           continue;
        if (tmp.indexOf(":function") > -1) {
          codeLineSplitArr[k] = "\tthis." + codeLineSplitArr[k].trim() + "\n";
          codeLineSplitArr[k] = codeLineSplitArr[k].replace(":", " = ");
          //count++;
        }
        if(tmp.trim()=="}," && codeLineSplitArr[k+1].trim()=="}"){
          codeLineSplitArr[k] = codeLineSplitArr[k].replace("},","}");
          //count++;
        } 
        if (tmp.indexOf(")_lcov_") > -1) {
          codeLineSplitArr[k] = codeLineSplitArr[k].replace(")_lcov_","\nmodule.exports = new "+fileName+"();");
          //count++;
        }
        auraContent = auraContent + codeLineSplitArr[k] + "\n";
      }
      //console.log("count:"+count);
      /* var auraSpecContent = "";
      var requireHook ="var " + fileName + " = "+"require('../../"+auraFile+"');\n";
      var specLineSplitArr = specCode.split("\n");
      auraSpecContent = specLineSplitArr[0];
      var flag=true;
      for (var k = 1; k <= specLineSplitArr.length - 1; k++) {
        if(specLineSplitArr[k].indexOf("describe")>-1 && flag){
          specLineSplitArr[k] = requireHook+ "\n" + specLineSplitArr[k];
          auraSpecContent = auraSpecContent + specLineSplitArr[k] + "\n";
          flag=false;
        }else{
          auraSpecContent = auraSpecContent + specLineSplitArr[k] + "\n";
        }
      } */  
      try{
        fs.writeFileSync(auraFile, auraContent);
        console.log("Data written to file::"+auraFile);
        /* fs.writeFileSync(specFile, auraSpecContent);
        console.log("Data written to file::"+specFile); */
      }catch(err){
        console.log(err);
      }  
    }
  }
};