---
layout: distill
title: "The Data Analysis Self-Learning Journey of an Economics Student: Part II -- SQL"
description: How I went from zero SQL knowledge to writing window functions, one query at a time.
tags: sql data-analysis datacamp
categories: data-analysis
date: 2026-02-10
featured: false

authors:
  - name: Tuyet-Han LE
    url: "https://letuyethan.github.io"
    affiliations:
      name: University of Orleans

toc:
  - name: Why SQL Matters
  - name: "The Basics: SELECT, FROM, WHERE"
  - name: Aggregation and Grouping
  - name: Joining Tables
  - name: Advanced Data Manipulation
  - name: Window Functions
  - name: Working with Text and Dates
  - name: Database Design
  - name: Reflections
---

## Why SQL Matters

Python is great for analysis, but data *lives* in databases. Whether it's economic indicators, firm-level data, or survey responses, chances are it's stored in a relational database somewhere. SQL (Structured Query Language) is how you talk to those databases.

I completed DataCamp's **SQL Fundamentals** track -- 7 courses that go from writing your first `SELECT` statement to designing entire database schemas. Here's what each course taught me.

---

## The Basics: SELECT, FROM, WHERE

**Introduction to SQL**<d-footnote>DataCamp course: <a href="https://www.datacamp.com/completed/statement-of-accomplishment/course/ccca01fc141b59282d23d274d9cf477a96928c8a">Introduction to SQL</a></d-footnote> covers the core syntax. At its heart, SQL is about asking questions of structured data:

```sql
-- What are the top 10 countries by GDP per capita?
SELECT country, gdp_per_capita
FROM world_bank_data
WHERE year = 2024
ORDER BY gdp_per_capita DESC
LIMIT 10;
```

The beauty of SQL is its readability. Even someone who has never written code can roughly understand what a query does. `SELECT` what you want, `FROM` where, `WHERE` under what conditions, `ORDER BY` how to sort.

---

## Aggregation and Grouping

**Intermediate SQL**<d-footnote>DataCamp course: <a href="https://www.datacamp.com/completed/statement-of-accomplishment/course/5c97c239aef83d613bde510128952c09133848d0">Intermediate SQL</a></d-footnote> introduces the tools for summarizing data -- aggregate functions and `GROUP BY`:

```sql
-- Average GDP growth by region
SELECT region,
       COUNT(*) AS n_countries,
       AVG(gdp_growth) AS avg_growth,
       MIN(gdp_growth) AS min_growth,
       MAX(gdp_growth) AS max_growth
FROM economic_indicators
WHERE year = 2024
GROUP BY region
HAVING AVG(gdp_growth) > 2.0
ORDER BY avg_growth DESC;
```

The distinction between `WHERE` and `HAVING` is subtle but important: `WHERE` filters individual rows *before* grouping, while `HAVING` filters groups *after* aggregation. Getting this wrong is a common source of bugs.

---

## Joining Tables

**Joining Data in SQL**<d-footnote>DataCamp course: <a href="https://www.datacamp.com/completed/statement-of-accomplishment/course/981c9a435a16bb2732db876f06facd4b2a07a49f">Joining Data in SQL</a></d-footnote> is where SQL really shines. Relational databases spread data across multiple tables to avoid redundancy. Joins reconnect them:

```sql
-- Combine trade data with country details
SELECT t.year,
       t.export_value,
       c.country_name,
       c.region,
       c.income_group
FROM trade_flows t
INNER JOIN countries c
  ON t.country_code = c.country_code
WHERE t.year >= 2020;
```

The four main join types serve different purposes:

- **INNER JOIN** -- only rows that match in *both* tables
- **LEFT JOIN** -- all rows from the left table, matching rows from the right (or NULL)
- **RIGHT JOIN** -- the reverse
- **FULL JOIN** -- all rows from both tables

For economic research, `LEFT JOIN` is probably the most common: you have your main dataset and want to enrich it with supplementary information, keeping all your original observations even if some don't match.

The course also covers set operations (`UNION`, `INTERSECT`, `EXCEPT`) and subqueries, which are powerful tools for complex data combinations.

---

## Advanced Data Manipulation

**Data Manipulation in SQL**<d-footnote>DataCamp course: <a href="https://www.datacamp.com/completed/statement-of-accomplishment/course/851d760c5eee5854849016d89d5ac22707460a96">Data Manipulation in SQL</a></d-footnote> introduces `CASE` statements, subqueries, and common table expressions (CTEs). These let you reshape and transform data directly in SQL:

