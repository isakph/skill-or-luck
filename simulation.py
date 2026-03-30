import random


def simulate_once(n: int, w: float) -> tuple[float, float]:
    """
    Runs one simulation.
    One simulation means generating n participants and assigning each a luck and a skill score,
    drawn uniformly from [0, 100].
    The score is luck*w + skill*(1-w).
    Given the distribution, the expected mean score is thus 50.

    Returns:
        tuple[float, float]: The winning participant as a ``(luck, skill)`` tuple with the
        highest combined luck and skill score.
    """
    participants: list[tuple[float, float]] = [(random.uniform(0,100), random.uniform(0,100)) for p in range(n)]
    scores: list[tuple[tuple[float, float], float]] = [(participant, participant[0]*w + participant[1]*(1-w)) for participant in participants]

    return max(scores, key=lambda item: item[1])[0]


def run_simulations(n: int, m: int, w: float) -> list[tuple[float, float]]:
    """
    n: the number of participants
    m: the number of simulations
    w: the weighting of luck in the simulations

    returns:
        list of winners represented as ``(luck, skill)`` tuples
    """
    assert (0 <= w <= 1)

    winners = [simulate_once(n, w) for _ in range(m)]
    
    return winners


def main():
    n = 100 # participants
    m = 100 # no. of sims
    w = 0.05 # weighting of luck

    winners = run_simulations(n, m, w)

    total_luck = 0.0
    total_skill = 0.0
    for luck, skill in winners:
        total_luck += luck
        total_skill += skill

    winner_count = len(winners)
    average_luck = total_luck / winner_count
    average_skill = total_skill / winner_count

    print(f"Average luck: {average_luck}. --- Average skill: {average_skill}")


if __name__ == "__main__": 
    main()