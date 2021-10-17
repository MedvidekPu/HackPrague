import pandas as pd

import sqlalchemy
import pyodbc
import urllib

server = 'hackprague.database.windows.net'
database = 'HackPrague'
username = 'hackprague'
password = 'MartinMartin2021'
driver= '{ODBC Driver 17 for SQL Server}'

params = urllib.parse.quote_plus('DRIVER='+driver+';SERVER='+server+';PORT=1433;DATABASE='+database+';UID='+username+';PWD='+ password)
engine = sqlalchemy.create_engine("mssql+pyodbc:///?odbc_connect=%s" % params)
connection = engine.connect()


okresy= pd.read_excel('struktura_uzemi_cr_1_1_2016_az_1_1_2021.xlsx')

okresy.to_sql("ciselnik_lokalita", engine, if_exists='append')     