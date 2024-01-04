from xml.sax import default_parser_list
from black import re
from matplotlib.pyplot import text
import numpy as np
import requests,json
from re import X
from typing import Counter
import pymongo
import pandas as pd
from flask import Flask,request
from flask_cors import CORS
import random
import st
# db ='SchoolCourse'
app = Flask(__name__)
cors = CORS(app) #跨域能力
##set FLASK_APP=server cd server set FLASK_ENV=development ， flask run --port 8090 --host 0.0.0.0
@app.route("/",methods={'get','post'})##跟请求的名字
def hello_world():
    return "<h2>Hello, World!</h2>"##向前端返回一段字符,需要改成开发者模式

@app.route("/selectdone",methods={'get','POST'})#传课表数据
def selectDone():
    print("成功来到传课表数据的函数")
    print(request.form.get('classchoise'))

    classChoise=request.form.get('classchoise')
    academyChoise=request.form.get('academychoise')
    # yearChoise=request.form.get('yearchoise')

    print("成功从前端获取的数据")
    print(classChoise)
    print(academyChoise)
    print(st.get_row_class(classChoise,[],academyChoise))
    classTable=st.get_row_class(classChoise,[],academyChoise)
    # classTable=[{'班级':'2021建筑学（卓越班）01','日期':'星期5','时间':'7-8节','地点':'汇文楼'},{'班级':'2021建筑学（卓越班）01','日期':'星期2','时间':'11-14节','地点':'汇文楼'}]
    
    print(classTable)
    return{'data':classTable}

@app.route("/geterror",methods={'POST'})#传报错数据
def getError():
    ##注意数据类型，一般是str，若需要。要转换
    print("成功得到课表目前缺陷")
    dataList=[]
    academyChoise=request.form.get('academychoise')
    OriAndchange=json.loads(request.form.get('oriAndchange'))
    classChoise=request.form.get('classchoise')
    dataList=st.get_cla_df('深圳','深圳大学',classChoise,OriAndchange,academyChoise)
    ##json.dumps(dataList)
    print(OriAndchange,1)
    #return "hello?"
    return{'data':dataList}


@app.route("/selectclass",methods={'POST'})
def selectClass():#返回课程
    print("成功来到选择班级的函数")
    academyChoise=request.form.get('academychoise')
    yearChoise=request.form.get('yearchoise')
    Classes=st.find_class(academyChoise,yearChoise)
    print(Classes)
    return{'data':Classes}

@app.route("/runchanges",methods={'POST'})
def runChanges():#修改课表
    print("成功来到修改课表的函数")
    OriAndchange=json.loads(request.form.get('oriAndchange'))
    classChoise=request.form.get('classchoise')
    academyChoise=request.form.get('academychoise')
    print(type(classChoise))
    print(OriAndchange)
    print(type(OriAndchange[0]))
    print(type(OriAndchange[0][0]))
    print(type(OriAndchange[0][0]['班级']))
    print(type(academyChoise))
    changecla=st.get_row_class(classChoise,OriAndchange,academyChoise)
    print(changecla)
    return {'data':changecla}

@app.route("/sentfeedbacks",methods={'POST'})
def sentFeedbacks():
    feedbacks=json.loads(request.form.get('feedbacks'))
    print(feedbacks)
    respone=st.get_feedback(feedbacks)
    return {'data':respone}

# 得到表格一的数据
@app.route("/getchart1",methods={'POST'})
def getchart1():
    aca=request.form.get('acaname')
    print(aca)
    l=st.get_graph_first(aca)
    l1=l[0][0].tolist()
    l2=l[1][0].tolist()
    print([l1,l2])
    print(type([l1,l2]))
    respone=[l1,l2]
    return {'data':respone}

# 得到表格二的数据
@app.route("/getchart2",methods={'POST'})
def getchart2():
    grade=request.form.get('grade')
    l1=st.get_graph_second(grade[0])
    l2=st.get_graph_second(grade[1])
    l3=st.get_graph_second(grade[2])
    print([l1,l2,l3])
    print(type([l1,l2]))
    respone=[l1,l2,l3]
    return {'data':respone}

