iC = {
  thickness: 50,
  loadImg:function(img_url){
    this.c = document.getElementById("myCanvas");
    var ctx = this.c.getContext("2d");
    var img = new Image();
    img.src='/getImage.php?url='+img_url;

    img.onload = function(){
      ctx.width = img.width;
      ctx.height = img.height;
      ctx.drawImage(img,0,0);
    } 
          
  },
  getColor:function(x,y){
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    var imgd = ctx.getImageData(x, y, 1, 1);
    var pix = imgd.data;

    return [pix[0],pix[1],pix[2]];

  },
  pickColors:function(){
    var alp = 0.2;
    var pt = iC.getPalette();
    var pb = iC.getBGPalette();
    var bg = pb[0];
    var tc = pt[4];

    $('.parent p').css('color','rgb('+tc[0]+','+tc[1]+','+tc[2]+')');
    $('.parent').css('background-color','rgb('+bg[0]+','+bg[1]+','+bg[2]+')');
    var layer_color = 'rgba('+bg[0]+','+bg[1]+','+bg[2]+','+alp+')';
    var gradient_color = bg[0]+','+bg[1]+','+bg[2];
    //iC.setAlphaLayer(layer_color);
    iC.setGradient(gradient_color);

  },
  getPalette:function(){
    var colors = new Array();
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    var imgd = ctx.getImageData(iC.thickness, iC.thickness, $('#myCanvas').width() - iC.thickness, $('#myCanvas').height() - iC.thickness );
    var pix = imgd.data;
    
    for (var i = 0; i < pix.length; i+=4) {
      var colorString = pix[i] + ',' + pix[i+1] + ',' + pix[i+2] + ',' + pix[i+3];
      if( colors[colorString] ){
        colors[colorString]++;
      }else{
        colors[colorString] = 1;
      }
    };
    var sortedColors = sortAssoc(colors);
    var c = 0;
    var devVal = 30;
    var response = new Array();
    
    for (var clr in sortedColors) {
      colorValues = clr.split(',');
      isValid = true;
      for( var r in response ){
        var colorDevTtl = 0;
        var rgbaVals = response[r];

        for( var i = 0; i <= 3; i++ ){
          colorDevTtl += Math.abs( colorValues[i] - rgbaVals[i] );
        }
        
        if( colorDevTtl / 4 < devVal ){
          isValid = false;
          break;
        }
      }
      if (isValid){
        response.push(colorValues);
        c++;
      }
      if (c >= 5)
        break;
    }

    return response;
  
  },
  getBGPalette:function(){
    var colors = new Array();
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    var allPix = new Array();
    
    //top
    var imgd = ctx.getImageData(0, 0, $('#myCanvas').width(), iC.thickness);
    var pix = imgd.data;
    allPix = allPix.concat(pix);
    //left
    var imgd = ctx.getImageData($('#myCanvas').width() - iC.thickness, iC.thickness, $('#myCanvas').width(), $('#myCanvas').height());
    var pix = imgd.data;
    allPix = allPix.concat(pix);
    
    //bottom
    var imgd = ctx.getImageData(0, $('#myCanvas').height() - iC.thickness, $('#myCanvas').width() - iC.thickness, $('#myCanvas').height());
    var pix = imgd.data;
    allPix = allPix.concat(pix);
    
    //right
    var imgd = ctx.getImageData(0, iC.thickness, iC.thickness, $('#myCanvas').height() - iC.thickness);
    var pix = imgd.data;
    allPix = allPix.concat(pix);

    for (var i = 0; i < allPix.length; i+=4) {
      var colorString = pix[i] + ',' + pix[i+1] + ',' + pix[i+2] + ',' + pix[i+3];
      if( colors[colorString] ){
        colors[colorString]++;
      }else{
        colors[colorString] = 1;
      }
    };
    var sortedColors = sortAssoc(colors);
    var c = 0;
    var devVal = 30;
    var response = new Array();
    
    for (var clr in sortedColors) {
      colorValues = clr.split(',');
      isValid = true;
      for( var r in response ){
        var colorDevTtl = 0;
        var rgbaVals = response[r];

        for( var i = 0; i <= 3; i++ ){
          colorDevTtl += Math.abs( colorValues[i] - rgbaVals[i] );
        }
        
        if( colorDevTtl / 4 < devVal ){
          isValid = false;
          break;
        }
      }
      if (isValid){
        response.push(colorValues);
        c++;
      }
      if (c >= 5)
        break;
    }

    return response;
    
  },
  setAlphaLayer:function(color){
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    console.log(color);
    
    ctx.beginPath();
    ctx.rect(0, 0, $('#myCanvas').width(), $('#myCanvas').height());
    ctx.fillStyle = color;
    ctx.fill();
   
  },
  setGradient:function(color){
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");

     var gradient = ctx.createRadialGradient(200, 200, 0,200, 200, 200);
     gradient.addColorStop(0, 'rgba('+color+',0)');
     gradient.addColorStop(1, 'rgba('+color+',1)');

     ctx.fillStyle = gradient;

     ctx.fillRect(0, 0, $('#myCanvas').width(), $('#myCanvas').height());
  },
  actions:function(){
    $('#do').click(function(){
      if ($('#img_url').val() !='')
      {
        iC.loadImg($('#img_url').val());
      }
    });
    
    $('#redo').click(function(){
        iC.pickColors();
    });


    $('#myCanvas').mousemove(function(e){
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    var imgd = ctx.getImageData(event.offsetX,event.offsetY, 1, 1);
    var pix = imgd.data;

    });
  },

}


$(document).ready(function(){
  iC.actions();  
});

function sortAssoc(aInput){
  var aTemp = [];
  for (var sKey in aInput)
    aTemp.push([sKey, aInput[sKey]]);
  aTemp.sort(function () {return arguments[1][1] - arguments[0][1]}
      );

  var aOutput = [];
  for (var nIndex = 0; nIndex < aTemp.length; nIndex++){
    aOutput[aTemp[nIndex][0]] = aTemp[nIndex][1];
  }
  return aOutput;
}
