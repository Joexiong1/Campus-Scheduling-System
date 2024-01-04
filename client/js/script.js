function getError(){//获得目前课表的报错
    console.log('get error')
    let formData = new FormData()//let 局部变量 表格对象
    //****序列化和反序列化****
    var academychoise=$("#selectschool").val();//得到选的的学院
    var classchoise=$("#selectclass").val();//得到选的的班级
    if(classchoise=='noclass'){
        layer.msg('没有选择班级', function(){
            
            });
    }
    else{
        var oriAndchange = getOAC()

        formData.append('classchoise',classchoise)//key：value
        formData.append('oriAndchange',JSON.stringify(oriAndchange))
        formData.append('academychoise',academychoise)
        $("#result").find("li").remove()
        $.ajax({//给后端的信
            url:"http://127.0.0.1:8090/geterror",//getdata为方法
            type:"post",
    
            data:formData,
            contentType: false,
            processData: false,
            success: function(response){//形参  回调函数，通讯成功
                console.log('success!')
                console.log(response)//后端的内容
                
                var arr =response['data'];
                if(response['data']==null){
                    layer.msg('目前排课没有缺陷', function(){
                        
                        });
                }
                else{
                    var list = document.getElementById("result");
                
                    for(var i in arr){
                        listcol = document.createElement("li");
                        // listcol.innerHTML=""
                        listcol.innerHTML=arr[i];
                        console.log(listcol)
                        list.appendChild(listcol);               
                    }
                    console.log(arr)
                }
               
            }
        }) 
    }
}    
function selectDone(){//选完班级后得到课表
    
    console.log('select done')
    $("#changedsets").find("li").remove()//消除之前的修改记录
    let formData = new FormData();//let 局部变量
    var academychoise=$("#selectschool").val();//得到选的的学院
    var yearchoise=$("#selectyear").val();//得到选的的年级
    var classchoise=$("#selectclass").val();//得到选的的班级

    console.log(classchoise)
    console.log(academychoise)
    console.log(yearchoise)

    if(classchoise=='noclass'){
        layer.msg('没有选择班级', function(){
            
            });
    }
    else{
        formData.append('classchoise',classchoise)//key：value
        formData.append('academychoise',academychoise)
        formData.append('yearchoise',yearchoise)

        resettable()

        $.ajax({//给后端的信
            url:"http://127.0.0.1:8090/selectdone",//selectdone为方法
            type:"post",//内容
            data:formData,
            contentType: false,
            processData: false,
            success: function(response){//形参  回调函数，通讯成功
                console.log('select_done_success!')
                console.log(response['data'])//后端的内容
                var classtab=response['data'] 
                setclasses(classtab,0)//填入课表
            }
        })
        console.log(classchoise)
    }
}
function selectclass(){//为了选完学院和年级后选择对应的班级
    var academychoise=$("#selectschool").val();//得到选的的学院
    var yearchoise=$("#selectyear").val();//得到选的的年级

    let formData = new FormData();//let 局部变量

    formData.append('academychoise',academychoise)
    formData.append('yearchoise',yearchoise)
    
    $("#selectclass").find("option").remove()
    var class_sel=document.getElementById("selectclass")
    var t=new Option('-请选择班级-','noclass')
    class_sel.appendChild(t)
    console.log('准备传向后传数据')
    $.ajax({
        url:"http://127.0.0.1:8090/selectclass",//selectclass为方法
        type:"post",//内容
        data:formData,
        contentType: false,
        processData: false,
        success:function(response){
            var $ = layui.jquery, form = layui.form;
            var classes=response['data']//等后端传回课程名
            console.log('成功传递')
            console.log(classes)
            for(var i in classes){
                var opt=new Option(classes[i],classes[i])
                class_sel.appendChild(opt)
                //$('#selectclass').append("<option value='" + title[i].buttonId + "'>" + opt + '</option>')
            }
            form.render('select','tochanged');
        }
    })
}
function addchanged(){//增加修改记录   
    var changedclass=$("#tochangeclass").val()//tochangeclas，到时候换成课程名
    var changeddate=$("#tochange_date").val()
    var changedstart=$("#tochange_start").val()
    var changedend=$("#tochange_end").val()
    var changedloca=$("#tochange_loca").val()
    
    var tflag=1

    console.log(changedclass)//拥有时间地点班级课程信息
    console.log(changeddate)
    console.log(changedstart)
    console.log(changedend)
    console.log(changedloca)
    if(changedclass=="nochange"){
        layer.msg('没有选择班级', function(){
            id: 't1'
        });
        
        tflag=0
    }
    else if(tflag==1){
         //拼接开始和结束节数
        var changedtime=changedstart.concat(changedend)
        console.log(changedtime)
        var flag=changedclass.split("|")
        
        console.log(flag[0])
        var changedclassname=flag[3]
        console.log(changedclass)
        //弄一个弹窗，用来报错输入  if
        
        //输入默认值
        if(changeddate=="nochange"&&changedloca=="nochange"&&tflag==1){
            changeddate=flag[0]
            changedloca=flag[2]
            console.log(changeddate)
            console.log(changedloca)
            layer.msg('没有选择日期（默认为不更改，即 '+changeddate+')'+'<br>'+'没有选择上课地点，(默认为不更改，即 '+changedloca+')');
            
        } 
        if(changedloca=="nochange"&&changeddate!="nochange"){
            changedloca=flag[2]
            console.log(changedloca)
            layer.msg('没有选择上课地点，（默认为不更改，即 '+changedloca+'）');
        }
        if(changeddate=="nochange"&&tflag==1&&changedloca!="nochange"){
            changeddate=flag[0]
            console.log(changeddate)
            layer.msg('没有选择日期（默认为不更改，即 '+changeddate+')');
        }
        if((changedstart=="nochange"||changedend=="nochange")&&tflag==1){
            changedtime=flag[1]
            console.log(changedtime)
            tflag=0
            layer.msg('请选择上课时间', function(){
                
            });  
        }
        if(parseInt(changedstart)>parseInt(changedend)){
            tflag=0
            layer.msg('数据错误：课程开始节数大于结束', function(){
                
            });
        }

        if(tflag==1){
            var tinfo1=flag[0]+"|"+flag[1]+"|"+flag[2]
            var tinfo2=changeddate+"|"+changedtime+"|"+changedloca//后续在千米那加上课程名
            var changedinfo=""//用来显示修改信息
            changedinfo=changedclassname+'：<br>'+tinfo1+" → "+tinfo2+'<br>'//“课程名”待换成对应的课程名
            console.log(changedinfo)
    
            //放入修改记录
            var list = document.getElementById("changedsets")
            var listcol = document.createElement("li");
            // listcol.value=changedclass
            tinfo2=tinfo2+"|"+changedclassname
            listcol.setAttribute('value',tinfo2)
            
            
            
            list.appendChild(listcol);
            listcol.innerHTML=changedinfo;
            
            
            //将来用来替换已经修改的信息
            // var listchild=list.children
            // console.log(listchild)
            // for(i=0;i<=listchild.length;i++){
            //     if(listchild[i].value!=changedclass){
            //         console.log(2,listchild[i].value)
                    
            //     }
            //     else{
            //         listchild[i].innerHTML=changedinfo
    
            //     }
            // }
            }
        }
       

   
    
    
    
}
function setdefultchoise(){//初始化修改选择  暂时没有实现
    var changedclass=$("#tochangeclass").val();
    console.log("初始化修改选择成功")
    console.log(changedclass)
    str=changedclass.split("|")
    console.log(str[0])
    
    var changeddate=document.getElementById("tochange_date")
    var changedstart=document.getElementById("tochange_start")
    var changedend=document.getElementById("tochange_end")
    var changeloca=document.getElementById("tochange_loca")
    
    document.getElementsByTagName("选择日期")[0].value=str[0]
    
}
function runchanges(){//运行修改，得到新课表，目前缺少报错

    var classchoise=$("#selectclass").val();//班级，用来传给后端
    var academychoise=$("#selectschool").val();//得到选的的学院
    var oriAndchange = getOAC()

    let formData = new FormData()
    formData.append('classchoise',classchoise)
    formData.append("oriAndchange",JSON.stringify(oriAndchange))
    formData.append("academychoise",academychoise)
    $.ajax({//给后端的信
        url:"http://127.0.0.1:8090/runchanges",//runchanges为方法
        type:"post",
        data:formData,
        contentType: false,
        processData: false,
        success: function(response){//形参  回调函数，通讯成功
            console.log(response)
            console.log('success!')
            var classtab=response['data']
            resettable()//重置课表
            setclasses(classtab,1)//填入课表
        }
    })
    // var starttime=parseInt(changedstart)
    // var endtime=parseInt(changedend)
    // $("#changedsets").find("li").remove()


}
function resettable(){//初始化课表
    for(i=1;i<=14;i++){
        for(j=1;j<=7;j++){
            tdid="c"+String(i)+"."+String(j);
            document.getElementById(tdid).innerHTML='<br><br>';
        }
    }
}
function getOAC(){//得到更新前后的数据
    //数据格式：[[{'班级':'','日期':'','时间':'','地点':'','课程名':''},{}]]
    var changedclass=$("#tochangeclass").val()//原 日期 时间 地点 课程名
    var classchoise=$("#selectclass").val();//班级，用来传给后端
    
    var origininfo = changedclass.split("|")
    // console.log(origininfo)
    var torigin={'班级':classchoise,'日期':origininfo[0],'时间':[origininfo[1]],'地点':[origininfo[2]],'课程名':[origininfo[3]]}//后续要修改
    // console.log(torigin)

    var changedlist = $("#changedsets").children()
    console.log(changedlist[0],12012)
    var oriAndchange=[]//用来存传给后端的字典数组
    for(i=0;i<changedlist.length;i++){
        var value=$(changedlist[i]).attr("value")
        console.log(value)
        changedinfo=value.split("|")
        // console.log(changedinfo[0])
        // console.log(changedinfo[1])
        // console.log(changedinfo[2])
        var tchanged={'班级':classchoise,'日期':changedinfo[0],'时间':[changedinfo[1]],'地点':[changedinfo[2]],'课程名':[changedinfo[3]]}//后续要修改
        console.log(tchanged)

        tinfo=[torigin,tchanged]
        // console.log(tinfo)
        oriAndchange.push(tinfo)

    }
    console.log(oriAndchange,changedlist.length)
    return oriAndchange
}
function randomColor(){
    /*const chars="0123456789abcedf";
    const colorCodelength=6;
    let color ="";
    for(let index=0; index<colorCodelength ; index++){
        const randomNum=Math.floor( Math.random()*chars.length)
        color+=chars.substring(randomNum,randomNum+1);
    }
    console.log("color:",color)*/
    //return color;
    const r=Math.ceil(Math.random()*15);
    const g=Math.ceil(Math.random()*100+100);
    const b=Math.ceil(Math.random()*80+20);
    const a=0.4;
    const color="rgba("+r+','+g+','+b+','+a+")";
    console.log(color);
    return color;
}
function setclasses(classtab,flag){//课表填入课程
    if(flag==1){
        var classname=document.getElementById('chooseclassname')//获得对应班级
        // console.log(classtab[0])
        
        // console.log('当前班级：'+classtab[0]['班级'])
        classname.innerHTML='当前班级：'+classtab[0]['班级']
        for(i in classtab){//循环遍历班级一周的每一节课
            // console.log(classtab[i])
            console.log((classtab[i]['时间'],3212123))
            var weekdate=classtab[i]['日期'][2]//得到星期几上课
            // console.log(weekdate)
            var classtime=classtab[i]['时间'].match(/\d+/g)//得到上课节次(例：7-9节)
            
            // console.log((classtime))
            if(weekdate=='一')
                weekdate=1
            if(weekdate=='二')
                weekdate=2
            if(weekdate=='三')
                weekdate=3
            if(weekdate=='四')
                weekdate=4
            if(weekdate=='五')
                weekdate=5
            if(weekdate=='六')
                weekdate=6
            if(weekdate=='日')
                weekdate=7
            j=classtime[0]
            j=parseInt(j)
            let color=randomColor()
            for(;j<=parseInt(classtime[1]);j++){//把课程放到课表里面,一节一节加
                
                // console.log(typeof(j))
                // console.log(j)
                let t=String(j)
                let classid='c'+t+'.'+weekdate//得到对应表格的id
                // console.log(classid)
                var whatclass=document.getElementById(classid)
                // console.log(whatclass)
                //whatclass.innerHTML=classtab[i]['课程名']+'<br>地点：'+classtab[i]['地点']//在课表上写上课程
                whatclass.innerHTML='<div class="eachclass" onmouseover="openMap(this)" onmouseout="closeMap(this)" style="text-align:center;padding:1px 2px;color:white;border-radius:10px;background-color:'+color+';">'+classtab[i]['课程名']+'<br> 地点：'+classtab[i]['地点']+'</div>'//在课表上写上课程名和地点
            }
        }
    }
    else if(flag==0){
        var $ = layui.jquery, form = layui.form;
        var classname=document.getElementById('chooseclassname')
        console.log(classtab[0])
   
        console.log('当前班级：'+classtab[0]['班级'])
        classname.innerHTML='当前班级：'+classtab[0]['班级']

        var changeclass=document.getElementById('tochangeclass')//得到可改变的课程名
        $("#tochangeclass").find("option").remove()
        var t=new Option('-请选择需要修改的课程-','nochange')
        changeclass.appendChild(t)
        for(i in classtab){//循环遍历班级一周的每一节课
            console.log(classtab[i])
            console.log((classtab[i]['日期'][2]))
            var weekdate=classtab[i]['日期'][2]//得到星期几上课
            console.log(weekdate)
            var classtime=classtab[i]['时间'].match(/\d+/g)//得到上课节次(例：7-9节)
            console.log((classtab[i]['时间']))
            console.log((classtime))
            j=classtime[0]
            if(weekdate=='一')
                weekdate=1
            if(weekdate=='二')
                weekdate=2
            if(weekdate=='三')
                weekdate=3
            if(weekdate=='四')
                weekdate=4
            if(weekdate=='五')
                weekdate=5
            if(weekdate=='六')
                weekdate=6
            if(weekdate=='日')
                weekdate=7
            j=parseInt(j)
            let color=randomColor()
            for(;j<=parseInt(classtime[1]);j++){//把课程放到课表里面,一节一节加
                
                console.log(typeof(j))
                console.log(j)
                let t=String(j)
                let classid='c'+t+'.'+weekdate//得到对应表格的id
                console.log(classid)
                var whatclass=document.getElementById(classid)
                console.log(whatclass)
                whatclass.innerHTML='<div class="eachclass" onmouseover="openMap()" onmouseout="closeMap()" style="text-align:center;padding:1px 2px;color:white;border-radius:10px;background-color:'+color+';">'+classtab[i]['课程名']+'<br> 地点：'+classtab[i]['地点']+'</div>'//在课表上写上课程名和地点
            }
        //把课程放到修改选项
        var opt=new Option(classtab[i]['日期']+'|'+classtab[i]['时间']+'|'+classtab[i]['地点']+'|'+classtab[i]['课程名'],classtab[i]['日期']+'|'+classtab[i]['时间']+'|'+classtab[i]['地点']+'|'+classtab[i]['课程名'])
        //opt.innerText=classtab[i]['课程名']
        changeclass.appendChild(opt)//时间为例
        console.log(opt)
        console.log(typeof(opt))
        form.render('select','toonchangedd');    
        }
    }
}
function sentFeedbacks(feedbacks){//反馈传给后端数据库
    console.log('get_feedbacks_success',typeof(feedbacks))
    let formData = new FormData()//let 局部变量 表格对象
    formData.append('feedbacks',JSON.stringify(feedbacks))
    $.ajax({//给后端的信
        url:"http://127.0.0.1:8090/sentfeedbacks",//getdata为方法
        type:"post",
        data:formData,
        contentType: false,
        processData: false,
        success: function(response){//形参  回调函数，通讯成功
            console.log('success!')
            console.log(response)//后端的内容
            if(response['data']=='success2'){
                layer.msg('提交成功');
            }
        }
    })
}
function openMap(obj){

    
    console.log('mpaopened')
    console.log(typeof(obj))
    layer.open({
        type: 1,
        title: '地图',
        shade: 0,
        area: ['700px','500px'],
        shadeClose: 1,
        
        content:  $('#mapcontainer'),
        scrollbar: 1
        });

}
function closeMap(){
    console.log('mpaclosed')
    layer.close(layer.index);
}
//http://127.0.0.1:8090
///https://szuclass.wenbobobo.icu:8090  更换到服务器上要记得改
//'<div class="eachclass" style="text-align:center;padding:1px 2px;color:white;border-radius:10px;background-color:'+color+';">'+classtab[i]['课程名']+'<br> 地点：'+classtab[i]['地点']+'</div>'