# 得到表格三的数据
@app.route("/getchart3",methods={'POST'})
def getchart3():
    aca=request.form.get('acaname')
    print(aca)
    l=st.get_graph_third(aca)
    l1=l[0][0].tolist()
    l2=l[1][0].tolist()
    print([l1,l2])
    print(type([l1,l2]))
    respone=[l1,l2]
    return {'data':respone}

# 得到表格四的数据
@app.route("/getchart4",methods={'POST'})
def getchart4():
    grade=request.form.get('grade')
    l1=st.get_graph_forth(grade[0])
    l2=st.get_graph_forth(grade[1])
    l3=st.get_graph_forth(grade[2])
    print([l1,l2,l3])
    print(type([l1,l2]))
    respone=[l1,l2,l3]
    return {'data':respone}
#---------------------------------------------------------------------------------------------------------------------------------------------------



# myclient = pymongo.MongoClient("mongodb://localhost:27017/")

# dblist = myclient.list_database_names()
# if "SchoolCourse" in dblist:
#   print("数据库已存在！")

# mydb = myclient["SchoolCourse"]
# mycol = mydb["testCourse"]

# class_morn={"1-2节":1.2,"1-3节":1.3,"1-4节":1.4,"1-5节":1.5,"2-3节":2.3,"2-4节":2.4,"2-5节":2.5,"3-4节":3.4,"3-5节":3.5}
# class_afte={"6-7节":6.7,"6-8节":6.8,"6-9节":6.9,"6-10节":7.0,"7-8节":7.8,"7-9节":7.9,"7-10节":8.0,"8-9节":8.9,"8-10节":9.0,"9-10节":10.0}
# class_nigh={"11-12节":12.2,"11-13节":12.3,"11-14节":12.4,"12-13节":13.3,"12-14节":13.4,"13-14节":14.4}
# class_arr=[class_morn,class_afte,class_nigh]

# bad_arr=pd.DataFrame(columns=['班级','日期','时间','策略'])

# #聚合操作1（格式：班级+日期作为主键，属性分别为时间和地点）
# def get_agg1():
#     group_dict=[{"$group":{"_id":{"班级":"$班级","日期":"$日期"},"时间":{"$push":"$时间"},"地点":{"$push":"$地点"}}}]
#     result=mydb["testCourse"].aggregate(group_dict)
#     return result

# #聚合操作2(格式:班级作为主键)
# def get_agg2():
#     group_dict=[{"$group":{"_id":{"班级":"$班级"},"时间":{"$push":"$时间"},"地点":{"$push":"$地点"}}}]
#     result=mydb["testCourse"].aggregate(group_dict)
#     return result

# #获得某点的经纬度
# def gain_location(city,address):
#     api_url=f'https://restapi.amap.com/v3/geocode/geo?city={city}&address={address}&key=dee869bca0eceff229daf4fa8a079114&output=json&callback=showLocation'
#     r=requests.get(api_url)
#     r=r.text
#     r=r.strip('showLocation(')
#     r=r.strip(')')
#     jsonData=json.loads(r)['geocodes'][0]['location']
#     return jsonData

# #获得两点之间步行的相关信息
# def get_route(city,origin,destination):
#     api=f'https://restapi.amap.com/v3/direction/walking?origin={origin}&destination={destination}&output=JSON&key=dee869bca0eceff229daf4fa8a079114&city={city}'
#     r=requests.get(api)
#     r=r.text
#     jsonData=json.loads(r)
#     return jsonData             

# #获得两点间步行路径时间
# def get_route_info(city,start,end):
#     route=[]
#     route.append(start)
#     route.append(end)
#     ori=gain_location(city,start)
#     des=gain_location(city,end)
#     info=get_route(city,ori,des)
#     if info['info']=='ok':
#         try:
#             duration=info['route']['paths'][0]['duration']
#         except:
#             duration='null'
        
