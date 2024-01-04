# -*- coding:utf-8 -*-
from ctypes import sizeof
from matplotlib.pyplot import text
from flask import Flask
from pprint import *
import numpy as np
import pandas as pd
import requests,json
from re import X
from typing import Counter
import pymongo
myclient = pymongo.MongoClient("mongodb://localhost:27017/")

dblist = myclient.list_database_names()
if "SchoolCourse" in dblist:
  print("数据库已存在！")

#连接指定学院数据库
def get_academy(aca_name):
    print('getacademysuccess')
    mydb = myclient["SchoolCourse"]
    mycol = mydb[aca_name]
    return mycol

class_morn={"1-2节":1.2,"1-3节":1.3,"1-4节":1.4,"1-5节":1.5,"2-3节":2.3,"2-4节":2.4,"2-5节":2.5,"3-4节":3.4,"3-5节":3.5}
class_afte={"6-7节":6.7,"6-8节":6.8,"6-9节":6.9,"6-10节":7.0,"7-8节":7.8,"7-9节":7.9,"7-10节":8.0,"8-9节":8.9,"8-10节":9.0,"9-10节":10.0}
class_nigh={"11-12节":12.2,"11-13节":12.3,"11-14节":12.4,"12-13节":13.3,"12-14节":13.4,"13-14节":14.4}
class_arr=[class_morn,class_afte,class_nigh]

day_dict={"星期一":0,"星期二":1,"星期三":2,"星期四":3,"星期五":4,"星期六":5,"星期七":6}

bad_arr=pd.DataFrame(columns=['班级','日期','时间','策略'])

#收集反馈信息
def get_feedback(feedback):
    print('success1')
    mydb = myclient["feedback_db"]
    mycol = mydb["feedbacks"]
    response=mycol.insert_one(feedback)
    response='success2'
    return response


#聚合操作1（格式：班级+日期作为主键，属性分别为时间和地点）
def get_agg1(aca_name):
    group_dict=[{"$group":{"_id":{"班级":"$班级","日期":"$日期"},"时间":{"$push":"$时间"},"地点":{"$push":"$地点"},"课程名":{"$push":"$课程名"}}}]
    result=get_academy(aca_name).aggregate(group_dict)
    return result

#聚合操作2(格式:班级作为主键,不带日期)
def get_agg2(aca_name):
    group_dict=[{"$group":{"_id":{"班级":"$班级"},"时间":{"$push":"$时间"},"地点":{"$push":"$地点"}}}]
    result=get_academy(aca_name).aggregate(group_dict)
    return result

#聚合操作3(格式：班级作为主键，带日期)
def get_agg3(aca_name):
    group_dict=[{"$group":{"_id":{"班级":"$班级"},"日期":{"$push":"$日期"},"时间":{"$push":"$时间"},"地点":{"$push":"$地点"}}}]
    result=get_academy(aca_name).aggregate(group_dict)
    return result

#获得某点的经纬度
def gain_location(city,address):
    api_url=f'https://restapi.amap.com/v3/geocode/geo?city={city}&address={address}&key=6e029ddeb239d2582fce453e845a57e4&output=json&callback=showLocation'
    r=requests.get(api_url)
    r=r.text
    r=r.strip('showLocation(')
    r=r.strip(')')
    jsonData=json.loads(r)
    if jsonData['info']=='OK':
        try:
            jsonData=json.loads(r)['geocodes'][0]['location']
        except:
            jsonData='null'
    return jsonData

#获得两点之间步行的相关信息
def get_route(city,origin,destination):
    api=f'https://restapi.amap.com/v3/direction/walking?origin={origin}&destination={destination}&output=JSON&key=6e029ddeb239d2582fce453e845a57e4&city={city}'
    r=requests.get(api)
    r=r.text
    jsonData=json.loads(r)
    return jsonData             

