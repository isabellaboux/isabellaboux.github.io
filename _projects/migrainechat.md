---
layout: page
title: MigraineChat
description: MigraineChat is a prototype for a voice-first app that allows migraine patients to log their health status daily and generate patient-specific predictions about their likelihood of getting a migraine on the next day.
img: assets/img/migrainechat_cover.png
importance: 4
category: fun
tags: [LLM, fastAPI, PostgreSQL, data simulation, XGBoost, logistic regression, scikit-learn, streamlit, visualization, plotly, synthetic data generation, speech-to-text, text-to-speech]
---

## Overview
MigraineChat is a prototype for a voice-first app that allows migraine patients to log their health status daily and generate patient-specific predictions about their likelihood of getting a migraine on the next day.

This project was conducted jointly with [Dr. Maxim Smirnov](https://github.com/msmirnov18) in the context of the training [Data Science Retreat](https://datascienceretreat.com/).

**How does this differ from already existing migraine logging apps?**

- **voice-first logging**: many migraine patients suffer from photosensitivity, meaning that light sources increase their pain. For this reason, staring at their smartphone while they type their symptoms is not ideal. Using their voice offers an appealing alternative.
- **daily logging every day, not only on migraine days**: the chat function is designed to capture data daily. This is in turn critical so that patient data outside of migraine episodes is also logged, which is crucial for predicting migraine onset.

**Who benefits from it?**

* **Migraine patients** benefit by gaining better insights into their migraine patterns, with the potential to predict the next migraine onset.
* **Physicians** are supported when diagnosing thanks to the statistics and visualizations providing an overview of the patient's symptoms.
* **Researchers** might also benefit in the long run by having access to large real-world migraine datasets, which can be of great value for better understanding this pathology and improving treatment.

**Additional materials**

* [Repo](https://github.com/msmirnov18/migraine-app) (currently private)
* [Slides](https://docs.google.com/presentation/d/1dsO1lTasWDT7mw39KPnsPemNxCj4NpsskKp4Dsu8cvI/edit?usp=sharing) 
* [Presentation video](https://www.youtube.com/watch?v=UbnxSYMMpJs)


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

Here, the user can simply talk to the LLM assistant, which is designed to nudge the user into providing information about specific health parameters. Depending on whether the user is having a migraine or not, the focus is more on overall well-being (energy level, focus, etc.) or on migraine symptoms (pain intensity, nausea, aura, etc.). The LLM assistant attempts to collect all variables, but is also sensitive to exit commands in case the patient wants to leave the conversation.

#### Backend

1. The audio is sent to the backend via `fastapi` where it is in turn sent to the **Groq API** operating a **speech-to-text (stt)** with the model `openai/whisper-large-v3`.
2. The resulting transcription is then sent to the **OpenAI API**, where the model `gpt-5.4-nano` analyzes the response and provides (i) a `.json` structure containing the extracted information and (ii) a conversational response nudging the user to complete missing information.
3. The LLM's response is then sent to the **Groq API**, which operates a **text-to-speech (tts)** model, `canopylabs/orpheus-v1-english`, that is in turn sent to the frontend and back to the user.

Several conversation turns can take place. The conversation terminates when either of these are true:
* the user requests the conversation to end
* all information about the current day has been logged by the user
Eventually, the extracted data is saved into a **PostgreSQL** database.

# Statistics tab

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/migrainechat_tab_statistics.png" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    [FIGURE 2] Statistics tab summarizing and visualizing the user's data (here synthetic-user-7).
</div>

#### Frontend

The user can view their logged data thanks to a series of visualizations aimed at providing detailed insights into the user's typical migraine patterns and which signs are most indicative of an incoming migraine episode.

#### Backend

The data from the last year, including relevant statistics, is retrieved from the PostgreSQL database via API call and visualized with `plotly`.

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

The user sees an information box containing the likelihood (in %) that they will get a migraine on the next day. This is helpful for planning the next day accordingly and can support the decision to take preventive medication, for instance triptans.

#### Backend

**Generating synthetic data**

A first step in experimenting with modelling was generating synthetic user data mimicking typical migraine patterns. We generated time-series data for 2 years for 10 synthetic users. The simulations were conducted in `numpy` and `pandas`. Synthetic users were generated using a **two-level stochastic model**, that is, a **hierarchical simulation with between-subject and within-subject variability**. For each parameter, a population-level mean was obtained from the literature where available. Inter-individual variability was modeled by sampling each synthetic user’s characteristic mean value from a normal distribution centered on the population mean, with an assumed standard deviation reflecting plausible between-subject variability. Subsequently, repeated episode-level values for each user were sampled from a second normal distribution centered on that user-specific mean, representing intra-individual variability across episodes.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/migrainechat_simulation.png" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    [FIGURE 4] Two-level stochastic model approach taken to generate synthetic user data accounting for both between-user variability and within-user variability across migraine episodes.
</div>

**Modelling**

Two different types of model (XGBoost, Logistic Regression) are built for each individual user. The task is a binary classification: will the user get a migraine the next day (yes: 1 / no: 0). All available user data is used as training, being mindful of certain intrinsic properties of the data:
- the data is a **time series**, so specific measures are taken to avoid data-leakage
- there is a major **class imbalance**
- each user has a **small dataset**, preventing the use of more complex models such as DNNs.
- it is desirable to favor models allowing some degree of **interpretability**.

Overall, XGBoost outperformed Logistic Regression for all synthetic users on all relevant performance indicators: **precision**, **recall**, **F1**, and **ROC AUC** (Figure 5). The Logistic Regression model family tends to achieve more variable performance than XGBoost (see larger SD bars), which suggests higher reliability for XGBoost. In addition, LogReg appears to have a high false-positive tendency for the migraine class, likely due to class imbalance, small samples, threshold choice, or class weighting. Performance of the Logistic Regression model family could also possibly be improved by adding feature interactions or polynomials.

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
    [FIGURE 5] Average performance metrics for the model families Logistic Regression and XGBoost as a function of training vs. test and positive vs. negative cases. Error bars indicate standard deviation across models for different individual users.
</div>

# Thoughts on data privacy

At this stage, the project is a prototype and proof of concept. It currently relies on third-party services such as Groq and OpenAI, meaning sensitive data may be shared with external providers. As a result, data protection requirements—particularly for medical and health-adjacent data—are not yet fully addressed. However, the models used are relatively small and could, in principle, be run locally on an in-house server or possibly even on the user’s own device.


# Tech Stack

Python
* streamlit
* plotly
* fastapi
* numpy
* pandas
* scikit-learn
* xgboost
* matplotlib

Database
* sqlalchemy
* psycopg2-binary

Deployment
* docker
* uvicorn

External services
* groq
    * openai/whisper-large-v3
    * canopylabs/orpheus-v1-english
* openai
    * gpt-5.4-nano
* langfuse







