import pandas as pd

df=pd.read_csv('stu.csv')
name=df['名前'].copy()
s=""
for i in range(len(name)):
  s+="\""
  s+=name[i]
  s+="\""
  s+=","
f=open('name.txt','w')
f.write(s)
f.close()