#获得两点间步行路径时间
def get_route_info(city,start,end):
    route=[]
    route.append(start)
    route.append(end)
    ori=gain_location(city,start)
    des=gain_location(city,end)
    info=get_route(city,ori,des)
    if(info['info']=='ok'):
        try:
            duration=info['route']['paths'][0]['duration']
        except:   
            duration='null'  
    return duration        

#查找周边一公里内的餐饮服务并判断步行时间是否超过10分钟
def sel_around(city,name):
    location=gain_location(city,name)
    api=f'https://restapi.amap.com/v3/place/around?key=6e029ddeb239d2582fce453e845a57e4&city={city}&location={location}&types=050000&radius=1000&output=JSON'
    r=requests.get(api)
    r=r.text
    jsonData=json.loads(r)
    for record in range(10):
        count=0
        if(int(get_route_info(city,name,jsonData['pois'][record]['address']))<600):
            count+=1
    if(count==0):
        return False
    else:
        return True
    
#class_count为该班级每星期课程总数
def get_sum(cla_name,aca_name):
    group_dict=[{"$group":{"_id":"$班级","class_count":{"$sum":1}}}]
    str5=get_academy(aca_name).aggregate(group_dict)
    for record in str5:
        if(cla_name in record['_id']):
            print(record)

#找到课程对应的数字
def get_number(record,j):           
    for cla_key in class_arr:
        for value in cla_key.keys():
            if(record['时间'][j]==value):
                number=round(cla_key[value],1)             #相减用float会有偏差，14.4-12.2！=2.2
    return number      

#策略1：邻近课程上课地点不能超过600秒步行时间  
def stra_cla_dis(city,uniname,cla_name,change_dict,aca_name):
    #bad_arr=pd.DataFrame(columns=['班级','日期','时间','策略'])
    if change_dict:
        result=get_change_dict(change_dict,aca_name)
    else:
        result=get_week_agg(cla_name,1,aca_name)
    uniname=uniname
    city=city
    for record in result:
        for j in range(len(record['时间'])-1): 
            for m in range(3):
                if(record["时间"][j] in class_arr[m] and (record["时间"][j+1] in class_arr[m])):
                    #距离判断
                    start=[uniname+record['地点'][j]]
                    end=[uniname+record['地点'][j+1]]
                    if  int(get_route_info(city,start,end))>600:
                        #存入bad_arr
                        #print(record['_id'],"的第",record['时间'][j],'和第',record['时间'][j+1],'节课不符合策略：邻近课程上课地点不能超过600秒步行时间 ')
                        bad_arr_app=pd.DataFrame([[record['_id']['班级'],record['_id']['日期'],record['时间'][j]+'和'+record['时间'][j+1],'邻近课程上课地点超过600秒步行时间']],columns=['班级','日期','时间','策略'])
                        global bad_arr
                        bad_arr=bad_arr.append(bad_arr_app,ignore_index=True)
                    break
                else:
                    continue

#策略2：3-4节和9-10节课程的上课地点不能离食堂太远
def stra_cant(city,uniname,cla_name,change_dict,aca_name):
    if change_dict:
        result=get_change_dict(change_dict,aca_name)
    else:
        result=get_week_agg(cla_name,1,aca_name)
    for record in result:
        for j in range(len(record['时间'])):
            if(record["时间"][j]=="3-4节" or record["时间"][j]=="9-10节"):
                flag=sel_around(city,uniname+record["地点"][j])
                if(flag==False):
                    #print(record['_id'],"的第",record['时间'][j],'节课不符合策略:3-4节和9-10节课程的上课地点不能离食堂太远')
                    #存入bad_arr
                    bad_arr_app=pd.DataFrame([[record['_id']['班级'],record['_id']['日期'],record['时间'][j],'的上课地点离食堂太远']],columns=['班级','日期','时间','策略'])
                    global bad_arr
                    bad_arr=bad_arr.append(bad_arr_app,ignore_index=True)

