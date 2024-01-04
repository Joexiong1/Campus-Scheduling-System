allaca=[
"教育学部",
"艺术学部",
"医学部",
"马克思主义学院",
"经济学院",
"法学院",
"心理学院",
"体育学院",
"人文学院",
"外国语学院",
"传播学院",
"数学与统计学院",
"物理与光电工程学院",
"化学与环境工程学院",
"生命与海洋科学学院",
"机电与控制工程学院",
"材料学院",
"电子与信息工程学院",
"计算机与软件学院",
"建筑与城市规划学院",
"土木与交通工程学院",
"管理学院",
"政府管理学院",
"高等研究院",
"金融科技学院",
"国际交流学院"]
function acainfo(acaname,flag){
    //到时候和后端链接获得数据
    let formData = new FormData()
    formData.append('acaname',acaname)
    if(flag==1){
        $.ajax({//给后端的信
            url:"http://127.0.0.1:8090/getchart1",//getdata为方法
            type:"post",
    
            data:formData,
            contentType: false,
            processData: false,
            success: function(response){//形参  回调函数，通讯成功
                console.log('success!')
                console.log(response)//后端的内容
                temp1= response['data']
                console.log(temp1)
                initchart1(temp1)
            }
        })
        
    }
    if(flag==3){
        $.ajax({//给后端的信
            url:"http://127.0.0.1:8090/getchart3",//getdata为方法
            type:"post",
    
            data:formData,
            contentType: false,
            processData: false,
            success: function(response){//形参  回调函数，通讯成功
                console.log('success!')
                console.log(response)//后端的内容
                temp3= response['data']
                console.log(temp3)
                initchart3(temp3)
            }
        })
    }
}
function schinfo(flag){
    let formData = new FormData()
    grades=['2021','2020','2019']
    formData.append('grade',grades)
    if(flag==2){
        $.ajax({//给后端的信
            url:"http://127.0.0.1:8090/getchart2",//getdata为方法
            type:"post",
            data:formData,
            contentType: false,
            processData: false,
            success: function(response){//形参  回调函数，通讯成功
                console.log('success!')
                console.log(response)//后端的内容
                temp2= response['data']
                console.log(temp2)
                initchart2(temp2)
            }
        })
        
    }
    if(flag==4){
        $.ajax({//给后端的信
            url:"http://127.0.0.1:8090/getchart4",//getdata为方法
            type:"post",
            data:formData,
            contentType: false,
            processData: false,
            success: function(response){//形参  回调函数，通讯成功
                console.log('success!')
                console.log(response)//后端的内容
                temp4= response['data']
                console.log(temp4)
                initchart4(temp4)
            }
        })
        
    }
}
function initchart1(temp1){
    var myChart = echarts.init(document.getElementById('main1'));
    myChart.clear();
    // 指定图表的配置项和数据
    var option = {
        title:{
            text: '各年级班级总数与存在缺陷班级总数',
            left: 'center'
        },
        color: ['#087BFF', '#E91E1E'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
            type: 'shadow'
            }
        },
        toolbox: {
            show: true,
            feature: {
              mark: { show: true },
              dataView: { show: true, readOnly: true },
              saveAsImage: { show: true }
            }
          },
        legend: {
            left:'3%'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
        },
        yAxis: {
            type: 'category',
            data: ['2019', '2020', '2021']
        },
        series: [
            {
            name: '该年级班级数',
            type: 'bar',
            data: temp1[0]
            },
            {
            name: '该年级拥有错误的班级数',
            type: 'bar',
            data: temp1[1]
            }
        ]
        };
    myChart.setOption(option);
}
function initchart2(temp2){
    var myChart = echarts.init(document.getElementById('main2'));
    myChart.clear();
    var option = {
        title: [
            {
                text: '各学院拥有缺陷课程的班级占比',
                left: 'center'
            },
            {
                subtext: '2021级',
                left: '3%',
                top: '20%',
                textAlign: 'center'
            },
            {
                subtext: '2020级',
                left: '50%',
                top: '20%',
                textAlign: 'center'
            },
            {
                subtext: '2019级',
                left: '3%',
                top: '75%',
                textAlign: 'center'
            },
            {
                subtext: '三个年级',
                left: '50%',
                top: '75%',
                textAlign: 'center'
            }
        ],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: true },
            saveAsImage: { show: true }
          }
        },
        series: [
          {
            name: '2021级',
            type: 'pie',
            radius: [20, 90],
            center: ['25%', '25%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 5
            },
            label: {
              show: true
            },
            emphasis: {
              label: {
                show: true
              }
            },
            data: [
              { value: temp2[0][allaca[0]], name: allaca[0] },
              { value: temp2[0][allaca[1]], name: allaca[1] },
              { value: temp2[0][allaca[2]], name: allaca[2] },
              { value: temp2[0][allaca[3]], name: allaca[3] },
              { value: temp2[0][allaca[4]], name: allaca[4] },
              { value: temp2[0][allaca[5]], name: allaca[5] },
              { value: temp2[0][allaca[6]], name: allaca[6] },
              { value: temp2[0][allaca[7]], name: allaca[7] },
              { value: temp2[0][allaca[8]], name: allaca[8] },
              { value: temp2[0][allaca[9]], name: allaca[9] },
              { value: temp2[0][allaca[10]], name: allaca[10] },
              { value: temp2[0][allaca[11]], name: allaca[11] },
              { value: temp2[0][allaca[12]], name: allaca[12] },
              { value: temp2[0][allaca[13]], name: allaca[13] },
              { value: temp2[0][allaca[14]], name: allaca[14] },
              { value: temp2[0][allaca[15]], name: allaca[15] },
              { value: temp2[0][allaca[16]], name: allaca[16] },
              { value: temp2[0][allaca[17]], name: allaca[17] },
              { value: temp2[0][allaca[18]], name: allaca[18] },
              { value: temp2[0][allaca[19]], name: allaca[19] },
              { value: temp2[0][allaca[20]], name: allaca[20] },
              { value: temp2[0][allaca[21]], name: allaca[21] },
              { value: temp2[0][allaca[22]], name: allaca[22] },
              { value: temp2[0][allaca[23]], name: allaca[23] },
              { value: temp2[0][allaca[24]], name: allaca[24] },
              { value: temp2[0][allaca[25]], name: allaca[25] }
            ]
          },
          {
            name: '2020级',
            type: 'pie',
            radius: [20, 90],
            center: ['75%', '25%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 5
            },
            data: [
                { value: temp2[1][allaca[0]], name: allaca[0] },
                { value: temp2[1][allaca[1]], name: allaca[1] },
                { value: temp2[1][allaca[2]], name: allaca[2] },
                { value: temp2[1][allaca[3]], name: allaca[3] },
                { value: temp2[1][allaca[4]], name: allaca[4] },
                { value: temp2[1][allaca[5]], name: allaca[5] },
                { value: temp2[1][allaca[6]], name: allaca[6] },
                { value: temp2[1][allaca[7]], name: allaca[7] },
                { value: temp2[1][allaca[8]], name: allaca[8] },
                { value: temp2[1][allaca[9]], name: allaca[9] },
                { value: temp2[1][allaca[10]], name: allaca[10] },
                { value: temp2[1][allaca[11]], name: allaca[11] },
                { value: temp2[1][allaca[12]], name: allaca[12] },
                { value: temp2[1][allaca[13]], name: allaca[13] },
                { value: temp2[1][allaca[14]], name: allaca[14] },
                { value: temp2[1][allaca[15]], name: allaca[15] },
                { value: temp2[1][allaca[16]], name: allaca[16] },
                { value: temp2[1][allaca[17]], name: allaca[17] },
                { value: temp2[1][allaca[18]], name: allaca[18] },
                { value: temp2[1][allaca[19]], name: allaca[19] },
                { value: temp2[1][allaca[20]], name: allaca[20] },
                { value: temp2[1][allaca[21]], name: allaca[21] },
                { value: temp2[1][allaca[22]], name: allaca[22] },
                { value: temp2[1][allaca[23]], name: allaca[23] },
                { value: temp2[1][allaca[24]], name: allaca[24] },
                { value: temp2[1][allaca[25]], name: allaca[25] }
            ]
          },
          {
            name: '2019级',
            type: 'pie',
            radius: [20, 90],
            center: ['25%', '75%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 5
            },
            label: {
              show: true
            },
            emphasis: {
              label: {
                show: true
              }
            },
            data: [
                { value: temp2[2][allaca[0]], name: allaca[0] },
                { value: temp2[2][allaca[1]], name: allaca[1] },
                { value: temp2[2][allaca[2]], name: allaca[2] },
                { value: temp2[2][allaca[3]], name: allaca[3] },
                { value: temp2[2][allaca[4]], name: allaca[4] },
                { value: temp2[2][allaca[5]], name: allaca[5] },
                { value: temp2[2][allaca[6]], name: allaca[6] },
                { value: temp2[2][allaca[7]], name: allaca[7] },
                { value: temp2[2][allaca[8]], name: allaca[8] },
                { value: temp2[2][allaca[9]], name: allaca[9] },
                { value: temp2[2][allaca[10]], name: allaca[10] },
                { value: temp2[2][allaca[11]], name: allaca[11] },
                { value: temp2[2][allaca[12]], name: allaca[12] },
                { value: temp2[2][allaca[13]], name: allaca[13] },
                { value: temp2[2][allaca[14]], name: allaca[14] },
                { value: temp2[2][allaca[15]], name: allaca[15] },
                { value: temp2[2][allaca[16]], name: allaca[16] },
                { value: temp2[2][allaca[17]], name: allaca[17] },
                { value: temp2[2][allaca[18]], name: allaca[18] },
                { value: temp2[2][allaca[19]], name: allaca[19] },
                { value: temp2[2][allaca[20]], name: allaca[20] },
                { value: temp2[2][allaca[21]], name: allaca[21] },
                { value: temp2[2][allaca[22]], name: allaca[22] },
                { value: temp2[2][allaca[23]], name: allaca[23] },
                { value: temp2[2][allaca[24]], name: allaca[24] },
                { value: temp2[2][allaca[25]], name: allaca[25] }
            ]
          },
          {
            name: '三个年级',
            type: 'pie',
            radius: [20, 90],
            center: ['75%', '75%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 5
            },
            data: [
                { value: temp2[0][allaca[0]]+temp2[1][allaca[0]]+temp2[2][allaca[0]], name: allaca[0] },
                { value: temp2[0][allaca[1]]+temp2[1][allaca[1]]+temp2[2][allaca[1]], name: allaca[1] },
                { value: temp2[0][allaca[2]]+temp2[1][allaca[2]]+temp2[2][allaca[2]], name: allaca[2] },
                { value: temp2[0][allaca[3]]+temp2[1][allaca[3]]+temp2[2][allaca[3]], name: allaca[3] },
                { value: temp2[0][allaca[4]]+temp2[1][allaca[4]]+temp2[2][allaca[4]], name: allaca[4] },
                { value: temp2[0][allaca[5]]+temp2[1][allaca[5]]+temp2[2][allaca[5]], name: allaca[5] },
                { value: temp2[0][allaca[6]]+temp2[1][allaca[6]]+temp2[2][allaca[6]], name: allaca[6] },
                { value: temp2[0][allaca[7]]+temp2[1][allaca[7]]+temp2[2][allaca[7]], name: allaca[7] },
                { value: temp2[0][allaca[8]]+temp2[1][allaca[8]]+temp2[2][allaca[8]], name: allaca[8] },
                { value: temp2[0][allaca[9]]+temp2[1][allaca[9]]+temp2[2][allaca[9]], name: allaca[9] },
                { value: temp2[0][allaca[10]]+temp2[1][allaca[10]]+temp2[2][allaca[10]], name: allaca[10] },
                { value: temp2[0][allaca[11]]+temp2[1][allaca[11]]+temp2[2][allaca[11]], name: allaca[11] },
                { value: temp2[0][allaca[12]]+temp2[1][allaca[12]]+temp2[2][allaca[12]], name: allaca[12] },
                { value: temp2[0][allaca[13]]+temp2[1][allaca[13]]+temp2[2][allaca[13]], name: allaca[13] },
                { value: temp2[0][allaca[14]]+temp2[1][allaca[14]]+temp2[2][allaca[14]], name: allaca[14] },
                { value: temp2[0][allaca[15]]+temp2[1][allaca[15]]+temp2[2][allaca[15]], name: allaca[15] },
                { value: temp2[0][allaca[16]]+temp2[1][allaca[16]]+temp2[2][allaca[16]], name: allaca[16] },
                { value: temp2[0][allaca[17]]+temp2[1][allaca[17]]+temp2[2][allaca[17]], name: allaca[17] },
                { value: temp2[0][allaca[18]]+temp2[1][allaca[18]]+temp2[2][allaca[18]], name: allaca[18] },
                { value: temp2[0][allaca[19]]+temp2[1][allaca[19]]+temp2[2][allaca[19]], name: allaca[19] },
                { value: temp2[0][allaca[20]]+temp2[1][allaca[20]]+temp2[2][allaca[20]], name: allaca[20] },
                { value: temp2[0][allaca[21]]+temp2[1][allaca[21]]+temp2[2][allaca[21]], name: allaca[21] },
                { value: temp2[0][allaca[22]]+temp2[1][allaca[22]]+temp2[2][allaca[22]], name: allaca[22] },
                { value: temp2[0][allaca[23]]+temp2[1][allaca[23]]+temp2[2][allaca[23]], name: allaca[23] },
                { value: temp2[0][allaca[24]]+temp2[1][allaca[24]]+temp2[2][allaca[24]], name: allaca[24] },
                { value: temp2[0][allaca[25]]+temp2[1][allaca[25]]+temp2[2][allaca[25]], name: allaca[25] }
            ]
          }
        ]
      };
      myChart.setOption(option);
}
function initchart3(temp3){
    var myChart = echarts.init(document.getElementById('main3'));
    myChart.clear();
    // 指定图表的配置项和数据
    var option = {
        title:{
            text: '各年级课程总数与存在缺陷的课程总数',
            left: 'center'
        },
        color: ['#1ED4E9', '#D7E91E'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
            type: 'shadow'
            }
        },
        toolbox: {
            show: true,
            feature: {
              mark: { show: true },
              dataView: { show: true, readOnly: true },
              saveAsImage: { show: true }
            }
          },
        legend: {
            left:'3%'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
        },
        yAxis: {
            type: 'category',
            data: ['2019', '2020', '2021']
        },
        series: [
            {
            name: '该年级班级数',
            type: 'bar',
            data: temp3[0]
            },
            {
            name: '该年级拥有错误的班级数',
            type: 'bar',
            data: temp3[1]
            }
        ]
        };
    myChart.setOption(option);
}
function initchart4(temp2){
    var myChart = echarts.init(document.getElementById('main4'));
    myChart.clear();
    var option = {
        title: [
            {
                text: '各学院拥的缺陷课程占比',
                left: 'center'
            },
            {
                subtext: '2021级',
                left: '3%',
                top: '20%',
                textAlign: 'center'
            },
            {
                subtext: '2020级',
                left: '50%',
                top: '20%',
                textAlign: 'center'
            },
            {
                subtext: '2019级',
                left: '3%',
                top: '75%',
                textAlign: 'center'
            },
            {
                subtext: '三个年级',
                left: '50%',
                top: '75%',
                textAlign: 'center'
            }
        ],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: true },
            saveAsImage: { show: true }
          }
        },
        series: [
          {
            name: '2021级',
            type: 'pie',
            radius: [20, 90],
            center: ['25%', '25%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 5
            },
            label: {
              show: true
            },
            emphasis: {
              label: {
                show: true
              }
            },
            data: [
                { value: temp4[0][allaca[0]], name: allaca[0] },
                { value: temp4[0][allaca[1]], name: allaca[1] },
                { value: temp4[0][allaca[2]], name: allaca[2] },
                { value: temp4[0][allaca[3]], name: allaca[3] },
                { value: temp4[0][allaca[4]], name: allaca[4] },
                { value: temp4[0][allaca[5]], name: allaca[5] },
                { value: temp4[0][allaca[6]], name: allaca[6] },
                { value: temp4[0][allaca[7]], name: allaca[7] },
                { value: temp4[0][allaca[8]], name: allaca[8] },
                { value: temp4[0][allaca[9]], name: allaca[9] },
                { value: temp4[0][allaca[10]], name: allaca[10] },
                { value: temp4[0][allaca[11]], name: allaca[11] },
                { value: temp4[0][allaca[12]], name: allaca[12] },
                { value: temp4[0][allaca[13]], name: allaca[13] },
                { value: temp4[0][allaca[14]], name: allaca[14] },
                { value: temp4[0][allaca[15]], name: allaca[15] },
                { value: temp4[0][allaca[16]], name: allaca[16] },
                { value: temp4[0][allaca[17]], name: allaca[17] },
                { value: temp4[0][allaca[18]], name: allaca[18] },
                { value: temp4[0][allaca[19]], name: allaca[19] },
                { value: temp4[0][allaca[20]], name: allaca[20] },
                { value: temp4[0][allaca[21]], name: allaca[21] },
                { value: temp4[0][allaca[22]], name: allaca[22] },
                { value: temp4[0][allaca[23]], name: allaca[23] },
                { value: temp4[0][allaca[24]], name: allaca[24] },
                { value: temp4[0][allaca[25]], name: allaca[25] }
            ]
          },
          {
            name: '2020级',
            type: 'pie',
            radius: [20, 90],
            center: ['75%', '25%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 5
            },
            data: [
                { value: temp4[1][allaca[0]], name: allaca[0] },
                { value: temp4[1][allaca[1]], name: allaca[1] },
                { value: temp4[1][allaca[2]], name: allaca[2] },
                { value: temp4[1][allaca[3]], name: allaca[3] },
                { value: temp4[1][allaca[4]], name: allaca[4] },
                { value: temp4[1][allaca[5]], name: allaca[5] },
                { value: temp4[1][allaca[6]], name: allaca[6] },
                { value: temp4[1][allaca[7]], name: allaca[7] },
                { value: temp4[1][allaca[8]], name: allaca[8] },
                { value: temp4[1][allaca[9]], name: allaca[9] },
                { value: temp4[1][allaca[10]], name: allaca[10] },
                { value: temp4[1][allaca[11]], name: allaca[11] },
                { value: temp4[1][allaca[12]], name: allaca[12] },
                { value: temp4[1][allaca[13]], name: allaca[13] },
                { value: temp4[1][allaca[14]], name: allaca[14] },
                { value: temp4[1][allaca[15]], name: allaca[15] },
                { value: temp4[1][allaca[16]], name: allaca[16] },
                { value: temp4[1][allaca[17]], name: allaca[17] },
                { value: temp4[1][allaca[18]], name: allaca[18] },
                { value: temp4[1][allaca[19]], name: allaca[19] },
                { value: temp4[1][allaca[20]], name: allaca[20] },
                { value: temp4[1][allaca[21]], name: allaca[21] },
                { value: temp4[1][allaca[22]], name: allaca[22] },
                { value: temp4[1][allaca[23]], name: allaca[23] },
                { value: temp4[1][allaca[24]], name: allaca[24] },
                { value: temp4[1][allaca[25]], name: allaca[25] }
            ]
          },
          {
            name: '2019级',
            type: 'pie',
            radius: [20, 90],
            center: ['25%', '75%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 5
            },
            label: {
              show: true
            },
            emphasis: {
              label: {
                show: true
              }
            },
            data: [
                { value: temp4[2][allaca[0]], name: allaca[0] },
                { value: temp4[2][allaca[1]], name: allaca[1] },
                { value: temp4[2][allaca[2]], name: allaca[2] },
                { value: temp4[2][allaca[3]], name: allaca[3] },
                { value: temp4[2][allaca[4]], name: allaca[4] },
                { value: temp4[2][allaca[5]], name: allaca[5] },
                { value: temp4[2][allaca[6]], name: allaca[6] },
                { value: temp4[2][allaca[7]], name: allaca[7] },
                { value: temp4[2][allaca[8]], name: allaca[8] },
                { value: temp4[2][allaca[9]], name: allaca[9] },
                { value: temp4[2][allaca[10]], name: allaca[10] },
                { value: temp4[2][allaca[11]], name: allaca[11] },
                { value: temp4[2][allaca[12]], name: allaca[12] },
                { value: temp4[2][allaca[13]], name: allaca[13] },
                { value: temp4[2][allaca[14]], name: allaca[14] },
                { value: temp4[2][allaca[15]], name: allaca[15] },
                { value: temp4[2][allaca[16]], name: allaca[16] },
                { value: temp4[2][allaca[17]], name: allaca[17] },
                { value: temp4[2][allaca[18]], name: allaca[18] },
                { value: temp4[2][allaca[19]], name: allaca[19] },
                { value: temp4[2][allaca[20]], name: allaca[20] },
                { value: temp4[2][allaca[21]], name: allaca[21] },
                { value: temp4[2][allaca[22]], name: allaca[22] },
                { value: temp4[2][allaca[23]], name: allaca[23] },
                { value: temp4[2][allaca[24]], name: allaca[24] },
                { value: temp4[2][allaca[25]], name: allaca[25] }
            ]
          },
          {
            name: '2018级',
            type: 'pie',
            radius: [20, 90],
            center: ['75%', '75%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 5
            },
            data: [
                { value: temp4[0][allaca[0]]+temp4[1][allaca[0]]+temp4[2][allaca[0]], name: allaca[0] },
                { value: temp4[0][allaca[1]]+temp4[1][allaca[1]]+temp4[2][allaca[1]], name: allaca[1] },
                { value: temp4[0][allaca[2]]+temp4[1][allaca[2]]+temp4[2][allaca[2]], name: allaca[2] },
                { value: temp4[0][allaca[3]]+temp4[1][allaca[3]]+temp4[2][allaca[3]], name: allaca[3] },
                { value: temp4[0][allaca[4]]+temp4[1][allaca[4]]+temp4[2][allaca[4]], name: allaca[4] },
                { value: temp4[0][allaca[5]]+temp4[1][allaca[5]]+temp4[2][allaca[5]], name: allaca[5] },
                { value: temp4[0][allaca[6]]+temp4[1][allaca[6]]+temp4[2][allaca[6]], name: allaca[6] },
                { value: temp4[0][allaca[7]]+temp4[1][allaca[7]]+temp4[2][allaca[7]], name: allaca[7] },
                { value: temp4[0][allaca[8]]+temp4[1][allaca[8]]+temp4[2][allaca[8]], name: allaca[8] },
                { value: temp4[0][allaca[9]]+temp4[1][allaca[9]]+temp4[2][allaca[9]], name: allaca[9] },
                { value: temp4[0][allaca[10]]+temp4[1][allaca[10]]+temp4[2][allaca[10]], name: allaca[10] },
                { value: temp4[0][allaca[11]]+temp4[1][allaca[11]]+temp4[2][allaca[11]], name: allaca[11] },
                { value: temp4[0][allaca[12]]+temp4[1][allaca[12]]+temp4[2][allaca[12]], name: allaca[12] },
                { value: temp4[0][allaca[13]]+temp4[1][allaca[13]]+temp4[2][allaca[13]], name: allaca[13] },
                { value: temp4[0][allaca[14]]+temp4[1][allaca[14]]+temp4[2][allaca[14]], name: allaca[14] },
                { value: temp4[0][allaca[15]]+temp4[1][allaca[15]]+temp4[2][allaca[15]], name: allaca[15] },
                { value: temp4[0][allaca[16]]+temp4[1][allaca[16]]+temp4[2][allaca[16]], name: allaca[16] },
                { value: temp4[0][allaca[17]]+temp4[1][allaca[17]]+temp4[2][allaca[17]], name: allaca[17] },
                { value: temp4[0][allaca[18]]+temp4[1][allaca[18]]+temp4[2][allaca[18]], name: allaca[18] },
                { value: temp4[0][allaca[19]]+temp4[1][allaca[19]]+temp4[2][allaca[19]], name: allaca[19] },
                { value: temp4[0][allaca[20]]+temp4[1][allaca[20]]+temp4[2][allaca[20]], name: allaca[20] },
                { value: temp4[0][allaca[21]]+temp4[1][allaca[21]]+temp4[2][allaca[21]], name: allaca[21] },
                { value: temp4[0][allaca[22]]+temp4[1][allaca[22]]+temp4[2][allaca[22]], name: allaca[22] },
                { value: temp4[0][allaca[23]]+temp4[1][allaca[23]]+temp4[2][allaca[23]], name: allaca[23] },
                { value: temp4[0][allaca[24]]+temp4[1][allaca[24]]+temp4[2][allaca[24]], name: allaca[24] },
                { value: temp4[0][allaca[25]]+temp4[1][allaca[25]]+temp4[2][allaca[25]], name: allaca[25] }
            ]
          }
        ]
      };
      myChart.setOption(option);
}