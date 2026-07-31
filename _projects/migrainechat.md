---
layout: page
title: MigraineChat
description: []
img: assets/img/migrainechat_cover.png
importance: 4
category: miscellaneous
tags: [LLM, fastAPI, PostgreSQL, data simulation, XGBoost, logistic regression, scikit-learn, streamlit, visualization, plotly, synthetic data generation, speech-to-text, text-to-speech, python]
---

## Overview
MigraineChat is a prototype of a voice-first app that allows migraine patients to log their health status daily and generate patient-specific predictions about their likelihood of developing a migraine the following day.

This project was conducted jointly with [Dr. Maxim Smirnov](https://github.com/msmirnov18) in the context of the [Data Science Retreat](https://datascienceretreat.com/) training program.

**How does this differ from existing migraine logging apps?**

- **Voice-first logging**: Many migraine patients experience photosensitivity, meaning that light can increase their pain. For this reason, staring at a smartphone while entering symptoms is not ideal. Using their voice offers an appealing alternative.
- **Daily logging, not only on migraine days**: The chat function is designed to capture data every day. This is critical because it also records patient data outside migraine episodes, which is essential for predicting migraine onset.

**Who benefits from it?**

- **Migraine patients** gain better insights into their migraine patterns, with the potential to predict the onset of their next migraine.
- **Physicians** receive diagnostic support through statistics and visualizations that provide an overview of the patient's symptoms.
- **Researchers** might also benefit in the long run from access to large, real-world migraine datasets, which could be highly valuable for understanding this condition and improving treatment.

**Additional materials**

- [Repo](https://github.com/msmirnov18/migraine-app) (currently private)
- [Slides](https://docs.google.com/presentation/d/1dsO1lTasWDT7mw39KPnsPemNxCj4NpsskKp4Dsu8cvI/edit?usp=sharing)
- [Presentation video](https://www.youtube.com/watch?v=UbnxSYMMpJs)

## Chat tab

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/migrainechat_tab_chat.png" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    [FIGURE 1] View of the chat interface.
</div>

#### Frontend

Here, users can simply talk to the LLM assistant, which is designed to prompt them to provide information about specific health parameters. Depending on whether the user is experiencing a migraine, the conversation focuses either on overall well-being (energy level, focus, etc.) or on migraine symptoms (pain intensity, nausea, aura, etc.). The LLM assistant attempts to collect all variables but also recognizes exit commands if the patient wants to end the conversation.

#### Backend

1. The audio is sent to the backend via `FastAPI` and then to the **Groq API**, which performs **speech-to-text (STT)** conversion using the `openai/whisper-large-v3` model.
2. The resulting transcription is then sent to the **OpenAI API**, where the `gpt-5.4-nano` model analyzes the response and provides (i) a JSON structure containing the extracted information and (ii) a conversational response prompting the user to provide any missing information.
3. The LLM's response is then sent to the **Groq API**, which uses the `canopylabs/orpheus-v1-english` **text-to-speech (TTS)** model. The resulting audio is sent to the frontend and played back to the user.

Several conversation turns can take place. The conversation terminates when either of the following is true:

- The user requests that the conversation end.
- The user has logged all the information for the current day.

The extracted data is then saved to a **PostgreSQL** database.

# Statistics tab

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/migrainechat_tab_statistics.png" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    [FIGURE 2] Statistics tab summarizing and visualizing the user's data (in this example, synthetic-user-7).
</div>

#### Frontend

Users can view their logged data through a series of visualizations designed to provide detailed insights into typical migraine patterns and identify which signs are most indicative of an impending migraine episode.

#### Backend

Data from the previous year, including relevant statistics, is retrieved from the PostgreSQL database via an API call and visualized with `Plotly`.

## Predictions tab

#### Frontend

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/migrainechat_tab_predictions_neg.png" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/migrainechat_tab_predictions_pos.png" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    [FIGURE 3] Predictions tab showing either a negative prediction (left) or a positive one (right).
</div>

The user sees an information box showing the likelihood, as a percentage, that they will develop a migraine the following day. This information can help them plan accordingly and decide whether to take preventive medication, such as triptans.

#### Backend

**Generating synthetic data**

The first step in experimenting with modeling was to generate synthetic user data that mimicked typical migraine patterns. We generated two years of time-series data for 10 synthetic users. The simulations were conducted using `NumPy` and `pandas`. Synthetic users were generated using a **two-level stochastic model**—that is, a **hierarchical simulation with between-subject and within-subject variability**. For each parameter, a population-level mean was obtained from the literature, where available. Interindividual variability was modeled by sampling each synthetic user’s characteristic mean value from a normal distribution centered on the population mean, with an assumed standard deviation reflecting plausible between-subject variability. Subsequently, repeated episode-level values for each user were sampled from a second normal distribution centered on that user's specific mean, representing intraindividual variability across episodes.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/migrainechat_simulation.png" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    [FIGURE 4] Two-level stochastic model approach taken to generate synthetic user data accounting for both between-user variability and within-user variability across migraine episodes.
</div>

**Modeling**

Two different types of models (XGBoost and logistic regression) are built for each user. The task is a binary classification: Will the user develop a migraine the next day (yes: 1 / no: 0)? All available user data is used for training while accounting for certain intrinsic properties of the data:

- The data is a **time series**, so specific measures are taken to avoid data leakage.
- There is a major **class imbalance**.
- Each user has a **small dataset**, preventing the use of more complex models such as DNNs.
- It is desirable to favor models that allow some degree of **interpretability**.

Overall, XGBoost outperformed logistic regression for all synthetic users across all relevant performance metrics: **precision**, **recall**, **F1**, and **ROC AUC** (Figure 5). The logistic regression model family tends to exhibit more variable performance than XGBoost (see the larger SD bars), suggesting that XGBoost is more reliable. In addition, logistic regression appears to have a strong tendency toward false positives for the migraine class, likely due to class imbalance, small sample sizes, threshold choice, or class weighting. The performance of the logistic regression model family could potentially be improved by adding feature interactions or polynomial features.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/migrainechat_precision_by_model_data.png" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/migrainechat_recall_by_model_data.png" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/migrainechat_f1_score_by_model_data.png" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/migrainechat_roc_auc_by_model_data.png" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    [FIGURE 5] Average performance metrics for the logistic regression and XGBoost model families, grouped by training versus test data and positive versus negative cases. Error bars indicate the standard deviation across models for individual users.
</div>

# Thoughts on data privacy

At this stage, the project is a prototype and a proof of concept. It currently relies on third-party services such as Groq and OpenAI, meaning that sensitive data may be shared with external providers. As a result, data protection requirements—particularly for medical and health-related data—are not yet fully addressed. However, the models used are relatively small and could, in principle, run locally on an in-house server or possibly even on the user’s own device.


# Tech Stack

Python

- Streamlit
- Plotly
- FastAPI
- NumPy
- pandas
- scikit-learn
- XGBoost
- Matplotlib

Database

- SQLAlchemy
- psycopg2-binary

Deployment

- Docker
- Uvicorn

External services

- Groq
  - openai/whisper-large-v3
  - canopylabs/orpheus-v1-english
- OpenAI
  - gpt-5.4-nano
- Langfuse
