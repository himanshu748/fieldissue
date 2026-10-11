"""Render the saved fixed-test AUC learning curve without provider calls."""

import argparse
import json
from pathlib import Path


def plot(source: Path, destination: Path):
    import matplotlib

    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    data = json.loads(source.read_text())
    models = [
        ("majority", "Majority", "#666666", "--"),
        ("logistic_regression", "Logistic regression", "#0072B2", "-"),
        ("hist_gradient_boosting", "Histogram boosting", "#E69F00", "-"),
        ("tabpfn", "TabPFN (1 estimator)", "#009E73", "-"),
        ("oracle", "Oracle probability", "#CC79A7", ":"),
    ]
    plt.rcParams.update({"svg.fonttype": "none", "font.size": 11})
    fig, ax = plt.subplots(figsize=(9, 5.6), layout="constrained")
    sizes = [p["trainRows"] for p in data["points"]]
    for key, name, color, line in models:
        estimates = [p["summary"][key]["rocAuc"] for p in data["points"]]
        values = [p["mean"] for p in estimates]
        errors = [
            [p["mean"] - p["ci95"][0] for p in estimates],
            [p["ci95"][1] - p["mean"] for p in estimates],
        ]
        ax.errorbar(
            sizes,
            values,
            yerr=errors,
            marker="o",
            capsize=4,
            linewidth=1.8,
            color=color,
            linestyle=line,
            label=name,
        )
    ax.set_xscale("log", base=2)
    ax.set_xticks(sizes, labels=[str(s) for s in sizes])
    ax.set_xlabel("Training rows, log2 scale")
    ax.set_ylabel("ROC AUC on the same 500 synthetic test rows")
    ax.set_title("FieldIssue synthetic revisit learning curve", loc="left", weight="bold")
    ax.grid(axis="y", alpha=0.25)
    ax.spines[["top", "right"]].set_visible(False)
    ax.legend(loc="lower right", frameon=False)
    fig.supxlabel(
        "95% Student t intervals across 5 training repeats. Invented labels, not real revisits.",
        fontsize=9,
    )
    destination.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(
        destination,
        metadata={
            "Title": "FieldIssue synthetic TabPFN learning curve",
            "Description": "Fixed 500-row test, five training repeats at six sizes. Oracle probabilities are the Bayes rule in expectation. Intervals exclude test-population uncertainty.",
            "Date": data["createdAt"],
        },
    )
    plt.close(fig)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("destination", type=Path)
    args = parser.parse_args()
    plot(args.source, args.destination)