#     return duration        

# #查找周边一公里内的餐饮服务并判断步行时间是否超过10分钟
# def sel_around(city,name):
#     location=gain_location(city,name)
#     api=f'https://restapi.amap.com/v3/place/around?key=dee869bca0eceff229daf4fa8a079114&city={city}&location={location}&types=050000&radius=1000&output=JSON'
#     r=requests.get(api)
#     r=r.text
#     jsonData=json.loads(r)
#     for record in range(10):
#         count=0
#         if(int(get_route_info(city,name,jsonData['pois'][record]['address']))<600):
#             count+=1
#     if(count==0):
#         return False
#     else:
#         return True
    
# #class_count为该班级每星期课程总数
# def get_sum(cla_name):
#     group_dict=[{"$group":{"_id":"$班级","class_count":{"$sum":1}}}]
#     str5=mydb["testCourse"].aggregate(group_dict)
#     for record in str5:
#         if(cla_name in record['_id']):
#             print(record)

# #找到课程对应的数字
# def get_number(record,j):
#     for cla_key in class_arr:
#         for value in cla_key.keys():
#             if(record['时间'][j]==value):
#                 number=round(cla_key[value],1)
#     return number 

# #策略1：邻近课程上课地点不能超过600秒步行时间  
# def stra_cla_dis(city,uniname):
#     result=get_agg1()
#     uniname=uniname
#     city=city
#     for record in result:
#         for j in range(len(record['时间'])-1):
#             for m in range(3):
#                 if(record["时间"][j] in class_arr[m] and (record["时间"][j+1] in class_arr[m])):
#                     #距离判断
#                     start=[uniname+record['地点'][j]]
#                     end=[uniname+record['地点'][j+1]]
#                     if  int(get_route_info(city,start,end))>600:
#                         #存入bad_arr
#                         #print(record['_id'],"的第",record['时间'][j],'和第',record['时间'][j+1],'节课不符合策略：邻近课程上课地点不能超过600秒步行时间 ')
#                         bad_arr_app=pd.DataFrame([[record['_id']['班级'],record['_id']['日期'],record['时间'][j]+'和'+record['时间'][j+1],'邻近课程上课地点超过600秒步行时间']],columns=['班级','日期','时间','策略'])
#                         global bad_arr
#                         bad_arr=bad_arr.append(bad_arr_app,ignore_index=True)
#                     break
#                 else:
#                     continue
    

# #策略2：3-4节和9-10节课程的上课地点不能离食堂太远
# def stra_cant(city,uniname):
#     result=get_agg1()
#     for record in result:
#         for j in range(len(record['时间'])-1):
#             if(record["时间"][j]=="3-4节" or record["时间"][j]=="9-10节"):
#                 flag=sel_around(city,uniname+record["地点"][j])
#                 if(flag==False):
#                     #print(record['_id'],"的第",record['时间'][j],'节课不符合策略:3-4节和9-10节课程的上课地点不能离食堂太远')
#                     bad_arr_app=pd.DataFrame([[record['_id']['班级'],record['_id']['日期'],record['时间'][j],record['时间'][j]+'的上课地点离食堂太远']],columns=['班级','日期','时间','策略'])
#                     global bad_arr
#                     bad_arr=bad_arr.append(bad_arr_app,ignore_index=True)

# #策略3: 3-5节和7节不能都要上课
# def stra_morn_after():
#     result=get_agg1()
#     for record in result:
#         for j in range(len(record['时间'])-1):
#             if(record["时间"][j]=='3-5节' and '7' in record["时间"][j+1]):
#                 #print(record['_id'],'3-5节和第7节都要上课')
#                 bad_arr_app=pd.DataFrame([[record['_id']['班级'],record['_id']['日期'],record['时间'][j],'3-5节和7节都要上课']],columns=['班级','日期','时间','策略'])
#                 global bad_arr
#                 bad_arr=bad_arr.append(bad_arr_app,ignore_index=True)

