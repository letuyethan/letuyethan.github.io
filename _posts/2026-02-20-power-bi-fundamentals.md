---
layout: distill
title: "The Data Analysis Self-Learning Journey of an Economics Student: Part III -- Power BI"
description: From drag-and-drop dashboards to DAX formulas -- how I picked up Power BI as an economics student.
tags: power-bi data-visualization datacamp
categories: data-analysis
date: 2026-02-20
featured: false

authors:
  - name: Tuyet-Han LE
    url: "https://letuyethan.github.io"
    affiliations:
      name: University of Orleans

toc:
  - name: Why Power BI?
  - name: First Steps with Power BI
  - name: DAX -- The Formula Language
  - name: Data Visualization Best Practices
  - name: "Case Study: Customer Churn Analysis"
  - name: Data Preparation with Power Query
  - name: Data Modeling
  - name: The Complete Picture
---

## Why Power BI?

Python and SQL are powerful, but they have a limitation: the output is typically a script, a table, or a static image. When you need to share insights with stakeholders who don't code -- managers, clients, policymakers -- you need something more interactive.

That's where **Power BI** comes in. It's Microsoft's business intelligence tool for building interactive dashboards and reports. I completed DataCamp's **Power BI Fundamentals** track (6 courses) to add this tool to my analytical toolkit. Here's what each course covers and what I took away.

---

## First Steps with Power BI

**Introduction to Power BI**<d-footnote>DataCamp course: <a href="https://www.datacamp.com/completed/statement-of-accomplishment/course/f25d31aaaf124465c7793355fd5da8fec6ec01fc">Introduction to Power BI</a></d-footnote> covers the basics: importing data from various sources (CSV, Excel, databases), the Power BI Desktop interface, and building your first visualizations.

The core workflow is:

1. **Get Data** -- connect to your data source
2. **Transform** -- clean and reshape (Power Query)
3. **Model** -- define relationships between tables
4. **Visualize** -- create charts and dashboards
5. **Publish** -- share reports with stakeholders

What struck me coming from Python: Power BI's drag-and-drop interface makes it incredibly fast to prototype visualizations. What takes 15 lines of Matplotlib code takes a single drag in Power BI. The trade-off is flexibility -- Python gives you pixel-level control, while Power BI gives you speed and interactivity.

---

## DAX -- The Formula Language

**Introduction to DAX in Power BI**<d-footnote>DataCamp course: <a href="https://www.datacamp.com/completed/statement-of-accomplishment/course/567de64c5d9e0d29882522fdac806b140a91f520">Introduction to DAX in Power BI</a></d-footnote> is where Power BI gets its analytical power. DAX (Data Analysis Expressions) is a formula language for creating calculated columns and measures.

The key distinction every beginner struggles with:

- **Calculated columns** -- computed row by row, stored in the table, evaluated at refresh time
- **Measures** -- computed on the fly based on the current filter context, not stored

For example:

```
// Calculated column -- static, one value per row
Profit Margin = Sales[Revenue] - Sales[Cost]

// Measure -- dynamic, changes with filters
Total Revenue = SUM(Sales[Revenue])

// More complex measure with CALCULATE
Revenue Growth YoY =
  VAR CurrentYear = SUM(Sales[Revenue])
  VAR PreviousYear = CALCULATE(
    SUM(Sales[Revenue]),
    SAMEPERIODLASTYEAR(Calendar[Date])
  )
  RETURN
    DIVIDE(CurrentYear - PreviousYear, PreviousYear)
```

The `CALCULATE` function is the most powerful (and most confusing) function in DAX. It evaluates an expression in a *modified filter context*. Understanding filter context vs. row context is the single biggest conceptual hurdle in learning DAX.

---

## Data Visualization Best Practices

**Data Visualization in Power BI**<d-footnote>DataCamp course: <a href="https://www.datacamp.com/completed/statement-of-accomplishment/course/8f5c4da5984f0b862c1a506b7496a8bbb9b2f904">Data Visualization in Power BI</a></d-footnote> goes beyond *how* to make charts and focuses on *which* charts to use and *how* to design them effectively.

Key principles I took away:

**Match the chart to the question:**

| Question | Chart Type |
|---|---|
| How does X change over time? | Line chart |
| How do categories compare? | Bar chart |
| What is the composition? | Stacked bar or pie chart |
| What is the relationship between X and Y? | Scatter plot |
| What is the geographic distribution? | Map |
| What is the current status? | KPI card or gauge |