```sql
-- Classify countries by income level
SELECT country_name,
       gdp_per_capita,
       CASE
         WHEN gdp_per_capita > 40000 THEN 'High income'
         WHEN gdp_per_capita > 10000 THEN 'Upper middle'
         WHEN gdp_per_capita > 3000  THEN 'Lower middle'
         ELSE 'Low income'
       END AS income_category
FROM countries;
```

**CTEs** (Common Table Expressions) are particularly useful for breaking complex queries into readable steps:

```sql
-- Which regions grew faster than the global average?
WITH global_avg AS (
  SELECT AVG(gdp_growth) AS world_growth
  FROM economic_indicators
  WHERE year = 2024
)
SELECT region, AVG(gdp_growth) AS regional_growth
FROM economic_indicators
WHERE year = 2024
GROUP BY region
HAVING AVG(gdp_growth) > (SELECT world_growth FROM global_avg);
```

CTEs make your queries self-documenting. Instead of nesting subqueries three levels deep, you name each step. Future you (or your colleagues) will thank you.

---

## Window Functions

**PostgreSQL Summary Stats and Window Functions**<d-footnote>DataCamp course: <a href="https://www.datacamp.com/completed/statement-of-accomplishment/course/f9295bcee0b32655f0479b1f4e69014eb71ab7c1">PostgreSQL Summary Stats and Window Functions</a></d-footnote> was the most eye-opening course in the track. Window functions let you compute aggregates *without collapsing rows* -- something regular `GROUP BY` can't do:

```sql
-- Rank countries within each region by GDP growth
SELECT country_name,
       region,
       gdp_growth,
       RANK() OVER (PARTITION BY region ORDER BY gdp_growth DESC)
         AS growth_rank,
       LAG(gdp_growth) OVER (PARTITION BY country_name ORDER BY year)
         AS prev_year_growth,
       gdp_growth - LAG(gdp_growth)
         OVER (PARTITION BY country_name ORDER BY year)
         AS growth_change
FROM economic_indicators
WHERE year = 2024;
```

Key window functions I use regularly:

- `ROW_NUMBER()`, `RANK()`, `DENSE_RANK()` -- for ranking within groups
- `LAG()`, `LEAD()` -- for comparing with previous/next rows (time series)
- `SUM() OVER()` -- for running totals
- `NTILE()` -- for dividing data into quantiles

For economists, `LAG()` is incredibly useful -- it's how you compute year-over-year changes, growth rates, and first differences directly in SQL.

---

## Working with Text and Dates

**Functions for Manipulating Data in PostgreSQL**<d-footnote>DataCamp course: <a href="https://www.datacamp.com/completed/statement-of-accomplishment/course/45e379a2345d43ba662f31ef08e6090cd24e22f1">Functions for Manipulating Data in PostgreSQL</a></d-footnote> covers the practical side of data cleaning: string operations, date/timestamp manipulation, and type casting.

```sql
-- Clean and standardize text data
SELECT UPPER(TRIM(country_name)) AS clean_name,
       EXTRACT(YEAR FROM report_date) AS report_year,
       EXTRACT(QUARTER FROM report_date) AS report_quarter,
       AGE(NOW(), report_date) AS time_since_report
FROM raw_data;
```

This is the unglamorous but essential side of data work. Real-world data has inconsistent capitalization, trailing spaces, dates in weird formats, and values stored as the wrong type. These functions let you fix it all at the query level.

---

## Database Design

The final course, **Database Design**<d-footnote>DataCamp course: <a href="https://www.datacamp.com/completed/statement-of-accomplishment/course/e5e57fa3458ba7a05ef5012783e4c578ff29f0f4">Database Design</a></d-footnote>, zooms out from writing queries to designing the databases themselves. Key concepts:

- **Normalization** -- organizing data to reduce redundancy (1NF, 2NF, 3NF)
- **Star vs. snowflake schemas** -- how to structure data warehouses for analytical queries
- **OLTP vs. OLAP** -- transactional databases (fast writes) vs. analytical databases (fast reads)
- **Primary and foreign keys** -- enforcing data integrity through constraints

Understanding database design changed how I think about data storage. When I see a flat CSV with repeated values, I now instinctively think: *"this should be normalized into two tables with a foreign key."*

---

## Reflections

The SQL track follows a clear progression:

**Query basics** → **Aggregation** → **Joining** → **Advanced manipulation** → **Window functions** → **String/date functions** → **Database design**

If Python is how you *analyze* data, SQL is how you *access* it. In practice, most data workflows start with a SQL query to extract the right data, followed by Python for analysis and visualization. Knowing both gives you end-to-end capability.

My top takeaway: **window functions are underrated**. Most people learn `SELECT`, `JOIN`, and `GROUP BY`, then stop. But `RANK()`, `LAG()`, and `SUM() OVER()` are what separate someone who can query data from someone who can truly analyze it in SQL.