#策略3: 3-5节和7节不能都要上课
def stra_morn_after(cla_name,change_dict,aca_name):
    if change_dict:
        result=get_change_dict(change_dict,aca_name)
        print(result)
    else:
        result=get_week_agg(cla_name,1,aca_name)
    for record in result:
        for j in range(len(record['时间'])-1):
            if(record["时间"][j]=='3-5节' and '7' in record["时间"][j+1]):
                #print(record['_id'],'3-5节和第7节都要上课')
                #存入bad_arr
                bad_arr_app=pd.DataFrame([[record['_id']['班级'],record['_id']['日期'],record['时间'][j],'和第7节都要上课']],columns=['班级','日期','时间','策略'])
                global bad_arr
                bad_arr=bad_arr.append(bad_arr_app,ignore_index=True)

#策略4: 9-10节和11节不能都要上课
def stra_after_night(cla_name,change_dict,aca_name):
    if change_dict:
        result=get_change_dict(change_dict,aca_name)
    else:
        result=get_week_agg(cla_name,1,aca_name)
    for record in result:
        for j in range(len(record['时间'])-1):
            if(record["时间"][j]=='9-10节' and '11' in record["时间"][j+1]):
                #print(record['_id'],'9-10节和11节都要上课')
                #存入bad_arr
                bad_arr_app=pd.DataFrame([[record['_id']['班级'],record['_id']['日期'],record['时间'][j],'和11节都要上课']],columns=['班级','日期','时间','策略'])
                global bad_arr
                bad_arr=bad_arr.append(bad_arr_app,ignore_index=True)

#策略5：十二十三节课间只有十分钟，除非十二十三节在同一个地点，否则十二节和十三节不能都要上课
def stra_twe_thir(city,cla_name,change_dict,aca_name):
    if(change_dict):
        result=get_change_dict(change_dict,aca_name)
    else:
        result=get_week_agg(cla_name,1,aca_name)
    for record in result:
        for j in range(len(record['时间'])-1):
            if(record["时间"][j]=='11-12节' and '13-14节' in record["时间"][j+1]):
                if(gain_location(city,record['地点'][j])!=gain_location(city,record['地点'][j+1])):
                    #print(record['_id'],'11-12节和13节都要上课且不在同一地点')
                    #存入bad_arr
                    bad_arr_app=pd.DataFrame([[record['_id']['班级'],record['_id']['日期'],record['时间'][j],'和13-14节都要上课']],columns=['班级','日期','时间','策略'])
                    global bad_arr
                    bad_arr=bad_arr.append(bad_arr_app,ignore_index=True)

#sum班级每周中四节课连着上的次数
def stra_four(city,cla_name,aca_name,change_dict):
    if(change_dict):
        result=get_change_dict(change_dict,aca_name)
    else:
        result=get_week_agg(cla_name,1,aca_name)
        
    result=get_agg2(aca_name)
    sum=0
    for record in result:
        if(record["_id"]["班级"]==cla_name):
            for j in range(len(record['时间'])-1):
                number_j1=get_number(record,j)
                number_j2=get_number(record,j+1)
                if(round(number_j2-number_j1,1)==2.2):
                    sum+=1
    return sum

#输出指定班级一周所有课程(dict)
def get_week_agg(cla_name,code,aca_name):
    if(code==1):
        result=get_agg1(aca_name)
        cla=[]
        for record in result:
            if(record['_id']["班级"]==cla_name):
                cla.append(record)
    return cla

#输出指定班级一周所有课程(初始)
def get_week_class(cla_name,aca_name):
    result=get_agg1(aca_name)
    week_arr=pd.DataFrame(columns=['日期','时间','地点','课程名'])       #有课程名要加上课程名
    for record in result:
        if(record['_id']['班级']==cla_name):
            for j in range(len(record['时间'])-1):
                week_arr_app=pd.DataFrame([[record['_id']['日期'],record['时间'][j],record['地点'][j],record['课程名'][j]]],columns=['日期','时间','地点','课程名'])
                week_arr=week_arr.append(week_arr_app,ignore_index=True)
    return week_arr

