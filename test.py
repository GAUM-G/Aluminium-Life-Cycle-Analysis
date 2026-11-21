"""Display the latest model evaluation scores saved during training."""
import json
from pathlib import Path


def main():
    metrics_path = Path(__file__).resolve().parent / "models/experiments/summary_metrics.json"
    if not metrics_path.is_file():
        raise SystemExit(f"Saved evaluation scores not found: {metrics_path}")
    metrics = json.loads(metrics_path.read_text(encoding="utf-8"))

    print("Saved model evaluation scores (from the latest training run)\n")
    print(f"{'Target':<29} {'Model':<22} {'R2':>8} {'RMSE':>12} {'Test samples':>13}")
    print("-" * 88)
    for row in metrics.values():
        if row.get("skipped") or row.get("r2") is None:
            print(f"{row['target']:<29} Skipped: no evaluation available")
            continue
        print(f"{row['target']:<29} {row['winner']:<22} "
              f"{row['r2']:8.4f} {row['rmse']:12.6f} {row['n_test']:13d}")
    print("\nR2: closer to 1 is better. RMSE: lower is better.")
    print("Displays saved scores; does not retrain or re-evaluate models.")


if __name__ == "__main__":
    main()
