---
layout: page
title: MigraineChat
description: a project with no image
img: assets/img/migrainechat_cover.png
importance: 4
category: fun
tags: [LLM, fastAPI, postgreSQL, data simulation, XGBoost, logistic regression, skitlearn, streamlit, visualization, plotly synthetic data generation, speech-to-text, text-to-speech]
---

# Overview

MigraineChat is a prototype for an voice-first app that allows migraine patients to log their health status daily andd generate patient-specific predictaions about their likely of getting a migraine in the next day. This project was conducted jointly with [Dr. Maxim Smirnov](https://github.com/msmirnov18).

### How this differs from already existign migrine logging apps

- every day logging
- voice based
prediction

### Who benefits?

* **Migraine patients** benefit by gaining beteer insigths into their migraine patterns, with the potential of being able to predict the next migraine onset.
* **Physicians** are supported when diagnosing thanks to the statistics and visualization providing an overview fo the patient's symptoms.
* **Researchers** migh also benefit in the long run by having access to large real-world migraine data, which can be of great value to better understand this pathhology and bette rtreatment.


# Repo

[https://github.com/msmirnov18/migraine-app](https://github.com/msmirnov18/migraine-app)\\
(currently private)


# The frontend

Currently, the frontend has x tabs, each corresponding to one function.

# Logging tab

[screenshot]

### Frontend

Here, the user can simply talk to the LLM-assistant, which is designed to nudge the user into providing information about specific health parameters. Depending on whethe rthe user is having a migrane or not, the focus lays more on overall well being (energy level, focus, etc)  or on the symptoms of migrain etitels (pain intensity, nausea, auras, etc). The LLM assiatnt attempts to collect all variables, but is also sensitive to exit commands, in case the patients wants to leave teh conversation.

### Backend

1. The ausio is sedn to the backend where it is sent to teh Groq API operating a speech-to-text with the model  xxxx by xxx.
2. The resulting transcription is then sent to teh OpenAI API wher ethe model xxx analyses teh reposse and provides (i) a json structure containing the extracted information and (ii) a conversational response nudging teh user to complete misisng information.

When teh conversation is concluded because teh user requeted an exit or because all information is conplete:

3. The extracted dat agets saved into a postgreSQl database.

# Stats tab

### Frontend

here, the user can view their logged data thanks to a series of visualizations aiming at providing etailed insights about the user typical migraien patterns and which signs are most indictaive of an incoming migraine episode. 

### Backend

1. The data from the last year including relevant statistics is retrieved from the postgreSQL database via API call.

# Predictions

### Frontend

The user sees an information box containg the likelihood (in %) that they will get a migraine on the next day. This is helpful for them planning their next day accordigly and can supoort decision to take preventive medication (for instance triptanes). 

### backend

Two different types of model (XGBoost, linear regression) are built for each user. The task is a binary classification: will teh user get a migraine the next day (yes/no). All available user data is used as training, being mindful of certain intrinsic properties of the data:
- the data is a *time series*, so specific measure are taken to avoid data-leakage
- thera is a major *class imbalance*
- in general the datasets can be assumed to be small

Overall, XGboost outperformed linear regression for all synthetic users on all relevant permormance indicators: precision, recall, F1, ROC AUC.

[IMG]

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
    Caption photos easily. On the left, a road goes through a tunnel. Middle, leaves artistically fall in a hipster photoshoot. Right, in another hipster photoshoot, a lumberjack grasps a handful of pine needles.
</div>







