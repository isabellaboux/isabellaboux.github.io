---
layout: page
title: The latent structure of indirect language
description: []
img: assets/img/iCO-Eval2_Fig3-4.jpg
importance: 2
category: work
tags: [language, PCA, linear mixed modelling, inferential statistics, experimental design, ratings, matlab, SPSS, visualization, R]
related_publications:
  - Boux2022
mermaid:
  enabled: true
  zoomable: false
---

## Overview
---

Indirect language (e.g., *“I am on a diet”* as a refusal of a piece of cake) introduces a gap between the literal meaning of a sentence and its communicative intent.

With this project, I asked whether indirectness can be captured through **quantifiable cognitive features** and modeled using statistical and multivariate techniques. In addition, I investigated whether indirectness can be treated as a **latent construct** reflected in multiple observable dimensions.

I showed human participants examples of direct and indirect replies to questions and asked them to provide various ratings about the reply. I analyzed the ratings and derived measures using **linear mixed-effects models (LMMs)**, **correlation analysis**, and **principal component analysis (PCA)**.

## STEP 1: Design examples of direct and indirect replies

---

Before collecting ratings, I needed to develop a set of direct and indirect replies.

Because we know that ratings can be affected by very low-level aspects of a sentence, I wanted my direct and indirect replies to differ from each other only in terms of in/directness, but to be otherwise structurally identical to each other. This was achieved by varying the question preceding the reply, while the reply itself remained identical, including its pragmatic meaning (a statement in both cases).


#### SA-matched set

| Condition               | Question                                  | Question’s SA       | Critical reply                       | Reply’s SA                         | Expected interpretation |
| ----------------------- | ----------------------------------------- | ------------------- | ------------------------------------ | ---------------------------------- | ---------------------------- |
| direct       | **Is your cat hurt?**                     | information query   | **It got wounded.**                  | statement              | yes                          |
| indirect     | **Are you bringing your cat to the vet?** | information query   | **It got wounded.**                  | statement               | yes                          |

To remain comparable with previous studies investigating indirectness, I also included a set of direct and indirect replies that, while containing the same sentence, convey a different pragmatic meaning (direct statement vs. indirect rejection or acceptance of an offer).

#### non-SA-matched set

| Condition               | Question                                  | Question’s SA       | Critical reply                       | Reply’s SA                         | Expected interpretation |
| ----------------------- | ----------------------------------------- | ------------------- | ------------------------------------ | ---------------------------------- | ---------------------------- |
| direct   | **Have you decided on a destination?**    | information query   | **We are not sure where to go yet.** | statement              | no                           |
| indirect | **Shall I buy the train tickets?**        | offer (or proposal) | **We are not sure where to go yet.** | rejecting (or accepting) the offer | no                           |

Because I was interested in making comparisons between the SA-matched and non-SA-matched sets, I also ensured that, between responses that signified a *yes* or *no*, the length of the reply and number of content words were comparable.

| Measure                                                   | SA-matched: Yes (n = 36) | SA-matched: No (n = 36) | non-SA-matched: Yes (n = 33) | non-SA-matched: No (n = 33) |
| --------------------------------------------------------- | -----------------------: | ----------------------: | ---------------------------: | --------------------------: |
| Length critical utterance in words (mean ± SD)            |              5.50 ± 1.54 |             5.19 ± 1.17 |                  5.85 ± 1.23 |                 5.52 ± 1.46 |
| Number of content words in critical utterance (mean ± SD) |              2.75 ± 1.02 |             2.69 ± 0.62 |                  2.82 ± 0.92 |                 2.61 ± 0.86 |


At this point, we have two sets of highly comparable direct and indirect replies that nicely isolate indirectness. However, because these replies are put in a different dialogic context (that is, they follow different questions), their relation with their context question must also be kept as comparable as possible. For this reason, I also quantified the relation between each reply and its context question, with a particular emphasis on meaning similarity, assessed in various ways, including **cosine similarity** based on latent semantic analysis (LSA).


| Measure                                      | SA-matched Yes Direct (n = 36) | SA-matched Yes Indirect (n = 36) | SA-matched No Direct (n = 36) | SA-matched No Indirect (n = 36) | non-SA-matched Yes Direct (n = 33) | non-SA-matched Yes Indirect (n = 33) | non-SA-matched No Direct (n = 33) | non-SA-matched No Indirect (n = 33) |
| -------------------------------------------- | -----------------------------: | -------------------------------: | ----------------------------: | ------------------------------: | ---------------------------------: | -----------------------------------: | --------------------------------: | ----------------------------------: |
| LSA Cosine similarity (mean ± SD)            |                    0.67 ± 0.13 |                      0.65 ± 0.17 |                   0.64 ± 0.15 |                     0.64 ± 0.13 |                        0.67 ± 0.12 |                          0.66 ± 0.13 |                       0.64 ± 0.12 |                         0.63 ± 0.12 |
| Length context question in words (mean ± SD) |                    5.67 ± 1.20 |                      5.50 ± 1.36 |                   6.06 ± 1.31 |                     6.19 ± 1.37 |                        5.91 ± 1.55 |                          6.18 ± 1.13 |                       5.97 ± 1.33 |                         5.94 ± 1.27 |
| Number of repeated pronouns (sum)            |                              8 |                                8 |                             5 |                               5 |                                  4 |                                    3 |                                 1 |                                   3 |
| Number of coreferences (sum)                 |                             29 |                               30 |                            33 |                              33 |                                 34 |                                   28 |                                27 |                                  32 |
| Number of repeated lemmas (sum)              |                              9 |                               11 |                            11 |                               8 |                                  9 |                                    8 |                                 8 |                                   9 |


