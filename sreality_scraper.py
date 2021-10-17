# -*- coding: utf-8 -*-
"""
Created on Fri Oct  9 09:16:07 2020
@author: marek.vareka
"""

import pandas as pd 
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import time
import re
import numpy as np
from datetime import date



# driver instalation
#from webdriver_manager.chrome import ChromeDriverManager
#driver = webdriver.Chrome(ChromeDriverManager().install())

from webdriver_manager.chrome import ChromeDriverManager
options = webdriver.ChromeOptions()
options.add_argument('--headless')

# MVA ad hoc analysis


browser = webdriver.Chrome(ChromeDriverManager().install() , chrome_options = options  )

browser.get("https://www.sreality.cz/hledani/prodej/domy/praha?strana=2")
time.sleep(5)  #wait till page loads fully
soup = BeautifulSoup(browser.page_source, 'lxml')
html = soup.prettify()
browser.close() #close window

            
         
#####zakladni tri sloupce - Nazev, Adresa, Cena

class Scrapuj: 
    def __init__(self, url):
        self.url = url
        
        
        browser = webdriver.Chrome(ChromeDriverManager().install() , chrome_options = options  )
        browser.get(url)
        time.sleep(6)  #wait till page loads fully 
        self.soup = BeautifulSoup(browser.page_source, 'lxml')
        browser.close() #close window
        

    def sosej(self, elementik, jmeno):
 
        
        for element in self.soup.find_all(elementik, class_=jmeno):
            print(element)
            pData = element.text
            
           
            # exeptions for name tags
            exeptions = ["Česky", "English", "Русский"]
            
            if jmeno == "name ng-binding" :
                if 	pData not in  exeptions :
                    pole.append(pData)
            else:
                    pole.append(pData)





#loopujeme pres stranky
urlAdresa = []
df = pd.DataFrame()
df1 = pd.DataFrame()

for j in range(1, 50):   # to be changed upper limit
    urlAdresa.append("https://www.sreality.cz/hledani/prodej/byty?strana="+str(j))




for i in range(0, len(urlAdresa)):
    pokus = Scrapuj(url = urlAdresa[i])

    #pri i = 0 je treba df vytvorit
    if i == 0:
        pole = [] 
        pokus.sosej(elementik = "span", jmeno = "name ng-binding")
        df['Nazev'] = pd.Series(pole)

        pole = [] 
        pokus.sosej(elementik = "span", jmeno = "locality ng-binding")
        df['Adresa'] = pd.Series(pole)

        pole = [] 
        pokus.sosej("span", "norm-price ng-binding")
        for k in range(0, len(pole)):
            pole[k] = re.sub('[^0-9]', '', pole[k])
            k += 1

        df['Cena'] = pd.Series(pole)


    #pri i >= 1 je treba k existujicimu df prilepit
    else:
        pole = [] 
        pokus.sosej(elementik = "span", jmeno = "name ng-binding")
        df1['Nazev'] = pd.Series(pole)

        pole = [] 
        pokus.sosej(elementik = "span", jmeno = "locality ng-binding")
        df1['Adresa'] = pd.Series(pole)

        pole = [] 
        pokus.sosej("span", "norm-price ng-binding")
        for k in range(0, len(pole)):
            pole[k] = re.sub('[^0-9]', '', pole[k])
            k += 1

        df1['Cena'] = pd.Series(pole)

        #prilepit a vymazat
        df = df.append(df1, ignore_index = True)
        df1 = pd.DataFrame()

    i += 1


#Z Nazev dostat plochu a typ bytu
df['Plocha'] = ""

for j in range(0, len(df['Nazev'])):
    df['Plocha'][j] = df['Nazev'][j].split()[3]
    j += 1

df['Typ'] = ""

for j in range(0, len(df['Nazev'])):
    df['Typ'][j] = df['Nazev'][j].split()[2]
    j += 1
    
df['nemovitost'] = ""

for j in range(0, len(df['Nazev'])):
    df['nemovitost'][j] = df['Nazev'][j].split()[1]
    j += 1
    

df['Ulice'] = ""
for j in range(0, len(df['Adresa'])):
    
    if df['Adresa'][j].find(",") >0:
        
        df['Ulice'][j] = df['Adresa'][j][:df['Adresa'][j].find(",")]
    else:
        df['Ulice'][j] =""
        
    j += 1
    
    
df['Mestska_cast'] = ""
for j in range(0, len(df['Adresa'])):
    
    a =  df['Adresa'][j].find(",") 
    if a> 0:
        a= a+2
    else:
        a=0
        
    b = df['Adresa'][j].find("-")
    
    if  b >0:
        
        df['Mestska_cast'][j] = df['Adresa'][j][a:b]
    else:
        df['Mestska_cast'][j] =df['Adresa'][j][a:]
        
    j += 1



    
df['datum']=  date.today()

# GT server login

import sqlalchemy
import pyodbc
import urllib

df.to_sql("sreality_prodej", engine, if_exists='append')     
     
# saving mined data to csv
df.to_excel( "prodej_byty_praha.xlsx", index=False)


df=df.drop(columns=['Mesto'])



import sqlalchemy
import pyodbc
import urllib
import pandas as pd

server = 'hackprague.database.windows.net'
database = 'HackPrague'
username = 'hackprague'
password = 'MartinMartin2021'
driver= '{ODBC Driver 17 for SQL Server}'

params = urllib.parse.quote_plus('DRIVER='+driver+';SERVER='+server+';PORT=1433;DATABASE='+database+';UID='+username+';PWD='+ password)
engine = sqlalchemy.create_engine("mssql+pyodbc:///?odbc_connect=%s" % params)
connection = engine.connect()


df = pd.read_excel("C:\Marek\dataming_mva\prodej_byty_praha.xlsx", index_col=0) 
df = df.reset_index()

df.to_sql("sreality_prodej", engine, if_exists='append')  
