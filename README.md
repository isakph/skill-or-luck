# Skill or Luck
Is skill or luck more important in success?
Simulating and visualizing that is the purpose of this repo. 
The theoretical underpinning is taken from the book *Success and Luck* (2016) by Robert H. Frank, specifically the simulations in the appendix of the book.

## The Experiments
With $n \in \[10,100000]$ participants, we examine if luck or skill matters the most for success.
The success of a participant depends on their aggregate luck and skill score. 
Each participant is assigned a $\text{luck}$ and a $\text{skill}$ score, drawn independently and uniformly from $[0, 100]$.
Then the score of a participant is as follows, with $w$ as the weight of $\text{luck}$:

$$score = \text{luck} \cdot w + \text{skill} \cdot (1 - w)$$

The average scores of the top participant are calculated across $m$ experiments, with $m \in \[10,100000]$. 