Final set of replies:
* **SA-matched set**: 70 item pairs
* **Non-SA-matched set**: 62 item pairs


## STEP 2: Collecting the data

---

I asked participants to view each question/answer pair and rate them along several dimensions on a 7-point Likert scale:
* **FUNCTION**: interpretation as signifying a *"yes"* or *"no"*
* **COH-R**: coherence with the preceding question
* **DIR-R**: perceived directness
* **PRE-R**: predictability given the preceding question
* **SSI-R**: semantic similarity to the preceding question
The question/reply pairs were presented in a randomized order and the direction of the Likert scale was inverted for half of the participants.


## STEP 3: data cleaning, processing, feature engineering

---

* I removed item pairs where:
  * “Direct” items were rated as more indirect than “indirect” ones
  * Function ratings did not align with expected yes/no interpretation
* I re-inverted ratings with inverted Likert anchors, ensuring consistent directionality across all scales
* I computed a new variable, **Certainty (CER-R)**, derived from function ratings:
  * Computed as the **rectified distance from the scale midpoint**
  * Shifted to align with other scales → final range: **1–4**
  * Interpretation:
    * extreme responses → high certainty
    * central values → low certainty


## STEP 4: Analysis and results

---

#### Do the various ratings differ as a function of in/directness, SA-matching and polarity?

Because I had a hierarchical dataset with the same reply presented to different participants and the same participant rating different replies, I modeled each rating dimension in **R** using **linear mixed-effects models** via the `lme4` package.

```r
RATING ~ InDirectness * Polarity * SA_matching + (1 | Subject) + (1 | Item)
```

For each rating, I started modeling the data with the simplest model and progressively added fixed factors. 
* Stepwise model building from **null model → full interaction model**
* Compared using **Likelihood Ratio Tests (LRT)**
I checked model sanity by examining the normality and homoscedasticity of model residuals.

In case of complex two-way or three-way interactions, I conducted post-hoc tests on marginal means by:
* Estimated marginal means using `emmeans`
* Multiple comparisons corrected using **Tukey’s HSD**

The strongest pattern for all ratings is that indirect replies are perceived as less coherent with their context, less predictable, less semantically similar to their context, and they are interpreted with less certainty. As expected, they are also perceived as less direct (sanity check). More fine-grained modulations can also be detected in relation to complex combinations of indirectness, SA-matching, and polarity.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/iCO-Eval_FIG2.png" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    **Figure 1**: Average ratings for the various dimensions: (A) Directness (DIR-R), (B) Coherence with the question (COH-R), (C) Predictability (PRE-R), (D) Semantic Similarity to the Question (SSI-R), (E) Certainty of Function (CER-R), (F) Function (FUN-R). Each of these are further divided by In/Directness (direct, indirect), SA-matching (SA-matched, non-SA-matched) and Polarity of the answer (yes, no). Error bars indicate the standard error of the mean based on single trial data.
</div>

---

#### Are the features all correlated?

Because the prior analysis showed striking parallels between features, I asked whether these are correlated with one another. For each reply, I calculated its average score for each feature and performed pairwise Pearson correlations between all features. Due to the number of correlations, a Bonferroni correction was applied.

All features are strongly (all R > 0.8) and significantly (all p < 0.001) linearly correlated with one another.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/iCO-Eval_FIG3.png" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    **Figure 3**: Correlation matrix shown for the following rated dimensions: certainty (CER-R), coherence with the question (COH-R), directness (DIR-R), predictability (PRE-R) and semantic similarity to the question (SSI-R). The plots below the diagonal show the scatter plot displaying the relationship between pairs of variables, together with the regression line in red. Each observation represents an item and its average score on a given scale. The plots above the diagonal show the respective Pearson correlation coefficient (R) and significance level after correction for multiple comparisons (*p < 0.05, **p < 0.01, ***p < 0.001).
</div>

---

#### Is indirectness a latent structure spanning all features?

I performed principal component analysis (PCA) to identify **latent structure** across features.
* Input: 5 features × 264 items
* Standardized feature space
* Assumption checks:
  * **Kaiser-Meyer-Olkin (KMO)** measure
  * **Bartlett’s test of sphericity**
  * Correlation matrix determinant
* Component selection: **Kaiser criterion (eigenvalue > 1)**
* Rotation: **Varimax (orthogonal)**

Interestingly, a single component clearly explains 92% of variance in the features, with all features loading equally. This indicates a **low-dimensional latent structure**, suggesting that indirectness reflects (or emerges from) a **joint cognitive signal**.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/iCO-Eval_FIG4.png" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    **Figure 3**: Scree plot depicting the Eigenvalues of each principal component identified by principal component analysis (PCA), together with the respective percentage of explained variance. The red dotted line represents Kaiser’s criterion at Eigenvalue 1.
</div>

---

## Conclusion

> Compared to direct replies, indirect replies are less predictable, less coherent, and less semantically aligned with their context question. They are also interpreted with less certainty. Strong correlations and the PCA results converge on a shared latent cognitive dimension underlying indirectness.

---

## Tech Stack

Python
- `psychopy` for programming the computerized rating task

R
- `lme4` for linear and generalized mixed-effects models
- `emmeans` for post-hoc comparisons
- `ggplot2` for visualization

Matlab
- for visualization

SPSS
- for PCA
