---
layout: page
title: Forecasting US Energy Consumption Using ARIMA Models
description: A time series study of Personal Consumption Expenditures on Energy (2010-2025)
img: assets/img/arima-energy/forecast.jpg
importance: 9
category: work
related_publications: false
---

## The Question

How much will Americans spend on energy next month? And the month after that? Forecasting energy consumption matters for policy planning, budgeting, and understanding economic trends -- and time series analysis gives us the tools to answer these questions rigorously.

In this project, I modeled **monthly Personal Consumption Expenditures (PCE) on Energy Goods and Services** in the US, from January 2010 to September 2025 -- that's **189 monthly observations**. The data comes from the Federal Reserve Economic Data (FRED) database, seasonally adjusted and reported in billions of USD.

This was a course project for **Time Series** in my Master's program (International Economics and Sustainable Development, University of Orleans), taught by Professor Djamel Kirat. I received a grade of **16.5/20** for this project[^1].

[^1]: [Full report (PDF)](/assets/pdf/projects/Forecasting_Personal_Consumption_Expenditures_on_Energy_Goods_and_Services_in_the_US__2010_2025__Using_ARIMA_Models.pdf)

---

## Getting to Know the Data

The first thing I always do is just *look* at the data. The time series plot immediately told a story:

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/arima-energy/time-series.jpg" title="Monthly US Energy PCE (2010-2025)" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Monthly US energy consumption expenditures from 2010 to 2025. Notice the sharp COVID-19 crash in 2020, the dramatic recovery, and the seasonal fluctuations throughout.
</div>

A few things jumped out: the series fluctuates with seasons (higher in winter and summer, lower in spring and autumn), there's no perfectly linear trend, and there's a **dramatic crash in 2020** followed by a strong recovery -- the COVID-19 effect on energy consumption is unmistakable.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/arima-energy/distribution.jpg" title="Distribution of Monthly US Energy PCE" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Most observations cluster around 600--700 billion USD, with extreme values at both ends corresponding to the COVID crash and post-recovery peaks.
</div>

The average monthly expenditure was about **633.87 billion USD**, with a standard deviation of $$\sigma = 98.32$$ billion -- quite a lot of variation. The histogram confirmed that most values sit around 600--700 billion, with tails stretching from $$\min = 415.8$$ to $$\max = 914.9$$ billion.

I also looked at the autocorrelation (ACF) and partial autocorrelation (PACF) of the raw series:

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/arima-energy/acf-original.jpg" title="ACF of Monthly US Energy PCE" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/arima-energy/pacf-original.jpg" title="PACF of Monthly US Energy PCE" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    <strong>Left:</strong> The ACF shows a gradual decline -- a classic sign of non-stationarity. <strong>Right:</strong> The PACF shows a significant spike at lag 1, hinting at short-term autoregressive effects.
</div>

---

## Is the Series Stationary?

Before fitting any ARIMA model, I needed to answer a fundamental question: does this series have a unit root? I used three complementary tests, because no single test tells the whole story -- they have different null hypotheses and different strengths.

### On the original series

**Augmented Dickey-Fuller (ADF) test** -- The null hypothesis is that the series has a unit root (i.e., is non-stationary). Including a trend term, the test yielded:

$$\tau = -1.775, \, p = 0.7167$$

This is well above the 5% critical value of $$-3.438$$. I cannot reject the null -- the data looks non-stationary.

**Phillips-Perron (PP) test** -- Same null hypothesis as ADF, but more robust to serial correlation and heteroskedasticity in the error term:

$$Z(t) = -1.899, \, p = 0.6553$$

Again, far from rejecting the unit root hypothesis. Both ADF and PP agree.

**KPSS test** -- This one flips the logic: the null hypothesis is that the series *is* stationary. If we reject, it means the data is non-stationary:

$$\eta = 2.47 \text{ (at lag 0)}$$

The 1% critical value is just $$0.216$$ -- our statistic exceeds it by more than ten times. The null of stationarity is strongly rejected.

All three tests consistently point to the same conclusion: the monthly energy expenditure series is **non-stationary**, and differencing is required before fitting an ARIMA model.

### After first differencing

I applied first differencing ($$\Delta y_t = y_t - y_{t-1}$$) and re-ran the same battery:

**ADF test**:

$$\tau = -11.636, \, p < 0.001$$

Now the test statistic is far below the 1% critical value of $$-4.011$$. The unit root is strongly rejected.

**Phillips-Perron test**:

$$Z(t) = -11.522, \, p < 0.001$$

Same story -- overwhelming evidence against a unit root.

**KPSS test**:

$$\eta = 0.0654 \text{ (at lag 0)}$$

This is well below even the 10% critical value of $$0.119$$. The null of stationarity is *not* rejected -- the differenced series is indeed stationary.

Taken together, these results confirm that the differenced series is stationary, justifying $$d = 1$$ in the ARIMA specification.

---

## Choosing the Model

Looking at the ACF and PACF of the differenced series helped me narrow down the model:

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/arima-energy/acf-differenced.jpg" title="ACF of Differenced Series" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/arima-energy/pacf-differenced.jpg" title="PACF of Differenced Series" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    After differencing, most autocorrelations fall within the 95% confidence bands. Only a couple of lags slightly exceed the threshold, suggesting a low-order ARMA process.
</div>

