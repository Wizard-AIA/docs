# Guide: Model Training

A checklist for asking Wizard to train a predictive model with actual rigor,
rather than a single unvalidated fit. As with
[Exploratory Data Analysis](exploratory-data-analysis.md), the agent will
already work through most of this on its own for a well-posed question —
this is useful for steering it toward a step you specifically want covered,
or for sanity-checking what came back.

## 1. Data preparation

- **Missing values** — impute (mean/median for numeric, mode or a constant
  for categorical) or drop, and be explicit about which. This is exactly the
  kind of silent decision the [trust layer](../concepts/architecture.md)
  surfaces alongside the answer.
- **Categorical encoding** — one-hot for low-cardinality columns,
  label/target encoding for high-cardinality ones.
- **Feature scaling** — a standard or min-max scaler, which matters a lot
  for distance-based algorithms and not at all for tree-based ones.
- **Train/test split** — 80/20 or 70/30, stratified for classification
  tasks so the split doesn't accidentally skew the class balance.

## 2. Baseline first

Train the simplest reasonable baseline — logistic regression, or a dummy
classifier/regressor — before anything more sophisticated. Without a
baseline, "the model is 82% accurate" has no way to be judged: on an
imbalanced dataset, a dummy classifier might already get 80% for free.

## 3. Model selection and training

- Pick algorithms suited to the problem (random forest, gradient boosting,
  etc.) rather than defaulting to one because it's familiar.
- **Cross-validation** (5-fold is a reasonable default) to check the result
  is stable, not an artifact of one particular split.
- **Hyperparameter tuning** via grid or randomized search, scoped to a
  reasonable time budget rather than an exhaustive sweep.

## 4. Evaluation

- **Classification** — accuracy, precision, recall, F1, ROC-AUC. Accuracy
  alone is close to meaningless on an imbalanced dataset.
- **Regression** — MAE, MSE, RMSE, R².
- **Residual analysis** (regression) — are the errors actually
  normally distributed, or is the model systematically wrong in some region?
- **Confusion matrix** (classification) — which specific mistakes is the
  model making, not just how many.

## 5. Feature importance

Extract and plot feature importances (tree-based models) or coefficients
(linear models). This is often more useful to a stakeholder than the
accuracy number itself — it answers "what's actually driving this
prediction," which is usually the real question behind "build me a model."

## 6. Final report

Summarize the best model's performance against the baseline from step 2,
and be explicit about what would make the model more useful — more data,
different features, a different problem framing. A model training exercise
that ends at "here's the accuracy" without that context isn't finished.
