let express = require("express")
let  bodyParser = require("body-parser")
var path = require('path');
let ueditor = require("ueditor")
let router = require("./router/router")
let  jsonParse = bodyParser.json()
let urlencoded = bodyParser.urlencoded({extended:false})

let app = express()
app.use(jsonParse)
app.use(urlencoded)

let options = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['html', 'htm'],
    index: false,
    maxAge: '1d',
    redirect: false,
    setHeaders: function(res, path,stat){
        res.set('x-timestamp', Date.now())
    }

}



// 上传图片的地址  图片或者文件服务器
app.use(express.static(__dirname+ '/static'))
// ueditor  配置文件的静态服务器地址
app.use(express.static(__dirname+ '/nodejs'))
app.use(express.static(__dirname+'/ueditor'))
app.use(express.static(__dirname+'/ued'))

// 跨域
app.all('*',function(req,res,next){
    // res.header( 'Access-Control-Allow-Origin', '*' );
    // res.header('Access-Control-Allow-Credentials', 'true');
    // res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    // res.header('Access-Control-Expose-Headers', 'Content-Length');
    // res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range, application/javascript;charset=UTF-8')
    res.header("Access-Control-Allow-Origin","*")
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    next()
})



app.use("/ueditor/ue", ueditor(path.join(__dirname, 'static'), function (req, res, next) {
    //客户端上传文件设置
    var imgDir = '/img/ueditor/'
    // var imgDir = __dirname + '/upload'
   
     var ActionType = req.query.action;
    if (ActionType === 'uploadimage' || ActionType === 'uploadfile' || ActionType === 'uploadvideo') {
        var file_url = imgDir;//默认图片上传地址
        /*其他上传格式的地址*/
        if (ActionType === 'uploadfile') {
            // file_url = __dirname + '/file'
            file_url = '/file/ueditor/'; //附件
        }
        if (ActionType === 'uploadvideo') {
            // file_url = __dirname + '/video'; //视频
            file_url = '/video/ueditor/'; //视频
        }
        res.ue_up(file_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
        res.setHeader('Content-Type', 'text/html');
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage') {
        var dir_url = imgDir;
        res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
    }
    // 客户端发起其它请求
    else {
        res.setHeader('Content-Type', 'application/json');
        res.redirect('/config.json');
    }
}));



app.post("/login",urlencoded,router.login)
app.post("/verifylogin",urlencoded,router.verifylogin)

app.post("/addnews",urlencoded,router.addnews)
app.post("/getnews",router.getnews)
app.post("/updatenews",urlencoded,router.updateNews)
app.post("/deletenews",urlencoded,router.deletNews)

app.post("/dynamicClassify",router.dynamicClassify)
app.post("/adddynamic",urlencoded,router.adddynamic)
app.post("/getdynamic",urlencoded,router.getdynamic)
app.post("/updatedynamic",urlencoded,router.updatedynamic)
app.post("/deletedynamic",urlencoded,router.deletedynamic)
app.post("/getdynamicByClass",urlencoded,router.getdynamicByClass)

app.post("/addalliance",urlencoded,router.addalliance)
app.post('/getalliance',urlencoded,router.getalliance)
app.post("/updatealliance",urlencoded,router.updatealliance)
app.post("/deletealliance",urlencoded,router.deletealliance)

app.post("/addvideo",urlencoded,router.addvideo)
app.post("/getvideo",urlencoded,router.getvideo)
app.post("/updatevideo",urlencoded,router.updatevideo)
app.post("/deletevideo",urlencoded,router.deletevideo)

app.post("/getadvertise",urlencoded,router.getadvertise)
app.post("/addadvertise",urlencoded,router.addadvertise)
app.post("/updateadvertise",urlencoded,router.updateadvertise)
app.post("/deleteadvertise",urlencoded,router.deleteadvertise)
app.listen(3000,function(){
    console.log('app port: 3000')
})