In the ACF plot, most autocorrelations lie within the 95% confidence bands, with only one lag slightly exceeding the threshold -- indicating limited residual autocorrelation. The PACF shows a similar pattern, with two lags slightly outside the bands. Based on these diagnostics, I considered two candidate models: $$\text{ARIMA}(1,1,1)$$ and $$\text{ARIMA}(2,1,1)$$. Both were estimated without a constant term, since the stationarity tests on the differenced series showed that the intercept was not statistically significant.

### ARIMA(1,1,1) -- the winner

The model is specified as:

$$\Delta y_t = \phi_1 \Delta y_{t-1} + \varepsilon_t + \theta_1 \varepsilon_{t-1}$$

Estimated coefficients:

$$\hat{\phi}_1 = -0.748 \, (z = -9.12, \, p < 0.001)$$

$$\hat{\theta}_1 = 0.924 \, (z = 16.80, \, p < 0.001)$$

$$\hat{\sigma} = 21.08$$

Both the AR and MA coefficients are highly significant at the 1% level, indicating strong short-term autocorrelation and moving average effects in the differenced series. The model's overall fit is confirmed by the Wald test: $$\chi^2(2) = 365.34, \, p < 0.001$$.

Information criteria:

$$\log L = -840.06, \, \text{AIC} = 1686.12, \, \text{BIC} = 1695.83$$

### ARIMA(2,1,1) -- not an improvement

To see if a richer autoregressive structure could improve the fit, I added a second AR lag. The model becomes:

$$\Delta y_t = \phi_1 \Delta y_{t-1} + \phi_2 \Delta y_{t-2} + \varepsilon_t + \theta_1 \varepsilon_{t-1}$$

Here, the differenced series at time $$t$$ depends on its own two most recent past values (the AR(1) and AR(2) terms) plus the current and previous error terms (the MA(1) part). The question is whether this second lag captures dynamics that the simpler ARIMA(1,1,1) missed.

Estimated coefficients:

$$\hat{\phi}_1 = -0.081 \, (z = -0.23, \, p = 0.817)$$

$$\hat{\phi}_2 = -0.130 \, (z = -1.34, \, p = 0.180)$$

$$\hat{\theta}_1 = 0.267 \, (z = 0.75, \, p = 0.455)$$

$$\hat{\sigma} = 21.22$$

*None* of the AR or MA coefficients are statistically significant at conventional levels. The additional AR(2) term does not improve the model. The information criteria confirm this:

$$\log L = -841.11, \, \text{AIC} = 1690.22, \, \text{BIC} = 1703.17$$

A higher (less negative) log-likelihood indicates better fit, while lower AIC and BIC are preferred since they penalize model complexity. On every metric, ARIMA(2,1,1) performs worse than ARIMA(1,1,1): lower log-likelihood, higher AIC (+4.1), and higher BIC (+7.3). **ARIMA(1,1,1) is the preferred specification.**

---

## Diagnostics: Is the Model Any Good?

A good model isn't just one with significant coefficients -- its residuals should look like white noise (no remaining patterns), and the model should be stable. I checked both.

**Portmanteau (Q) test for white noise** -- This tests whether there is any remaining autocorrelation in the residuals. The null hypothesis is that the residuals are independently distributed (i.e., white noise):

$$Q(40) = 47.84, \, p = 0.1846$$

With a p-value of 0.1846, I cannot reject the null at any conventional significance level. The residuals show no significant autocorrelation up to 40 lags -- the model has successfully captured the serial dependence in the data.

**Eigenvalue stability condition** -- For the ARIMA model to produce reliable forecasts, the AR part must be stationary and the MA part must be invertible. This is verified by checking that all inverse roots of the AR and MA characteristic polynomials lie strictly inside the unit circle:

<div class="row justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/arima-energy/inverse-roots.jpg" title="Inverse roots of ARMA polynomials" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    All eigenvalues for both the AR and MA components sit strictly inside the unit circle, satisfying the conditions for stationarity (AR part) and invertibility (MA part). This confirms the model is stable and suitable for forecasting.
</div>

---

## The Forecast

Using ARIMA(1,1,1), I generated forecasts for the next nine months (October 2025 to June 2026):

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/arima-energy/forecast.jpg" title="Monthly US Energy PCE Forecast" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    The forecast (with confidence intervals) suggests energy expenditures will stabilize around <strong>760 billion USD</strong> per month, with no strong upward or downward trend in the short term.
</div>

The model predicts energy consumption will hover around **760 billion USD** monthly, fluctuating slightly but without a clear directional trend. This makes sense -- the ARIMA model captures the short-term dynamics but doesn't predict structural shifts.

---

## What I Took Away

This project was a satisfying end-to-end time series exercise: from exploratory analysis to stationarity testing, model selection, diagnostics, and forecasting. A few key lessons:

- **Always test stationarity rigorously** -- using multiple tests (ADF, PP, KPSS) gives much more confidence than relying on a single one. They test different null hypotheses and complement each other.
- **Simpler models can win** -- ARIMA(1,1,1) beat ARIMA(2,1,1) on every metric. Adding parameters doesn't help if they're not significant.
- **Diagnostics matter** -- a model that passes the Portmanteau test and has stable roots gives you confidence that the forecasts are meaningful, not just artifacts of overfitting.

---

## Skills and Tools

- **Time Series**: ARIMA modeling, ADF/PP/KPSS stationarity tests, ACF/PACF analysis, Portmanteau test, eigenvalue stability condition
- **Software**: Stata
- **Data**: FRED (Federal Reserve Economic Data) -- series DNRGRC1M027SBEA
