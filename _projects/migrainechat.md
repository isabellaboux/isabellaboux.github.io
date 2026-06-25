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

### How this differs from already existing migraine logging apps?

- **voice-fist logging**: many migraien patients suffer from photosansitivity, that is light sources increase their pain. For thsi reason, staring at their smartphone while they type their symptos is not ideal. Using their voice offers an appealing alternative.
- **daily-logging everyday, not only on migraine days**: the chat function is design to capture data daily. Thsi is i iturn critical so that patint data of events during the migraine episodes is also logges, which in turn i scrucial for predictingmigraine onset.

### Who benefits?

* **Migraine patients** benefit by gaining beteer insigths into their migraine patterns, with the potential of being able to predict the next migraine onset.
* **Physicians** are supported when diagnosing thanks to the statistics and visualization providing an overview fo the patient's symptoms.
* **Researchers** migh also benefit in the long run by having access to large real-world migraine data, which can be of great value to better understand this pathhology and bette rtreatment.


# Repo

[https://github.com/msmirnov18/migraine-app](https://github.com/msmirnov18/migraine-app)
/
(currently private)


# Logging tab

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/assets/img/migrainechat_tab_chat.png" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    [FIGURE X] View of the chat interface.
</div>

### Frontend

Here, the user can simply talk to the LLM-assistant, which is designed to nudge the user into providing information about specific health parameters. Depending on whethe rthe user is having a migrane or not, the focus lays more on overall well being (energy level, focus, etc)  or on the symptoms of migrain etitels (pain intensity, nausea, auras, etc). The LLM assiatnt attempts to collect all variables, but is also sensitive to exit commands, in case the patients wants to leave teh conversation.

### Backend

1. The audio is sent to the backend where it is sent to the Groq API operating a speech-to-text with the model *openai/whisper-large-v3*.
2. The resulting transcription is then sent to the OpenAI API where the model *gpt-5.4-nano* analyses the response and provides (i) a .json structure containing the extracted information and (ii) a conversational response nudging the user to complete misisng information.
3. The LLm's respose is then sent to the Groq Api which operates a text-to-speech with the  model *canopylabs/orpheus-v1-english* which is in turn sent ot the frontend and back to the user. 

Severl conversation turns can take place. The conversation terminated when either of these are true:
* the user requested the conversation to end
*  or because all information about the current day has been logged by the user
Eventually, the extracted data is saved into a postgreSQl database.

# Stats tab

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/assets/img/migrainechat_tab_statistics.png" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    [FIGURE X] Statistics tab summmarizing and visualizing the data of synthetic-user-7.
</div>

### Frontend

Here, the user can view their logged data thanks to a series of visualizations aiming at providing detailed insights about the user typical migraien patterns and which signs are most indictaive of an incoming migraine episode. 

### Backend

The data from the last year including relevant statistics is retrieved from the postgreSQL database via API call and visualized with plotly.

# Predictions

### Frontend

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/assets/img/migrainechat_tab_predictions_neg.png" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/assets/img/migrainechat_tab_predictions_pos.png" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    [FIGURE X] Predictions tab showing either a negative prediction (left) or a positive one (right).
</div>

The user sees an information box containg the likelihood (in %) that they will get a migraine on the next day. This is helpful for them planning their next day accordigly and can supoort decision to take preventive medication (for instance triptanes). 

### Backend

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
    [FIGURE X] Performance metricr for training / test, positive / begative cases and logictic recression / XGBoost.
</div>

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