#输出指定班级一周所有课程(表格)
def get_week_class_df(cla_name,aca_name):
    result=get_agg3(aca_name)
    week_arr=pd.DataFrame(columns=['星期1','星期2','星期3','星期4','星期5','星期6','星期7','时间','地点'])
    number=0
    for record in result:
        if(record['_id']['班级']==cla_name):
            for j in range(len(record['日期'])):
                temp=[0]*9
                for key in day_dict.keys():
                    if(record['日期'][j]==key):
                        number=day_dict[key]
                for i in range(7):
                    if(i==number):
                        temp[i]=record['日期'][j]
                temp[7]=record['时间'][j]
                temp[8]=record['地点'][j]
                week_arr_app=pd.DataFrame([temp],columns=['星期1','星期2','星期3','星期4','星期5','星期6','星期7','时间','地点'])
                week_arr=week_arr.append(week_arr_app,ignore_index=True)  
    
#得到所有违背指定策略的课程并按照班级分类
def get_wrong(city,uniname,cla_name,change_dict,aca_name):
    global bad_arr
    bad_arr=bad_arr.drop(index=bad_arr.index)
    stra_after_night(cla_name,change_dict,aca_name)
    stra_morn_after(cla_name,change_dict,aca_name)
    #stra_cant(city,uniname,cla_name,change_dict,aca_name)
    #stra_cla_dis(city,uniname,cla_name,change_dict,aca_name)
    #stra_twe_thir(city,cla_name,change_dict,aca_name)
    #stra_four(city,cla_name,aca_name,change_dict)
    result={}
    index=0
    flag=0
    count=0
    for record in bad_arr.iterrows():                       #注意df的结构
        if(record[1]['班级'] not in result):
            result[record[1]['班级']]=[record[1]['班级']+record[1]['日期']+'第'+record[1]['时间']+record[1]['策略']]
        else:
            result[record[1]['班级']].append(record[1]['班级']+record[1]['日期']+'第'+record[1]['时间']+record[1]['策略'])
    
    return result

#得到指定班级违背策略的课程
def get_cla_df(city,uniname,cla_name,change_dict,aca_name):         
    result=get_wrong(city,uniname,cla_name,change_dict,aca_name)
    for arr_record in result.keys():
        if(cla_name==arr_record):
            #print(result[arr_record])
            return result[arr_record]
                                                            
#实时修改的课表(dict)                    
def get_change_dict(change_dict,aca_name):           #change_dict格式应为:[[{'班级':'','日期':'','时间':'','地点':'','课程名':''},{}]]
    for change in change_dict:
        cla_date=change[0]["日期"]
        cla_name=change[0]["班级"]
        cla_week_class=get_week_agg(cla_name,1,aca_name)   
        #print(cla_week_class)
        for i in range(len(cla_week_class)):                    #找到改前课程并删除
            if(cla_week_class[i]['_id']['日期']==change[0]["日期"]):
                for j in range(len(cla_week_class[i]['时间'])):
                    if(cla_week_class[i]['时间'][j] in change[0]["时间"] and cla_week_class[i]['地点'][j] in change[0]["地点"] and cla_week_class[i]['课程名'][j] in change[0]["课程名"]):    #有课程名要加上课程名
                        del cla_week_class[i]['时间'][j]        
                        del cla_week_class[i]['地点'][j]        #有课程名要删掉  
                        del cla_week_class[i]['课程名'][j] 
                        break
                break
            else:
                continue
        target=0
        for i in range(len(cla_week_class)):                    #找到改后课程并插入（注意添加要排序,通过节次确定位置）
            if(cla_week_class[i]['_id']['日期']==change[1]["日期"]):
                target=1
                for j in range(len(cla_week_class[i]['时间'])-1):
                    num_1=get_number(cla_week_class[i],j)       
                    num_2=get_number(cla_week_class[i],j+1)
                    num=get_number(change[1],0)
                    #找到位置并插入
                    if(num>num_1 and j==len(cla_week_class[i]['时间'])):        #插入到该天最后一节课之后
                        cla_week_class[i]['时间'].insert(j+1,change[1]["时间"])
                        cla_week_class[i]['地点'].insert(j+1,change[1]["地点"])      #有课程名要插入课程名
                        cla_week_class[i]['课程名'].insert(j+1,change[1]["课程名"]) 
                    elif(num>num_1 and num<num_2):                                #中间
                        cla_week_class[i]['时间'].insert(j+1,change[1]["时间"])     
                        cla_week_class[i]['地点'].insert(j+1,change[1]["地点"])      #有课程名要插入课程名
                        cla_week_class[i]['课程名'].insert(j+1,change[1]["课程名"]) 
                        break
                    elif(num<num_1 and j==0):                                       #插入到该天第一节课之前
                        cla_week_class[i]['时间'].insert(0,change[1]["时间"])     
                        cla_week_class[i]['地点'].insert(0,change[1]["地点"])      #有课程名要插入课程名
                        cla_week_class[i]['课程名'].insert(0,change[1]["课程名"]) 
                        break
                break
            else:
                continue
        if(target==0):     #原课程没有调换后的星期的情况
            cla_week_class.append({'_id': {'班级': cla_name, '日期': change[1]["日期"]}, '时间': change[1]["时间"], '地点': change[1]["地点"], '课程名': change[1]["课程名"]})
            
    return cla_week_class    