# #策略4: 9-10节和11节不能都要上课
# def stra_after_night():
#     result=get_agg1()
#     for record in result:
#         for j in range(len(record['时间'])-1):
#             if(record["时间"][j]=='9-10节' and '11' in record["时间"][j+1]):
#                 #print(record['_id'],'9-10节和11节都要上课')
#                 bad_arr_app=pd.DataFrame([[record['_id']['班级'],record['_id']['日期'],record['时间'][j],'9-10节和11节都要上课']],columns=['班级','日期','时间','策略'])
#                 global bad_arr
#                 bad_arr=bad_arr.append(bad_arr_app,ignore_index=True)

# #策略5：十二十三节课间只有十分钟，除非十二十三节在同一个地点，否则十二节和十三节不能都要上课
# def stra_twe_thir(city):
#     result=get_agg1()
#     for record in result:
#         for j in range(len(record['时间'])-1):
#             if(record["时间"][j]=='11-12节' and '13-14节' in record["时间"][j+1]):
#                 if(gain_location(city,record['地点'][j])!=gain_location(city,record['地点'][j+1])):
#                     #print(record['_id'],'11-12节和13节都要上课且不在同一地点')
#                     #存入bad_arr
#                     bad_arr_app=pd.DataFrame([[record['_id']['班级'],record['_id']['日期'],record['时间'][j],'11-12节和13-14节都要上课']],columns=['班级','日期','时间','策略'])
#                     global bad_arr
#                     bad_arr=bad_arr.append(bad_arr_app,ignore_index=True)

# #sum班级每周中四节课连着上的次数
# def stra_four(city,cla_name):
#     result=get_agg2()
#     sum=0
#     for record in result:
#         if(record["_id"]["班级"]==cla_name):
#             for j in range(len(record['时间'])-1):
#                 number_j1=get_number(record,j)
#                 number_j2=get_number(record,j+1)
#                 if(round(number_j2-number_j1,1)==2.2):
#                     sum+=1
#     return sum

# #输出指定班级一周所有课程
# def get_week_class(cla_name):
#     result=get_agg1()
#     week_arr=pd.DataFrame(columns=['日期','时间','地点'])
#     for record in result:
#         if(record['_id']['班级']==cla_name):
#             for j in range(len(record['时间'])-1):
#                 week_arr_app=pd.DataFrame([[record['_id']['日期'],record['时间'][j],record['地点'][j]]],columns=['日期','时间','地点'])
#                 week_arr=week_arr.append(week_arr_app,ignore_index=True)
#     return week_arr   

# #得到所有违背策略的课程并按照班级分类
# def get_dataframe(city,uniname,cla_name):
#     stra_after_night()
#     # stra_morn_after()
#     # stra_cant(city,uniname)
#     # stra_cla_dis(city,uniname)
#     # stra_twe_thir(city)
#     # stra_four(city,cla_name)
#     result={}
#     index=0
#     flag=0
#     count=0
#     for record in bad_arr.iterrows():
#         if(record[1]['班级'] not in result):
#             result[record[1]['班级']]=[record[1]['班级']+record[1]['日期']+'第'+record[1]['时间']+record[1]['策略']]
#         else:
#             result[record[1]['班级']].append(record[1]['班级']+record[1]['日期']+'第'+record[1]['时间']+record[1]['策略'])
#     for arr_record in result.keys():
#         if(cla_name==arr_record):
#             return(result[arr_record])
    
        
      

# # x=get_dataframe('深圳','深圳大学','2021建筑学（卓越班）01')
# # # print(get_week_class('2020建筑学02')) 
# # print(x)



# # dataList=st.get_cla_df('深圳','深圳大学','2021建筑学（卓越班）01')
# #     ##json.dumps(dataList)
# # print(dataList)
# stra_cant('深圳','深圳大学')