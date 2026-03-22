---
layout: page
title: EEG Bases of Instantaneous Emotion Sharing via Language
description: EEG-based detection of communicative intent in language
img: assets/img/exSA_FIG3A.jpg
importance: 1
category: work
related_publications:
  - boux_instantaneous_2026
mermaid:
  enabled: true
  zoomable: true
---

### Problem
Can we detect *communicative intent* (e.g., expressing emotion vs stating facts) directly from elecrophysiological brain signals (EEG) — and how early does this differenciation occurs in the language comprehension process?

---

### Dataset
- **Participants:** 24 subjects (after exclusions)
- **Signals:** 64-channel electroencephalography (EEG)
- **Sampling rate:** 500 Hz
- **Trials:** ~270+ per subject (balanced across conditions)
- **Conditions (2×2 design):**
  - Person: 1st vs 3rd
  - Adjective: emotional vs physical
- **Labels (derived):**
  - Expressive (emotion-sharing)
  - Assertive (fact-reporting)

---

### Preprocessing Pipeline


```mermaid
flowchart TD
A[Test] --> B[Works]
```

```mermaid
flowchart TD

subgraph A[Data Acquisition]
    A1[64-channel EEG<br/>10-10 layout]
    A4[Sampling: 500 Hz<br/>Impedance below 10 kOhm]
    A1 --> A4
end

subgraph B[Signal cleaning]
    B1[Downsampling<br/>500 -> 250 Hz]
    B2[Filtering<br/>Band-pass filter: 0.1-30 Hz<br/>Notch filter: 50 Hz]
    B4[Compute vertical and horizontal EOG signals<br/>from ocular electrodes]
    B6[Interpolate noisy channels<br/>spherical spline]
    B8[ICA decomposition<br/>Remove ocular components]
    B1 --> B2 --> B4 --> B6 --> B8
end

subgraph C[Signal segmentation - version 1]
    C1[Segment data<br/>-100 to +800 ms]
    C2[Baseline correction<br/>-100 to 0 ms]
    C1 --> C2
end

subgraph D[Signal segmentation - version 2]
    D1[High-pass filter<br/>1 Hz]
    D2[Segment data<br/>-2100 to +800 ms]
    D3[Baseline correction<br/>-2100 to -1900 ms]
    D1 --> D2 --> D3
end

subgraph E[Averaging]
    C3[Reject segments > 200 uV peak-to-peak]
    E1[Average by subject<br/>n=24, m=4 conditions]
    E2[Grand average across subjects]
    C3 --> E1 --> E2
end

subgraph F[Feature Extraction]
    F1[Detect ERP peaks<br/>FWHM method]
    F3[Extract 4 time windows<br/>TW1: 76-100 ms<br/>TW2: 110-130 ms<br/>TW3: 143-197 ms<br/>TW4: 221-279 ms]
    G1[Extract 9 spatial locations<br/>anterior-left, anterior-midline, anterior-right<br/>central-left, central-midline, central-right<br/>posterior-left, posterior-midline, posterior-right]
    F1 --> F3 --> G1
end

subgraph H[Statistical Analysis]
    H1[Check Gaussian distribution<br/>Shapiro-Wilk test]
    H2[rmANOVA<br/>2 Person x 2 Adjective x 3 Gradient x 3 Laterality]
    H6[Post-hoc tests<br/>Bonferroni correction]
    H1 --> H2 --> H6
end

A --> B --> C --> E
B --> D --> E
E --> F --> H
```
---

### Analysis Strategy
Instead of naive classification, used a **controlled statistical model** to isolate signal sources:

- **Repeated-measures ANOVA**
  - Factors:
    - Person (1st vs 3rd)
    - Adjective (emotional vs physical)
    - Electrode location (spatial structure)
- Key idea:
  - The **interaction term** isolates *communicative intent*
  - Removes confounds from syntax + semantics

---

### Results
- Significant interaction effect at **~250 ms post-stimulus** :contentReference[oaicite:0]{index=0}  
- Strongest signal over **posterior electrodes**
- Interpretation:
  - Brain differentiates *intent* before surprisingly early and in parallel with (i.e. not after) classical semantic processing stages.

---

### Data Science Interpretation
This project demonstrates:

- **Signal extraction in low SNR environments**
  - EEG is extremely noisy → requires heavy preprocessing
- **Temporal feature engineering**
  - Meaningful signals emerge only in specific time windows
- **High-dimensional → structured reduction**
  - 64 channels × time → interpretable features
- **Inferential statistics**
    - Experimental design (controlled feature disentanglement)

---

### Tech Stack
- Python (MNE, NumPy)
- Signal processing (filtering, ICA)
- Statistical modeling (ANOVA, interaction effects)
- Experimental design (controlled feature disentanglement)

---
