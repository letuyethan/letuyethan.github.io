---
layout: distill
title: "The Data Analysis Self-Learning Journey of an Economics Student: Part I -- Python"
description: How I taught myself Python for data analysis as an economics student, one DataCamp course at a time.
tags: python data-analysis datacamp
categories: data-analysis
date: 2026-02-01
featured: true
featured_title: "Self-Learning Python for Data Analysis"

authors:
  - name: Tuyet-Han LE
    url: "https://letuyethan.github.io"
    affiliations:
      name: University of Orleans

toc:
  - name: Why Python for Data Analysis?
  - name: "Getting Started: The Basics"
  - name: "Leveling Up: Intermediate Python"
  - name: Data Manipulation with pandas
  - name: Joining Data with pandas
  - name: Data Visualization with Seaborn
  - name: Introduction to Statistics
  - name: Exploratory Data Analysis
  - name: The Big Picture
---

## Why Python for Data Analysis?

As an economics student, I spent most of my time working with Stata. It's great for econometrics, but when I started exploring broader data analysis -- cleaning messy datasets, building visualizations, running quick statistical checks -- I kept hearing the same advice: *learn Python*.

So I worked through DataCamp's **Python Data Fundamentals** track: 7 courses that take you from `print("hello world")` to a full exploratory data analysis pipeline. Here's what I learned and how each piece fits together.

---

## Getting Started: The Basics

The journey starts with **Introduction to Python**<d-footnote>DataCamp course: <a href="https://www.datacamp.com/completed/statement-of-accomplishment/course/f09c48c0c4f63256520e71b7bc637377ba54367b">Introduction to Python</a></d-footnote>. Variables, data types, lists, and basic operations. Nothing fancy, but essential. The key insight: Python treats everything as an object, and understanding this early makes everything else click.

```python
# Lists are your first data structure
gdp_growth = [2.3, 1.8, 3.1, -3.4, 5.7]
print(f"Average growth: {sum(gdp_growth) / len(gdp_growth):.1f}%")
```

**Intermediate Python**<d-footnote>DataCamp course: <a href="https://www.datacamp.com/completed/statement-of-accomplishment/course/8d75b3cfc8b5d2cd502270a8afd17ad6e6480551">Intermediate Python</a></d-footnote> builds on this with dictionaries, NumPy arrays, and control flow (loops, conditionals). But the real game-changer is the introduction to **Matplotlib** -- your first taste of turning numbers into pictures:

```python
import matplotlib.pyplot as plt
import numpy as np

years = np.arange(2015, 2026)
inflation = [0.1, 1.3, 2.1, 2.4, 1.8, 1.2, 2.6, 8.0, 5.2, 2.9, 2.3]

plt.plot(years, inflation, marker='o')
plt.xlabel("Year")
plt.ylabel("Inflation Rate (%)")
plt.title("US Inflation Rate (2015-2025)")
plt.show()
```

---

## Data Manipulation with pandas

This is where things get practical. **Data Manipulation with pandas**<d-footnote>DataCamp course: <a href="https://www.datacamp.com/completed/statement-of-accomplishment/course/3b0227836f0461c7f43ff29b949b4ca3dea9cae2">Data Manipulation with pandas</a></d-footnote> teaches you to load, inspect, filter, sort, group, and aggregate tabular data -- essentially, everything you'd do in Excel but faster and reproducible.

The core operations I use constantly:

```python
import pandas as pd

# Load and inspect
df = pd.read_csv("economic_data.csv")
df.info()
df.describe()

# Filter and group
high_growth = df[df["gdp_growth"] > 3.0]
by_region = df.groupby("region")["gdp_growth"].mean()

# Handle missing values
df["gdp_growth"].fillna(df["gdp_growth"].median(), inplace=True)
```

The `.groupby()` method alone transformed how I think about data. Instead of writing loops, you express what you want declaratively: *"give me the average GDP growth by region."* Clean, readable, fast.

---

## Joining Data with pandas