#实时传回修改后的课表(df)
def get_change_class(change_dict,aca_name):          #change_dict格式应为:[[{'班级':'','日期':'','时间':'','地点':'','课程名':''},{}]]
    for record in change_dict:
        #print(record)
        #for i in range(2):
            #print(i)
            cla_name=record[0]["班级"]
            cla_week_class=get_week_class(cla_name,aca_name)             #根据前端需求更改函数
            for i in cla_week_class.shape[0]:
                if(record[0]["日期"]==cla_week_class[i][1]["日期"] and record[0]["时间"]==cla_week_class[i][1]["时间"] and record[0]["地点"]==cla_week_class[i][1]["地点"] and record[0]["课程名"]==cla_week_class[i][1]["课程名"]):     #注意df的columns
                    cla_week_class[i][1]["日期"]=record[1]["日期"]
                    cla_week_class[i][1]["时间"]=record[1]["时间"]
                    cla_week_class[i][1]["地点"]=record[1]["地点"]
                    cla_week_class[i][1]["课程名"]=record[1]["课程名"]
            #break
    return cla_week_class

#传回指定班级的每条课程记录（字典数组）
def get_row_class(cla_name,change_dict,aca_name):
    if change_dict:
        result=get_change_dict(change_dict,aca_name)
    else:
        result=get_week_agg(cla_name,1,aca_name)
    li=[]
    
    for record in result:
        for i in range(len(record["时间"])):
            li.append({'班级':record['_id']['班级'],'日期':record['_id']['日期'],'时间':record['时间'][i],'地点':record['地点'][i],'课程名':record['课程名'][i]})       #有课程名要加上
            #print(record['地点'][i])
    return li

#获得指定学院和年级的班级
def find_class(aca_name,grade):
    group_dict=[{"$group":{"_id":{"班级":"$班级"}}}]
    result=get_academy(aca_name).aggregate(group_dict)
    list=[]
    for record in result:
        if(grade in record['_id']['班级']):
            list.append( record['_id']['班级'])
            #print( record['_id']['班级'])
    return list

