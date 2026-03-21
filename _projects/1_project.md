---
layout: page
title: Instantaneous Emotion Sharing
description: EEG-based detection of communicative intent in language
img: assets/img/exSA_FIG3A.jpg
importance: 1
category: work
related_publications: true
---

### Problem
Can we detect *communicative intent* (e.g., expressing emotion vs stating facts) directly from brain signals — and how early does this signal emerge?

This can be framed as a **time-resolved classification problem on noisy multivariate signals (EEG)**.

---

### Dataset
- **Participants:** 24 subjects (after exclusions)
- **Signals:** 64-channel EEG
- **Sampling rate:** 500 Hz → downsampled to 250 Hz
- **Trials:** ~270+ per subject (balanced across conditions)
- **Conditions (2×2 design):**
  - Person: 1st vs 3rd
  - Adjective: emotional vs physical
- **Labels (derived):**
  - Expressive (emotion-sharing)
  - Assertive (fact-reporting)

---

### Preprocessing Pipeline
Implemented in **Python (MNE)**:

1. Band-pass filtering: **0.1–30 Hz**
2. Notch filter: **50 Hz** (line noise removal)
3. Artifact handling:
   - Bad channel interpolation
   - **ICA decomposition (~35 components)** → removal of ocular artifacts
4. Epoching:
   - Window: **-100 ms to +800 ms** around critical word
   - Baseline correction
5. Trial rejection:
   - Threshold: **200 µV peak-to-peak**

➡️ Result: clean, time-aligned neural signals per condition

---

### Feature Engineering
- Extracted **event-related potentials (ERPs)** (time-locked averages)
- Defined **data-driven time windows** using peak detection (FWHM method)
- Focus on early windows:
  - ~80 ms
  - ~110–130 ms
  - ~143–197 ms
  - **~221–279 ms (key window)**

Each trial → reduced to:
- mean amplitude per time window
- spatial grouping (anterior / central / posterior electrodes)

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

➡️ This is equivalent to **causal feature isolation** in modern ML terms

---

### Results
- Significant interaction effect at **~250 ms post-stimulus** :contentReference[oaicite:0]{index=0}  
- Strongest signal over **posterior electrodes**
- Interpretation:
  - Brain differentiates *intent* before classical semantic processing stages (N400)

---

### Data Science Interpretation
This project demonstrates:

- **Signal extraction in low SNR environments**
  - EEG is extremely noisy → requires heavy preprocessing
- **Temporal feature engineering**
  - Meaningful signals emerge only in specific time windows
- **Causal inference via experimental design**
  - Factorial design replaces black-box models
- **High-dimensional → structured reduction**
  - 64 channels × time → interpretable features

---

### Tech Stack
- Python (MNE, NumPy)
- Signal processing (filtering, ICA)
- Statistical modeling (ANOVA, interaction effects)
- Experimental design (controlled feature disentanglement)

---

### Key Insight
The brain performs **real-time intent classification (~250 ms)**  
— showing that pragmatic meaning is computed **in parallel with semantic processing**, not after it.