Real-world analysis rarely involves a single table. **Joining Data with pandas**<d-footnote>DataCamp course: <a href="https://www.datacamp.com/completed/statement-of-accomplishment/course/f7c40862ff28019ad820e917676b24f92fbd068e">Joining Data with pandas</a></d-footnote> covers the pandas equivalents of SQL JOINs:

```python
# Merge trade data with country metadata
trade_enriched = pd.merge(
    trade_flows,
    country_info,
    on="country_code",
    how="left"
)

# Concatenate yearly datasets
all_years = pd.concat([df_2022, df_2023, df_2024], ignore_index=True)
```

Understanding the difference between inner, outer, left, and right joins is crucial -- it determines whether you keep or lose observations. I've seen analyses go wrong because someone used an inner join when they needed a left join, silently dropping data.

---

## Data Visualization with Seaborn

While Matplotlib gives you control, **Seaborn**<d-footnote>DataCamp course: <a href="https://www.datacamp.com/completed/statement-of-accomplishment/course/cd1e5743fde4aa7fd10a2b48527a0afa91ce4f5d">Introduction to Data Visualization with Seaborn</a></d-footnote> gives you beautiful statistical visualizations with minimal code:

```python
import seaborn as sns

# Distribution
sns.histplot(data=df, x="income", hue="region", kde=True)

# Relationships
sns.scatterplot(data=df, x="education_years", y="income",
                hue="gender", size="age")

# Categorical comparisons
sns.boxplot(data=df, x="region", y="gdp_per_capita")
```

The key lesson: **choose the right chart for the question you're asking**. Histograms for distributions, scatter plots for relationships, box plots for comparisons across categories. Seaborn makes it easy to try different views quickly.

---

## Introduction to Statistics

**Introduction to Statistics in Python**<d-footnote>DataCamp course: <a href="https://www.datacamp.com/completed/statement-of-accomplishment/course/eb4b4b1994ec19dd7770a5b7620e994ed8e574fa">Introduction to Statistics in Python</a></d-footnote> covers the foundations: measures of center (mean, median), spread (variance, standard deviation, IQR), probability distributions (normal, binomial, Poisson), and correlation.

What I found most valuable was connecting these concepts to Python code. For example, understanding when the mean is misleading:

```python
# Income data is typically right-skewed
incomes = [25000, 30000, 35000, 40000, 45000, 500000]

mean_income = np.mean(incomes)    # 112,500 -- misleading!
median_income = np.median(incomes) # 37,500 -- more representative

print(f"Mean: ${mean_income:,.0f}")
print(f"Median: ${median_income:,.0f}")
```

The presence of one outlier (500,000) pulls the mean way up. In economics, this happens constantly -- income, wealth, and firm size distributions are almost always skewed. **Always check the median alongside the mean.**

---

## Exploratory Data Analysis

The capstone of the track is **Exploratory Data Analysis in Python**<d-footnote>DataCamp course: <a href="https://www.datacamp.com/completed/statement-of-accomplishment/course/b356a88a2e15b333520478c6186734ac1c6c3bc1">Exploratory Data Analysis in Python</a></d-footnote>, which ties everything together into a systematic workflow:

1. **Validate** -- check data types, missing values, duplicates
2. **Clean** -- handle missing data, fix inconsistencies
3. **Explore distributions** -- histograms, summary statistics
4. **Detect outliers** -- IQR method, z-scores
5. **Find relationships** -- correlation matrices, scatter plots

This course changed how I approach any new dataset. Before, I would jump straight into modeling. Now, I spend time *understanding* the data first. It saves hours of debugging later.

---

## The Big Picture

Looking back, the 7 courses form a natural pipeline:

**Raw syntax** (Intro + Intermediate) → **Data wrangling** (pandas + Joining) → **Visualization** (Seaborn) → **Statistics** (Intro to Stats) → **Putting it all together** (EDA)

Each course builds on the previous one. You can't do EDA without pandas. You can't interpret distributions without statistics. You can't communicate findings without visualization.

For anyone coming from an economics or social science background, I'd say: don't be intimidated by Python. The learning curve is steep for about two weeks, and then it clicks. Once you can wrangle a DataFrame and make a plot, you'll wonder how you ever lived without it.