**Design principles:**

- **Less is more** -- remove chart junk (unnecessary gridlines, borders, 3D effects)
- **Consistent colors** -- use a limited palette with semantic meaning (red = bad, green = good)
- **Cross-filtering** -- let users click on one visual to filter all others. This interactivity is Power BI's superpower
- **Drill-through** -- let users click on a summary to see the details behind it

---

## Case Study: Customer Churn Analysis

**Case Study: Analyzing Customer Churn in Power BI**<d-footnote>DataCamp course: <a href="https://www.datacamp.com/completed/statement-of-accomplishment/course/d12cee815d75bf90a0334b74e0043f29356d4a0b">Case Study: Analyzing Customer Churn in Power BI</a></d-footnote> was the most practical course in the track. Instead of learning features in isolation, you solve a real business problem end-to-end: *Why are customers leaving a telecom subscription service?*

The workflow mirrors what you'd do in a real job:

1. **Import and clean** the customer dataset
2. **Explore** churn rates by demographics, contract type, payment method
3. **Identify patterns** -- which customer segments have the highest churn?
4. **Build a dashboard** that tells the story
5. **Recommend actions** based on the data

The key insight from this case study: **data analysis isn't just about finding patterns -- it's about communicating them in a way that drives decisions**. A beautiful dashboard that doesn't answer a business question is useless. A simple bar chart that reveals the main driver of churn is invaluable.

---

## Data Preparation with Power Query

**Data Preparation in Power BI**<d-footnote>DataCamp course: <a href="https://www.datacamp.com/completed/statement-of-accomplishment/course/f49b67194b5fd1ccb86259a6b7135c0aa183b060">Data Preparation in Power BI</a></d-footnote> focuses on Power Query, the built-in ETL<d-footnote>ETL: Extract, Transform, Load -- the process of getting raw data into a usable format.</d-footnote> engine. This is where you spend most of your time in a real Power BI project.

Common operations:

- **Remove duplicates** and filter out irrelevant rows
- **Unpivot columns** -- transform wide data into long format
- **Merge queries** -- the Power Query equivalent of SQL JOINs
- **Handle errors** -- replace error values, manage null data
- **Create custom columns** -- add calculated fields during the data loading step

The advantage over cleaning in Python: Power Query records every transformation as a step. If your source data updates, all transformations are reapplied automatically. This makes your pipeline reproducible without writing a single line of code.

---

## Data Modeling

The final course, **Data Modeling in Power BI**<d-footnote>DataCamp course: <a href="https://www.datacamp.com/completed/statement-of-accomplishment/course/dd1c4e5b171ad54a5ed173476d6492cb028f4953">Data Modeling in Power BI</a></d-footnote>, teaches the architecture behind effective dashboards. A good data model makes everything downstream easier -- visualizations are faster, DAX formulas are simpler, and reports are more maintainable.

Key concepts:

**Star schema design:**

- One central **fact table** (e.g., sales transactions) surrounded by **dimension tables** (e.g., customers, products, dates)
- Dimension tables connect to the fact table via foreign keys
- This structure is optimized for analytical queries

**Relationships and cardinality:**

- **One-to-many** (most common) -- one row in the dimension matches many rows in the fact table
- **Many-to-many** -- requires a bridge table to resolve
- **Cross-filter direction** -- determines how filters propagate between tables

**Hierarchies:**

- Date hierarchies (Year → Quarter → Month → Day) enable drill-down in time-series visuals
- Product hierarchies (Category → Subcategory → Product) let users explore at different granularities

The most important lesson: **invest time in your data model before building visualizations**. A flat table with 50 columns might seem convenient, but it leads to slow reports, confusing DAX, and maintenance nightmares. A properly modeled star schema solves all these problems.

---

## The Complete Picture

The 6 courses form a complete analytics workflow:

**Import & interface** (Intro) → **Calculations** (DAX) → **Visualization** (Data Viz) → **Applied analysis** (Case Study) → **Data cleaning** (Power Query) → **Architecture** (Data Modeling)

Power BI fills a gap in my toolkit that Python and SQL don't cover: **interactive, shareable business intelligence**. When I need to explore data and test hypotheses, I use Python. When I need to query large databases, I use SQL. When I need to build a dashboard that a non-technical audience can explore on their own, I use Power BI.

For fellow economics students: Power BI is increasingly used in consulting, international organizations, and policy analysis. Learning it alongside Python and SQL makes you versatile across both academic research and applied business analytics.