#获得所有错误
def get_all_err():
    a=["教育学部","艺术学部","医学部","马克思主义学院","经济学院","法学院","心理学院","体育学院","人文学院","外国语学院","传播学院","数学与统计学院","物理与光电工程学院","化学与环境工程学院","生命与海洋科学学院","机电与控制工程学院","材料学院","电子与信息工程学院","计算机与软件学院","建筑与城市规划学院","土木与交通工程学院","管理学院","政府管理学院","高等研究院","国际交流学院"]
    b=["2018","2019","2020","2021"]
    for aca in a:
        for grade in b:
            cla_list=find_class(aca,grade)
            for record in cla_list:
                error=get_cla_df("深圳","深圳大学",record,[],aca)
                dict={"班级":record,"错误":error}
                mydb = myclient["error"]
                mycol = mydb[aca]
                result=mycol.insert_one(dict)

#从报错数据库中调出相应班级的错误
def get_db_error(aca,cla):
    mydb = myclient["error"]
    mycol = mydb[aca]
    result=[]
    for record in mycol.find():
        if(record["班级"]==cla):
            result=record["错误"]
            break
    return result
    
def get_aca_error(aca):
    mydb = myclient["error"]
    mycol = mydb[aca]
    result=[]
    for record in mycol.find():
        if(record["错误"] is None):
            continue
        else:
            result.append(record["班级"])   
    return result
#图表一//
def get_graph_first(aca):
    result=np.zeros((2,3),dtype=int)
    cla_count=np.zeros((1,3),dtype=int)
    error_count=np.zeros((1,3),dtype=int)
    for i in ["2021","2020","2019"]:
        cla_count[0,int(i)-2019]=len(find_class(aca,i))
        for record in get_aca_error(aca):
            if(i in record):
                error_count[0,int(i)-2019]+=1
    result=[cla_count,error_count]                  #第一行为每个年级的班级总数，第二行为每个年级存在缺陷的班级数量    
    return result


#图表二
def get_graph_second(grade):   #注意传入的学年需要为string类型
    dict={"教育学部":0,"艺术学部":0,"医学部":0,"马克思主义学院":0,"经济学院":0,"法学院":0,"心理学院":0,"体育学院":0,"人文学院":0,
            "外国语学院":0,"传播学院":0,"数学与统计学院":0,"物理与光电工程学院":0,"化学与环境工程学院":0,"生命与海洋科学学院":0,
            "机电与控制工程学院":0,"材料学院":0,"电子与信息工程学院":0,"计算机与软件学院":0,"建筑与城市规划学院":0,"土木与交通工程学院":0,
            "管理学院":0,"政府管理学院":0,"高等研究院":0,"金融科技学院":0,"国际交流学院":0}
    for aca in dict.keys():
        for record in get_aca_error(aca):
            if(grade in record):
                dict[aca]+=1
    return dict

#图表三
def get_graph_third(aca):
    result=np.zeros((2,3),dtype=int)
    aca_cla_count=np.zeros((1,3),dtype=int)
    error_count=np.zeros((1,3),dtype=int)
    result=get_agg1(aca)
    
    for record in result:              #每个年级分别的课程总数
        for i in ["2021","2020","2019"]:
            if(i in record["_id"]["班级"]):
                aca_cla_count[0,int(i)-2019]+=1
    
    mydb1 = myclient["error"]
    mycol1 = mydb1[aca]
    group_dict=[{"$group":{"_id":{"班级":"$班级","日期":"$日期"},"时间":{"$push":"$时间"},"地点":{"$push":"$地点"},"课程名":{"$push":"$课程名"}}}]
    result=mycol1.aggregate(group_dict)                         
    for record in result:               #每个年级分别存在缺陷的课程总数（顺序为2021,2020,2019）
        for i in ["2021","2020","2019"]:
            if(i in record["_id"]["班级"]):
                error_count[0,int(i)-2019]+=1

    result=[aca_cla_count,error_count]

    return result


