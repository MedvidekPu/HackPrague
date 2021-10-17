ALTER TABLE dbo.sreality_pronajem ADD kod_obce bigint
ALTER TABLE dbo.sreality_prodej_byty_praha1 DROP COLUMN kod_obec

sp_rename 'dbo.sreality_pronajem.Mestska_cast', 'Mesto', 'COLUMN';

ALTER TABLE dbo.sreality_pronajem ALTER COLUMN Cena bigint

ALTER TABLE dbo.sreality_prodej ADD kraj nvarchar(max)

SELECT * FROM dbo.sreality_prodej
SELECT * FROM dbo.ciselnik_lokalita

/* join kod obce na nazev obce*/
UPDATE  dbo.sreality_pronajem
SET     kod_obce = sp.kod_obec
FROM    dbo.sreality_pronajem ad LEFT JOIN dbo.ciselnik_lokalita sp
ON      sp.nazev_obec = ad.Mesto
WHERE   sp.kod_obec IS NOT NULL

select * from dbo.ciselnik_lokalita
select * from dbo.sreality_prodej
/* join nazev okres on kod obce */

UPDATE  dbo.sreality_prodej
SET     kraj = sp.nazev_kraj
FROM    dbo.sreality_prodej ad LEFT JOIN dbo.ciselnik_lokalita sp
ON      sp.nazev_obec = ad.Mesto
WHERE   sp.nazev_obec IS NOT NULL

/* create avg ceny table*/
CREATE TABLE dbo.kraje_prumer(
nazev_kraje nvarchar(max),
prumer_prodej bigint,
prumer_najem bigint
)


/* okresy prumer_cena a prumer_najem */
UPDATE  dbo.okresy_prumer
SET     prumer_prodej = prumer_prodej
SELECT  kraj, AVG(Cena) AS prumer_prodej FROM dbo.sreality_pronajem WHERE kraj IS NOT NULL GROUP BY kraj

select * from  kraje_prumer_prodej

/* calculate average prices per okres*/
select * from kraje_prumer
SELECT kraj, AVG(Cena) AS prumer_pronajem INTO kraje_prumer FROM dbo.sreality_pronajem WHERE kraj IS NOT NULL GROUP BY kraj;

drop table dbo.kraje_prumer_prodej

SELECT kraj, AVG(Cena) AS prumer_prodej INTO kraje_prumer_prodej FROM dbo.sreality_prodej WHERE kraj IS NOT NULL GROUP BY kraj;

