---
layout: page
title: Analysis of School Spending and 4th Grade Math Achievement
description: A panel econometrics study of U.S. school districts (1992-1998)
img: assets/img/panel-data/trend.jpg
importance: 10
category: work
related_publications: true
---

## The Big Question

Does spending more money on schools actually improve student performance? It sounds like it should be a straightforward yes -- but in economics, things are rarely that simple. This project was my deep dive into that question, using panel econometrics to separate what's real from what's just correlation.

I worked with a balanced panel of **550 U.S. school districts** observed over **7 years (1992--1998)**, totaling 3,850 observations. The data comes from {% cite wooldridge2009introductory %}. The outcome I focused on was **math4** -- the percentage of 4th graders achieving satisfactory math scores.

This was a course project for **Panel Econometrics** in my Master's program (International Economics and Sustainable Development, University of Orleans), taught by Professor Marcel Voia. I received a grade of **18/20** for this project[^1].

[^1]: [Full report (PDF)](/assets/pdf/panel_data_math_achievement.pdf)

---

## First Look at the Data

Before diving into regressions, I spent time just getting to know the data. Here's what stood out:

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/panel-data/distribution.jpg" title="Distribution of % Satisfactory 4th Grade Math" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    The distribution of math achievement across all district-years. It's roughly bell-shaped, centered around 50--70%, but the tails stretch almost to 0% and 100%. There's a <em>lot</em> of variation across districts.
</div>

Then I looked at how things changed over time:

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/panel-data/trend.jpg" title="Trend of Average % Satisfactory 4th Grade Math (1992-1998)" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/panel-data/boxplot.jpg" title="Boxplot of % Satisfactory 4th Grade Math by Year" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    <strong>Left:</strong> Average math achievement shot up from about 37% in 1992 to 75% in 1998 -- a remarkable improvement. <strong>Right:</strong> The boxplots show that not only did the median rise, but the spread across districts narrowed over time, suggesting convergence. Still, there are persistent outliers at both ends.
</div>

This upward trend likely reflects policy changes during this period (including higher real spending and foundation grants). It also told me right away: **year fixed effects are essential** in any regression model, otherwise temporal trends would contaminate the spending estimates.

---

## The Modeling Journey

Rather than jumping straight to a "final model," I walked through a progression of approaches -- each one revealing something new about the data.

### Step 1: Pooled OLS -- the naive starting point

I started with a standard pooled OLS regression (with cluster-robust standard errors by district). The results looked promising: a 10% increase in per-pupil expenditure was associated with about a **0.83 percentage-point** increase in math achievement. Free lunch eligibility (a proxy for poverty) was strongly negative, as expected.

But here's the catch: pooled OLS treats each district-year as an independent observation. It ignores that some districts are *persistently* high-performing and others are *persistently* struggling -- and these differences might be correlated with spending levels. In other words, omitted variable bias is a real concern here.

### Step 2: Random Effects -- accounting for district differences

The random effects (RE) model partially addresses this by modeling district-specific intercepts as random draws. The spending coefficient dropped from 8.33 to **4.26** -- already a sign that some of the OLS effect was picking up district characteristics rather than true spending effects.

A Breusch-Pagan test confirmed that a panel model is indeed preferred over pooled OLS ($$\bar{\chi}^2 = 2057.70$$, $$p < 0.001$$). About 43% of the total variance comes from between-district differences.

### Step 3: Fixed Effects -- the real test

This is where things got interesting. The fixed effects (FE) model strips out *all* time-invariant district characteristics and asks: **when a district increases its spending, do its scores actually go up?**

The answer? The spending coefficient dropped to **1.73 and became statistically insignificant**. The free-lunch effect also vanished in FE. What did emerge was a nonlinear enrollment effect -- as schools grow, scores initially rise but eventually decline.

### The Verdict: Hausman Test

The Hausman test made the choice clear: $$\chi^2(10) = 98.68$$, $$p < 0.001$$. The RE model is inconsistent -- unobserved district characteristics *are* correlated with the regressors. **Fixed effects is the preferred specification.**

### One More Check: Dynamic Panel (Arellano-Bond)

I also explored whether past performance predicts current performance (a dynamic specification). However, the lagged dependent variable ran into collinearity issues, likely due to near-time-invariant factors. The dynamic model didn't add much here, reinforcing that the static FE model is appropriate for this data.

---

## What I Took Away

The most striking finding wasn't any single coefficient -- it was watching the **spending effect shrink and disappear** as I moved from OLS to RE to FE. It's a textbook illustration of why controlling for unobserved heterogeneity matters:

- **Pooled OLS** overstates the spending effect because high-spending districts tend to be "better" in many unobserved ways.
- **Random Effects** partially corrects this but still assumes spending is uncorrelated with unobserved district traits (which the Hausman test rejects).
- **Fixed Effects** provides the most credible within-district estimates, and tells us that simply spending more -- without addressing *how* resources are used -- may not move the needle.

Of course, this doesn't mean money doesn't matter at all. It means the question is harder than it looks. Endogeneity is a real issue (districts with struggling students may receive *more* funding), and an instrumental variable approach -- like exploiting Michigan's Proposal A funding reform {% cite papke2005spending %} -- would be needed to make stronger causal claims.

---

## Skills and Tools

- **Econometrics**: Pooled OLS, Random Effects (GLS), Fixed Effects (within estimator), Hausman test, Breusch-Pagan LM test, Arellano-Bond dynamic panel estimation
- **Software**: Stata
- **Data**: Wooldridge's *Introductory Econometrics* textbook dataset (4th edition)