#图表四
def get_graph_forth(grade):   #注意传入的学年需要为string类型
    dict={"教育学部":0,"艺术学部":0,"医学部":0,"马克思主义学院":0,"经济学院":0,"法学院":0,"心理学院":0,"体育学院":0,"人文学院":0,
            "外国语学院":0,"传播学院":0,"数学与统计学院":0,"物理与光电工程学院":0,"化学与环境工程学院":0,"生命与海洋科学学院":0,
            "机电与控制工程学院":0,"材料学院":0,"电子与信息工程学院":0,"计算机与软件学院":0,"建筑与城市规划学院":0,"土木与交通工程学院":0,
            "管理学院":0,"政府管理学院":0,"高等研究院":0,"金融科技学院":0,"国际交流学院":0}
   
    for aca in dict.keys():
        mydb1 = myclient["error"]
        mycol1 = mydb1[aca]
        group_dict=[{"$group":{"_id":{"班级":"$班级","日期":"$日期"},"时间":{"$push":"$时间"},"地点":{"$push":"$地点"},"课程名":{"$push":"$课程名"}}}]
        result=mycol1.aggregate(group_dict)                         
        for record in result:                  #整个学校对应年级分别存在缺陷的课程总数
            if(grade in record["_id"]["班级"]):
                dict[aca]+=1
                    
    return dict
print(get_graph_third('人文学院'))
#print(get_graph_third('2021'))
#print(get_graph_forth('2021'))
#print(get_cla_df('深圳','深圳大学','2021建筑学（卓越班）01',[],'建筑与城市规划学院'))
# print(get_row_class('2021建筑学（卓越班）01',[],'建筑与城市规划学院'))

# print(find_class('建筑与城市规划学院','2019'))
# get_cla_df('深圳','深圳大学','2021建筑学（卓越班）01',[],'建筑与城市规划学院')
# print(get_cla_df('深圳','深圳大学','2021建筑学（卓越班）01',[],'建筑与城市规划学院'))
# a=[[{'班级': '2021建筑类02', '日期': '星期2', '时间': ['13-14节'], '地点': ['建筑楼']}, {'班级': '2021建筑类02', '日期': '星期2', '时间': ['1-2节'], '地点': ['建筑楼']}]]

#b=[[{'班级':'2021英语（师范）01','日期':'星期四','时间':['7-8节'],'地点':['汇文楼H3-102'],'课程名':['东方文学']},{'班级':'2021英语（师范）01','日期':'星期五','时间':['13-14节'],'地点':['汇文楼'],'课程名':['东方文学']}]]
# #get_row_class('2020城乡规划01',a,'建筑与城市规划学院')
# #print(get_row_class('2020城乡规划01',b,'建筑与城市规划学院'))
# #print(get_change_dict([[{'班级': '2021建筑类02', '日期': '星期2', '时间': '13-14节', '地点': '建筑楼'}, {'班级': '2021建筑类02', '日期': '星期7', '时间': '14-14节', '地点': '汇文楼', '课程名': ''}], [{'班级': '2021建筑类02', '日期': '星期2', '时间': '13-14节', '地点': '建筑楼'}, {'班级': '2021建筑类02', '日期': '星期7', '时间': '14-14节', '地点': '汇文楼'}]],"建筑与城市规划学院"))
# #print(get_wrong('深圳','深圳大学',,'建筑与城市规划学院'))
# print(get_wrong('深圳','深圳大学','2020城乡规划01',[[{'班级': '2021建筑类02', '日期': '星期2', '时间': ['9-10节'], '地点': ['致理楼']}, {'班级': '2021建筑类02', '日期': '星期7', '时间': ['13-14节'], '地点': ['汇文楼']}]],'建筑与城市规划学院'))
#print(get_cla_df('深圳','深圳大学','2021建筑类02',[[{'班级': '2021建筑类02', '日期': '星期2', '时间': ['9-10节'], '地点': ['致理楼']}, {'班级': '2021建筑类02', '日期': '星期7', '时间': ['13-14节'], '地点': ['汇文楼']}]],'建筑与城市规划学院'))
#print(find_class('人文学院','2020'))
#print(get_row_class('2021英语（师范）01',b,'人文学院'))
##a={'1':'1'}
#get_feedback(a)
#获得所有错误