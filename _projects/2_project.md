---
layout: page
title: Capturing indirectness in language with PCA
description: Cognitive properties of indirect replies are rated and related to one another to indentify latent structure of indirectness.  
img: assets/img/iCO-Eval2_Fig3-4.jpg
importance: 2
category: work
related_publications:
  - Boux2022
mermaid:
  enabled: true
  zoomable: true
---

## Overview

Indirect language (e.g., *“I am on a diet”* as a refusal of a piece of cake) introduces a gap between literal form and communicative intent. This project investigates whether indirectness can be captured through **quantifiable cognitive features** and modeled using statistical and multivariate techniques.

We treat indirectness as a **latent construct** reflected in multiple observable dimensions and analyze it using **linear mixed-effects models (LMMs)**, **correlation analysis**, and **principal component analysis (PCA)**.

---

## Experimental Design

* **Within-subject design** with repeated ratings per participant
* Each item consists of:

  * A **context question**
  * A **reply** (direct vs. indirect)
* Factors:

  * **Directness**: direct vs. indirect
  * **Speech-act matching**: matched vs. mismatched
  * **Polarity**: yes vs. no

This results in a **hierarchical dataset** with:

* Multiple observations per subject
* Multiple items per experimental condition

---

## Data

Participants view question/answer pairs and are asked to rate them along several dimensions on a 7-point Likert scale:
* **FUNCTION**: interpretation as impllying a "yes" or "no"
* **COH-R**: coherence with the preceding question
* **DIR-R**: perceived directness
* **PRE-R**: predictability given the preceding question
* **SSI-R**: semantic similarity to the preceding question

## Data Preprocessing

Preprocessing and analysis were conducted in **MATLAB**, **R (lme4, emmeans)**, and **SPSS**.

### Scale Harmonization

* Ratings with mirrored Likert anchors were **inverted**
* Ensured consistent directionality across all scales

### Feature Transformation

A new variable, **Certainty (CER-R)**, was derived from function ratings:

* Computed as the **rectified distance from the scale midpoint**
* Shifted to align with other scales → final range: **1–4**
* Interpretation:

  * Extreme responses → high certainty
  * Central values → low certainty

---

## Data Cleaning

We applied strict filtering to ensure validity of the direct/indirect manipulation:

* Removed item pairs where:

  * “Direct” items were rated as more indirect than “indirect” ones
  * Function ratings did not align with expected yes/no interpretation

* Additional balancing:

  * Equal number of **yes/no items** across conditions

### Final dataset:

* **SA-matched set**: 70 item pairs
* **Non-SA-matched set**: 62 item pairs

---

## Statistical Modeling

### Linear Mixed-Effects Models (LMM)

We modeled each rating dimension using **linear mixed-effects models** via `lme4`.

#### Model structure:

```r
RATING ~ InDirectness * Polarity * SA_matching + (1 | Subject) + (1 | Item)
```

#### Key components:

* **Fixed effects**:

  * Directness (Direct vs. Indirect)
  * Speech-act matching
  * Polarity (yes/no)
  * All interactions

* **Random effects**:

  * Random intercepts for **subjects** and **items**

---

### Model Selection

* Stepwise model building from **null model → full interaction model**
* Compared using **Likelihood Ratio Tests (LRT)**

```r
(null) RATING ~ 1 + (1|Subject) + (1|Item)
```

→ progressively adding predictors and interactions

---

### Post-hoc Analysis

* Estimated marginal means using `emmeans`
* Multiple comparisons corrected using **Tukey’s HSD**

---

### Model Diagnostics

* Residuals inspected for:

  * Normality
  * Homoscedasticity
  * Independence

---

## Correlation Analysis

To test whether cognitive features co-vary:

* Computed **pairwise Pearson correlations**
* Based on **item-level averages**
* Data collapsed across conditions (motivated by LMM results)

### Notes:

* Function ratings excluded (bimodal distribution)
* Bonferroni correction applied (10 comparisons)

---

## Principal Component Analysis (PCA)

We performed PCA to identify **latent structure** across features.

### Setup:

* Input: 5 features × 264 items
* Standardized feature space

### Assumption checks:

* **Kaiser-Meyer-Olkin (KMO)** measure
* **Bartlett’s test of sphericity**
* Correlation matrix determinant

### PCA configuration:

* Component selection: **Kaiser criterion (eigenvalue > 1)**
* Rotation: **Varimax (orthogonal)**

---

### Interpretation

* Strong loadings of all features on a shared component
* Indicates a **low-dimensional latent structure**
* Suggests indirectness reflects a **joint cognitive signal**

---

## Key Findings

* Indirect replies are:

  * Less predictable
  * Less coherent
  * Less semantically aligned
  * Interpreted with lower certainty

* Effects are reduced (but not eliminated) when controlling for speech-act matching

* Strong correlations and PCA results converge on:
  → **A shared latent cognitive dimension underlying indirectness**

---

## Implications

### For Data Science

* Indirectness behaves like a **latent variable problem**
* Requires **multi-feature modeling**, not single metrics

### For NLP

* Standard similarity metrics miss **pragmatic meaning**
* Dialogue systems must model:

  * Context
  * Intent
  * Non-literal inference

---

## Future Work

* Replace rating-based similarity with **embedding-based metrics (e.g., transformers)**
* Use **Bayesian hierarchical models** for uncertainty quantification
* Extend to **real-world conversational datasets**
* Train models to **predict indirectness from text**

---

    description: a project with a background image
    img: /assets/img/12.jpg
    ---

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/1.jpg" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/3.jpg" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/5.jpg" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Caption photos easily. On the left, a road goes through a tunnel. Middle, leaves artistically fall in a hipster photoshoot. Right, in another hipster photoshoot, a lumberjack grasps a handful of pine needles.
</div>
<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/5.jpg" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    This image can also have a caption. It's like magic.
</div>

You can also put regular text between your rows of images.
Say you wanted to write a little bit about your project before you posted the rest of the images.
You describe how you toiled, sweated, _bled_ for your project, and then... you reveal its glory in the next row of images.

<div class="row justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/6.jpg" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm-4 mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/11.jpg" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    You can also have artistically styled 2/3 + 1/3 images, like these.
</div>

The code is simple.
Just wrap your images with `<div class="col-sm">` and place them inside `<div class="row">` (read more about the <a href="https://getbootstrap.com/docs/4.4/layout/grid/">Bootstrap Grid</a> system).
To make images responsive, add `img-fluid` class to each; for rounded corners and shadows use `rounded` and `z-depth-1` classes.
Here's the code for the last row of images above:

{% raw %}

```html
<div class="row justify-content-sm-center">
  <div class="col-sm-8 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/6.jpg" title="example image" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm-4 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/11.jpg" title="example image" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
```

{% endraw %}
