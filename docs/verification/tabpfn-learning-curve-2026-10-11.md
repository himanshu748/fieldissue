# Synthetic TabPFN learning curve, 11 October 2026

Thirty real Prior Labs API predictions used the frozen 2,500-row invented generator. A fixed 500-row test was evaluated at each size with five nested training repeats. The old seed-42 generator and 24-row result remain unchanged.

| Training rows | Majority AUC | Logistic AUC | Boosting AUC | TabPFN AUC | Oracle AUC | TabPFN minus logistic, 95% repeat interval |
| --- | --- | --- | --- | --- | --- | --- |
| 32 | 0.500 | 0.635 | 0.500 | 0.574 | 0.752 | -0.061 [-0.094, -0.029] |
| 64 | 0.500 | 0.680 | 0.628 | 0.632 | 0.752 | -0.047 [-0.086, -0.008] |
| 128 | 0.500 | 0.722 | 0.669 | 0.706 | 0.752 | -0.016 [-0.029, -0.004] |
| 256 | 0.500 | 0.735 | 0.661 | 0.724 | 0.752 | -0.011 [-0.029, +0.006] |
| 512 | 0.500 | 0.748 | 0.679 | 0.745 | 0.752 | -0.003 [-0.009, +0.003] |
| 1024 | 0.500 | 0.748 | 0.689 | 0.751 | 0.752 | +0.003 [+0.001, +0.005] |

**Decision fixed before inference:** TabPFN is shown in the Lab as useful only if its AUC beats logistic regression at n <= 128.

Mean paired AUC difference must be positive at all three sizes 32, 64 and 128. Report uncertainty even when this descriptive rule passes.

**Result: the rule failed.** TabPFN lost on mean AUC at 32, 64 and 128 rows. It narrowly exceeded logistic regression at 1,024 rows, which does not satisfy the small-data rule. The logistic model matches the generator's shape. This result cannot establish useful real revisit predictions.

[Every repeat and probability](tabpfn-learning-curve-2026-10-11.json) includes accuracy, ROC AUC, Brier score and log loss with 95% Student t intervals across five training repeats. Those intervals condition on the same fixed test and exclude test-population uncertainty. Oracle probabilities are the Bayes rule in expectation, not a guaranteed finite-test maximum.

[Chart](assets/tabpfn-learning-curve-2026-10-11.svg) · [Earlier 16/24 run](tabpfn-synthetic-evaluation-2026-10-09.json)

Quota reservations: 300,000 free prediction tokens. Cash spent: $0. Quotes bound quota use and are not an independently verified invoice. No payment method, plan change or paid resource was created. The existing 96-row live scenario model and real walk ranking are unchanged.
